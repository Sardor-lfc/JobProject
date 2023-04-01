require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
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
//

const userSchema = new mongoose.Schema({ email: String, password: String })

const User = new mongoose.model('User', userSchema)

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
app.get('/login', function (req, res) {
  res.render('login')
})
app.get('/register', function (req, res) {
  res.render('register')
})

app.get('/error', function (req, res) {
  res.render('error')
})
app.post('/login', async function (req, res) {
  const { username, password } = req.body

  try {
    const foundUser = await User.findOne({ email: username })

    if (foundUser) {
      const result = await bcrypt.compare(password, foundUser.password)
      if (result === true) {
        res.redirect('/')
      } else {
        res.redirect('error')
      }
    } else {
      res.redirect('error')
    }
  } catch (err) {
    console.log(err)
    res.send('Something went wrong')
  }
})

app.post('/register', function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    })
    newUser
      .save()
      .then(() => {
        res.redirect('/')
      })
      .catch((err) => {
        console.log(err)
      })
  })
})
app.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    // perform additional actions after logout
    res.redirect('/')
  })
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
app.post('/delete/:_id', async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params._id })
    return res.redirect('/')
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server error')
  }
})
//Update function

app.get('/edit/:_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
    if (!post) {
      return res.status(404).send('Post not found')
    }
    res.render('edits/edit', { post })
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server error')
  }
})

//
app.get('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId
  try {
    const post = await Post.findOne({ _id: requestedPostId }).exec()
    res.render('post', {
      title: post.title,
      company: post.company,
      content: post.content,
      location: post.location,
      status: post.status,
      type: post.type,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

let port = process.env.PORT
if (port == null || port == '') {
  port = 3000
}

app.listen(port, function () {
  console.log('Server started successfully')
})
