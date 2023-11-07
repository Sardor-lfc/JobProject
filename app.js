//require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const port = 4000
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
const loginSchema = {
  name: String,
  username: String,
  password: String,
}
const registerSchema = {
  name: String, // Full name
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  gender: {
    type: String,
  },
  profilePhoto: String, // URL or file path
  email: {
    type: String,
    required: true,
    unique: true,
    validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  // Other fields as needed
}

const dateSchema = new mongoose.Schema({
  dateString: {
    type: Date,
    default: Date.now,
  },
})
const DateModel = mongoose.model('Date', dateSchema)
const Post = mongoose.model('Post', postSchema)
const Login = mongoose.model('Login', loginSchema)
const Register = mongoose.model('Register', registerSchema)
//

//const userSchema = new mongoose.Schema({ email: String, password: String })
//
//const User = new mongoose.model('User', userSchema)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

//

const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)
const dateString = currentDate.toLocaleString('en-GB')

const dateObject = new DateModel({ dateString })
dateObject.save()

//
app.get('/', function (req, res) {
  Post.find({})
    .then((posts) => {
      res.render('home', {
        posts: posts,
        dateAndTime: dateString,
      })
    })
    .catch((err) => {
      console.error(err)
    })
})

app.get('/addjob', function (req, res) {
  res.render('addjob')
})
//
//
app.get('/login', function (req, res) {
  res.render('login')
})
app.get('/register', function (req, res) {
  res.render('register')
})
//
//
app.get('/error', function (req, res) {
  res.render('error')
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
// Login Authentication
app.get('/login', function (req, res) {
  const { username, password } = req.body

  Register.findOne({ username: username, password: password }, (err, user) => {
    if (err) {
      console.log(err)
      res.redirect('/error') // Handle errors as needed
    } else if (user) {
      // User found, create a session to represent the logged-in state
      req.session.user = user
      res.redirect('/dashboard') // Redirect to the dashboard or another page
    } else {
      res.redirect('/error') // User not found, handle as needed
    }
  })
})
//
// Register Authentication
app.post('/register', function (req, res) {
  const post = Register({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    profilePhoto: req.body.profilePicture,
    email: req.body.email,
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
//
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

app.listen(port, function () {
  console.log(`Server started successfully at ${port}`)
})
