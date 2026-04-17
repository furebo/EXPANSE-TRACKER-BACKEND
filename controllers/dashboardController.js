// const Income = require("../models/Income");
// const Expanse = require("../models/Expanse");
// const {isValidObjectId, Types} = require("mongoose");

// //Dashboard data
// exports.getDashboardData = async (req,res) => {
//    try {
//     const userId = req.user.id;
//     const userObjectId = new Types.ObjectId(String(userId));

//     //fetch total income and expanses
//     const totalIncome = await Income.aggregate([
//         {$match: {userId:userObjectId}},
//         {$group: {_id:null,total: {$sum: "$amount"}}},
//     ])
//     console.log("Total Income ",{totalIncome, userId: isValidObjectId(userId)});

//     const totalExpanse = await Expanse.aggregate([
//         {$match: {userId: userObjectId}},
//         {$group: {_id: null, total: {$sum: "$amount"}}}
//     ])

//     //Get income transactions in the last 60 days
//     const last60DaysIncomeTransactions = await Income.find({
//         userId,
//         date: {$gte: new Date(Date.now() - 60*24*60*60*1000)}
//     }).sort({date: -1})

//     //get total income for last 60 days
//     const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum,transaction) => {
//         return sum + transaction.amount;
//     }, 0)

//     //get expanse transactions in last 30 days
//     const last30DaysExpanseTransactions = await Expanse.find({
//         userId,
//         date: {$gte: new Date(Date.now() - 30*24*60*60*1000)}
//     }).sort({date: -1})

//     //get total expanses for the last 30 days
//     const expansesLast30Days = last30DaysExpanseTransactions.reduce((sum,transaction) => sum + transaction.amount, 0)
    
//     //fetch last 5 transactions (income + expanse)
//     const lastTransactions = [
//         ...(await Income.find({userId}).sort({date: -1}).limit(5)).map((txn)=>({
//             ...txn.toObject(),
//             type:"income",
//         })),
//         ...(await Expanse.find({userId}).sort({date: -1}).limit(5)).map((txn)=>({
//             ...txn.toObject(),
//             type:"expanse",
//         }))
//     ].sort((a,b) => b.date - a.date ); //sort the latest first

//     //Final response
//     res.json({
//         totalBalance: (totalIncome[0]?.total || 0) - (totalExpanse[0]?.total || 0),
//         totalIncome: totalIncome[0]?.total || 0,
//         totalExpanses:totalExpanse[0]?.total || 0,
//         last30DaysExpanses: {
//             total: expansesLast30Days,
//             transactions: last30DaysExpanseTransactions,
//         },
//         last60DaysIncome: {
//             total: incomeLast60Days,
//             transactions: last60DaysIncomeTransactions,
//         },
//         recentTransactions: lastTransactions,
//     })
//    } catch (error) {
//     res.status(500).json({message: error.message});
//    }
// }

const Income = require("../models/Income");
const Expanse = require("../models/Expanse");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpanse = await Expanse.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Find the latest income and expense dates
    const latestIncome = await Income.findOne({ userId }).sort({ date: -1 });
    const latestExpense = await Expanse.findOne({ userId }).sort({ date: -1 });

    // Pick the latest transaction date from either income or expense
    const latestTransactionDate = latestIncome?.date && latestExpense?.date
      ? new Date(Math.max(latestIncome.date, latestExpense.date))
      : latestIncome?.date || latestExpense?.date || new Date();

    // Calculate dynamic cut-off dates
    const sixtyDaysAgo = new Date(latestTransactionDate);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const thirtyDaysAgo = new Date(latestTransactionDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get income transactions in the last 60 days (relative to latest date)
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days (relative to latest date)
    const last30DaysExpanseTransactions = await Expanse.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    const expansesLast30Days = last30DaysExpanseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expanse.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expanse",
        })
      ),
    ].sort((a, b) => b.date - a.date);

    // Final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpanse[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpanses: totalExpanse[0]?.total || 0,
      last30DaysExpanses: {
        total: expansesLast30Days,
        transactions: last30DaysExpanseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
