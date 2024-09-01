// Import statements
import toolbarHtml from '../static/toolbar.html';
import "../static/toolbar.css";
import cartHtml from '../static/cart.html';
import "../static/cart.css";
import customHtml from "../static/custom.html";
import "../static/custom.css";
import logo from "../KieboLogo.png";

// Initialize cart array
let cart = [];

// Function to inject toolbar
function injectToolbar() {
    const toolbarDiv = document.createElement('div');
    toolbarDiv.id = 'toolbar';
    toolbarDiv.innerHTML = toolbarHtml;
    document.body.appendChild(toolbarDiv);

    const logoLoc = document.querySelector('.logo');
    if (logoLoc) {
        logoLoc.src = logo;
        console.log("Logo element:", logoLoc);
    } else {
        console.error("Logo element not found");
    }

    let pageProduct, pagePrice, imageUrl;

    console.log("Loading product information...");

    // Use MutationObserver instead of setTimeout
    const observer = new MutationObserver((mutations, obs) => {
        const head = document.querySelector('.mainTitle--O1XCl8e2.f-els-2');
        if (head) {
            obs.disconnect(); // Stop observing once element is found
            pageProduct = head.textContent;
            console.log("Page product:", pageProduct);

            pagePrice = getProductPrice();
            console.log("Page price:", pagePrice);

            const imageDiv = document.querySelector('.mainPic--zxTtQs0P');
            console.log("Image div:", imageDiv);
            const imageUrl = imageDiv.src;
            console.log("Image URL:", imageUrl);
            if (imageDiv) {
                // const backgroundImage = window.getComputedStyle(imageDiv).backgroundImage;
                // imageUrl = backgroundImage.match(/url\("?(.+?)"?\)/)[1];
                console.log("Extracted Image URL:", imageUrl);
            } else {
                console.log("Image div not found.");
                imageUrl = 'default-image-url.jpg';
            }

            setupEventListeners(pageProduct, pagePrice, imageUrl);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Function to set up event listeners
function setupEventListeners(pageProduct, pagePrice, imageUrl) {
    const addToCartButton = document.getElementById('add-to-cart');
    const viewCartButton = document.getElementById('view-cart');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            console.log('Add to Cart button clicked');
            addToCart(pageProduct, pagePrice, imageUrl);
        });
    } else {
        console.error('Add to Cart button not found');
    }

    if (viewCartButton) {
        viewCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('View Cart button clicked');
            document.getElementById('toolbar').style.display = 'none';
            injectCart();
        });
    } else {
        console.error('View Cart button not found');
    }
}

// Function to add item to cart
function addToCart(product, price, imageUrl) {
    const userEmail = 'sal@keibo.com'; // Replace with actual user's email or fetch dynamically
    const item = { product, price, imageUrl, quantity: 1 };

    chrome.runtime.sendMessage({ action: 'addToCart', userEmail, item }, response => {
        if (response.success) {
            console.log('Product added to cart:', product);
        } else {
            console.error('Failed to add product to cart:', response.error);
        }
    });
}

// Function to get product title
function getProductTitle() {
    const selectors = [
        '.ItemTitle--mainTitle--2OrrwrD.f-els-2',
        '.mainTitle--O1XCl8e2.f-els-2',
        'h1.title',
        '#product-name',
        '[itemprop="name"]'
    ];

    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`Product title found with selector: ${selector}`);
            return element.textContent.trim();
        }
    }

    console.log('Product title not found with any selector');
    return 'Unknown Product';
}

// Function to get product price
function getProductPrice() {
    const selectors = [
        '.SecurityPrice--text--3eB2Q7Q',
        '.text--Mdqy24Ex'
    ];

    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            console.log(`Product price found with selector: ${selector}`);
            return element.textContent.trim();
        }
    }

    console.log('Product price not found with any selector');
    return 'Unknown Price';
}

// Function to inject cart
function injectCart() {
    const userEmail = 'sal@keibo.com'; // Replace with actual user's email or fetch dynamically
    console.log('Retrieving cart items for user:', userEmail);
    chrome.runtime.sendMessage({ action: 'getCart', userEmail }, response => {
        if (response.success) {
            cart = response.items;
            console.log('Cart items:', cart);
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
                        injectToolbar();    
                    });
                } else {
                    console.error('Close cart button not found');
                }

                if (orderButton) {
                    orderButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        injectCustomization();
                    });
                } else {
                    console.error('Request order button not found');
                }
            }
        } else {
            console.error('Failed to retrieve cart:', response.error);
        }
    });
}

// Function to update cart items
function updateCartItems() {
    console.log('Updating cart items...');
    const cartItemsContainer = document.querySelector('.cart');
    if (!cartItemsContainer) {
        console.error('Cart container not found');
        return;
    }

    // Remove existing cart items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // Add new cart items
    cart.forEach(item => {
        if (!item || typeof item !== 'object') {
            console.error('Invalid cart item:', item);
            return;
        }

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img class="product-image" src="${item.imageUrl || 'default-image.jpg'}" alt="Product Image">
            <div class="item-details">
                <p class="product-name">${item.product || 'Unknown Product'}</p>
                <button class="remove-item">✕</button>
                <p class="product-variants">Variants: </p>
                <p class="product-price">${item.price || 'N/A'}</p>
                <input class="product-quantity" value="${item.quantity || 1}" min="1" type="number">
                <label>Quantity</label>
            </div>
        `;
        console.log
        const removeButton = itemElement.querySelector('.remove-item');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                removeItem(item.product);
            });
        }

        cartItemsContainer.insertBefore(itemElement, cartItemsContainer.querySelector('.total'));
        console.log('Item added to cart:', item.product);
    });

    updateTotalPrice();
}

// Function to update total price
function updateTotalPrice() {
    const totalElement = document.querySelector('.total');
    if (!totalElement) {
        console.error('Total element not found');
        return;
    }

    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (price * item.quantity);
    }, 0);

    totalElement.textContent = `TOTAL: ¥ ${total.toFixed(2)}`;
}

// Function to remove item from cart
function removeItem(productName) {
    if (!productName) {
        console.error('Product name not provided');
        return;
    }

    cart = cart.filter(item => item.product !== productName);
    updateCartItems();
}

// Function to inject customization
function injectCustomization() {
    const customizationDiv = document.createElement('div');
    customizationDiv.id = 'customization-container';
    customizationDiv.innerHTML = customHtml;
    document.getElementById('cart-container').style.display = 'none';
    document.body.appendChild(customizationDiv);
    console.log("Customization div:", customizationDiv);
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