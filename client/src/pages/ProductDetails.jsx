import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp, FaStar, FaRegStar } from 'react-icons/fa';
import api from '../utils/api';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  
  // Reviews State
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleWhatsAppInquiry = () => {
    const phoneNumber = '917742627542';
    const message = `Hello RoyalTraditionalCraft, I am interested in inquiring about "${product.name}" (Price: ₹${product.price.toLocaleString()}). Can you please share more details, customization options, or real pictures?\n\nProduct Link: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleBuyNow = async () => {
    try {
      await addToCart({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] });
      navigate('/checkout');
    } catch (err) {
      console.error('Failed to buy now', err);
    }
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const { data: prodData } = await api.get(`/products/${slug}`);
        setProduct(prodData);
        
        // Fetch reviews
        try {
          const { data: revData } = await api.get(`/products/${prodData.id}/reviews`);
          setReviews(revData);
        } catch (revErr) {
          console.error('Failed to fetch reviews', revErr);
        }
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const { data: newReview } = await api.post(`/products/${product.id}/reviews`, {
        rating: ratingInput,
        comment: commentInput
      });
      
      setReviews(prev => [newReview, ...prev]);
      
      // Update product rating and review count locally
      setProduct(prev => {
        const newCount = (prev.review_count || 0) + 1;
        const oldTotal = (prev.rating || 0) * (prev.review_count || 0);
        const newAvg = parseFloat(((oldTotal + ratingInput) / newCount).toFixed(1));
        return {
          ...prev,
          rating: newAvg,
          review_count: newCount
        };
      });

      setCommentInput('');
      setRatingInput(5);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= roundedRating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  if (loading) return <Loader />;
  if (error || !product) return <div className="p-20 text-center font-heading text-xl text-red-500">{error}</div>;

  const userHasReviewed = reviews.some(r => r.user_id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-body">
      <Link to="/products" className="inline-flex items-center text-text-muted hover:text-primary-dark transition mb-8">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Product Image & Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm aspect-square flex items-center justify-center relative group">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <div className="text-text-muted">No Image Available</div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-gray-50 transition ${
                    activeImage === index ? 'border-accent-gold shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-accent-gold text-sm font-bold tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="text-4xl font-heading text-primary-dark mb-2">{product.name}</h1>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-500">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-text-muted font-medium">
              ({product.review_count || 0} reviews)
            </span>
          </div>

          <p className="text-2xl font-body text-text-dark font-medium mb-6">₹{product.price.toLocaleString()}</p>
          
          <div className="prose prose-sm text-text-muted mb-8 whitespace-pre-wrap">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          <button 
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] })}
            className="w-full bg-primary-dark text-white px-8 py-4 rounded-xl hover:bg-secondary-brown transition shadow-md flex items-center justify-center gap-3 font-medium text-lg"
          >
            <FiShoppingCart /> Add to Cart
          </button>

          <button 
            onClick={handleBuyNow}
            className="w-full mt-4 bg-accent-gold hover:bg-yellow-600 text-white px-8 py-4 rounded-xl transition shadow-md flex items-center justify-center gap-3 font-medium text-lg"
          >
            Buy Now
          </button>

          <button 
            onClick={handleWhatsAppInquiry}
            className="w-full mt-4 bg-[#25D366] hover:bg-[#20ba56] text-white px-8 py-4 rounded-xl transition shadow-md flex items-center justify-center gap-3 font-medium text-lg border border-[#25D366]/20"
          >
            <FaWhatsapp className="text-2xl" /> Inquire on WhatsApp
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-heading text-primary-dark mb-8">Customer Reviews & Ratings</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews Left Column: Score Card & Write Review */}
          <div className="space-y-8">
            <div className="bg-cream/40 p-6 rounded-2xl border border-primary-dark/5">
              <h3 className="text-xl font-heading text-primary-dark mb-4">Overall Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-heading text-primary-dark">{product.rating || '0.0'}</span>
                <span className="text-text-muted">/ 5</span>
              </div>
              <div className="flex text-yellow-500 my-3">
                {renderStars(product.rating)}
              </div>
              <p className="text-sm text-text-muted">Based on {product.review_count || 0} ratings</p>
            </div>

            {/* Write a Review Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-heading text-primary-dark mb-4">Write a Review</h3>
              
              {user ? (
                userHasReviewed ? (
                  <p className="text-green-600 text-sm font-medium">Thank you! You have already reviewed this product.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                          >
                            {star <= ratingInput ? (
                              <FaStar className="text-yellow-500" />
                            ) : (
                              <FaRegStar className="text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Your Review</label>
                      <textarea
                        required
                        rows="4"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Share your experience with this handcrafted furniture..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-gold outline-none text-sm resize-none"
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-500 text-xs">{submitError}</p>
                    )}
                    {submitSuccess && (
                      <p className="text-green-600 text-xs font-medium">Review submitted successfully!</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-primary-dark text-white py-3 rounded-xl hover:bg-secondary-brown transition shadow-md font-medium text-sm disabled:opacity-50"
                    >
                      {submitLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-text-muted mb-4">You must be logged in to leave a review.</p>
                  <Link
                    to="/login"
                    className="inline-block bg-primary-dark text-cream px-6 py-2 rounded-xl text-sm font-medium hover:bg-secondary-brown transition shadow-sm"
                  >
                    Login to Review
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Right Column: List of Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-heading text-primary-dark mb-4">Reviews ({reviews.length})</h3>
            
            {reviewsLoading ? (
              <div className="text-text-muted text-sm py-4">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-cream/20 p-8 rounded-2xl border border-dashed border-gray-200 text-center text-text-muted text-sm">
                No reviews yet. Be the first to share your thoughts about this product!
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading font-bold text-primary-dark text-lg capitalize">
                          {review.user_name}
                        </h4>
                        <div className="flex text-yellow-500 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">
                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                      {review.comment || 'No comment provided.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
