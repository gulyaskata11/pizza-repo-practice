const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.json()) // IMPORTANT

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.use('/public', express.static(`${__dirname}/../frontend/public`))






app.listen(2000, console.log('server listening on http://127.0.0.1:2000'))