import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { cloudinary } from "../utils/cloudinary.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import generateAdminToken from "../utils/generateAdminToken.js";

//@desc auth admin / set token
//route POST /api/admin/auth
//@access public

const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        generateAdminToken(res, admin._id);

        const adminData = {
            _id: admin?._id,
            name: admin?.name,
        };

        res.json(adminData);
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//@desc register admin
//route POST /api/admin/register
//@access public

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400);
        throw new Error("Admin user already exists");
    }

    // If no image is provided, create a new user without image details
    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        generateAdminToken(res, admin._id);

        const adminData = {
            _id: admin._id,
            name: admin.name,
        };

        res.status(201).json(adminData);
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//@desc logout admin
//route POST /api/admin/logout
//@access private
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie("adminJwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Admin logged out." });
});

//@desc get all users data
//route GET /api/admin/users
//@access private /admin

const getUsers = asyncHandler(async (req, res) => {
    // Extract pagination parameters from query string or use defaults
    const { page = 1, search = "" } = req.query;
    const limit = 10;


    // Construct the search query based on the search parameter
    const searchRegex = new RegExp(search, "i"); // Case-insensitive regex pattern for search
    const searchQuery = search
        ? {
            $or: [
                { name: { $regex: searchRegex } }, // Search by name
                { email: { $regex: searchRegex } }, // Search by email
            ],
        }
        : {};

    // Query the database using paginate method with the search query
    const users = await User.paginate(searchQuery, {
        page,
        limit,
        select: "-password",
        pagination: true,
    });

    // Extract the total document count from the pagination result
    const totalDocs = users.totalDocs;

    res.json({ users, totalDocs, page });
});

const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Validate the userId to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400);
        throw new Error("Invalid user ID");
    }

    // Find the user by ID
    const user = await User.findById(userId).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
  
    // Validate the userId to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400);
        throw new Error("Invalid user ID");
    }
  
    // Find the user by ID
    const user = await User.findById(userId);
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
  
    // Delete the user's image from Cloudinary if it exists
    if (user.image && user.image.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }
  
    //force logging out user from application
    req.io.emit('force-logout', { userId });


    // Delete the user document from the database
    await User.deleteOne({ _id: userId });
  
    res.status(200).json({ message: "User deleted successfully" });
  });


//@descadd user
//route POST /api/users/add
//@access private admin
const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    let user = null;
    if (image) {
      // If image is provided, upload it to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "users", // Replace with your upload preset
      });
  
      // Create a new user with image details
      user = await User.create({
        name,
        email,
        password,
        image: {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        },
      });
    } else {
      // If no image is provided, create a new user without image details
      user = await User.create({
        name,
        email,
        password,
      });
    }
  
    if (user) {
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
          };
      
          if (user.image) {
            userData.image = user.image;
          }
  
      res.status(201).json({"success": true,message:"User added succesfully", userData});
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  });

//@desc update user profile from admin
//route PUT /api/admin/users/edi/:userId
//@access private admin
const updateUserProfileByAdmin = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Validate the userId to ensure it's a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update user's profile details
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.body?.image) {
    
    // If the user already has an image, delete it from Cloudinary
    if (user.image && user.image.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }

    // Upload new image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.body.image, {
      folder: "users",
    });

    // Update user's image details in the database
    user.image = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  // Save the updated user details
  const updatedUser = await user.save();

  // Respond with the updated user data
  const userData = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  };

  if (updatedUser.image) {
    userData.image = updatedUser.image;
  }

  res.json(userData);
});



export { 
    authAdmin,
    registerAdmin,
    logoutAdmin,
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    updateUserProfileByAdmin,


};
