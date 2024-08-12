const createToolbar = () => {
  console.log('newcontent.js loaded');

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

  cartStyleStr = `#floating-cart {
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
      }`
  const toolbarStyle = document.createElement('style');
  toolbarStyle.textContent = toolbarStyleStr;
  document.head.appendChild(toolbarStyle);

  chrome.runtime.sendMessage({action: 'getToolbarUrl'}, (response) => {
      if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          return;
      }
      const toolbar = document.createElement('iframe');
      toolbar.src = response.url;
      toolbar.id = 'floating-toolbar';
      document.body.appendChild(toolbar);
      console.log('Toolbar loaded successfully');
  });
//   const button = document.getElementById('view-cart');
//   const cartStyle = document.createElement('style');
//   cartStyle.textContent = cartStyleStr;
//   document.head.appendChild(cartStyle);

//   // Create cart iframe (initially hidden)
//   const cart = document.createElement('iframe');
//   cart.id = 'floating-cart';
//   document.body.appendChild(cart);

  
  // Listen for messages from the toolbar iframe
//   window.addEventListener('message', (event) => {
//     console.log('Message received:', event.data);
//       if (event.data.action === 'viewCart') {
//           chrome.runtime.sendMessage({action: 'getCartUrl'}, (response) => {
//               if (chrome.runtime.lastError) {
//                   console.error('Error:', chrome.runtime.lastError);
//                   return;
//               }
//               cart.src = chrome.runtime.getURL('cart.html');
//               cart.style.display = 'block';
//           });
//       }
//   });

    
    
}
;


createToolbar();


// Define the function
const createCart = () => {
    console.log('createCart function called');

    const findFloatingToolbar = () => {
        const cartIframe = document.getElementById('floating-toolbar');
        if (!cartIframe) {
            console.log('Floating toolbar iframe not found, retrying...');
            setTimeout(findFloatingToolbar, 500); // Retry after 500ms
            return;
        }
        console.log('Iframe found:', cartIframe);

        // Wait for the iframe to load
        //cartIframe.addEventListener('load', () => {
            console.log('Iframe loaded');
            
            // Now try to access the contentWindow
            if (!cartIframe.contentWindow) {
                console.error('Unable to access iframe contentWindow');
                return;
            }

            // Try to access the document inside the iframe
            try {
                const iframeDocument = cartIframe.contentWindow.document;
                const button = iframeDocument.getElementById('view-cart');
                console.log('Button:', button);

                if (button) {
                    button.addEventListener('click', () => {
                        console.log('Button clicked');
                        // ... rest of your button click handler code ...
                    });
                } else {
                    console.error('View cart button not found in iframe');
                }
            } catch (error) {
                console.error('Error accessing iframe content:', error);
            }
        //});
    };

    // Start looking for the floating toolbar
    findFloatingToolbar();
};

// Ensure the function is called when the script loads
createCart();

// Also add a listener for DOMContentLoaded in case the script loads before the DOM is ready
document.addEventListener('DOMContentLoaded', createCart);

// If you're using this in a Chrome extension content script, you might also want to add:
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createCart();
}