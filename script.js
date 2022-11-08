
const content = document.querySelector('#content')
const categories = document.querySelectorAll('.category')
const homeBtn = document.querySelector('#home_button')
var contenedor = document.getElementById('contenedor_carga')
const inputSearch = document.getElementById('input_search')
const btnSearch = document.getElementById('button_search')
btnSearch.disabled = true
document.addEventListener('DOMContentLoaded', function(){
    getProducts()
    disableBtnSearch()
})
function getProducts(category = null){
    content.innerHTML = ''
    fetch(`http://localhost:8000/api/products/${category ? category : ''}`)
    .then(res => res.json())
    .then(data => {
        fill(data)
    })
    loadingAnimation()
}

function fill(data){ 
    content.innerHTML = ''
    data.forEach(d => {
        content.innerHTML += `
            <div class="card-deck">
                <div class="card">
                    <img src="${d.url_image}" class="card-img-top " alt="product_image">
                    <div class="card-body">
                        <h5 class="card-title">${d.name}</h5>
                        <div class="d-flex justify-content-around mb-3">
                            <p class="card-text">${d.discount ? '<del>' + '$' + d.price + '</del>' : '$' + d.price}</p>
                            ${d.discount ? '<p class="card-text">'+ '$' + Math.round(( d.price - (d.price * d.discount)/100 )) +'</p>': ''}
                            ${d.discount ? '<p class="card-text">' + d.discount + '%</p>' : ''}
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
function loadingAnimation(){
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    setTimeout(() => {
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0'
    }, 2500);
}
function searchProducts(search){
    content.innerHTML = ''
    fetch(`http://localhost:8000/api/products/search/${search ? search : ''}`)
    .then(res => res.json())
    .then(data => {
        fill(data)
    })
    loadingAnimation()
}
btnSearch.addEventListener('click', function(e){
    e.preventDefault()
    searchProducts(inputSearch.value)
})
inputSearch.addEventListener('keyup', function(){
    if(!inputSearch.value){
        btnSearch.disabled = true
    }else{
        btnSearch.disabled = false
    }
})