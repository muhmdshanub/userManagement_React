import {Router} from "express";
import { authAdmin, registerAdmin, logoutAdmin, getUsers, getUserById, deleteUserById, addUser, updateUserProfileByAdmin } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import { updateUserProfile } from "../controllers/userController.js";


const adminRouter = Router();


adminRouter.post('/register',registerAdmin);
adminRouter.post('/auth',authAdmin);
adminRouter.post('/logout',protectAdmin,logoutAdmin);
adminRouter.get('/users',protectAdmin,getUsers);
adminRouter.get('/users/:userId',protectAdmin,getUserById);
adminRouter.delete('/users/delete/:userId',protectAdmin,deleteUserById);
adminRouter.post("/users/add", protectAdmin, addUser);
adminRouter.put("/users/edit/:userId", protectAdmin, updateUserProfileByAdmin);


export default adminRouter;