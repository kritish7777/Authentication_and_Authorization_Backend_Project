const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = async(req,res) => {
    try{
        // get data
        const{name,email,password,role} = req.body;
        
        // check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }
        
        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"error in hashing password"
            })
        }
        
        // create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"user created successfully"
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again later",
        });
    }
}


exports.login = async(req,res) => {
    try{

        // data fetch
        const{email,password} = req.body;
        
        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all details carefully"
            })
        }
        
        // check for registered user
        let user = await User.findOne({email});
        
        // if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered"
            })
        }
        
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        
        // verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,
                                               {
                                                expiresIn:"2h"
                                            })
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"user loggedin successfully"
            })
        }

        else{
            // password do not match
            return res.status(403).json({
                success:true,
                message:"incorrect password"
            })
        }
        
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure"
        })
    }
}