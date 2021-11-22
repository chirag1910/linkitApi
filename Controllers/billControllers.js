const User = require("../Models/userModel");
const mongooseTypes = require("mongoose").Types;

const addBill = async (req, res) => {
    try {
        const { id, amount, title, description, date: plainDate } = req.body;
        var date;

        if (!amount) {
            return res.json({ status: "error", error: "Invalid amount" });
        }
        if (!plainDate) {
            date = new Date();
        } else {
            date = new Date(plainDate);
        }

        const billId = new mongooseTypes.ObjectId();

        await User.findByIdAndUpdate(
            { _id: id },
            {
                $push: {
                    bills: {
                        _id: billId,
                        amount,
                        title,
                        description,
                        date,
                    },
                },
            }
        );

        return res.json({
            status: "ok",
            _id: billId,
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
    const { id, billId } = req.body;
    if (!billId) {
        return res.json({ status: "error", error: "Invalid bill ID" });
    }
    try {
        await User.findByIdAndUpdate(
            { _id: id },
            {
                $pull: {
                    bills: {
                        _id: billId,
                    },
                },
            }
        );

        return res.json({
            status: "ok",
            message: "Bill deleted successfully",
        });
    } catch (error) {
        return res.json({ status: "error", error: "Invalid bill ID" });
    }
};

const updateBill = async (req, res) => {
    const {
        id,
        billId,
        amount,
        title,
        description,
        date: plainDate,
    } = req.body;

    if (!billId) {
        return res.json({ status: "error", error: "Invalid bill ID" });
    }

    try {
        const user = await User.findOne({ _id: id, "bills._id": billId });

        if (user) {
            const bills = user.bills;
            var prevAmount, prevTitle, prevDescription, prevDate;

            bills.forEach((bill) => {
                if (bill._id.equals(billId)) {
                    prevAmount = bill.amount;
                    prevTitle = bill.title;
                    prevDescription = bill.description;
                    prevDate = bill.date;
                }
            });

            await User.updateOne(
                { _id: id, "bills._id": billId },
                {
                    $set: {
                        "bills.$.amount": amount ? amount : prevAmount,
                        "bills.$.title": title ? title : prevTitle,
                        "bills.$.description": description
                            ? description
                            : prevDescription,
                        "bills.$.date": plainDate
                            ? new Date(plainDate)
                            : prevDate,
                    },
                }
            );

            return res.json({
                status: "ok",
                message: "Bill updated successfully",
            });
        } else {
            return res.json({ status: "error", error: "Bill not found" });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Some error occurred" });
    }
};

module.exports = { addBill, deleteBill, updateBill };
