
const content = document.querySelector('#content')
const categories = document.querySelectorAll('.category')
const homeBtn = document.querySelector('#home_button')
var contenedor = document.getElementById('contenedor_carga')
const inputSearch = document.getElementById('input_search')
const btnSearch = document.getElementById('button_search')
let mensajeError
btnSearch.disabled = true
document.addEventListener('DOMContentLoaded', function(){
    getProducts()
})
function getProducts(category = null){
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    content.innerHTML = ''
    fetch(`http://localhost:8000/api/products/${category ? category : ''}`)
    .then(res => res.json())
    .then(data => {
        fill(data)
        if(data.length){
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
        }
    })
}

function fill(data){ 
    content.innerHTML = ''
    data.forEach(d => {
        content.innerHTML += `
            <div class="card-group">
                <div class="card" style="height: 30rem">
                    <div class="card-body">
                        <div style="height: 60%;">
                            <img src="${d.url_image}" class="card-img-top " alt="product_image" style="height: 100%;">
                        </div>
                        <div style="height: 9rem">
                            <h5 class="card-title">${d.name}</h5>
                            <div class="d-flex justify-content-around">
                                ${d.discount ? '<div class="discount-container"><p class="card-text discount">' + d.discount + '%</p></div>' : ''}
                                <div class="discount-container">
                                <p class="card-text font-weight-bold">${d.discount ? '<del>' + '$' + numericFormat(d.price) + '</del>' : '$' + numericFormat(d.price)}</p>
                                ${d.discount ? '<p class="card-text font-weight-bold">'+ '$' + numericFormat(Math.round(( d.price - (d.price * d.discount)/100 ))) +'</p>': ''}
                                </div>
                            </div>
                        </div>
                        <center><a href="#" class="btn btn-primary">Comprar</a></center>
                    </div>
                </div>
            </div>
        `
    });
}
for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener('click', function(){
        getProducts(i+1)
    })
}
homeBtn.addEventListener('click', function(){
    getProducts()
})
function searchProducts(search){
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    content.innerHTML = ''
    fetch(`http://localhost:8000/api/products/search/${search ? search : ''}`)
    .then(res => res.json())
    .then(data => {
        if(data.length){
            fill(data)
            document.querySelector('#alert-container').style.display = 'none'
            console.log('hay cosas')
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
        }else{
            document.querySelector('#alert-container').style.display = 'flex'
            document.querySelector('#alert-container').textContent = 'No se encontro el producto :('
            console.log('no hay cosas')
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0'
        }
    })
}
btnSearch.addEventListener('click', function(e){
    e.preventDefault()
    searchProducts(inputSearch.value)
    inputSearch.value = ''
})
inputSearch.addEventListener('keyup', function(){
    if(!inputSearch.value){
        btnSearch.disabled = true
    }else{
        btnSearch.disabled = false
    }
})
function numericFormat(number){
    let numberParts = number.toString().split('.')
    numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numberParts.join('.')
}