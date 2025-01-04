
import mongoose from "mongoose";


const staffSalarySchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        ref: "staff"
    },
    date: {
        type: Date,
        required: true,
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