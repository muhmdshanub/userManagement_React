import {Router} from "express";
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post('/',registerUser);
userRouter.post('/auth',authUser);
userRouter.post('/logout',protect,logoutUser);
userRouter.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);


export default userRouter;