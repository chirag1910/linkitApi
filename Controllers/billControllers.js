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

module.exports = { addBill };
