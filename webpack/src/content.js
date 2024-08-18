import toolbarHtml from '../static/toolbar.html';
import "../static/toolbar.css";
import cartHtml from '../static/cart.html';
import "../static/cart.css";
import customHtml from "../static/custom.html";
import "../static/custom.css";

function injectToolbar() {
    const toolbarDiv = document.createElement('div');
    toolbarDiv.id = 'toolbar';  // Add an ID to reference the toolbar later
    toolbarDiv.innerHTML = toolbarHtml;
    document.body.appendChild(toolbarDiv);

    // Access buttons after injection
    let pageProduct;
    let pagePrice;
    let imageUrl;

    console.log("loading product name...");

    setTimeout(() => {
        console.log("product name loaded");
        pageProduct = document.querySelector('.ItemTitle--mainTitle--2OrrwrD.f-els-2');
        pageProduct= pageProduct.textContent;
        console.log("pageProduct: ", pageProduct);
        pagePrice = document.querySelector('.SecurityPrice--text--3eB2Q7Q').textContent;
        console.log("pagePrice: ", pagePrice);

        const imageDiv = document.querySelector('.js-image-zoom__zoomed-image');
    
        if (imageDiv) {
            // Get the background-image style property
            const backgroundImage = window.getComputedStyle(imageDiv).backgroundImage;

            // Extract the URL using a regular expression
            imageUrl = backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            
            console.log("Extracted Image URL: ", imageUrl);

            // You can now use the imageUrl variable as needed
        } else {
            console.log("Image div not found.");
        }
    }, 2000);
    
    
    // pageProduct = document.querySelector('.ItemTitle--mainTitle--2OrrwrD.f-els-2');
    // console.log("pageProduct: ", pageProduct);
    


    const addToCartButton = document.getElementById('add-to-cart');
    const viewCartButton = document.getElementById('view-cart');
  
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            console.log('Add to Cart button clicked');
            injectProduct(pageProduct, pagePrice,imageUrl);
            
        });
    }
  
    if (viewCartButton) {
        viewCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('View Cart button clicked');
            toolbarDiv.style.display = 'none';
            injectCart(pageProduct, pagePrice,imageUrl);
        });
    }
}

function injectProduct(pageProduct, pagePrice,imageUrl) {
    const productDiv = document.createElement('div');
    productDiv.class = 'cart-item';  // Add an ID to reference the product div later
    productDiv.innerHTML = cartHtml;
}

function injectCart(pageProduct,pagePrice,imageUrl) {
    const cartDiv = document.createElement('div');
    cartDiv.id = 'cart';  // Add an ID to reference the cart div later
    cartDiv.innerHTML = cartHtml;
    document.body.appendChild(cartDiv);
    
    //const productDiv = doc.querySelector('.cart-item'); 

    const productName = cartDiv.querySelector('.product-name');
    const productPrice = cartDiv.querySelector('.product-price');
    const productImage = cartDiv.querySelector('.product-image');
    if(productImage){
        productImage.src = imageUrl;
    }
    if (productPrice) {
        productPrice.textContent = "¥ "+pagePrice;  // Set the desired product price or any dynamic content
    }
    console.log("productName: ", productName);
    if (productName) {
        productName.textContent = pageProduct;  // Set the desired product name or any dynamic content
    }
    // Access the close button after cart is injected
    const closeButton = document.getElementById('close-cart');
    const orderButoon= document.querySelector('.request-order');
    console.log("orderButoon: ", orderButoon);
    
    if (closeButton) {
        console.log('Close button found');
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Close Cart button clicked');
            document.getElementById('toolbar').style.display = 'block';  // Show toolbar
            cartDiv.style.display = 'none';  // Hide the cart
        });
    }
    if (orderButoon) {
        console.log('Order button found');
        orderButoon.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Order Cart button clicked');
            injectCustomization();
        });
    }

}

function injectCustomization(){
    const customizationDiv = document.createElement('div');
    customizationDiv.id = 'customization-container';  // Add an ID to reference the cart div later
    customizationDiv.innerHTML = customHtml;
    document.getElementById('cart').style.display = 'none';
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
