import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
        required: true,
    }
});

const expense = mongoose.model("expense", expenseSchema);

export default expense;