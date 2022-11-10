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
const contenedorCarrito = document.getElementById('carrito-contenedor')
btnSearch.disabled = true
document.addEventListener('DOMContentLoaded', function(){
    getProducts()
    getCategories()
})
function getProducts(category = null){
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
        if(data.length){
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
            document.querySelector('#alert-container').style.display = 'none'
        }
    })
}
function getCategories(){
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/fillCategories`)
    .then(res => res.json())
    .then(data => {
        fillCategories(data)
        let categories = document.querySelectorAll('.category')
        for (let i = 0; i < categories.length; i++) {
            categories[i].addEventListener('click', function(){
                getProducts(i+1)
            })
        }
    })
}
function fill(products){ 
    content.innerHTML = ''
    products.forEach(product => {
        content.innerHTML += `
            <div>
                <div class="card m-2" style="height: 35rem">
                    <div class="card-body">
                        <div style="height: 60%;">
                            <img src="${product.url_image ? product.url_image : './src/img/not_found_image.jpg'}" class="card-img-top " alt="product_image" style="height: 100%;">
                        </div>
                        <div class="data-container">
                            <div style="height: 30%;">
                                <h5 style="text-align: center;" class="card-title">${product.name}</h5>
                            </div>
                            <div class="prices_discount-container">
                                ${product.discount ? '<div class="discount-container"><p class="card-text discount">' + product.discount + '%</p></div>' : ''}
                                <div class="price-container">
                                    <p class="card-text font-weight-bold">${product.discount ? '<del>' + '$' + numericFormat(product.price) + '</del>' : '$' + numericFormat(product.price)}</p>
                                    ${product.discount ? '<p class="card-text font-weight-bold">'+ '$' + numericFormat(Math.round(( product.price - (product.price * product.discount)/100 ))) +'</p>': ''}
                                </div>
                            </div>
                        </div>
                        <div style="height: 2rem; margin-top: 2rem;">
                            <center>
                                <button id="${product.id}" class="btn btn-primary btn-agregar">
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
    });
    btnAgregar = document.querySelectorAll('.btn-agregar')
}
setTimeout(() => {
    console.log(btnAgregar)
    for (let i = 0; i < productos[0].length; i++) {
        btnAgregar[i].addEventListener('click', () => {
            agregarAlCarrito(productos[0][i].id)
        })
    }
}, 5000);
function agregarAlCarrito(product_id){
    const product = productos[0].find((prod) => prod.id === product_id)
    carrito.push(product)
    actualizarCarrito()
    console.log(carrito)
}
function fillCategories(data){ 
    data.forEach(d => {
        categoryContainer.innerHTML += `
            <a class="dropdown-item category" href="#">${d.name.toUpperCase()}</a>
        `
    });
}
homeBtn.addEventListener('click', function(){
    getProducts()
})
function searchProducts(search){
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    content.innerHTML = ''
    fetch(`https://backendbsaleprueba-production.up.railway.app/api/products/search/${search ? search : ''}`)
    .then(res => res.json())
    .then(data => {
        if(data.length){
            fill(data)
            document.querySelector('#alert-container').style.display = 'none'
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
        }else{
            document.querySelector('#alert-container').style.display = 'flex'
            document.querySelector('#alert-container').textContent = 'No se encontro el producto 🥸'
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
        }
    })
}
btnSearch.addEventListener('click', function(e){
    e.preventDefault()
    searchProducts(inputSearch.value)
})
inputSearch.addEventListener('keyup', inputEmpty)
function inputEmpty(){
    if(!inputSearch.value){
        btnSearch.disabled = true
    }else{
        btnSearch.disabled = false
    }
}

function numericFormat(number){
    let numberParts = number.toString().split('.')
    numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numberParts.join('.')
}
function actualizarCarrito(){
    contenedorCarrito.innerHTML = ''
    carrito.forEach(producto => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="cart-container-modal">
                <div class="cart-data-container">
                    <div>
                        <p>${producto.name}</p>
                        <p>Precio: ${producto.price}</p>
                        <p>Cantidad: <span id="cantidad">${producto.discount}</span></p>
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
}

$('#open-cart').on('click', function(){
    $('#ventana-modal').modal()
})