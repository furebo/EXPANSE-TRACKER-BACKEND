const express = require('express');
const {addExpanse,getAllExpanse,deleteExpanse,downloadExpanseExcel} = require("../controllers/expanseController");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/add',protect,addExpanse);
router.get('/get',protect,getAllExpanse);
router.delete('/:id',protect,deleteExpanse);
router.get('/downloadexcel',protect,downloadExpanseExcel);

module.exports=router;