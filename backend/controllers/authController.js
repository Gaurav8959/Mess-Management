import card from "../models/CardSchema.js";
import student from "../models/StudentSchema.js";
import user from "../models/UserSchema.js";
import staff from "../models/CreateStaff.js";
import staffSalary from "../models/StaffSalary.js";
import expense from "../models/Expenses.js";
import bcrypt from "bcryptjs";
import { sendVerification } from "../middleware/Email.js";
//Create Student API
const CreateStudent = async (req, res) => {
  try {
    const {
      fullname,
      fathername,
      email,
      mobile,
      roomno,
      branch,
      year,
      password,
    } = req.body;

    const profilephoto = req.file ? req.file.filename : null;

    if (
      !fullname ||
      !fathername ||
      !email ||
      !mobile ||
      !roomno ||
      !branch ||
      !year ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const ExistStudent = await student.findOne({ email });
    if (ExistStudent) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }
    const NewStudent = new student({
      fullname,
      fathername,
      email,
      mobile,
      roomno,
      branch,
      year,
      password,
      profilephoto,
    });
    await NewStudent.save();
    res.status(200).json({
      success: true,
      message: "Student Created Sucessfully",
      NewStudent,
    });
  } catch (error) {
    console.log("Student Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Read Student API
const GetStudent = async (req, res) => {
  try {
    const students = await student.find();
    return res.status(200).json({ success: true, students: students || [], message: students.length > 0 ? 'Students fetched successfully' : 'No students found' });
  } catch (error) {
    console.log("Student not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Update Student
const UpdateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if password is being updated
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12); // Hash the new password
    }

    const updateStudent = await student.findByIdAndUpdate(studentId, req.body, {
      new: true,
    });
    if (!updateStudent) {
      return res
        .status(404)
        .josn({ success: false, messsage: "User Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      updateStudent,
    });
  } catch (error) {
    console.log("Student not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Student
const DeleteStudent = async (req, res) => {
  try {
    const StudentId = req.params.id;
    const DelStudent = await student.findByIdAndDelete(StudentId);
    if (!DelStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Students not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Student Deleted Successfully",
        DelStudent,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Create Card
const CreateCard = async (req, res) => {
  try {
    const { studentid, date, startdate, enddate, amount, status, cardno, extendays, cardenddate } =
      req.body;

    if (
      !studentid ||
      !amount ||
      !status ||
      !cardno ||
      !cardenddate
    ) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    const NewCard = new card({
      studentid,
      date,
      startdate,
      enddate,
      amount,
      status,
      cardno,
      cardenddate,
      extendays,
    });
    await NewCard.save();
    res
      .status(200)
      .json({ success: true, message: "Card Created Successfully", NewCard });
  } catch (error) {
    console.log("Card Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Read Card
const GetCard = async (req, res) => {
  try {
    const cards = await card.find();
    if (!cards || cards.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    return res.status(200).json({ success: true, cards });
  } catch (error) {
    console.log("Cards not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

// Extend & Update
const Extend = async (req, res) => {
  try {
    const cardId = req.params.id;
    const updateCard = await card.findByIdAndUpdate(cardId, req.body, {
      new: true
    });
    if (!updateCard) {
      return res.status(400).json({ success: true, message: "Card not found"});
    }
    if (updateCard.extendays >= 6) {
      const extenddays = updateCard.extendays;
      const newEndDate = new Date(updateCard.cardenddate);
      newEndDate.setDate(newEndDate.getDate() + extenddays);
      updateCard.cardenddate = newEndDate;
      await updateCard.save();
    }
    return res.status(200).json({ success: true, message: "Card Updated or Extended Successfully", updateCard });
  } catch (error) {
    console.log("Card not found internal error", error);
    return res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Card
const DeleteCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const DelCard = await card.findByIdAndDelete(cardId);
    if (!DelCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Card Deleted Successfully", DelCard });
  } catch (error) {
    console.log("Card not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Create Admin
const CreateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const ExistAdmin = await user.findOne({ email });
    if (ExistAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exist" });
    }
    const NewAdmin = new user({
      name,
      email,
      password,
    });
    await NewAdmin.save();
    res
      .status(200)
      .json({ success: true, message: "Admin Created Successfully", NewAdmin });
  } catch (error) {
    console.log("Admin Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Login API
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const userValid = await user.findOne({ email });
    if (!userValid) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, userValid.password);
    if (!isMatch) {
      return res
        .status(422)
        .json({ success: false, message: "Invalid Details" });
    }
    //Token Generate
    const token = await userValid.generateAuthtoken();

    //Cookie Generate
    res.cookie("cookie", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });
    const result = {
      userValid,
      token,
    };
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log("Login error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Logout API
const Logout = async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });
    res.clearCookie("cookie", {
      path: "/",
      httpOnly: true,
    });
    await req.rootUser.save();
    res.status(200).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Create Staff
const CreateStaff = async (req, res) => {
  try {
    const { name, email, mobile, address, desigination } = req.body;
    if (!name || !email || !mobile || !address || !desigination) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const ExistStaff = await staff.findOne({ email });
    if (ExistStaff) {
      return res
        .status(400)
        .json({ success: false, message: "Staff already exist" });
    }
    const NewStaff = new staff({
      name,
      email,
      mobile,
      address,
      desigination,
    });
    await NewStaff.save();
    res
      .status(200)
      .json({ success: true, message: "Staff Created Successfully", NewStaff });
  } catch (error) {
    console.log("Staff Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Read Staff
const GetStaff = async (req, res) => {
  try {
    const staffs = await staff.find();
    if (!staffs || staffs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    return res.status(200).json({ success: true, staffs });
  } catch (error) {
    console.log("Staff not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};


//Update Staff
const UpdateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    const updateStaff = await staff.findByIdAndUpdate(
      staffId,
      req.body,
      {
        new: true,
      }
    );
    if (!updateStaff) {
      return res
        .status(404)
        .josn({ success: false, messsage: "User Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Staff Updated Successfully",
      updateStaff,
    });
  } catch (error) {
    console.log("Staff not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Staff
const DeleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const DelStaff = await staff.findByIdAndDelete(staffId);
    if (!DelStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Staff Deleted Successfully", DelStaff });
  } catch (error) {
    console.log("Staff not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Staff Salary
const StaffSalary = async (req, res) => {
  try {
    const { staffId, name, amount, note } = req.body;
    if (!staffId || !name || !amount || !note) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const NewSalary = new staffSalary({
      staffId,
      name,
      amount,
      note,
    });
    await NewSalary.save();
    return res
      .status(200)
      .json({ success: true, message: "Staff Salary Added Successfully" });
  } catch (error) {
    console.log("Staff not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Read Staff Salary
const GetStaffSalary = async (req, res) => {
  try {
    const salarys = await staffSalary.find();
    if (!salarys || salarys.length === 0) {
      return res
        .status(400)
        .json({ success: true, message: "Staff Salary's not found" });
    }
    return res.status(200).json({ success: true, salarys });
  } catch (error) {
    console.log("Staff Salary not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Staff salary
const DeleteSalary = async (req, res) => {
  try {
    const staffSalaryId = req.params.id;
    const DeleteSalary = await staffSalary.findByIdAndDelete(staffSalaryId);
    if (!DeleteSalary) {
      return res
        .status(400)
        .json({ success: false, message: "Staff Salary not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Staff Salary Deleted Successfully",
        DeleteSalary,
      });
  } catch (error) {
    console.log("Staff not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Update Staff Salary
const UpdateStaffSalary = async (req, res) => {
  try {
    const staffId = req.params.id;

    const updateSalray = await staffSalary.findByIdAndUpdate(
      staffId,
      req.body,
      {
        new: true,
      }
    );
    if (!updateSalray) {
      return res
        .status(404)
        .josn({ success: false, messsage: "User Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Salay Updated Successfully",
      updateSalray,
    });
  } catch (error) {
    console.log("Salary not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Create Expenses
const Expenses = async (req, res) => {
  try {
    const { amount, date, note} = req.body;
    if (!amount || !date || !note) {
      return res.status(404).json({ success: false, message: "All Fields are Required"});
    }
    const NewExpenses = new expense({
      amount,
      date,
      note,
    });
    await NewExpenses.save();
    return res.status(200).json({ success: true, message: "Expenses Added Successfully", NewExpenses});
  } catch (error) {
    console.log("Expenses Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Read Expenses
const GetExpenses = async (req, res) => {
  try {
    const expenses = await expense.find();
    if (!expenses || expenses.length === 0) {
      return res
        .status(400)
        .json({ success: true, message: "Expenses's not found" });
    }
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.log("Expenses not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Update Expenses
const UpdateExpenses = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const updateexpenses = await expense.findByIdAndUpdate(
      expenseId,
      req.body,
      {
        new: true,
      }
    );
    if (!updateexpenses) {
      return res
        .status(404)
        .josn({ success: false, messsage: "Expenses Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Expense Updated Successfully",
      updateexpenses,
    });
  } catch (error) {
    console.log("Expenses not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Expenses
const DeleteExpenses = async (req, res) => {
  try {
    const expensesId = req.params.id;
    const DeleteExpenses = await expense.findByIdAndDelete(expensesId);
    if (!DeleteExpenses) {
      return res
        .status(400)
        .json({ success: false, message: "Expenses not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Expenses Deleted Successfully",
        DeleteExpenses,
      });
  } catch (error) {
    console.log("Expenses not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Email For Reset Password
const EmailForForgetPassword = async (req, res) => {
  try {
    const email = req.body.email;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const userExist = await student.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save OTP to user's record or in a temporary storage (e.g., Redis)
    userExist.otp = otp; // Ensure your user schema supports OTP
    userExist.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    await userExist.save();

    // Send OTP to the user's email (using a mailer library like Nodemailer)
    sendVerification(userExist.email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error in EmailForForgetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

//Otp Verification
const CheckOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if both email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Find the user by email
    const user = await student.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Invalidate the OTP to prevent reuse
    user.otp = null;
    user.otpExpires = null;
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in CheckOtp:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;

    // Check if both email and new password are provided
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required" });
    }
    // Find the user by email
    const user = await student.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if OTP verification flag is set
    if (!user.isOtpVerified ) {
      return res.status(403).json({ success: false, message: "OTP verification is required" });
    }
    
    //Hash new password
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 12);
    }

    // Update the password
    user.password = newPassword; // Ensure proper password hashing
    user.isOtpVerified = false; // Reset the flag after successful password reset
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};



export {
  //Student
  CreateStudent,
  GetStudent,
  DeleteStudent,
  UpdateStudent,

  //Card
  CreateCard,
  GetCard,
  DeleteCard,
  Extend,

  //Auth
  Logout,
  Login,
  
  //Salary
  GetStaffSalary,
  UpdateStaffSalary,
  DeleteSalary,
  StaffSalary,

  //Staff
  CreateStaff,
  GetStaff,
  DeleteStaff,
  UpdateStaff,
  
  //Expenses
  GetExpenses,
  Expenses,
  DeleteExpenses,
  UpdateExpenses,

  //Admin Create
  CreateAdmin,
  
  //Forget Password Student
  EmailForForgetPassword,
  CheckOtp,
  ResetPassword
};
