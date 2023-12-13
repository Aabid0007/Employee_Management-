const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    salutation: {
      type: String,
      required: [true, "Please add the employee salutation"],
    },
    firstName: {
      type: String,
      required: [true, "Please add the employee firstname"],
    },
    lastName: {
      type: String,
      required: [true, "Please add the employee lastname"],
    },
    email: {
      type: String,
      required: [true, "Please add the employee email"],
    },
    phone: {
      type: String,
      required: [true, "please add the employee phone number"],
    },
    dob: {
      type: String,
      required: [true, "Please add the employee date of birth"],
    },
    gender: {
      type: String,
      required: [true, "Please add the employee gender"],
    },
    qualifications: {
      type: String,
      required: [true, "Please add the employee qualifications"],
    },
    address: {
      type: String,
      required: [true, "Please add the employee address"],
    },
    country: {
      type: String,
      required: [true, "Please add the employee country"],
    },
    state: {
      type: String,
      required: [true, "Please add the employee state"],
    },
    city: {
      type: String,
      required: [true, "Please add the employee country"],
    },
    pin: {
      type: String,
      required: [true, "Please add the employee country"],
    },
    username: {
      type: String,
      required: [true, "Please add the employee country"],
    },
    password: {
      type: String,
      required: [true, "Please add the employee country"],
    },
    image: {
      type: String,
      required: [true, "please add the image"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);