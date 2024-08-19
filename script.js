class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

class ShoppingCartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calculer le prix total de cet article
    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Ajouter un produit au panier
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new ShoppingCartItem(product, quantity));
        }
        this.updateCartDisplay();
    }

    // Mettre à jour la quantité d'un article
    updateItemQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.updateCartDisplay();
    }

    // Supprimer un article du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateCartDisplay();
    }

    // Obtenir le nombre total d'articles dans le panier
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtenir le prix total du panier
    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }


    // Mettre à jour l'affichage du panier
    updateCartDisplay() {
        const cartCountElement = document.getElementById('cart-count');
        cartCountElement.textContent = this.getTotalItems();

        // Mettre à jour le contenu du modal du panier
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Votre panier est vide.</p>';
        } else {
            this.items.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('flex', 'items-center', 'justify-between', 'py-2', 'border-b');

                cartItemElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover">
                        <div class="ml-4">
                            <h3 class="text-lg font-medium">${item.product.name}</h3>
                            <p class="text-sm text-gray-600">${item.product.price} FCFA</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button class="decrement-btn text-gray-500 px-2">-</button>
                        <span class="quantity text-lg mx-2">${item.quantity}</span>
                        <button class="increment-btn text-gray-500 px-2">+</button>
                        <button class="remove-btn text-red-500 ml-4">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;

                // Écouteurs pour les boutons de contrôle
                const decrementBtn = cartItemElement.querySelector('.decrement-btn');
                const incrementBtn = cartItemElement.querySelector('.increment-btn');
                const removeBtn = cartItemElement.querySelector('.remove-btn');

                decrementBtn.addEventListener('click', () => this.updateItemQuantity(item.product.id, item.quantity - 1));
                incrementBtn.addEventListener('click', () => this.updateItemQuantity(item.product.id, item.quantity + 1));
                removeBtn.addEventListener('click', () => this.removeItem(item.product.id));

                cartItemsContainer.appendChild(cartItemElement);
            });
        }

        // Mettre à jour le prix total
        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = `${this.getTotalPrice().toFixed()} FCFA`;
    }
}

// Instances des classes définies précédemment
const cart = new ShoppingCart();

// Liste des produits disponibles
const productsData = [
    new Product(1, 'MacBook Pro', 1700000, 'src/img/ordinateur_portable.jpg'),
    new Product(2, 'iPhone 15', 570000, 'src/img/smartphone.jpg'),
    new Product(3, 'Airpods Max', 380000, 'src/img/casque_audio.jpg'),
    new Product(4, 'Apple Watch SE', 185000, 'src/img/montre_connectee.jpg'),
];

// Fonction pour afficher les produits sur la page
function displayProducts() {
    const productList = document.getElementById('product-list');
    productsData.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('flex', 'flex-col', 'bg-white', 'p-4', 'rounded', 'shadow');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover self-center mb-4">
            <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-700 mb-4">${product.price} FCFA</p>
            <button class="add-to-cart-btn bg-gray-700 hover:bg-gray-500 active:bg-gray-900 text-white px-4 py-2 rounded w-full">Ajouter au panier</button>
        `;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            cart.addItem(product);
            showNotification(`${product.name} a été ajouté au panier.`);
        });

        productList.appendChild(productCard);
    });
}

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('fixed', 'bottom-4', 'right-4', 'bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded', 'shadow');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gestion de l'affichage du modal du panier
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart');

cartButton.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
});

closeCartButton.addEventListener('click', () => {
    cartModal.classList.remove('flex');
    cartModal.classList.add('hidden');
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    cart.updateCartDisplay();
});