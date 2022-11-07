const rootElement = document.querySelector('#root')

const pizzaComponent = (name, price, ingredients, id) => `
  <div class="beer">
    <h2>${name}</h2>
    <h3>${price}</h3>
    <h4>${rating}</h4>
    <button class="edit beer${id}">edit</button>
  </div>
`