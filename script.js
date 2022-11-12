//http://localhost:8000
//https://backendbsaleprueba-production.up.railway.app
const content = document.querySelector('#content')
const categoryContainer = document.getElementById('categories')
const homeBtn = document.querySelector('#home_button')
const inputSearch = document.getElementById('input_search')
const btnSearch = document.getElementById('button_search')
const loadingContainer = document.getElementById('loading-container')
const cartContainer = document.getElementById('cart-container')
const clearButton = document.getElementById('clear-button')
const totalPrice = document.getElementById('total-price')
const payButton = document.getElementById('pay-button')
const btnOpenCart = document.getElementById('open-cart')
let productsArray = []
let cart = []
var page_number = 1
var records_per_page = 8
var total_page;
let quantity = {quantity: 1}
btnSearch.disabled = true

//Listeners
document.addEventListener('DOMContentLoaded', function () {
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        updateCart()
    }
    getProducts()
    getCategories()
})
clearButton.addEventListener('click', function () {
    for (let i = 0; i < cart.length; i++) {
        cart[i].quantity = 1
    }
    cart.length = 0
    updateCart()
    emptyCartVerify()
})
homeBtn.addEventListener('click', function () {
    $('.pagination-container').text('')
    getProducts()
})
btnSearch.addEventListener('click', function (e) {
    e.preventDefault()
    $('.pagination-container').text('')
    searchProducts(inputSearch.value)
})
inputSearch.addEventListener('keyup', inputEmpty)
btnOpenCart.addEventListener('click', function(e){
    e.preventDefault()
    $('#cart-modal').modal()
    emptyCartVerify()
})

//Fetchs
function getProducts(category = null) {
    inputEmpty()
    loadingContainer.style.visibility = 'visible';
    loadingContainer.style.opacity = '100'
    content.innerHTML = ''
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/products/${category ? category : ''}`)
        .then(res => res.json())
        .then(data => {
            productsArray = [
                data,
            ]
            fill(productsArray[0])
            if (data.length) {
                loadingContainer.style.visibility = 'hidden';
                loadingContainer.style.opacity = '0'
                document.querySelector('#alert-container').style.display = 'none'
            }
            total_page = Math.ceil(productsArray[0].length / records_per_page);
            displayPaginationButtons()
        })
}
function getCategories() {
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/categories`)
        .then(res => res.json())
        .then(data => {
            fillCategories(data)
            let categories = document.querySelectorAll('.category')
            for (let i = 0; i < categories.length; i++) {
                categories[i].addEventListener('click', function () {
                    $('.pagination-container').text('')
                    getProducts(i + 1)
                    page_number = 1
                })
            }
        })
}
function searchProducts(search) {
    loadingContainer.style.visibility = 'visible';
    loadingContainer.style.opacity = '100'
    content.innerHTML = ''
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/products/search/${search ? search : ''}`)
        .then(res => res.json())
        .then(data => {
            if (data.length) {
                productsArray = [
                    data,
                ]
                fill(productsArray[0])
                document.querySelector('#alert-container').style.display = 'none'
                loadingContainer.style.visibility = 'hidden';
                loadingContainer.style.opacity = '0'
                total_page = Math.ceil(productsArray[0].length / records_per_page);
                displayPaginationButtons()
            } else {
                document.querySelector('#alert-container').style.display = 'flex'
                document.querySelector('#alert-container').textContent = 'No se encontro el producto 🥸'
                loadingContainer.style.visibility = 'hidden';
                loadingContainer.style.opacity = '0'
            }
        })
}

//Functions Pagination
function displayPaginationButtons(){
    var buttons_text
    if(page_number == 1){
        buttons_text = '<li class="page-item disabled"><a onClick="prevPage()" id="prev-btn" class="page-link" href="#">&laquo;</a></li>'
    }else{
        buttons_text = '<li class="page-item"><a onClick="prevPage()" id="prev-btn" class="page-link" href="#">&laquo;</a></li>'
    }
    var active = ''
    for (let i = 1; i <= total_page; i++) {
        if(i==page_number){
            active = ' active'
        }else{
            active = ''
        }
        buttons_text = buttons_text+'<li class="page-item' + active + '"><a id="page-index'+ (i) +'" onClick="changePageIndex('+ i +')" class="page-link page-index" href="#">' + (i) + '</a></li>'
    }
    if(page_number == total_page){
        buttons_text = buttons_text + '<li class="page-item disabled"><a onClick="nextPage();" class="page-link" href="#">&raquo;</a></li>'
    }else{
        buttons_text = buttons_text + '<li class="page-item"><a onClick="nextPage();" class="page-link" href="#">&raquo;</a></li>'
    }
    $('.pagination-container').text('')
    $('.pagination-container').append(buttons_text)
}
function nextPage(){
    page_number++
    fill(productsArray[0])
    displayPaginationButtons()
}
function prevPage(){
    page_number--
    fill(producproductsArraytos[0])
    displayPaginationButtons()
}
function changePageIndex(index){
    page_number = parseInt(index)
    fill(productsArray[0])
    displayPaginationButtons()
}

//Functions fill
function fill(products) {
    content.innerHTML = ''
    let start_index = (page_number - 1) * records_per_page
    let end_index = start_index + (records_per_page - 1)
    end_index = (end_index >= products.length ? products.length - 1 : end_index)
    for (let i = start_index; i <= end_index; i++) {
        Object.assign(products[i], quantity)
        content.innerHTML += `
            <div>
                <div class="card m-2" style="height: 35rem">
                    <div class="card-body">
                        <div style="height: 60%;">
                            <img src="${products[i].url_image ? products[i].url_image : './src/img/not_found_image.jpg'}" class="card-img-top " alt="product_image" style="height: 100%;">
                        </div>
                        <div class="data-container">
                            <div style="height: 30%;">
                                <h5 style="text-align: center;" class="card-title">${products[i].name}</h5>
                            </div>
                            <div class="prices_discount-container">
                                ${products[i].discount ? '<div class="discount-container"><p class="card-text discount">' + products[i].discount + '%</p></div>' : ''}
                                <div class="price-container">
                                    <p class="card-text font-weight-bold">${products[i].discount ? '<del>' + '$' + numericFormat(products[i].price) + '</del>' : '$' + numericFormat(products[i].price)}</p>
                                    ${products[i].discount ? '<p class="card-text font-weight-bold">' + '$' + numericFormat(Math.round((products[i].price - (products[i].price * products[i].discount) / 100))) + '</p>' : ''}
                                </div>
                            </div>
                        </div>
                        <div style="height: 2rem; margin-top: 2rem;">
                            <center>
                                <button onClick="addToCart(${products[i].id})" class="btn btn-primary btn-agregar">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shopping-cart-plus" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <circle cx="6" cy="19" r="2" />
                                    <circle cx="17" cy="19" r="2" />
                                    <path d="M17 17h-11v-14h-2" />
                                    <path d="M6 5l6.005 .429m7.138 6.573l-.143 .998h-13" />
                                    <path d="M15 6h6m-3 -3v6" />
                                    </svg>
                                </button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        `
        
    }
    $('.page-index').removeClass('active')
    $('#page-index'+page_number).addClass('active')
}
function fillCategories(data) {
    data.forEach(d => {
        categoryContainer.innerHTML += `
            <a class="dropdown-item category" href="#">${d.name.toUpperCase()}</a>
        `
    });
}

//Cart functions
function addToCart(product_id) {
    const exist = cart.some(prod => prod.id === product_id)
    if (exist) {
        const prod = cart.map(prod => {
            if (prod.id === product_id) {
                prod.quantity++
            }
        })
    }else{
        const product = productsArray[0].find((prod) => prod.id === product_id)
        cart.push(product)
    }
    updateCart()
}
function updateCart() {
    cartContainer.innerHTML = ''
    cart.forEach(product => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="cart-container-modal">
                <div class="cart-data-container">
                    <div>
                        <p>${product.name}</p>
                        <p>Precio: $${product.discount ? numericFormat(Math.round((product.price - (product.price * product.discount) / 100))) : product.price}</p>
                        <p>Cantidad: <span id="quantity">${product.quantity}</span></p>
                    </div>
                    <div>
                        <img src="${product.url_image ? product.url_image : './src/img/not_found_image.jpg'}" style="height: 8rem; border-radius: 0.5rem;">
                    </div>
                </div>
                <div>
                    <button style="width: 100%; display: flex; justify-content: center; align-items: center;" onClick="removeFromCart(${product.id})" class="btn btn-danger">
                        <p class="font-weight-bold" style="margin-bottom: 0;">Eliminar</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <line x1="3" y1="3" x2="21" y2="21" />
                        <path d="M4 7h3m4 0h9" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="14" x2="14" y2="17" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923" />
                        <line x1="18.384" y1="14.373" x2="19" y2="7" />
                        <path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                    </button>
                </div>
            </div>
        `
        cartContainer.appendChild(div)
    });
    localStorage.setItem('cart', JSON.stringify(cart))
    totalPrice.innerText = '$' + numericFormat(cart.reduce((acc, prod) => acc + ((prod.discount ? (prod.price - (prod.price * prod.discount) / 100) : prod.price) * prod.quantity), 0))
}
function removeFromCart(product_id) {
    const product = cart.find((prod) => prod.id === product_id)
    const index = cart.indexOf(product)
    for (let i = 0; i < cart.length; i++) {
        if(cart[i].id === product_id){
            cart[i].quantity = 1
        }
    }
    cart.splice(index, 1)
    updateCart()
    emptyCartVerify()
}
function emptyCartVerify() {
    if (!cart.length) {
        cartContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <center style="font-weight: bold;">Agrega un producto al carrito 🥸</center>
            </div>
        `
        payButton.style.display = 'none'
        clearButton.disabled = true
    }else{
        payButton.style.display = ''
        clearButton.disabled = false
    }
}

//Useful functions
function inputEmpty() {
    if (!inputSearch.value) {
        btnSearch.disabled = true
    } else {
        btnSearch.disabled = false
    }
}
function numericFormat(number) {
    let numberParts = number.toString().split('.')
    numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numberParts.join('.')
}
