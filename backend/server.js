const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.json()) 

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/admin.html`))
})

app.use('/img', express.static(`${__dirname}/data/img`))

app.use('/public', express.static(`${__dirname}/../frontend/public`))

app.get('/pizza', (req, res) => {
    fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
      if (err) {
        console.log('hiba:', err)
        res.status(500).send('hibavan')
      } else {
        res.status(200).send(JSON.parse(data))
      }
    })
})

app.post('/',(req, res) => {
    // let orderData = JSON.stringify(req.body)
    console.log(req.body)
    const fileData = JSON.parse(JSON.stringify(req.body));
	  const fileDataString = JSON.stringify(fileData, null, 2);
    let currentDate = Date.now()
    let filePath = `${__dirname}/data/pizzas-order-${currentDate}.json`
    fs.writeFile(filePath, fileDataString, (err) => {
      if(err) {
          return res.send(error)
      } else {
          return res.send({response: 'done'})
      }
    })
}) 

app.post('/admin', (req, res) => {

  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if (err) {
      console.log('hiba:', err)
      res.status(500).send('hibavan')
    } else {
      let pizzas = JSON.parse(data)

      let lastItem = pizzas[pizzas.length - 1]
      let lastItemId = parseInt(lastItem.id)

      let newPizza = {
        "id": (lastItemId + 1).toString(),
        "name": req.body.name,
        "ingredients": req.body.ingredients.split(', '),
        "price": req.body.price,
        "active": "true"
      }

      pizzas.push(newPizza)

      fs.writeFile(`${__dirname}/data/pizza.json`, JSON.stringify(pizzas, null, 4), (err) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json(newPizza)
        }
      })
    }
  })
})

app.delete('/admin/del/:id', (req, res) => {
  let delPizzaId = req.params.id
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if(err) {
      console.log(err)
    }else {
      let pizzas = JSON.parse(data)

      let delPizza = pizzas.find(el => el.id === delPizzaId)
      let index = pizzas.indexOf(delPizza)
      pizzas.splice(index, 1)

      fs.writeFile(`${__dirname}/data/pizza.json`, JSON.stringify(pizzas, null, 4), (error) => {
        if(error) {
            console.log(error)
        } else {
            return res.send("ok")
        }
    })
    }
  })
})

app.get('/admin/:id', (req, res) => {
  let selPizzaId = req.params.id
  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if(err) {
      console.log(err)
    }else {
      let pizzas = JSON.parse(data)

      let selPizza = pizzas.find(el => el.id === selPizzaId)
      return res.send(selPizza)
    }
  })
})

app.put('/admin/modify/:id', (req, res) => {
  let modPizzaId = req.params.id
  let changes = req.body

  fs.readFile(`${__dirname}/data/pizza.json`, (err, data) => {
    if(err) {
      console.log(err)
    }else {
      let pizzas = JSON.parse(data)

      let index = pizzas.findIndex(pizza => pizza.id === modPizzaId)

      if(index !== -1) {
        pizzas[index] = changes 
      } else {
        res.send("This pizza does not exist!")
      }

      fs.writeFile(`${__dirname}/data/pizza.json`, JSON.stringify(pizzas, null, 4), (error) => {
        if(error) {
            console.log(error)
        } else {
           res.send("ok")
        }
    })
    }

  })
})


app.listen(3000, console.log('server listening on http://127.0.0.1:3000'))