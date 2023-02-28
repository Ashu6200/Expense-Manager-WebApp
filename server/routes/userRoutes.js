const userRouter = require('express').Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../model/userModel');
const JWTSEC = "#2@!@$ndja45883 r7##";



userRouter.post('/register',
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json("You already have account Please Login");
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashPassword
            });
            const accessToken = jwt.sign({
                id: user._id,
                email: user.email,
                username: user.username
            }, JWTSEC);
            await user.save();
            res.status(200).json({ user: user, accessToken: accessToken });
        } catch (error) {
            res.status(500).json("Internal error")

        }
    })

userRouter.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json("User doesn't found")
            }
            const Comparepassword = await bcrypt.compare(req.body.password, user.password);
            if (!Comparepassword) {
                return res.status(400).json("Password does not match")
            }
            const accessToken = jwt.sign({
                id: user._id,
                email: user.email,
                username: user.username
            }, JWTSEC);
            const { password, ...other } = user._doc
            res.status(200).json({ user: other, accessToken });

        } catch (error) {
            res.status(500).json("Internal error occured")
        }
    });

module.exports = userRouter