document.addEventListener('DOMContentLoaded', () => {
    const productosArray = [
        {
            id: 1,
            nombre: "Latex obra",
            precio: 10000,
            imagen: "./img/producto2.png"
        },
        {
            id: 2,
            nombre: "Impregnante maderas",
            precio: 30000,
            imagen: "./img/producto3.png"
        },
        {
            id: 3,
            nombre: "Acrilico premium",
            precio: 25000,
            imagen: "./img/producto4.png"
        },
        {
            id: 4,
            nombre: "Latex exterior interior",
            precio: 5000,
            imagen: "./img/producto5.png"
        }
    ];

    let carrito = [];
    const moneda = "$";
    const DOMproductos = document.querySelector('#productos');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
    const miLocalStorage = window.localStorage;

    function renderizarProductos() {
        productosArray.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${moneda}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', cargarProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMproductos.appendChild(miNodo);
        });
    }

    function cargarProductoAlCarrito(evento) {

        carrito.push(evento.target.getAttribute('marcador'))

        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        Toastify({
            text: "Producto agregado",
            duration: 2000,
            style:{
                fontSize:"30px",
                fontFamily:"Arial",
                color:"red",
                background:"white"
            }
            }).showToast();
    }
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((producto) => {
            const miProducto = productosArray.filter((productoBaseDatos) => {
                return productoBaseDatos.id === parseInt(producto);
            });
            const numeroUnidadesProducto = carrito.reduce((total, ProductoId) => {

                return ProductoId === producto ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-producto', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesProducto} x ${miProducto[0].nombre} - ${miProducto[0].precio}${moneda}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'Eliminar';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.producto = producto;
            miBoton.addEventListener('click', borrarProductoCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }

    function borrarProductoCarrito(evento) {

        const id = evento.target.dataset.producto;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        
    }

    function calcularTotal() {
        return carrito.reduce((total, producto) => {
            const miProducto = productosArray.filter((productoBaseDatos) => {
                return productoBaseDatos.id === parseInt(producto);
            });
            return total + miProducto[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
        
    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {

        if (miLocalStorage.getItem('carrito') !== null) {

            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }
    function mostrar_posicion( posicion ){

        let lat = posicion.coords.latitude;
        let long = posicion.coords.longitude;
        let key = "ff0a9f28cb03716a9654313d6a51907c";
    
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=metric&lang=es`)
            .then( response => response.json())
            .then( data =>{ 
                            const climaDiv = document.getElementById("clima");
                            climaDiv.innerHTML = `<h1>Clima hoy en tu ciudad</h1>
                                                <p>${data.name}</p>
                                                <p>Temp: ${data.main.temp}°C</p>
                                                <p>Clima:${data.weather[0].description}</p>`
            });
    }
    const posicionBuenosAires = {
        coords: {
            latitude: -34.61,
            longitude: -58.38
        }
    };
    mostrar_posicion(posicionBuenosAires);
    
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
