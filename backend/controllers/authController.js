import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      collegeId: user.collegeId, 
      collegeIds: user.collegeIds 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, collegeId, collegeIds } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate role
    if (!['Student', 'Recruiter', 'College'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be Student, Recruiter, or College',
      });
    }

    // Create user object base
    const userData = {
      name,
      email,
      password,
      role,
    };

    // Attach college references if applicable
    if (role === 'Student' && collegeId) {
      userData.collegeId = collegeId;
    } else if (role === 'Recruiter' && collegeIds && Array.isArray(collegeIds)) {
      userData.collegeIds = collegeIds;
    }

    // Create user
    const user = await User.create(userData);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all colleges for registration selection
// @route   GET /api/auth/colleges
// @access  Public
export const getColleges = async (req, res) => {
  try {
    const colleges = await User.find({ role: 'College' }).select('_id name');
    
    res.status(200).json({
      success: true,
      count: colleges.length,
      colleges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
