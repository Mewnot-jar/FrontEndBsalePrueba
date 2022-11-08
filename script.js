
const contenido = document.querySelector('#contenido')
document.addEventListener('DOMContentLoaded', function(){
    obtenerDatos()
})
function obtenerDatos(){
    fetch('http://localhost:8000/api/products/')
    .then(res => res.json())
    .then(data => {
        llenar(data)
    })
}
function llenar(datos){ 
    datos.forEach(dato => {
        contenido.innerHTML += `
            <div class="card col" style="width: 18rem;">
                <img src="${dato.url_image}" class="card-img-top " alt="product_image">
                <div class="card-body">
                    <h5 class="card-title">${dato.name}</h5>
                    <div class="d-flex justify-content-around">
                        <p class="card-text">${dato.discount ? '<del>' + dato.price + '</del>' : dato.price}</p>
                        ${dato.discount ? '<p class="card-text">'+ (dato.price * dato.discount)/100 +'</p>': ''}
                        ${dato.discount ? '<p class="card-text">' + dato.discount + '%</p>' : ''}
                    </div>
                    <a href="#" class="btn btn-primary">Comprar</a>
                </div>
            </div>
        `
    });
}