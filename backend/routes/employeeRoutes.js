const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    const employees = await Employee.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error('Fetch employees error:', error.message);
    res.status(500).json({ message: 'Server error fetching employee list' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { fullName, email, mobileNumber, department, designation, joiningDate } = req.body;
    if (!fullName || !email || !mobileNumber || !department || !designation || !joiningDate) {
      return res.status(400).json({ message: 'All employee fields are required' });
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'An employee with this email already exists' });
    }

    const employee = new Employee({
      fullName,
      email,
      mobileNumber,
      department,
      designation,
      joiningDate,
      createdBy: req.user._id,
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Create employee error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error adding employee' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { fullName, email, mobileNumber, department, designation, joiningDate } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(444).json({ message: 'Employee not found' });
    }

    if (email && email !== employee.email) {
      const emailConflict = await Employee.findOne({ email });
      if (emailConflict) {
        return res.status(400).json({ message: 'Email is already in use by another employee' });
      }
    }

    employee.fullName = fullName || employee.fullName;
    employee.email = email || employee.email;
    employee.mobileNumber = mobileNumber || employee.mobileNumber;
    employee.department = department || employee.department;
    employee.designation = designation || employee.designation;
    employee.joiningDate = joiningDate || employee.joiningDate;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Update employee error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating employee' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(444).json({ message: 'Employee not found' });
    }

    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error('Delete employee error:', error.message);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});

module.exports = router;
