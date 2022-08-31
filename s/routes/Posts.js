const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../midlewares/AuthMidleware");

router.get("/", validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.get("/userById/:id", async (req, res) => {
    const userId = req.params.id;
    const listOfPosts = await Posts.findAll({ where: { UserId: userId }, include: [Likes] });
    res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.UserId = req.user.id;
    post.username = req.user.username;
    await Posts.create(post);
    res.json(post);
});

router.put("/title", async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update({ title: newTitle }, { where: { id: id } });
    res.json(newTitle);
});

router.put("/postText", async (req, res) => {
    const { newText, id } = req.body;
    await Posts.update({ postText: newText }, { where: { id: id } });
    res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    try {
        await Posts.destroy({
            where: {
                id: postId
            },
        });
        res.json({ status: true });
    } catch (err) {
        res.json({ error: err });
    }
});

module.exports = router;