import express from "express";
import authenticate from "../middleware/authenticate.js";
import fileUpload from "../middleware/fileUpload.js";
import {
  CreateStudent,
  Logout,
  CreateCard,
  DeleteStaff,
  UpdateStaffSalary,
  DeleteSalary,
  CreateStaff,
  GetStaffSalary,
  StaffSalary,
  GetStaff,
  GetStudent,
  DeleteCard,
  Login,
  DeleteStudent,
  GetCard,
  CreateAdmin,
  Extend,
  UpdateStaff,
  UpdateStudent,
  Expenses,
  GetExpenses,
  UpdateExpenses,
  DeleteExpenses,
  EmailForForgetPassword,
  CheckOtp,
  ResetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/createstudent", authenticate, fileUpload, CreateStudent);
router.get("/getstudent", GetStudent);
router.put("/updatestudent/:id", authenticate, UpdateStudent);
router.delete("/deletestd/:id", authenticate, DeleteStudent);
router.post("/createcard", authenticate, CreateCard);
router.get("/getcard", GetCard);
router.post("/createadmin", authenticate, CreateAdmin);
router.post("/login", Login);
router.get("/logout", authenticate, Logout);
router.delete("/deletecard/:id", authenticate, DeleteCard);
router.post("/createstaff", authenticate, CreateStaff);
router.get("/getstaff", GetStaff);
router.delete("/deletestaff/:id", authenticate, DeleteStaff);
router.post("/staffsalary", authenticate, StaffSalary);
router.get("/readsalary", GetStaffSalary);
router.delete("/deletestaffsalary/:id", authenticate, DeleteSalary);
router.put("/updatesalary/:id", authenticate, UpdateStaffSalary);
router.put('/updatestaff/:id',authenticate,UpdateStaff);
router.post('/createexpenses',authenticate,Expenses);
router.get('/readexpenses',GetExpenses);
router.put('/updateexpenses/:id',authenticate,UpdateExpenses);
router.delete('/deleteexpenses/:id',authenticate,DeleteExpenses);
router.put('/extendcard/:id',authenticate,Extend);
router.post('/emailforotp',EmailForForgetPassword);
router.post('/checkotp',CheckOtp);
router.post('/restpassword',ResetPassword);

export default router;
