const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');
const { validateToken } = require("../midlewares/AuthMidleware");
const { profile } = require("console");

//create user
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json({ "username": username });
    });
});

//create accesstoken to login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (!user) {
        res.json({ error: "User Doesn't Exist" });
    } else {
        try {
            bcrypt.compare(password, user.password).then((match) => {
                if (!match) {
                    res.json({ error: "Wrong Username And Password Combination" });
                } else {
                    const accessToken = sign(
                        {
                            username: user.username,
                            id: user.id
                        },
                        "secretWord"
                    );
                    res.json({ token: accessToken, username: user.username, id: user.id });
                }
            });
        } catch (err) {
            res.json({ error: err });
        }
    }
});

//validate user
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

//get profile info
router.get("/profile/:id", async (req, res) => {
    const id = req.params.id
    //tips:attributes extra information to query
    const profileInfo = await Users.findByPk(id,
        { attributes: { exclude: ["password"] } });
    res.json(profileInfo);
});

//update password
router.put("/edit", validateToken, async (req, res) => {
    console.log("into the edit....");
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });
    try {
        bcrypt.compare(oldPassword, user.password).then(async (match) => {
            if (!match) {
                res.json({ error: "Wrong Password Combination" });
            } else {
                await bcrypt.hash(newPassword, 10).then((hash) => {
                    Users.update({ password: hash },
                        { where: { username: req.user.username } });
                    res.json("Success");
                });
            }
        });
    } catch (err) {
        res.json({ error: err });
    }

});

module.exports = router;