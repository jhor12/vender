// Array para almacenar productos en el carrito, cargado desde localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para actualizar el contador del carrito
function updateCartCounter() {
    const cartCounter = document.getElementById("cartCounter");
    cartCounter.textContent = cart.length;
    cartCounter.style.display = cart.length > 0 ? "inline-block" : "none"; // Mostrar solo si hay productos
}

// Agregar productos al carrito
function addToCart(productImage, productName, productPrice) {
    const product = { image: productImage, name: productName, price: productPrice };
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartPreview();
    updateCartCounter();

    // Mostrar la alerta de éxito
    showAlert("Agregado al carrito con éxito", "success");
}

// Vista previa de imagen en botón de carrito
function updateCartPreview() {
    const cartPreviewImg = document.getElementById("cartImgPreviewImg");
    cartPreviewImg.src = cart.length > 0 ? cart[cart.length - 1].image : '';
    document.getElementById("cartImgPreview").style.display = cart.length > 0 ? "block" : "none";
    updateCartPanel();
}

// Mostrar productos en la vista previa del carrito
function updateCartPanel() {
    const cartItemsPreview = document.getElementById("cartItemsPreview");
    cartItemsPreview.innerHTML = "";
    cart.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex align-items-center justify-content-between";
        listItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${product.image}" style="width: 50px; margin-right: 10px;">
                <div><p>${product.name}</p><p style="color: #7CFC00;">$${product.price}</p></div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index}, true)">X</button>
        `;
        cartItemsPreview.appendChild(listItem);
    });
}

// Eliminar producto del carrito y actualizar vista previa
function removeFromCart(index, refresh = true) {
    // Remover del array de carrito y de localStorage
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();

    // Si estamos en carrito_compras.html, eliminar el elemento del DOM inmediatamente
    const cartContainer = document.getElementById("cartItems");
    if (cartContainer) {
        const itemToRemove = document.querySelector(`#cartItems .col-md-4:nth-child(${index + 1})`);
        if (itemToRemove) itemToRemove.remove(); // Eliminar del DOM el producto
        if (cart.length === 0) loadCartItems(); // Mostrar mensaje si el carrito está vacío
    } else {
        if (refresh) {
            updateCartPreview();
            updateCartPanel();
        }
    }

    // Mostrar la alerta de éxito al eliminar
    showAlert("Eliminado con éxito", "error");
}

// Alternar visibilidad del panel de vista previa del carrito
function toggleCartPreview() {
    document.getElementById("cartPreviewPanel").classList.toggle("show");
}

// Cargar productos en carrito_compras.html
function loadCartItems() {
    const cartContainer = document.getElementById("cartItems");
    cartContainer.innerHTML = cart.length ? cart.map((product, index) => `
        <div class="col-md-4 mb-4">
            <div class="card position-relative">
                <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" onclick="removeFromCart(${index}, false)">X</button>
                <img src="${product.image}" class="card-img-top" style="height: 250px;">
                <div class="card-body text-dark">
                    <p>${product.name}</p>
                    <p class="text-success">$${product.price}</p>
                </div>
            </div>
        </div>
    `).join('') : "<p class='text-center text-muted'>No hay productos en el carrito.</p>";
}

// Inicializar eventos y cargar carrito
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cartItems")) loadCartItems();
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button.dataset.img, button.dataset.name, 30000);
        });
    });
    document.getElementById("closeCartPreview").addEventListener("click", toggleCartPreview);
    updateCartPreview();
    updateCartCounter(); // Actualizar el contador al cargar la página

    // Agregar el evento para el menú de hamburguesa
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navbarSupportedContent');
            navbarCollapse.classList.toggle('show'); // Alternar visibilidad
        });
    }
});

// Función para mostrar una alerta animada con chispas
function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `alert-box ${type}`;
    alertBox.innerHTML = `<span>${message}</span>`;

    // Añadir chispas alrededor del mensaje
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        alertBox.appendChild(spark);
    }

    // Añadir el elemento de alerta al cuerpo
    document.body.appendChild(alertBox);

    // Remover el mensaje después de un tiempo
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.remove();
        }, 500);
    }, 2000);
}
