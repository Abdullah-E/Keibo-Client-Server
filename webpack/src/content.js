import toolbarHtml from '../static/toolbar.html';
import "../static/toolbar.css";
import cartHtml from '../static/cart.html';
import "../static/cart.css";

function injectToolbar() {
    const toolbarDiv = document.createElement('div');
    toolbarDiv.id = 'toolbar';  // Add an ID to reference the toolbar later
    toolbarDiv.innerHTML = toolbarHtml;
    document.body.appendChild(toolbarDiv);

    // Access buttons after injection
    const addToCartButton = document.getElementById('add-to-cart');
    const viewCartButton = document.getElementById('view-cart');
  
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            console.log('Add to Cart button clicked');
            const itemTitle = document.querySelector('.ItemTitle--mainTitle--2OrrwrD.f-els-2');
            // Handle the "Add to Cart" functionality here
        });
    }
  
    if (viewCartButton) {
        viewCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('View Cart button clicked');
            toolbarDiv.style.display = 'none';
            injectCart();
        });
    }
}

function injectCart() {
    const cartDiv = document.createElement('div');
    cartDiv.id = 'cart';  // Add an ID to reference the cart div later
    cartDiv.innerHTML = cartHtml;
    document.body.appendChild(cartDiv);

    // Access the close button after cart is injected
    const closeButton = document.getElementById('close-cart');
    
    if (closeButton) {
        console.log('Close button found');
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Close Cart button clicked');
            document.getElementById('toolbar').style.display = 'block';  // Show toolbar
            cartDiv.style.display = 'none';  // Hide the cart
        });
    }
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
