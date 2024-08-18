import toolbarHtml from '../static/toolbar.html';
import "../static/toolbar.css";
import cartHtml from '../static/cart.html';
import "../static/cart.css";
import customHtml from "../static/custom.html";
import "../static/custom.css";

let cart = [];

function injectToolbar() {
    const toolbarDiv = document.createElement('div');
    toolbarDiv.id = 'toolbar';
    toolbarDiv.innerHTML = toolbarHtml;
    document.body.appendChild(toolbarDiv);

    let pageProduct, pagePrice, imageUrl;

    console.log("Loading product information...");

    setTimeout(() => {
        pageProduct = document.querySelector('.ItemTitle--mainTitle--2OrrwrD.f-els-2');
        pageProduct = pageProduct ? pageProduct.textContent : 'Unknown Product';
        console.log("pageProduct: ", pageProduct);

        pagePrice = document.querySelector('.SecurityPrice--text--3eB2Q7Q');
        pagePrice = pagePrice ? pagePrice.textContent : 'Unknown Price';
        console.log("pagePrice: ", pagePrice);

        const imageDiv = document.querySelector('.js-image-zoom__zoomed-image');
        if (imageDiv) {
            const backgroundImage = window.getComputedStyle(imageDiv).backgroundImage;
            imageUrl = backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            console.log("Extracted Image URL: ", imageUrl);
        } else {
            console.log("Image div not found.");
            imageUrl = 'default-image-url.jpg';
        }

        setupEventListeners(pageProduct, pagePrice, imageUrl);
    }, 2000);
}

function setupEventListeners(pageProduct, pagePrice, imageUrl) {
    const addToCartButton = document.getElementById('add-to-cart');
    const viewCartButton = document.getElementById('view-cart');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            console.log('Add to Cart button clicked');
            addToCart(pageProduct, pagePrice, imageUrl);
        });
    }

    if (viewCartButton) {
        viewCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('View Cart button clicked');
            document.getElementById('toolbar').style.display = 'none';
            injectCart();
        });
    }
}

function addToCart(product, price, imageUrl) {
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, price, imageUrl, quantity: 1 });
    }
    console.log('Product added to cart:', product);
    console.log('Current cart:', cart);
}

function injectCart() {
    let existingCart = document.getElementById('cart-container');
    if (existingCart) {
        existingCart.style.display = 'block';
        updateCartItems();
    } else {
        const cartDiv = document.createElement('div');
        cartDiv.id = 'cart-container';
        cartDiv.innerHTML = cartHtml;
        document.body.appendChild(cartDiv);

        updateCartItems();

        const closeButton = document.getElementById('close-cart');
        const orderButton = document.querySelector('.request-order');

        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('toolbar').style.display = 'block';
                cartDiv.style.display = 'none';
            });
        }

        if (orderButton) {
            orderButton.addEventListener('click', (event) => {
                event.preventDefault();
                injectCustomization();
            });
        }
    }
}

function updateCartItems() {
    console.log('Updating cart items...');
    const cartItemsContainer = document.querySelector('.cart');
    if (!cartItemsContainer) return;

    // Remove existing cart items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // Add new cart items
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img class="product-image" src="${item.imageUrl}" alt="Product Image">
            <div class="item-details">
                <p class="product-name">${item.product}</p>
                <button class="remove-item" onclick="removeItem(this)">✕</button>
                <p class="product-variants">Variants: </p>
                <p class="product-price">${item.price}</p>
                <input class="product-quantity" value="${item.quantity}" min="1" type="number">Quantity</input>
            </div>
        `;
        cartItemsContainer.insertBefore(itemElement, cartItemsContainer.querySelector('.total'));
        console.log('Item added to cart:', item.product);
    });

    updateTotalPrice();
}

function updateTotalPrice() {
    const totalElement = document.querySelector('.total');
    if (!totalElement) return;

    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('¥', '').trim());
        return sum + (price * item.quantity);
    }, 0);

    totalElement.textContent = `TOTAL: ¥ ${total.toFixed(2)}`;
}

function removeItem(button) {
    const cartItem = button.closest('.cart-item');
    const productName = cartItem.querySelector('.product-name').textContent;
    
    cart = cart.filter(item => item.product !== productName);
    updateCartItems();
}

function injectCustomization() {
    const customizationDiv = document.createElement('div');
    customizationDiv.id = 'customization-container';
    customizationDiv.innerHTML = customHtml;
    document.getElementById('cart-container').style.display = 'none';
    document.body.appendChild(customizationDiv);
    console.log("customizationDiv: ", customizationDiv);
}

// Run the injection when the content script loads
injectToolbar();

// Listen for specific events or messages to trigger the injection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectToolbar') {
        injectToolbar();
        sendResponse({success: true});
    }
});

// Make removeItem function globally available
window.removeItem = removeItem;