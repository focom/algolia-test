const express = require('express')
const PORT = process.env.PORT || 5000

var app = express()

var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('algolia.db')

// simple example to return value stored in DB
app.get('/stat/:repo', function (req, res, next) {
  let result = []
  db.serialize(function () {
    db.each(
      `SELECT * FROM data where repository='${req.params.repo}';`,
      function (err, row) {
        if (err) throw err
        result.push(row)
        console.log(result)
      },
      function (err, count) {
        if (err) throw err
        db.close()
        result.message = 'All good'
        res.send(JSON.stringify(result))
      }
    )
  })
})
app.listen(PORT)
