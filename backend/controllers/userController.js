import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { cloudinary } from "../utils/cloudinary.js";

//@desc auth user / set token
//route POST /api/users/auth
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    const userData = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
    };

    // Check if the user has an image associated with them
    if (user?.image) {
      userData.image = user?.image;
    }
    

    res.cookie('_id', user._id);
    res.json(userData);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc register user
//route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
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
    generateToken(res, user._id);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    if (user?.image) {
      userData.image = user?.image;
    }

    res.cookie('_id', user._id);
    res.status(201).json(userData);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc logout user
//route POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out." });
});

//@desc get user profile
//route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    if (user?.image) {
      userData.image = user?.image;
    }

    res.json( userData );
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc update user profile
//route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.image) {
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

    const updatedUser = await user.save();

    const userData = {
      _id: updatedUser?._id,
      name: updatedUser?.name,
      email: updatedUser?.email,
    }

    if(updatedUser?.image){
      userData.image = updatedUser?.image
    }

    res.json(userData);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
