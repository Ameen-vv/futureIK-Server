import express from 'express';
import {   signIn, userCheck, userRegister } from '../controllers/userController.js';
const router = express.Router();


router.post('/register',userRegister);
router.post('/signIn',signIn)
router.get('/authorize',userCheck)


export default router;