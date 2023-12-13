const express = require("express");
const router = express.Router();


const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
} = require("../controllers/employeeController");


router.route("/").get(getEmployees);
router.route("/").post(createEmployee);
router.route("/:id").get(getEmployee);
router.route("/:id").put(updateEmployee);
router.route("/:id").delete(deleteEmployee);
router.route("/search/:key").get(searchEmployee);


module.exports = router;


