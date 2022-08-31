const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../midlewares/AuthMidleware");

router.get("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { PostId: postId } });
    res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    comment.username = req.user.username;
    await Comments.create(comment);
    res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        await Comments.destroy({
            where: {
                id: commentId
            },
        });
        res.json("Deleted comment succesfully.");
    } catch (err) {
        res.json({ error: err });
    }

});

module.exports = router;