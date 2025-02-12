import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  fathername: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  mobile: {
    type: Number,
    required: true,
    minlength: 10,
  },
  roomno: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  profilephoto: {
    type: String,
    required: true,
  },
  profilephotoPublicId: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  otpExpires: {
    type: Date, // Use Date type for expiration
  },
  isOtpVerified: {
    type: Boolean,
  }
})


//Hash Password
studentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const student = mongoose.model("student", studentSchema);
export default student;
