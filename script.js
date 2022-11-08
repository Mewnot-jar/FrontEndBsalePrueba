
const content = document.querySelector('#content')
const categories = document.querySelectorAll('.category')
var contenedor = document.getElementById('contenedor_carga')
document.addEventListener('DOMContentLoaded', function(){
    getProducts()
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
            <div class="card col" style="width: 18rem;">
                <img src="${d.url_image}" class="card-img-top " alt="product_image">
                <div class="card-body">
                    <h5 class="card-title">${d.name}</h5>
                    <div class="d-flex justify-content-around">
                        <p class="card-text">${d.discount ? '<del>' + d.price + '</del>' : d.price}</p>
                        ${d.discount ? '<p class="card-text">'+ (d.price * d.discount)/100 +'</p>': ''}
                        ${d.discount ? '<p class="card-text">' + d.discount + '%</p>' : ''}
                    </div>
                    <a href="#" class="btn btn-primary">Comprar</a>
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
function loadingAnimation(){
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100'
    setTimeout(() => {
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0'
    }, 2500);
}
