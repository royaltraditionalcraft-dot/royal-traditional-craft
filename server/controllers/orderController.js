const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../supabase');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

exports.createOrder = async (req, res) => {
    try {
        const { user_id, items, total_amount, subtotal, shipping_address } = req.body;

        // 1. Create order in Razorpay
        const options = {
            amount: Math.round(total_amount * 100), // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        };
        const razorpayOrder = await razorpay.orders.create(options);

        // 2. Create order in our Supabase DB
        const { data: orderData, error: orderError } = await supabase.from('orders').insert([{
            user_id: user_id || null, // handle guest checkout
            total_amount,
            subtotal,
            shipping_address,
            razorpay_order_id: razorpayOrder.id,
            status: 'pending'
        }]).select().single();

        if (orderError) throw orderError;

        // 3. Create order items
        const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        res.status(201).json({
            order: orderData,
            razorpayOrderId: razorpayOrder.id,
            amount: options.amount,
            currency: options.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is successful, update order status
            const { data, error } = await supabase.from('orders').update({
                status: 'confirmed',
                razorpay_payment_id
            }).eq('id', order_id).select();

            if (error) throw error;
            return res.status(200).json({ message: "Payment verified successfully", order: data[0] });
        } else {
            return res.status(400).json({ error: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', userId).order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
