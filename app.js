const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const homeStartingContent = 'Hello About'
const aboutStartingContent = 'Hello About'
const contactStartingContent = 'Hello Contact'
const _ = require('lodash')
const app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
//
let posts = []
app.get('/', function (req, res) {
  res.render('home', { posts: posts })
})
app.get('/addjob', function (req, res) {
  res.render('addjob')
})
app.post('/addjob', function (req, res) {
  let post = {
    title: req.body.postTitle,
    company: req.body.postCompany,
    content: req.body.postBody,
    location: req.body.postLocation,
    status: req.body.postStatus,
    type: req.body.postType,
  }

  posts.push(post)
  res.redirect('/')
})
app.get('/static', function (req, res) {
  res.render('static')
})
app.get('/profile', function (req, res) {
  res.render('profile')
})
//
app.get('/posts/:postName', function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName)

  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.title)

    if (storedTitle === requestedTitle) {
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
//
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
