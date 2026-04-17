const xlsx = require("xlsx");
const Expanse = require("../models/Expanse");
//Add expanse source
exports.addExpanse = async (req,res) => {
    const userId = req.user.id;

    try{
          const {icon,category,amount,date} = req.body;
          //validation : check for missing values
          if(!category || !amount || !date){
            return res.status(400).json({message:"All fields are required."})
          }

          const newExpanse = new Expanse({
            userId,
            category,
            amount,
            icon,
            date:new Date(date)
          });
        await newExpanse.save();
        res.status(201).json({newExpanse});

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get all expanses source
exports.getAllExpanse = async (req,res) => {
  const userId = req.user.id;
  try {
    const expanse = await Expanse.find({userId}).sort({date:-1});
    res.json(expanse);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

//Delete expanse source
exports.deleteExpanse = async (req,res) => {
  try {
    await Expanse.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Expanse deleted successfully!."});
  } catch (error) {
    res.status(500).json({message:"Server Error deleting the expanse"});
  }
}

//download excel
exports.downloadExpanseExcel = async (req,res) => {
  const userId = req.user.id;
  try {
    const expanse = await Expanse.find({userId}).sort({date: -1});
    //preapre data for excel
    const data =expanse.map((item) => ({
      Category:item.category,
      Amount:item.amount,
      Date:item.date
    }))
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Expanse");
    xlsx.writeFile(wb,"expanse_details.xlsx");
    res.download("expanse_details.xlsx");
  } catch (error) {
    res.status(500).json({message:error});
  }
}