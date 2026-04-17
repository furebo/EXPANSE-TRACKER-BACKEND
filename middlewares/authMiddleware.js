const jwt =  require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Not authorized, token not found."})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // console.log("This is the decoded user: ", decoded)
        req.user = await User.findById(decoded.id).select("-password");
        // console.log("This is the request.user after aunthentication: ", req.user);
        next();
    } catch (error) {
        res.status(401).json({message:"Not authorized, token failed."})
    }
}