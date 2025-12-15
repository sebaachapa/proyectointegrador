
let cart = JSON.parse(localStorage.getItem('productos1')) || [];
let totalprice = parseFloat(localStorage.getItem('total')) || 0;


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.count').forEach(el => {
        if (cart.length > 0) {
            el.textContent = cart.length;
            el.style.display = 'inline';
        } else {
            el.style.display = 'none';
        }
    });
});

const productos = document.querySelectorAll('.producto');

function parsePrice(text) {
    // Si el texto está vacío, devolver 0
    if (!text) return 0;
    
    // Eliminar el símbolo $ y cualquier espacio
    let precio = text.replace('$', '');
    precio = precio.trim();
    
    // Eliminar puntos (separadores de miles como 1.000)
    precio = precio.replace(/\./g, '');
    
    // Cambiar coma por punto (convertir 50,99 a 50.99)
    precio = precio.replace(',', '.');
    
    // Convertir el texto a número decimal
    let numeroFinal = parseFloat(precio);
    
    // Si el resultado es un número válido, devolverlo; si no, devolver 0
    if (isNaN(numeroFinal)) {
        return 0;
    } else {
        return numeroFinal;
    }
}

productos.forEach(producto => {
    const button = producto.querySelector('.action-carrito');
    if (!button) return;
    const titleProduct = producto.querySelector('.textproducts')?.textContent.trim() || '';
    const priceRaw = producto.querySelector('p')?.textContent || '$0';
    const priceProduct = parsePrice(priceRaw);
    const imgProduct = producto.querySelector('img')?.src || '';

    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Verificar si el producto ya existe en el carrito
        let productoExistente = cart.find(item => item.title === titleProduct);
        
        if (productoExistente) {
            // Si existe, aumentar la cantidad
            productoExistente.count += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            const product = {
                title: titleProduct,
                price: priceProduct.toFixed(2),
                count: 1,
                image: imgProduct,
            };
            cart.push(product);
        }
        
        totalprice += priceProduct;

        localStorage.setItem('productos1', JSON.stringify(cart));
        localStorage.setItem('total', totalprice.toFixed(2));

        document.querySelectorAll('.count').forEach(el => {
            if (cart.length > 0) {
                el.textContent = cart.length;
                el.style.display = 'inline';
            } else {
                el.style.display = 'none';
            }
        });
    });
});

function handleCart() {
    const cart = JSON.parse(localStorage.getItem('productos1')) || [];
    const total = parseFloat(localStorage.getItem('total')) || 0;

    const carritoProduct = document.querySelector('.micarrito') || document.getElementById('micarrito');
    if (!carritoProduct) return;


    document.querySelectorAll('.count').forEach(el => {
        if (cart.length > 0) {
            el.textContent = cart.length;
            el.style.display = 'inline';
        } else {
            el.style.display = 'none';
        }
    });

    carritoProduct.innerHTML = '<h2>Mi CARRITO</h2>';
    

    const contadorDiv = document.createElement('h7');
    contadorDiv.id = 'contador-carrito';
    contadorDiv.textContent = cart.length + (cart.length === 1 ? ' producto' : ' productos');
    carritoProduct.appendChild(contadorDiv);


    if (cart.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'El carrito está vacío';
        carritoProduct.appendChild(emptyMsg);
        return;
    }


    const tabla = document.createElement('table');
    let encabezado = `
        <thead>
            <tr>
                <th></th>
                <th>Nombre del Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>X</th>
            </tr>
        </thead>`;

    let cuerpo = '<tbody>';
    cart.forEach((product) => {
        cuerpo += `
            <tr>
                <td><img src="${product.image}" alt="${product.title}" style="width: 100px; height: auto;"></td>
                <td>${product.title}</td>
                <td>$${product.price}</td>
                <td>${product.count}</td>
                <td><button class="eliminar" data-title="${product.title}">X</button></td>
            </tr>`;
    });
    cuerpo += '</tbody>';

    tabla.innerHTML = encabezado + cuerpo;
    carritoProduct.appendChild(tabla);

    // Calcular el total correctamente multiplicando precio x cantidad
    let totalCalculado = 0;
    cart.forEach((product) => {
        totalCalculado += parseFloat(product.price) * product.count;
    });

    // Crear y agregar el div del total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'carrito-total';
    totalDiv.innerHTML = `<strong>Total: $${totalCalculado.toFixed(2)}</strong>`;
    carritoProduct.appendChild(totalDiv);

    // Crear y agregar el botón de compra
    const compraButton = document.createElement('button');
    compraButton.className = 'btn-iniciar-compra';
    compraButton.textContent = 'Iniciar Compra';
    compraButton.addEventListener('click', () => {
        ;
    });
    carritoProduct.appendChild(compraButton);





    tabla.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.title;
            

            let indice = -1;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title === title) {
                    indice = i;
                    break;
                }
            }
            
            if (indice > -1) {

                cart.splice(indice, 1);
                
                localStorage.setItem('productos1', JSON.stringify(cart));
                

                let nuevoTotal = 0;
                for (let i = 0; i < cart.length; i++) {
                    nuevoTotal = nuevoTotal + parseFloat(cart[i].price);
                }
                
                localStorage.setItem('total', nuevoTotal.toFixed(2));
                handleCart();
            }
        });
    });
}

window.onload = handleCart;