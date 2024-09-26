import {Cart} from './Cart.js';

import toolbarHTML from '../static/toolbar.html';
import '../static/toolbar.css';
import cartHTML from '../static/cart.html';
import '../static/cart.css';
import customHTML from '../static/custom.html';
import '../static/custom.css';
import infoHTML from '../static/info.html';
import '../static/info.css';


import logo from '../KieboLogo.png';
// console.log("toolbar in UI.js",toolbarHTML);

export class UI{
    constructor(){
        this.cart = new Cart();
        this.cart.getItems();
    }

    //UI injectors:

    injectToolbar(){
        console.log('Injecting toolbar...');
        let toolbarDiv = document.getElementById('toolbar');
        if (toolbarDiv) {
            toolbarDiv.style.display = 'block';
            return;
        }
        toolbarDiv = document.createElement('div');
        toolbarDiv.id = 'toolbar';
        toolbarDiv.innerHTML = toolbarHTML;
        document.body.appendChild(toolbarDiv);

        const logoLoc = document.querySelector('.logo');
        if (logoLoc) {
        logoLoc.src = logo;
        } else {
        console.error("Logo element not found");
        }

        this.setupToolbarEventListeners();
    }

    injectCart(){
        let existingCart = document.getElementById('cart-container');
        if (existingCart) {
            existingCart.style.display = 'block';
        } else {
            const cartDiv = document.createElement('div');
            cartDiv.id = 'cart-container';
            cartDiv.innerHTML = cartHTML;
            document.body.appendChild(cartDiv);

            this.setupCartEventListeners();
        }
        this.updateCartItems();
    }
    
    injectCustomization(){
        const customizationDiv = document.createElement('div');
        customizationDiv.id = 'customization-container';
        customizationDiv.innerHTML = customHTML;
        document.getElementById('cart-container').style.display = 'none';
        document.body.appendChild(customizationDiv);

        const requestButton = document.getElementById('continue-button');
        if (requestButton) {
        requestButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.injectInfo();
        });
        }
    }
    
    injectInfo(){
        const infoDiv = document.createElement('div');
        infoDiv.id = 'info';
        infoDiv.innerHTML = infoHTML;
        infoDiv.style.display = 'block';
        document.body.appendChild(infoDiv);
        document.getElementById('customization-container').style.display = 'none';

        const submitButton = document.querySelector('#info #submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                // Add your logic to handle the form submission here
                console.log('Form submitted');
            });
        }
    }

    updateCartItems(){
        // const cart = Cart.getItems();
        const cart = this.cart.items;
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

            const removeButton = itemElement.querySelector('.remove-item');
            if (removeButton) {
                removeButton.addEventListener('click', async ()=> {
                    await (this.cart.removeItem(item.product));
                    this.updateCartItems();
                });
            }

            cartItemsContainer.insertBefore(itemElement, cartItemsContainer.querySelector('.total'));
        });
        
        this.updateTotalPrice(cart);
    }

    updateTotalPrice(cart){
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
    //event listeners:
    setupToolbarEventListeners() {
        const addToCartButton = document.getElementById('add-to-cart');
        const viewCartButton = document.getElementById('view-cart');
    
        if (addToCartButton) {
            addToCartButton.addEventListener('click', async () => {
                const pageProduct = this.getProductTitle();
                const pagePrice = this.getProductPrice();
                const imageUrl = this.getProductImage();
                console.log('Add to cart clicked', pageProduct, pagePrice, imageUrl);
                // You'll need to implement addToCart in your Cart class
                await this.cart.addItem(pageProduct, pagePrice, imageUrl);
                // Cart.addToCart(pageProduct, pagePrice, imageUrl);
                // Cart.addItem(pageProduct, pagePrice, imageUrl);
            });
        }
    
        if (viewCartButton) {
            viewCartButton.addEventListener('click', (event) => {
                console.log('View cart clicked');
                event.preventDefault();
                document.getElementById('toolbar').style.display = 'none';
                this.injectCart();
            });
        }
    }

    setupCartEventListeners() {
        const closeButton = document.getElementById('close-cart');
        const orderButton = document.querySelector('.request-order');

        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('toolbar').style.display = 'block';
                document.getElementById('cart-container').style.display = 'none';
                this.injectToolbar();    
            });
        }

        if (orderButton) {
            orderButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.injectCustomization();
            });
        }
    }

    //Scrapers:
    getProductTitle(){
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
                return element.textContent.trim();
            }
        }
    
        return 'Unknown Product';
    }

    getProductPrice(){
        const selectors = [
            '.SecurityPrice--text--3eB2Q7Q',
            '.text--Mdqy24Ex'
        ];
      
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
    
        return 'Unknown Price';
    }

    getProductImage(){
        const imageDiv = document.querySelector('.mainPic--zxTtQs0P');
        return imageDiv ? imageDiv.src : 'default-image-url.jpg';
    }
}