const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const homeStartingContent = 'Hello About'
const aboutStartingContent = 'Hello About'
const contactStartingContent = 'Hello Contact'

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
    content: req.body.postBody,
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
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
