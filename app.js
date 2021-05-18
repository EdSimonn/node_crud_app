const express = require('express');

const app = express();

app.use(express.json());

// database
const mongoose = require('mongoose');

//Coonect to Mongo
const db = require('./config/keys').MongoURI;

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true})
        .then(() => console.log('Mongo Connected....'))
        .catch(err => console.log(err));

// schema
const postSchema = new mongoose.Schema({
 message: "string",
 name: "string",
 email: "string",
 country: "string"
});
const Post  = mongoose.model('Post', postSchema);


// Routes
// Craete New Post
app.post('/post', function (req, res) {
    
    Post.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newPost) => {
        if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({ message: "Post created....", newPost})
        }
    })
});

// Get all posts
app.get('/post', (req, res) => {
    Post.find({}, (err, post) => {
        if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(500).json({ post })
        }
    })
})

// Get  single Post 
app.get('/post/:id', function(req, res) {
   Post.findById(req.params.id, (err, post) => {
       if(err) { 
           return res.status(500).json({message: err})
       } else {
           return res.status(200).json({message: "This is your post! ", post})
       }
   });
});

// update/edit post
app.patch('/post/:id', function(req, res) {
   Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
       if(err) { 
           return res.status(500).json({message: err})
       } else if (!post) {
           return res.status(200).json({message: "Post not found"})
       } else {
           post.save((err, newPost) => {
               if(err) {
                   return res.status(400).json({message: err})
               } else {
                   return res.status(200).json({message: "Post Updated.....", newPost})
               }
           })
       }
   });
});

// Delete Post
app.delete('/post/:id', function(req, res) {
    Post.findByIdAndDelete(req.params.id, (err, post) => {
        if(err) {
            return res.status(500).json({message: err})
         } else {
            return res.status(200).json({message: "Post Deleted........"})
        }
     })
})


// PORT
const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server started on ${PORT}`));