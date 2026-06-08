const supabase = require('../supabase');

// Fetch reviews for a specific product
exports.getProductReviews = async (req, res) => {
    try {
        const { id } = req.params; // Can be product ID (UUID) or slug
        
        // Find product ID if slug is provided
        let productId = id;
        if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            const { data: product, error: prodError } = await supabase
                .from('products')
                .select('id')
                .eq('slug', id)
                .single();
            if (prodError || !product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            productId = product.id;
        }

        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a review for a specific product
exports.createProductReview = async (req, res) => {
    try {
        const { id } = req.params; // Product ID or slug
        const { rating, comment } = req.body;
        const user = req.user; // populated by protect middleware

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Please provide a rating between 1 and 5' });
        }

        // Find product ID (if slug was passed)
        let productId = id;
        if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            const { data: product, error: prodError } = await supabase
                .from('products')
                .select('id')
                .eq('slug', id)
                .single();
            if (prodError || !product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            productId = product.id;
        }

        // Check if user already reviewed this product
        const { data: existingReview, error: reviewCheckError } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Get user name from metadata or fallback to email prefix
        const userName = user.user_metadata?.full_name || user.email.split('@')[0];

        // Insert new review
        const { data: newReview, error: insertError } = await supabase
            .from('reviews')
            .insert([
                {
                    product_id: productId,
                    user_id: user.id,
                    user_name: userName,
                    rating: parseInt(rating),
                    comment: comment || ''
                }
            ])
            .select();

        if (insertError) throw insertError;

        // Recalculate average rating and count
        const { data: allReviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', productId);

        if (reviewsError) throw reviewsError;

        const reviewCount = allReviews.length;
        const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = parseFloat((totalRating / reviewCount).toFixed(1));

        // Update products table with calculated stats
        const { error: updateError } = await supabase
            .from('products')
            .update({
                rating: averageRating,
                review_count: reviewCount
            })
            .eq('id', productId);

        if (updateError) throw updateError;

        res.status(201).json(newReview[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
