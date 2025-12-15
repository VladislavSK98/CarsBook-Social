const { userModel, themeModel, postModel } = require('../models');

// 🔧 Създаване на нов пост и ъпдейт на потребител и тема
function createPost(req, res, next) {
    const { themeId, text: postText, title: postTitle } = req.body;
    const { _id: userId } = req.user;

    if (!req.user) {
        return res.status(400).json({ message: 'User is not authenticated.' });
    }

    if (!postText || !postTitle) {
        return res.status(400).json({ message: 'Title and text are required.' });
    }

    const newPost = new postModel({ text: postText, title: postTitle, userId, themeId });

    newPost.save()
        .then(post => Promise.all([
            userModel.updateOne({ _id: userId }, { $push: { posts: post._id }, $addToSet: { themes: themeId } }),
            themeModel.findByIdAndUpdate(themeId, { $push: { posts: post._id }, $addToSet: { subscribers: userId } }, { new: true })
        ]).then(() => res.status(201).json(newPost)))
        .catch(next);
}

// 🔍 Връща всички постове
function getAllPosts(req, res, next) {
    postModel.find()
        .sort({ created_at: -1 })
        .populate('userId', 'username')          // <-- добавено
        .populate('comments.userId', 'username')
        .then(posts => res.status(200).json(posts))
        .catch(next);
}


// 🧠 Взема пост по ID
function getPostById(req, res, next) {
    const { id } = req.params;

    postModel.findById(id)
        .populate('userId', 'username')
        .populate('themeId', 'name')
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found' });
            res.status(200).json(post);
        })
        .catch(next);
}

// 🆕 Взема последните постове с лимит
function getLatestsPosts(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    postModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('themeId', 'name')
        .populate('userId', 'username')
        .then(posts => res.status(200).json(posts))
        .catch(next);
}

// ✏️ Редакция на пост// 

// function editPost(req, res, next) {
//     const { postId } = req.params;
//     const { postText, postTitle } = req.body;
//     const { _id: userId } = req.user;

//     postModel.findOneAndUpdate(
//         { _id: postId, userId },
//         { text: postText, title: postTitle },
//         { new: true }
//     )
//         .then(updatedPost => {
//             if (updatedPost) {
//                 res.status(200).json(updatedPost);
//             } else {
//                 res.status(401).json({ message: `Not allowed!` });
//             }
//         })
//         .catch(next);
// }
function editPost(req, res, next) {
    const { postId } = req.params;
    const { text, title } = req.body;
    const { _id: userId } = req.user;

    postModel.findOneAndUpdate(
        { _id: postId, userId },
        { text, title },
        { new: true }
    )
        .then(updatedPost => {
            if (!updatedPost) {
                return res.status(403).json({ message: 'Not allowed' });
            }
            res.status(200).json(updatedPost);
        })
        .catch(next);
}


// 🗑️ Изтриване на пост//

// function deletePost(req, res, next) {
//     const { postId, themeId } = req.params;
//     const { _id: userId } = req.user;

//     Promise.all([
//         postModel.findOneAndDelete({ _id: postId, userId }),
//         userModel.findOneAndUpdate({ _id: userId }, { $pull: { posts: postId } }),
//         themeModel.findOneAndUpdate({ _id: themeId }, { $pull: { posts: postId } }),
//     ])
//         .then(([deletedOne]) => {
//             if (deletedOne) {
//                 res.status(200).json(deletedOne);
//             } else {
//                 res.status(401).json({ message: `Not allowed!` });
//             }
//         })
//         .catch(next);
// }
// function deletePost(req, res, next) {
//     const { postId } = req.params;
//     const { _id: userId } = req.user;

//     postModel.findOne({ _id: postId, userId })
//         .then(post => {
//             if (!post) {
//                 return res.status(403).json({ message: 'Not allowed' });
//             }

//             return Promise.all([
//                 postModel.findByIdAndDelete(postId),
//                 userModel.updateOne({ _id: userId }, { $pull: { posts: postId } }),
//                 themeModel.updateOne(
//                     { _id: post.themeId },
//                     { $pull: { posts: postId } }
//                 )
//             ]);
//         })
//         .then(() => res.status(200).json({ message: 'Post deleted' }))
//         .catch(next);
// }
function deletePost(req, res, next) {
    const { postId } = req.params;
    const { _id: userId } = req.user;
    console.log("Deleting postId:", postId, "userId:", userId);


    postModel.findById(postId) // вместо findOne({ _id: postId, userId })
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found' });
            if (post.userId.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Not allowed' });
            }

            return Promise.all([
                postModel.findByIdAndDelete(postId),
                userModel.updateOne({ _id: userId }, { $pull: { posts: postId } }),
                themeModel.updateOne(
                    { _id: post.themeId },
                    { $pull: { posts: postId } }
                )
            ]);
        })
        .then(() => res.status(200).json({ message: 'Post deleted' }))
        .catch(next);
}



// 👍 Лайк/Ънлайк на пост
async function likePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error while liking post', error });
    }
}

// 🧵 Добавяне на коментар
function addComment(req, res, next) {
    const { postId } = req.params;
    const { text } = req.body;

    postModel.findById(postId)
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found' });

            post.comments.push({ text, userId: req.user._id });
            return post.save();
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(next);
}

// 🗨️ Вземане на всички коментари
function getComments(req, res, next) {
    const { postId } = req.params;

    postModel.findById(postId)
        .populate('comments.userId', 'username')
        .then(post => {
            if (!post) return res.status(404).json({ message: 'Post not found' });
            res.status(200).json(post.comments);
        })
        .catch(next);
}

// 📄 Взема пълен пост с потребител и коментари
function getPost(req, res, next) {
    const { id } = req.params;

    postModel.findById(id)
        .populate('userId')
        .populate('comments.userId')
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(next);
}

function getPostsByUserId(req, res, next) {
    const { userId } = req.params;

    postModel.find({ userId })
        .sort({ created_at: -1 })
        .populate('themeId', 'name')
        .then(posts => res.status(200).json(posts))
        .catch(next);
}


module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getLatestsPosts,
    editPost,
    deletePost,
    likePost,
    addComment,
    getComments,
    getPost,
    getPostsByUserId,
};
