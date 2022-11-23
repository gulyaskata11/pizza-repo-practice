const rootElement = document.querySelector('#root')
const addPizzaForm = document.querySelector('.add-pizza-form')
const delPizzaForm = document.querySelector('.del-pizza-form')
const modifyPizza = document.querySelector('.modify')

const addPizzas = async () => {
    return fetch('/pizza')
    .then(data => data.json()).then(pizzas => {
        return pizzas
    })
}

const pizzaComponent = (id, name, price, ingredients, active) => `
<div class="pizza">
    <h1>${id}</h1> 
    <h1>${name}</h1>
    <h1>${price} $</h1>
    <div class="pizza-pics">
        <img src="img/${name}.webp" alt="pizza">
    </div>
    <h1>${ingredients.join(" &#9679 ")}</h1>
    <h1>${active}</h1>
</div>
`;

const elementBuilder = async () => {
    const data = await addPizzas()
    data.forEach(elem => {
        rootElement.insertAdjacentHTML('beforeend', pizzaComponent(elem.id, elem.name, elem.price, elem.ingredients, elem.active))
    })
}

const addNewPizza = async () => {
    const sendBtn = document.querySelector('.send-btn')
    sendBtn.addEventListener('click', async (event) => {  
        event.preventDefault()
        console.log(event)
        let nameInput = document.querySelector('#name').value
        let ingInput = document.querySelector('#ingredients').value
        let priceInput = document.querySelector('#price').value

        console.log(nameInput, ingInput, priceInput)

        let newPizzaDatas = {
            name: nameInput,
            ingredients:ingInput,
            price: priceInput
        }

        await fetch('/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPizzaDatas)
         })
        //  .then(res => res.json())
        //  .then(newPizza => rootElement.insertAdjacentHTML("beforeend", pizzaComponent(newPizza.id, newPizza.name, newPizza.price, newPizza.ingredients, newPizza.active)))
        rootElement.innerHTML= ""
        await elementBuilder()
    })
}

const delPizza = async () => {
    const delBtn = document.querySelector('.del-pizza')
    delBtn.addEventListener("click", async () => {
        let delInput = document.querySelector('#del-pizza-id').value
        await fetch(`/admin/del/${delInput}`, {
            method: 'DELETE'
        })
        rootElement.innerHTML= ""
        await elementBuilder()
    })
}

const selectPizza = async () => {
    const selectBtn = document.querySelector('.select-pizza')
    selectBtn.addEventListener("click", async () => {
        let selectedId = document.querySelector("#select-pizza-id").value
        let pizzaNameSel = document.querySelector('.sel-pizza-name')
        let pizzaPriceSel = document.querySelector('.sel-pizza-price')
        let pizzaIngrSel = document.querySelector('.sel-pizza-ingredients')
        let pizzaIdSel = document.querySelector('.pizz-id')
        await fetch(`/admin/${selectedId}`)
         .then(res => res.json())
         .then(newPizza => {
            pizzaIdSel.innerHTML = newPizza.id
            pizzaNameSel.value = newPizza.name,
            pizzaPriceSel.value = newPizza.price,
            pizzaIngrSel.value = newPizza.ingredients
            })
        
        
    })
}

const modifyPizzaComponent = async () => {
    const modBtn = document.querySelector('.modify-pizza')
    modBtn.addEventListener("click", async () => {

        let selectedId = document.querySelector("#select-pizza-id").value
        let modNameInput = document.querySelector('.sel-pizza-name').value
        let modPriceInput = document.querySelector('.sel-pizza-price').value
        let modIngrInput = document.querySelector('.sel-pizza-ingredients').value
        let modStatusSelect = document.querySelector('.sel-pizza-status').value

        let modifiedPizzaDatas = {
            "id": selectedId,
            "name": modNameInput,
            "ingredients": modIngrInput.split(','),
            "price": modPriceInput,
            "active": modStatusSelect
        }

        await fetch(`/admin/modify/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifiedPizzaDatas)
        }) 

        rootElement.innerHTML = ""
        await elementBuilder()
    })
}




const main = async () => {
  await elementBuilder()

  addPizzaForm.insertAdjacentHTML("beforeend", `
  <form id="new-pizza-form">
      <input type="text" name="name" id="name" placeholder="Pizza Name">
      <input type="text" name="ingredients" id="ingredients" placeholder="Ingredients">
      <input type="number" name="price" id="price" placeholder="Price">
      <button class="send-btn">Send</button>
      <input type="reset" value="Empty">
  </form>
  `)

  addPizzaForm.insertAdjacentHTML("beforeend", `
    <input type="number" name="id" id="del-pizza-id">
    <button class="del-pizza">Delete</button>
  `)

  delPizzaForm.insertAdjacentHTML("beforeend", `
    <input type="number" name="id" id="select-pizza-id">
    <button class="select-pizza">Select</button>
  `)

  await addNewPizza()

  await delPizza()

  await selectPizza()

  await modifyPizzaComponent()
}

main()