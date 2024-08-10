// content.js



(function() {
    // Create the floating div
    const floatingDiv = document.createElement('div');
    floatingDiv.id = 'floating-toolbar';

    // Add content to the floating div
    floatingDiv.innerHTML = `
        <div class="toolbar-content">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    border: 1px solid;
                    border-radius: 2px;
                    color: white;
                    }

                    #floating-toolbar {
                    position: fixed;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    max-width: 1500px;
                    background-color: #bfa5cd;
                    padding: 10px 20px;
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
                    z-index: 9999;
                    box-sizing: border-box;
                    }

                    .toolbar-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    }

                    .logo {
                    height: 30px;
                    margin-right: 10px;
                    }

                    .language-toggle {
                    display: flex;
                    align-items: center;
                    }

                    .language-toggle span {
                    margin: 0 5px;
                    }

                    .switch {
                    position: relative;
                    display: inline-block;
                    width: 45px;
                    height: 20px;
                    padding: 2px;
                    }

                    .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                    }

                    .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgb(255, 255, 255);
                    transition: 0.4s;
                    border-radius: 34px;
                    }

                    .slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 2px;
                    bottom: 2px;
                    background-color: #bfa5cd;
                    transition: 0.4s;
                    border-radius: 50%;
                    }

                    input:checked + .slider {
                    background-color: #A15AA5;
                    }

                    input:checked + .slider:before {
                    transform: translateX(14px);
                    }

                    #floating-toolbar a, #floating-toolbar button {
                    background-color: #bfa5cd;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    cursor: pointer;
                    border-radius: 20px;
                    text-decoration: none;
                    display: inline-block;
                    height: auto;
                    }

                    #floating-toolbar button:hover, #floating-toolbar a:hover {
                    background-color: #A15AA5;
                    }
            </style>
            
            <span>UNTRANSLATE THE PAGE WHEN ADDING ITEMS TO CART.</span>
            <span class="language-toggle">
                <span>EN</span>
                <label class="switch">
                    <input type="checkbox" id="language-toggle-checkbox" />
                    <span class="slider round"></span>
                </label>
                <span>中文</span>
            </span>
            <button id="add-to-cart">ADD TO CART</button>
            <a href="./cart.html" id="view-cart">CART (0 ITEMS)</a>
        </div>
    `;
   

    // Append the floating div to the body
    document.body.appendChild(floatingDiv);
    console.log("div created");
    // Add event listener for language toggle
    const languageToggle = document.getElementById('language-toggle-checkbox');
    languageToggle.addEventListener('change', function() {
        // Add your language toggle logic here
        console.log('Language toggled:', this.checked ? '中文' : 'EN');
    });

    // Add event listener for add to cart button
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', function() {
        // Add your add to cart logic here
        console.log('Add to cart clicked');
        
        // Create a new div element
        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
            <style> 
                #cart-container {
                    position: fixed;
                    top: 20px; /* Adjusted to place the cart towards the top */
                    right: 0; /* Align the cart slightly inset from the right edge */
                    width: 350px; /* Reduced width for a more compact design */
                    height: auto; /* Auto height to fit content */
                    background-color: white;
                    border: 1px solid #ccc; /* Softer border */
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Stronger shadow for emphasis */
                    z-index: 10000;
                    padding: 20px;
                    border-radius: 8px; /* Rounded corners */
                    overflow-y: auto; /* Allow scrolling if content overflows */
                }

                .cart {
                    padding: 0;
                }
                .close-cart {
                    background-color: transparent;
                    border: none;
                    color: #333;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }

                .close-cart:hover {
                    color: #e53935; /* Red color on hover */
                }

                h2 {
                    font-size: 18px; /* Slightly smaller font size */
                    margin-h2 {ho                    font-size: 18px; /* Slightly smaller font size */ve                    margin-bottom: 15px;*                     font-weight: normal; /* Lighter font weight */                      color: #666; /* Softer color */                      text-transform: uppercase; /* Uppercase text to match image */                  }:           margin-bottom: 15px;
                    font-weight: normal; /* Lighter font weight */
                    color: #666; /* Softer color */
                    text-transform: uppercase; /* Uppercase text to match image */
                }

                .cart-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #ddd; /* Lighter divider */
                    padding-bottom: 15px;
                }

                .cart-item img {
                    width: 50px; /* Adjusted image size */
                    height: 50px; /* Uniform height */
                    margin-right: 15px; /* Spacing adjustment */
                    object-fit: cover;
                    border-radius: 5px; /* Rounded image corners */
                }

                .item-details {
                    flex-grow: 1;
                }

                .product-name {
                    font-weight: bold;
                    margin: 0;
                    font-size: 14px; /* Consistent font size */
                    color: #333; /* Darker text */
                }

                .product-variants {
                    font-size: 12px; /* Slightly smaller to fit better */
                    color: #888; /* Lighter variant color */
                    margin: 5px 0;
                }

                .product-price {
                    font-weight: bold;
                    color: #e53935; /* Red price color */
                    text-align: right; /* Align the price to the right */
                    margin-left: auto; /* Push price to the far right */
                    color: #666; /* Softer color */
                    text-transform: uppercase; /* Uppercase text to match image */
                .product-quantity {
                    width: 50px; /* Slightly wider to accommodate numbers */
                    text-align: center;
                    border: 1px solid #ccc; /* S                    margin-bottom: 15px;adding: 5px;
                    border-radius: 5px; /* Rounded corners */
                    font-size: 14px; /* Match font size */
                    color: #333; /* Text color */
                    margin-right: 10px; /* Space before the remove button */
                }
                .remove-item {

                .cart-item {
                    display: flex; /* Red color */
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #ddd; /* Lighter divider */
                    padding-bottom: 15px;
                }

                .cart-item i
                    width: 50px; /*               width: 50px; /* Adjusted image size */                      height: 50px; /* Uniform height */                      margin-right: 15px; /* Spacing adjustment */                      object-fit: cover;                      border-radius: 5px; /* Rounded image corners */         text-align: right;
                    margin: 20px 0 10px 0;
                    font-size: 18px; /* Increased font size */
                    color: #333; /* Darker text */
                    height: 50px; /* Uniform height */
                    margin-right: 15px; /* Spacing adjustment */
                    object-fit;
                    border-radius: 5px; /* Rounded image corners */
                }
 /* Button color to match the theme */
                .item-details {
                    flex-grow: 1;
                }
ounded corners */
                .product-name {
                    font-weight: bold;
                    margin: 0;
                    font-size: 14px; /* Consis   color: #333; /* Darker text */ /* Match text style */
                    color: #333; /* Darker text */
                }

                .product-variants {         font-size: 12px; /* Slightly smaller to fit better */ig                  
                    font-size: 12px; /* Slightly smaller to fit better */
                        color: #888; /* Lighter variant color */
                    margin: 5px 0;
                }

                .product-price {
                    font-weight: bold;
                    color: #e53935; /* Red price color */
                    text-align: right; /* Align the price to the right */
                    margin-left: auto; /* Push price to the far right */
                }

                .product-quantity {
                    width: 50px; /* Slightly wider to accommodate numbers */
                    text-align: center;
                    border: 1px solid #ccc; /* Soft border */
                    padding: 5px;
                    border-radius: 5px; /* Rounded corners */
                    font-size: 14px; /* Match font size */
                    color: #333; /* Text color */
                    margin-right: 10px; /* Space before the remove button */
                }
                .remove-item {
                    background-color: transparent;
                    border: none;
                    color: #e53935; /* Red color */
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: 10px;
                    font-weight: bold;
                }

                .remove-item:hover {
                    color: #b71c1c; /* Darker red on hover */
                }

                .total {
                    font-weight: bold;
                    text-align: right;
                    margin: 20px 0 10px 0;
                    font-size: 18px; /* Increased font size */
                    color: #333; /* Darker text */
                }

                .request-order {
                    width: 100%;
                    padding: 15px;
                    background-color: #b26ba5; /* Button color to match the theme */
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px; /* Rounded corners */
                    font-weight: bold;
                    font-size: 16px;
                    text-align: center;
                    text-transform: uppercase; /* Match text style */
                }

                .request-order:hover {
                    background-color: #9a5190; /* Slight hover effect */
                }
                </style>
            <div id="cart-container">
                <div class="cart">
                    <button class="close-cart" onclick="closeCart()">✕</button>
                    <h2>Your Cart</h2>
                    <hr>
                    <div class="cart-item">
                        <img src="./products/Screenshot 2024-07-23 212737.png" alt="Product Image">
                        <div class="item-details">
                            <p class="product-name">Product Name</p>
                            <button class="remove-item" onclick="removeItem(this)">✕</button>
                            <p class="product-variants">Variants: Lorem ipsum dolor, sit amet consectetur adipisicing elit</p>
                            <p class="product-price">¥ 100.00</p>
                            <input type="number" class="product-quantity" value="1" min="1">
                        </div>
                    </div>
                    <div class="cart-item">
                        <img src="./products/Screenshot 2024-07-23 214138.png" alt="Product Image">
                        <div class="item-details">
                            <p class="product-name">Product Name</p>
                            <button class="remove-item" onclick="removeItem(this)">✕</button>
                            <p class="product-variants">Variants: Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p class="product-price">¥ 100.00</p>
                            <input type="number" class="product-quantity" value="1">
                        </div>
                    </div>
                    <p class="total">TOTAL: ¥ 200.00</p>
                    <button class="request-order">REQUEST ORDER</button>
                </div>
            </div>
        `;
        // Append the new div to the body
        document.body.appendChild(newDiv);
    });
        
    // Function to update cart count
    function updateCartCount(count) {
        const viewCartLink = document.getElementById('view-cart');
        viewCartLink.textContent = `CART (${count} ITEMS)`;
    }

    // Example: Update cart count (you would call this function when items are added/removed)
    updateCartCount(0);
})();