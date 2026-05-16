const supabase = require('../supabase');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            throw new Error('Not authorized');
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.email === 'royaltraditionalcraft@gmail.com') {
        next();
    } else {
        res.status(403).json({ error: 'Not authorized as an admin' });
    }
};
