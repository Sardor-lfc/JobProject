require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const _ = require('lodash')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require('./config/auth.js')
MongoDB_Connect_Uri =
  'mongodb+srv://sardordev99:1IVosjqmVzajTBRz@sardor.x1nvukx.mongodb.net/jobDB?retryWrites=true&w=majority&appName=sardor'

app.set('view engine', 'ejs')
require('./config/passport')(passport)
mongoose
  .connect(MongoDB_Connect_Uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
)
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/users', require('./routes/users.js'))
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

//const userSchema = new mongoose.Schema({ email: String, password: String })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

//

//
app.get('/home', ensureAuthenticated, function (req, res) {
  Post.find({})
    .then((posts) => {
      res.render('home', {
        posts: posts,
        user: req.user,
      })
    })
    .catch((err) => {
      console.error(err)
    })
})
app.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))
app.get('/addjob', function (req, res) {
  res.render('addjob', {
    user: req.user,
  })
})
app.get('/profile', function (req, res) {
  res.render('profile', {
    user: req.user,
  })
})
//
//

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

//

//

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
app.get('/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    res.render('posts/edit', { posts: post })
  } catch {
    res.render('/')
  }
})
app.put('/edit/:_id', async (req, res) => {
  let post
  try {
    post = await Post.findById(req.params.id)

    post._id = req.params._id
    await post.save()
    res.redirect('/')
  } catch (error) {
    if (post == null) {
      res.redirect('/')
    } else {
      res.render('posts/edit', {
        post: post,
        error_msg: 'Error updating Post',
      })
    }
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
const PORT = 4000
app.listen(PORT, function () {
  console.log(`Server started successfully at ${PORT}`)
})
