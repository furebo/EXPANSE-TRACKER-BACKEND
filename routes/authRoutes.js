const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const upload = require('../utils/multer');
const {uploadToCloudinary} = require('../middlewares/uplaodMiddleware');

const {loginUser,registerUser,getUserInfo} = require("../controllers/authController");
const router = express.Router();

router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/getuser',protect,getUserInfo);

router.post("/upload-image",upload, async (req,res)=>{
try {
        if(!req.file){
        return res.status(400).json({message:"No file uploaded."})
    }
    const result = await uploadToCloudinary(req.file.buffer);
     res.status(200).json({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
} catch (error) {
      res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
}
})

module.exports = router;