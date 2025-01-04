import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    studentid: {
        type: String,
        required: true,
        ref: 'student'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    cardenddate: {
        type: Date,
        required: true,
    },
    startdate: {
        type: Date,
    },
    enddate: {
        type: Date,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Unpaid", "Paid", "Expired", "Hold"],
        default: "Unpaid",
    },
    extendays: {
        type: Number,
        default: 0,
    },
    cardno : {
        type: String,
        required: true,
        unique: true,
    }
});

const card = mongoose.model("card", cardSchema);

export default card;