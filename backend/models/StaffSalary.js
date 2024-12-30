
import mongoose from "mongoose";


const staffSalarySchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
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

const staffSalary = mongoose.model("staffsalary", staffSalarySchema);

export default staffSalary;