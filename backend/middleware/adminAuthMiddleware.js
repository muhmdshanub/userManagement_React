import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.adminJwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

      req.admin = await Admin.findById(decoded.adminId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, admmin token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no admin token');
  }
});

export { protectAdmin };