import express from 'express'
import UserController from '../controllers/users.js'
import Auth from '../common/auth.js'

const router = express.Router()

router.post('/signup',UserController.create)

router.post('/login',UserController.login)

router.post('/forgot-password',UserController.forgotPassword)

router.post('/reset-password',Auth.validate,UserController.resetPassword)


export default router