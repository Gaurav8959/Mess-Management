import mongoose from "mongoose";

const cardNumberSchema = new mongoose.Schema({
    cardcount:{
        type: Number,
        required: true
    }
});

const cardNumber = mongoose.model("cardnumber", cardNumberSchema);

export default cardNumber;