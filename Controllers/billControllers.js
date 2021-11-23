const Bill = require("../Models/billModel");

const addBill = async (req, res) => {
    try {
        const {
            userID,
            amount,
            title,
            description,
            date: plainDate,
        } = req.body;

        if (!amount) {
            return res.json({ status: "error", error: "Invalid amount" });
        }

        var date;
        if (!plainDate) {
            date = new Date();
        } else {
            date = new Date(plainDate);
        }

        const bill = await Bill.create({
            userID,
            amount,
            title,
            description,
            date,
        });

        return res.json({
            status: "ok",
            billID: bill._id,
            amount,
            title,
            description,
            date,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteBill = async (req, res) => {
    const { billID } = req.body;

    try {
        const bill = await Bill.findById(billID);

        if (bill) {
            bill.remove();

            return res.json({
                status: "ok",
                message: "Bill deleted successfully",
            });
        } else {
            return res.json({ status: "error", error: "Invalid bill ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const deleteBills = async (req, res) => {
    const { userID } = req.body;

    try {
        const bills = await Bill.find({ userID });

        bills.forEach(async (bill) => {
            await bill.remove();
        });

        return res.json({
            status: "ok",
            message: "Bills deleted successfully",
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const updateBill = async (req, res) => {
    const { billID, amount, title, description, date: plainDate } = req.body;

    try {
        const bill = await Bill.findById(billID);

        if (bill) {
            await bill.updateOne({
                amount,
                title,
                description,
                date: plainDate && new Date(plainDate),
            });

            return res.json({
                status: "ok",
                billID: bill._id,
                amount: amount || bill.amount,
                title: title || bill.title,
                description: description || bill.description,
                plainDate: plainDate ? new Date(plainDate) : bill.date,
            });
        } else {
            return res.json({ status: "error", error: "Invalid bill ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getBill = async (req, res) => {
    const { billID } = req.body;
    try {
        const bill = await Bill.findById(billID);

        if (bill) {
            return res.json({
                status: "ok",
                billID: bill._id,
                amount: bill.amount,
                title: bill.title,
                description: bill.description,
                date: bill.date,
            });
        } else {
            return res.json({ status: "error", error: "Invalid bill ID" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

const getBills = async (req, res) => {
    const { userID } = req.body;
    try {
        const bills = await Bill.find({ userID });

        return res.json({
            status: "ok",
            bills,
        });
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

module.exports = {
    addBill,
    deleteBill,
    deleteBills,
    updateBill,
    getBill,
    getBills,
};
