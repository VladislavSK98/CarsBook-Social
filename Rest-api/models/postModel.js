const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    title: {
        type: String, 
        required: true,
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    userId: {
        type: ObjectId,
        ref: "User"
    },
    themeId: {
        type: ObjectId,
        ref: "Theme"
    },
    comments: [{
        userId: { type: ObjectId, ref: "User" },
        text: { type: String, required: true }
    }]
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Post', postSchema);
