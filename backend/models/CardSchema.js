import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  studentid: {
    type: String,
    required: true,
    ref: "student",
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
  status: {
    type: String,
    enum: ["Unpaid", "Paid", "Expired", "Hold"],
    default: "Unpaid",
  },
  extendays: {
    type: Number,
    default: 0,
  },
  cardno: {
    type: String,
    required: true,
    unique: true,
  },
  payableamount: {
    type: Number,
    required: true,
  },
  paidamount: {
    type: Number,
    default: 0,
  },
  dueamount: {
    type: Number,
    default: 0,
  },
  meals: {
    type: Map,
    of: [
      {
        type: String,
        enum: ["breakfast", "lunch", "snacks", "dinner"],
      },
    ],
    default: {},
  },
});

const card = mongoose.model("card", cardSchema);

export default card;