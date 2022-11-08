
const contenido = document.querySelector('#content')
const categories = document.querySelectorAll('.category')
document.addEventListener('DOMContentLoaded', function(){
    getProducts()
})
function getProducts(category = null){
    fetch(`http://localhost:8000/api/products/${category ? category : ''}`)
    .then(res => res.json())
    .then(data => {
        fill(data)
    })
}

function fill(data){ 
    contenido.innerHTML = ''
    data.forEach(d => {
        contenido.innerHTML += `
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
