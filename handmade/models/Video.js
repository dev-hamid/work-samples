var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    Title: { type: String, default: '' },
    Size: { type: Number, default: 0.0 },
    Permalink: { type: String, required: true, unique: true },
    Artwork_Url: { type: String, default: '' },
    Views_Count: { type: Number, default: 0 },
    Likes_Count: { type: Number, default: 0 },
    Comments_Count: { type: Number, default: 0 },
    Duration: { type: Number, default: 0.0 },
    Tags: { type: String, default: '' },
    Video_Url: { type: String, default: '' },
    Stream_Url: { type: String, default: '' },
    Publisher: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Likers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    IsUserLike: { type: Boolean, default: false },
    Created_At: { type: Date, default: Date.now },
    Updated_At: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
