const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const upload = require("../config/multer");
const multer = require("multer");
const path = require("path");



// get all employees
//route get /api/employees
const getEmployees = asyncHandler(async (req, res) => {
  let { page, size } = req.query;
  const limit = parseInt(size);
  const skip = (page - 1) * size;
  
  const Totalemployees = await Employee.find();
  const employees = await Employee.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
  res.status(200).json({ Totalemployees, employees });
});



// Create New employee
//route POST /api/employees
const createEmployee = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "image upload error" });
    } else if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log(" The request body is :", req.body);

      const {
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        qualifications,
        address,
        country,
        state,
        city,
        pin,
      } = req.body;

      const imagepath = req.file ? req.file.path : null;

      if (
        !salutation ||
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !dob ||
        !gender ||
        !qualifications ||
        !address ||
        !country ||
        !state ||
        !city ||
        !pin
      ) {
        res.status(400);
        throw new Error(" all fields are mandatory! ");
      }
      const employee = await Employee.create({
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        qualifications,
        address,
        country,
        state,
        city,
        pin,
        username: firstName,
        password: phone,
        image: imagepath,
      });
      res.status(201).json(employee);
    }
  });
});


// Get employee
// GET /api/employees/:id
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.status(200).json(employee);
});


// Update employee
//route PUT /api/employees/:id
const updateEmployee = asyncHandler(async (req, res) => {
  upload(req, res, async (error) => {
    
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: "Image upload error: " + error.message });
    } else if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    let imagePath;

    if (req.file) {
      imagePath = path.join("uploads", req.file.filename);
    } else {
      // if no file is uploaded, keep the already existing image path
      const emp = await Employee.findById(req.params.id);

      if (!emp) {
        return res.status(404).json({ error: "Employee not found" });
      }
      //use the already existing image path
      imagePath = emp.image; 
    }

    // update image only if a new file was uploaded
    const updateData = {
      ...req.body,
      ...(imagePath ? { image: imagePath } : {}), // condition to include image
    };
    console.log(imagePath);

    const updatedData = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log(updatedData);
    return res.status(200).json(updatedData);
  });
});


// Delete employee
//route DELETE /api/employees/:id
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.status(200).json(employee);
});



// serach-method  --start
const searchEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.find({
    $or: [
      { firstName: { $regex: req.params.key, $options: "i" } },
      { lastName: { $regex: req.params.key, $options: "i" } },
      { email: { $regex: req.params.key, $options: "i" } },
    ],
  });
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.status(200).json({ employee });
});



module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
};
