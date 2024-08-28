// content.js

// Create and inject toolbar styles
const injectStyles = () => {
    const toolbarStyleStr = `
      #floating-toolbar {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 100%;
        height: 70px;
        background-color: #bfa5cd;
        padding: 10px 20px;
        z-index: 9999;
        box-sizing: border-box;
        border: none;
        border-radius: 20px;
      }
    `;
  
    const cartStyleStr = `
      #floating-cart {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        background-color: white;
        z-index: 10000;
        border: none;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        display: none;
      }
    `;
  
    const style = document.createElement('style');
    style.textContent = toolbarStyleStr + cartStyleStr;
    document.head.appendChild(style);
  };
  
  // Create and inject toolbar iframe
  const createToolbar = () => {
    console.log('Creating toolbar...');
    chrome.runtime.sendMessage({action: 'getToolbarUrl'}, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting toolbar URL:', chrome.runtime.lastError);
        return;
      }
      const toolbar = document.createElement('iframe');
      toolbar.src = response.url;
      toolbar.id = 'floating-toolbar';
      document.body.appendChild(toolbar);
      console.log('Toolbar loaded successfully');
    });
  };
  
  // Create cart iframe (initially hidden)
  const createCart = () => {
    console.log('Creating cart...');
    const cart = document.createElement('iframe');
    cart.id = 'floating-cart';
    cart.style.display = 'none';
    document.body.appendChild(cart);
  };
  
  // Handle messages from toolbar iframe
  const setupMessageListener = () => {
    window.addEventListener('message', (event) => {
      console.log('Message received:', event.data);
      if (event.data.action === 'viewCart') {
        chrome.runtime.sendMessage({action: 'getCartUrl'}, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error getting cart URL:', chrome.runtime.lastError);
            return;
          }
          const cart = document.getElementById('floating-cart');
          cart.src = response.url;
          cart.style.display = 'block';
        });
      }
    });
  };
  
  // Main function to initialize everything
  const initialize = () => {
    console.log('Initializing content script...');
    injectStyles();
    createToolbar();
    createCart();
    setupMessageListener();
  };
  
  // Run the initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }