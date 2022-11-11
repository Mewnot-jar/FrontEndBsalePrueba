//http://localhost:8000
//https://backendbsaleprueba-production.up.railway.app
const content = document.querySelector('#content')
const categoryContainer = document.getElementById('categories')
const homeBtn = document.querySelector('#home_button')
var contenedor = document.getElementById('contenedor_carga')
const inputSearch = document.getElementById('input_search')
const btnSearch = document.getElementById('button_search')
let btnAgregar
let mensajeError
let productos = [];
let carrito = [];
var page_number = 1;
var records_per_page = 8;
var total_page;
const contenedorCarrito = document.getElementById('carrito-contenedor')
const clearButton = document.getElementById('clear-button')
const totalPrice = document.getElementById('total-price')
let cantidad = {cantidad: 1}
btnSearch.disabled = true
document.addEventListener('DOMContentLoaded', function () {
    getProducts()
    getCategories()
})
clearButton.addEventListener('click', function () {
    for (let i = 0; i < carrito.length; i++) {
        carrito[i].cantidad = 1
    }
    carrito.length = 0
    actualizarCarrito()
    emptyCartVerify()
})
function getProducts(category = null) {
    inputEmpty()
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    content.innerHTML = ''
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/products/${category ? category : ''}`)
        .then(res => res.json())
        .then(data => {
            productos = [
                data,
            ]
            fill(productos[0])
            if (data.length) {
                contenedor.style.visibility = 'hidden';
                contenedor.style.opacity = '0'
                document.querySelector('#alert-container').style.display = 'none'
            }
            total_page = Math.ceil(productos[0].length / records_per_page);
            displayPaginationButtons()
        })
}
function getCategories() {
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/fillCategories`)
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
    fill(productos[0])
    displayPaginationButtons()
}
function prevPage(){
    page_number--
    fill(productos[0])
    displayPaginationButtons()
}
function changePageIndex(index){
    page_number = parseInt(index)
    fill(productos[0])
    displayPaginationButtons()
}
function fill(products) {
    content.innerHTML = ''
    let start_index = (page_number - 1) * records_per_page
    let end_index = start_index + (records_per_page - 1)
    end_index = (end_index >= products.length ? products.length - 1 : end_index)
    for (let i = start_index; i <= end_index; i++) {
        Object.assign(products[i], cantidad)
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
                                <button onClick="agregarAlCarrito(${products[i].id})" class="btn btn-primary btn-agregar">
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
function agregarAlCarrito(product_id) {
    const existe = carrito.some(prod => prod.id === product_id)
    if (existe) {
        const prod = carrito.map(prod => {
            if (prod.id === product_id) {
                prod.cantidad++
            }
        })
    }else{
        const product = productos[0].find((prod) => prod.id === product_id)
        carrito.push(product)
    }
    actualizarCarrito()
}
function fillCategories(data) {
    data.forEach(d => {
        categoryContainer.innerHTML += `
            <a class="dropdown-item category" href="#">${d.name.toUpperCase()}</a>
        `
    });
}
homeBtn.addEventListener('click', function () {
    $('.pagination-container').text('')
    getProducts()
})
function searchProducts(search) {
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    content.innerHTML = ''
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/products/search/${search ? search : ''}`)
        .then(res => res.json())
        .then(data => {
            if (data.length) {
                productos = [
                    data,
                ]
                fill(productos[0])
                document.querySelector('#alert-container').style.display = 'none'
                contenedor.style.visibility = 'hidden';
                contenedor.style.opacity = '0'
                total_page = Math.ceil(productos[0].length / records_per_page);
                displayPaginationButtons()
            } else {
                document.querySelector('#alert-container').style.display = 'flex'
                document.querySelector('#alert-container').textContent = 'No se encontro el producto 🥸'
                contenedor.style.visibility = 'hidden';
                contenedor.style.opacity = '0'
            }
        })
}
btnSearch.addEventListener('click', function (e) {
    e.preventDefault()
    $('.pagination-container').text('')
    searchProducts(inputSearch.value)
})
inputSearch.addEventListener('keyup', inputEmpty)
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
function actualizarCarrito() {
    contenedorCarrito.innerHTML = ''
    carrito.forEach(producto => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="cart-container-modal">
                <div class="cart-data-container">
                    <div>
                        <p>${producto.name}</p>
                        <p>Precio: $${producto.discount ? numericFormat(Math.round((producto.price - (producto.price * producto.discount) / 100))) : producto.price}</p>
                        <p>Cantidad: <span id="cantidad">${producto.cantidad}</span></p>
                    </div>
                    <div>
                        <img src="${producto.url_image ? producto.url_image : './src/img/not_found_image.jpg'}" style="height: 8rem; border-radius: 0.5rem;">
                    </div>
                </div>
                <div>
                    <button style="width: 100%" onClick="eliminarDelCarrito(${producto.id})" class="btn btn-danger">Eliminar producto</button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(div)
    });
    totalPrice.innerText = '$' + numericFormat(carrito.reduce((acc, prod) => acc + ((prod.discount ? (prod.price - (prod.price * prod.discount) / 100) : prod.price) * prod.cantidad), 0))
}

$('#open-cart').on('click', function (e) {
    e.preventDefault()
    $('#ventana-modal').modal()
    emptyCartVerify()
})
function eliminarDelCarrito(product_id) {
    const producto = carrito.find((prod) => prod.id === product_id)
    const index = carrito.indexOf(producto)
    for (let i = 0; i < carrito.length; i++) {
        if(carrito[i].id === product_id){
            carrito[i].cantidad = 1
        }
    }
    carrito.splice(index, 1)
    actualizarCarrito()
    emptyCartVerify()
}
function emptyCartVerify() {
    if (!document.getElementById('carrito-contenedor').children.length) {
        contenedorCarrito.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <center style="font-weight: bold;">Agrega un producto al carrito 🥸</center>
            </div>
        `
    }
}