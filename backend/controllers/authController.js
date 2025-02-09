import card from "../models/CardSchema.js";
import student from "../models/StudentSchema.js";
import user from "../models/UserSchema.js";
import staff from "../models/CreateStaff.js";
import staffSalary from "../models/StaffSalary.js";
import expense from "../models/Expenses.js";
import cardNumber from "../models/CardNumber.js";
import bcrypt from "bcryptjs";
import { sendVerification } from "../middleware/Email.js";
import { isValidObjectId } from "mongoose";
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
    const { stdId } = req.query;
    let students;
    if (stdId) {
      students = await student.findById(stdId);
    } else {
      students = await student.find();
    }
    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No student found" });
    }
    return res.status(200).json({
      success: true,
      students: students || [],
      message:
        students.length > 0
          ? "Students fetched successfully"
          : "No students found",
    });
  } catch (error) {
    console.log("Student not found internal error", error);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Update Student
const UpdateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    if (req.file) {
      updateData.profilephoto = req.file.filename;
    }

    // Check if password is being updated
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12); // Hash the new password
    }

    const updateStudent = await student.findByIdAndUpdate(
      studentId,
      updateData,
      {
        new: true,
      }
    );
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
    return res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
      DelStudent,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

//Card Count update
const CardCount = async (req, res) => {
  try {
    const id = req.params.id;
    const count = await cardNumber.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!count) {
      return res
        .status(404)
        .json({ success: false, message: "Card Count not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Card Count Updated Successfully",
      count,
    });
  } catch (error) {
    console.log("Card Count not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Card Count Create
const CardCountCreate = async (req, res) => {
  try {
    const { cardcount } = req.body;
    if (!cardcount) {
      return res
        .status(400)
        .json({ success: false, message: "Card Count is required" });
    }
    const cardnew = new cardNumber({
      cardcount,
    });
    await cardnew.save();
    if (!cardnew) {
      return res
        .status(404)
        .json({ success: false, message: "Card Count not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Card Count Created Successfully",
      cardnew,
    });
  } catch (error) {
    console.log("Card Count not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//card count get
const CardCountGet = async (req, res) => {
  try {
    const cardcount = await cardNumber.find();
    if (!cardcount) {
      return res
        .status(404)
        .json({ success: false, message: "Card Count not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Card Count Fetched Successfully",
      cardcount,
    });
  } catch (error) {
    console.log("Card Count not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//Create Card
const CreateCard = async (req, res) => {
  try {
    const {
      studentid,
      date,
      status,
      cardno,
      cardenddate,
      payableamount,
      paidamount,
      dueamount,
    } = req.body;

    if (
      !studentid ||
      !status ||
      !date ||
      !cardno ||
      !cardenddate ||
      !payableamount ||
      !paidamount
    ) {
      return res
        .status(404)
        .json({ success: false, message: "All fields are required" });
    }
    if (!isValidObjectId(studentid)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student Id",
      });
    }
    const ExistCard = await card.findOne({ studentid });
    if (ExistCard) {
      return res.status(404).json({
        success: false,
        message: "Card already exist for this student",
      });
    }
    const NewCard = new card({
      studentid,
      date,
      status,
      cardno,
      cardenddate,
      payableamount,
      paidamount,
      dueamount,
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
    const { stdId } = req.query;
    let cards;
    if (stdId) {
      cards = await card.find({ studentid: stdId }).populate("studentid");
    } else {
      cards = await card.find().populate("studentid");
    }
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
    if (!cardId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid card ID" });
    }
    const updateCard = await card.findById(cardId);
    if (!updateCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    Object.assign(updateCard, req.body);

    if (updateCard.startdate) {
      console.log(updateCard.startdate);
      updateCard.status = "Hold";
    }

    if (updateCard.extendays && updateCard.extendays >= 6) {
      const extenddays = Number(updateCard.extendays);
      const newEndDate = new Date(updateCard.cardenddate);
      newEndDate.setDate(newEndDate.getDate() + extenddays);
      updateCard.cardenddate = newEndDate;
      updateCard.status = "Paid";
    }
    await updateCard.save();
    return res.status(200).json({
      success: true,
      message: "Update Or Extended Successfully",
      updateCard,
    });
  } catch (error) {
    console.log("Card not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
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
    const { staffId } = req.query;
    let staffs;
    if (staffId) {
      staffs = await staff.findById(staffId);
    } else {
      staffs = await staff.find();
    }
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

//Read Staff Salary
const GetStaffSalary = async (req, res) => {
  try {
    const { staffId } = req.query; // Get staffId from the query parameters

    let salarys;
    if (staffId) {
      // Fetch salaries for the specific staffId
      salarys = await staffSalary.find({ staffId }).populate("staffId");
    } else {
      // Fetch all salaries
      salarys = await staffSalary.find().populate("staffId");
    }

    if (!salarys || salarys.length === 0) {
      return res.status(200).json({
        success: true,
        salarys: [],
        message: staffId
          ? "No salaries found for this staff"
          : "No staff salaries found",
      });
    }
    return res.status(200).json({ success: true, salarys });
  } catch (error) {
    console.log("Error fetching staff salary", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update Staff
const UpdateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    const updateStaff = await staff.findByIdAndUpdate(staffId, req.body, {
      new: true,
    });
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
    const { staffId, amount, note, date } = req.body;

    if (!staffId || !amount || !note || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    if (!isValidObjectId(staffId)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Staff Id" });
    }
    const ExistStaff = await staff.findById(staffId);
    if (!ExistStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    const NewSalary = new staffSalary({
      staffId,
      amount,
      note,
      date,
    });
    await NewSalary.save();
    return res.status(200).json({
      success: true,
      message: "Staff Salary Added Successfully",
      data: NewSalary,
    });
  } catch (error) {
    console.log("Staff not found internal error", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
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
    return res.status(200).json({
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
    const staffSalaryId = req.params.id;

    const updateSalray = await staffSalary.findByIdAndUpdate(
      staffSalaryId,
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
      message: "Salary Updated Successfully",
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
    const { amount, date, note } = req.body;
    if (!amount || !date || !note) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }
    const NewExpenses = new expense({
      amount,
      date,
      note,
    });
    await NewExpenses.save();
    return res.status(200).json({
      success: true,
      message: "Expenses Added Successfully",
      NewExpenses,
    });
  } catch (error) {
    console.log("Expenses Creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Read Expenses
const GetExpenses = async (req, res) => {
  try {
    const { expenseId } = req.query;
    let expenses;
    if (expenseId) {
      expenses = await expense.findById(expenseId);
    } else {
      expenses = await expense.find();
    }
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
    return res.status(200).json({
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
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const userExist = await student.findOne({ email });
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    // Find the user by email
    const user = await student.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Invalidate the OTP to prevent reuse
    user.otp = null;
    user.otpExpires = null;
    user.isOtpVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
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
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }
    // Find the user by email
    const user = await student.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP verification flag is set
    if (!user.isOtpVerified) {
      return res
        .status(403)
        .json({ success: false, message: "OTP verification is required" });
    }

    //Hash new password
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword, 12);
    }

    // Update the password
    user.password = newPassword; // Ensure proper password hashing
    user.isOtpVerified = false; // Reset the flag after successful password reset
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

//Attendance

// Function to determine the current meal type
const getMealType = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 11) {
    return "breakfast";
  } else if (currentHour >= 11 && currentHour < 16) {
    return "lunch";
  } else if (currentHour >= 16 && currentHour < 19) {
    return "snacks";
  } else if (currentHour >= 19 && currentHour < 23) {
    return "dinner";
  } else {
    return "none";
  }
};

// Controller to add data to the meals Map
const markAttendance = async (req, res) => {
  try {
    const cardId = req.params.id; // Get the card ID from the URL parameter
    if (!cardId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid card ID" });
    }

    // Step 1: Find the card by ID
    const carD = await card.findById(cardId);
    if (!carD) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    // Step 2: Determine the current meal type
    const mealType = getMealType();
    if (mealType === "none") {
      return res
        .status(400)
        .json({ success: false, message: "No meal available at this time." });
    }

    // Step 3: Get today's date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split("T")[0];

    // Step 4: Add the meal to the meals Map
    if (!carD.meals.has(today)) {
      // If the date does not exist, create a new entry
      carD.meals.set(today, [mealType]);
    } else {
      // If the date exists, add the meal to the mealsAttended array
      const mealsToday = carD.meals.get(today);
      if (!mealsToday.includes(mealType)) {
        mealsToday.push(mealType);
      } else {
        return res.status(400).json({
          success: false,
          message: `Attendance already marked for ${mealType}`,
        });
      }
    }

    // Step 5: Save the updated card document
    await carD.save();

    return res.status(200).json({
      success: true,
      message: "Attendance Marked",
      carD,
    });
  } catch (error) {
    console.log("Error marking attendance:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default markAttendance;



// const markAttendance = async (req, res) => {
//   try {
//     const cardId = req.params.id; // Get the card ID from the URL parameter
//     if (!cardId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid card ID" });
//     }

//     // Find the card by ID
//     const attendance = await card.findById(cardId);
//     if (!attendance) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Card not found" });
//     }

//     // Determine the current meal type based on time
//     const getMealType = () => {
//       const currentHour = new Date().getHours();

//       if (currentHour < 11) {
//         return "breakfast";
//       } else if (currentHour >= 11 && currentHour < 16) {
//         return "lunch";
//       } else if (currentHour >= 16 && currentHour < 19) {
//         return "snacks";
//       } else if (currentHour >= 19 && currentHour < 23) {
//         return "dinner";
//       } else {
//         return "none";
//       }
//     };

//     const mealType = getMealType();
//     if (mealType === "none") {
//       return res
//         .status(400)
//         .json({ success: false, message: "No meal available at this time." });
//     }

//     // Get today's date in "YYYY-MM-DD" format
//     const today = new Date().toISOString().split('T')[0];

//     // Debugging: Log the current date and meals array
//     // console.log("Today's date:", today);
//     // console.log("Current meals array before update:", attendance.meals);

//     // Find or create today's meal entry
//     //let mealEntry = attendance.meals.find((entry) => entry.date === today);
//     let mealDate = Array.from(attendance.meals.keys())
//     const lastInsertedDate = mealDate[mealDate.length - 1];
//     if(!lastInsertedDate && !lastInsertedDate === today){

//     }
    
//     if (!mealEntry && !mealEntry.date === today) {
//       console.log("No meal entry found for today. Creating a new one.");
//       mealEntry = { date: today, mealsAttended: [mealType] }; // Initialize mealsAttended with the current mealType
//       attendance.meals.push(mealEntry);

//       // Save the attendance document immediately after pushing the new mealEntry
//       await attendance.save();
//       console.log("New meal entry created and saved:", mealEntry);

//       return res.status(200).json({
//         success: true,
//         message: "Attendance Marked",
//         attendance,
//       });
//     }

//     // Check if the meal has already been marked
//     if (mealEntry.mealsAttended.includes(mealType)) {
//       return res
//         .status(400)
//         .json({ success: false, message: `Attendance already marked for ${mealType}` });
//     }

//     // Add the meal to the mealsAttended array
//     mealEntry.mealsAttended.push(mealType);
//     await attendance.save();

//     return res.status(200).json({
//       success: true,
//       message: "Attendance Marked",
//       attendance,
//     });
//   } catch (error) {
//     console.log("Error marking attendance:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

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
  CardCount,
  CardCountCreate,
  CardCountGet,

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
  ResetPassword,

  //Attendance
  markAttendance,
};
