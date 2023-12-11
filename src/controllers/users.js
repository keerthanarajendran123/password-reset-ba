import userModel from '../models/users.js'
import Auth from '../common/auth.js'
import EmailService from '../common/emailService.js'
import auth from '../common/auth.js'


const create = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(!user){
            req.body.password = await Auth.hashPassword(req.body.password)
            await userModel.create(req.body)
            res.status(201).send({
                message:"User Created Successfully"
             })
        }
        else
        {
            res.status(400).send({message:`User with ${req.body.email} already exists`})
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const login = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user)
        {
            let hashCompare = await Auth.hashCompare(req.body.password,user.password)
            if(hashCompare)
            {
                let token = await Auth.createToken({
                    id:user._id,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    role:user.role
                })
                let userData = await userModel.findOne({email:req.body.email},{_id:0,password:0,status:0,createdAt:0,email:0})
                res.status(200).send({
                    message:"Login Successfull",
                    token,
                    userData
                })
            }
            else
            {
                res.status(400).send({
                    message:`Invalid Password`
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`Account with ${req.body.email} does not exists!`
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
} 

const forgotPassword = async(req,res)=>{
    try {
         let user = await userModel.find({email:req.body.email},{password:0})
        
        if(user.length===1)
        {
           //creating token
            let token = await auth.createToken({
                email:user[0].email,
                firstName:user[0].firstName,
                lastName:user[0].lastName,
                id:user[0]._id
            })
            let url = `http://localhost:5173/reset-password?token=${token}`
            await EmailService.forgotPassword({name:`${user[0].firstName} ${user[0].lastName}`,email:'keerthurb9@gmail.com',url})
            res.status(200).send({
                message:"Reset Password Link Sent",
                url,
            })
        }
        else
        {
            res.status(400).send({
                message:`Account with ${req.body.email} does not exists`
            })
        }
         
    } catch (error) {
     console.log(error)
         res.status(500).send({
             message:"Internal Server Error",
             error:error.message
         })
    }
 }


const resetPassword = async (req, res) => {
    try {
      let token = req.headers.authorization?.split(' ')[1];
      let data = await auth.decodeToken(token);
  
      if (req.body.newpassword === req.body.confirmpassword) {
        let user = await userModel.findOne({ email: data.email });
        if (!user) {
          return res.status(400).send({
            message: 'User not found'
          });
        }
        user.password = await auth.hashPassword(req.body.newpassword);
        await user.save();
  
        return res.status(200).send({
          message: 'Password Updated Successfully'
        });
      } else {
        return res.status(400).send({
          message: "Passwords don't match"
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: 'Internal Server Error',
        error: error.message
      });
    }
  };
  

  export default {
    create,
    login,
    forgotPassword,
    resetPassword
  };