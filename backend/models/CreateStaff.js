import mongoose from "mongoose";
import validator from "validator";

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    mobile: {
        type: Number,
        required: true,
        minlength: 10,
    },
    address: {
        type: String,
        required: true,
    },
    desigination: {
        type: String,
        required: true,
    }
});

const staff = mongoose.model("staff", staffSchema);

export default staff;