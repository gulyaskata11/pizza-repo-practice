const rootElement = document.querySelector('#root')

const pizzaComponent = (name, ingredients, price) => `
  <div class="pizza">
    <h2>${name}</h2>
    <h5>${price} $</h5>
    <h3>Ingredients: ${ingredients}</h3>
    <img src="img/${name}.webp" width="24" height="39" alt="pizza">
    <label for="amount">Amount: </label>
    <input class="amount" type="number" name="amount">
    <button class="add-order">Addition</button>
  </div>
`

fetch('/pizza')
  .then(res => res.json())
  .then(pizzas => {
    pizzas.map((pizza) => rootElement.insertAdjacentHTML('beforeend', pizzaComponent(pizza.name, pizza.ingredients, pizza.price)))
    
    const addOrder = document.querySelectorAll('.add-order')
    
    for(let btn of addOrder) {
      btn.addEventListener("click", function(event) {
       // console.log(event)
        const pizzaName = event.path[1].children[0].innerText
       // console.log(pizzaName)
        const number = event.path[1].children[5].value
       // console.log(number)
        const price = event.path[1].children[1].innerText
        rootElement.insertAdjacentHTML("beforeend", `
          <div>
            <h1>${pizzaName}</h1>
            <h2>${number} x ${price}</h2>
          </div>
        `)     
      })
    }
}) 