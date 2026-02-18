const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ 
    id: user.id, 
    role: user.role, 
    department: user.department,
    permissions: {
      canBorrow: user.canBorrow,
      canReserve: user.canReserve,
      canAccessResources: user.canAccessResources,
      canViewReports: user.canViewReports
    }
  }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { 
      fullName, email, password, role, department, studentId, canBorrow, canReserve, canAccessResources, canViewReports
    } = req.body; // Full frontend integration
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role, // Student, Lecturer, etc.
      department,
      studentId: role === 'Student' ? studentId : null,
      avatar: `https://ui-avatars.com/api/?name=${fullName}&background=1f4fa3&color=fff`,
      canBorrow: canBorrow !== undefined ? canBorrow : true,
      canReserve: canReserve !== undefined ? canReserve : true,
      canAccessResources: canAccessResources !== undefined ? canAccessResources : true,
      canViewReports: canViewReports !== undefined ? canViewReports : false
    });

    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user.id, fullName, email, role, department, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, fullName: user.fullName, email, role: user.role, department: user.department, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
