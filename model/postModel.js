const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'image.jpg',
  },
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
