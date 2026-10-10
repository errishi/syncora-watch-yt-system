import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client lazily or handle missing env vars
const getSupabase = () => {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in server/.env");
    }
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
};

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Failed auth: missing or invalid header");
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        
        const token = authHeader.split(' ')[1];

        // Use the official Supabase SDK to verify the token securely!
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error || !data.user) {
            console.error("Supabase Auth Error:", error?.message);
            return res.status(401).json({ message: `Unauthorized - Invalid token (${error?.message})` });
        }

        console.log("Successfully authenticated user:", data.user.id);
        
        // Map to our expected format
        req.auth = { 
            userId: data.user.id, 
            email: data.user.email,
            user_metadata: data.user.user_metadata,
            ...data.user 
        };
        
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};
