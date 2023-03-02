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

app.get('/', function (req, res) {
  res.render('home')
})
app.get('/addjob', function (req, res) {
  res.render('addjob')
})
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
