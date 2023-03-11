const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const homeStartingContent = 'Hello About'
const aboutStartingContent = 'Hello About'
const contactStartingContent = 'Hello Contact'
const _ = require('lodash')
const app = express()
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost:27017/jobDB', { useNewUrlParser: true })
const postSchema = {
  title: String,
  company: String,
  content: String,
  location: String,
  status: String,
  type: String,
}
const Post = mongoose.model('Post', postSchema)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
//

app.get('/', function (req, res) {
  Post.find({})
    .then((posts) => {
      res.render('home', {
        posts: posts,
      })
    })
    .catch((err) => {
      console.error(err)
    })
})

app.get('/addjob', function (req, res) {
  res.render('addjob')
})
app.post('/addjob', function (req, res) {
  const post = Post({
    title: req.body.postTitle,
    company: req.body.postCompany,
    content: req.body.postBody,
    location: req.body.postLocation,
    status: req.body.postStatus,
    type: req.body.postType,
  })
  post
    .save()
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
    })
})
app.get('/static', function (req, res) {
  res.render('static')
})
app.get('/profile', function (req, res) {
  res.render('profile')
})
//
app.get('/posts/:postId', function (req, res) {
  const requestedPostId = req.params.postId
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (err) {
      console.log(err)
    } else {
      res.render('post', {
        title: post.title,
        company: post.comapany,
        content: post.content,
        location: post.location,
        status: post.status,
        type: post.type,
      })
    }
  })
})

app.listen(3000, function () {
  console.log('Server started on port 3000')
})
