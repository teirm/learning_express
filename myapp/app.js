var express = require('express')
var app = express()

var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}

var requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
}

/* Have to load middleware */
/* Middleware loaded first is executed first */
app.use(myLogger)
app.use(requestTime)

app.get('/', function (req, res){
    var responseText  = 'Hello World!<br>'
    responseText += '<small>Requested at: '
                    + req.requestTime
                    + '</small>'

    res.send(responseText)
})



/*
app.get('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
*/

app.listen(3000)

/*
    app.use(express.static('public'))
*/
