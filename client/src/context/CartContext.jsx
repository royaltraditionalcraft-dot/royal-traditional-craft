import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const loadCart = async () => {
      const localCart = JSON.parse(localStorage.getItem('royaltraditionalcraft_cart')) || [];
      
      if (user) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', user.id);
          
        if (!error && data && data.length > 0) {
          const dbCart = data.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product: item.products
          }));
          setCartItems(dbCart);
        } else {
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
      }
    };
    
    loadCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('royaltraditionalcraft_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product_id: product.id, quantity, product }];
    });

    if (user) {
      const { data } = await supabase.from('cart_items').select('*').eq('user_id', user.id).eq('product_id', product.id).single();
      if (data) {
        await supabase.from('cart_items').update({ quantity: data.quantity + quantity }).eq('id', data.id);
      } else {
        await supabase.from('cart_items').insert([{ user_id: user.id, product_id: product.id, quantity }]);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
    
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    
    setCartItems(prev => prev.map(item => 
      item.product_id === productId ? { ...item, quantity } : item
    ));

    if (user) {
      await supabase.from('cart_items').update({ quantity }).eq('user_id', user.id).eq('product_id', productId);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
