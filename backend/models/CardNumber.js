import mongoose from "mongoose";

const cardNumberSchema = new mongoose.Schema({
    cardcount:{
        type: Number,
        default: 0,
        required: true
    },
    lastUpdatedMonth: {
        type: Number,
    }
});

const cardNumber = mongoose.model("cardnumber", cardNumberSchema);

export default cardNumber;