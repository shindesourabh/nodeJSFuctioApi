const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Use async/await to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://sourabh:lrknfsfkfk@16.171.141.87:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Define a mongoose schema for the student
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
  // Add more fields as needed
});

const Student = mongoose.model('Student', studentSchema, 'students');

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const newStudent = new Student({ name, age, grade });
    await newStudent.save();
    res.status(200).json({ message: 'Student created successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ error: 'Error creating student', details: error.message });
  }
});

// Get a list of all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students', details: error.message });
  }
});

// Update an existing student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, age, grade } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(studentId, { name, age, grade }, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: 'Error updating student', details: error.message });
  }
});



// Delete an existing student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student', details: error.message });
  }
});



// Call the connectToDatabase function and then createTeacher
connectToDatabase().then(() => {
  // Start the server only after successfully connecting to the database
  app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
    
    // Call the createTeacher function to create a new teacher
  });
});