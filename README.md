**Descripción del proyecto:**

Tienda online de botillería en la que se despliegan productos, los cuales pueden mostrarse por categoría o ser buscados mediante una barra de búsqueda.

**Características:**

Lo primero que ve el usuario es el despliegue de varios productos, los cuales pueden ser visualizados por categorías mediante el enlace de categoría en la barra de navegación, así como también puede buscar su nombre de forma específica mediante la entrada de búsqueda. Los productos muestran su descuento, su valor y su valor con descuento aplicado. El despliegue de los productos está dividido en páginas, en las cuales se muestran 8 productos por página. 

El usuario podría tomar productos y añadirlos a su carrito de compras. 

Dentro del carrito de compras el usuario podrá eliminar productos de este, así como también vaciarlo por completo. El carrito de compras queda guardado en el localStorage del usuario, así que si este recarga la página, sus productos aun estarán en el carrito.

- **Tecnologías usadas:**
  - Backend:
    - Laravel 8
    - Composer
    - PHP 7.4
    - MySql
  - Frontend:
    - Javascript
    - JQuery
    - Bootstrap
    - Css
    - Html5
- **Backend(API REST):**
  - Controladores:
    - **ProductController.php:**
      - Controlador encargado de manipular la información de los productos.
      
        Sus métodos son:
      - **index()**
        - Nos trae todos los productos que existen en la base de datos.
      - **getProductsByCategory($category)**
        - Nos trae los productos especificando la categoría.
      - **searchProducts($search)**
        - Nos trae los productos que coincidan con la búsqueda del usuario.
    - **CategoryController.php:**
      - Controlador que manipula la información de las categorías.
      
        Su método es:
      - **index()**
        - Nos trae todas las categorías que existen en la base de datos.
        
  - Modelos:
    - **Product.php:**
      - Especifica la tabla 'product' de la base de datos.
    - **Category.php:**
      - Especifica la tabla 'category' de la base de datos.
      
  - Rutas:
    - **api.php:**
      - Declara las rutas que consumirá posteriormente el frontend.
      
        Las rutas declaradas son:
      - /products
        - Apunta a ProductController.php y utiliza el método **index.**
      - /products{category}
        - Apunta a ProductController.php y utiliza el método **getProductsByCategory.**
      - /products/search/{search}
        - Apunta a ProductController.php y utiliza el método **searchProducts.**
      - /categories
        - Apunta a CategoryController.php y utiliza el método **index.**
        
- **Frontend(Cliente):**
  - El proyecto cuenta con solo una vista (Index), la cual se actualiza dependiendo de las peticiones del cliente. Se utilizó Bootstrap en la mayoría de elementos, salvo por unos pocos a los cuales se le crearon clases específicas para su control de estilos.
  - **Javascript:**
  
    - Listeners:
    
      - **DOMContentLoaded:**
        - Al momento de cargar el contenido del DOM, este llama a las funciones getProducts() y getCategories(), además de revisar si es que el localStorage del usuario cuenta con un carrito.
      - **clearButton**:
        - Al momento de hacer click en él se limpia el carrito totalmente.
      - **homeBtn:**
        - Al momento de hacer click en él, se vuelve a cargar la página con el despliegue inicial de los productos.
      - **btnSearch:**
        - Al momento de hacer click en él, llama a la función searchProducts.
      - **inputSearch:**
        - Al momento de escribir en él, llama a la función inputEmpty.
      - **btnOpenCart:**
        - Al momento de hacer click en él, abre el modal del carrito de compras y llama a la función emptyCartVerify().
        
    - Fetchs:
    
      - **getProducts(category):**
        - Nos trae los productos comunicándose con la APIREST mediante su url, se puede especificar si viene con una categoría en específico para que solamente nos traiga los productos de dicha categoría, si la categoría viene vacía, nos traerá todos los productos.
      - **getCategories():**
        - Nos trae las categorías comunicándose con la APIREST mediante su url.
      - **searchProducts(search):**
        - Nos trae los productos que coincidan con la búsqueda del usuario comunicándose con la APIREST mediante su url.
        
    - Pagination Functions:
    
      - **displayPaginationButtons():**
        - Crea los botones de paginación y les da usabilidad.
      - **nextPage():**
        - Muestra los productos de la siguiente página.
      - **nextPage():**
        - Muestra los productos de la página anterior.
      - **changePageIndex(index):**
        - Muestra los productos de la página seleccionada por el usuario.
        
    - Fill Functions:
    
      - **fill(products):**
        - Esta función llena el contenedor principal con los productos que se le especifica.
        - Esta función es llamada por **getProducts**, **searchProducts** y las funciones relacionadas con el cambio de página. Estas funciones le entregan la variable products, la cual esta llenada con las especificaciones que cada función manipulo.
      - **fillCategories(data):**
        - Esta función llena la lista de categorías que se encuentra en la barra de navegación.
        
    - Cart Functions:
    
      - **addToCart(product\_id):**
        - Añade el producto especificado con 'product\_id' al carrito de compras y si el producto ya existe, le agrega uno más a su cantidad, luego de eso, actualiza el carro con **updateCart()**.
      - **updateCart():**
        - Esta función llena el contenedor del carrito de compras con los productos que el usuario haya agregado a este, además de agregar el carrito al localStorage.
      - **removeFromCart(product\_id):**
        - Remueve un producto especificado con 'product\_id' del carrito de compras, luego llama a u**pdateCart()** y **emptyCartVerify()**.
      - **emptyCartVerify():**
        - Verifica si el carro de compras esta vacío.
        - Si este está vacío, muestra un mensaje diciéndole al cliente que debe llenarlo, además de deshabilitar el botón de vaciar carro y de desaparecer el botón de pagar.
        - En el caso contrario, muestra el botón de pagar y habilita el botón de vaciar carro.
        
    - Useful Functions:
    
      - **inputEmpty():**
        - Verifica si la entrada de búsqueda esta vacía y deshabilita el botón de buscar.
      - **numericFormat(number):**
        - Formatea el precio del producto dejándolo con separador de miles.

