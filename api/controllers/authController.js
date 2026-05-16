const supabase = require('../supabase');

exports.register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone,
                    role: 'user'
                }
            }
        });
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        // Need to extract token to pass to update
        let token = req.headers.authorization.split(' ')[1];
        
        // When updating a user, Supabase uses the context of the currently authenticated user
        // However on the backend with service role we might need to do it differently, 
        // but for now we'll assume the client calls this with their session.
        const { data, error } = await supabase.auth.updateUser({
            data: req.body
        });
        
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Requires service role key to list users
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
