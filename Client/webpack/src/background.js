// Database name and version
console.log('Background script loaded.');
const dbName = 'ExtensionDB';
const dbVersion = 1;

let serverUrl = 'http://localhost:5000/api/v1';

function getLocalStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], function(result) {
      console.log(`${key}:`, result[key]);
      resolve(result[key]);
    });
  });
}

function setLocalStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({[key]: value}, function() {
      console.log(`${key} set to:`, value);
      resolve();
    });
  });
}

const api = {
  serverUrl: 'http://localhost:5000/api/v1',
  //basefunctions:
  useGet: async (url) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const completeUrl = `${serverUrl}${url}`;

      const response = await fetch(completeUrl, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();

      console.log(
        "GET",
        completeUrl,
        "Response:",
        data
      )

      return data;
    }catch(err){
      console.error(err);
    }
  },

  usePost: async (url, body) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const completeUrl = `${serverUrl}${url}`;

      const response = await fetch(completeUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      console.log(
        "POST",
        completeUrl,
        "Response:",
        data
      )

      return data;
    }catch(err){
      console.error(err);
    }
  },

  //Cart operations
  cart: {
    get: async (userEmail) => {
      const url = `/cart?email=${encodeURIComponent(userEmail)}`;
      return api.useGet(url);
    },
    add: async (userEmail, item) => {
      const url = `/cart/add?email=${encodeURIComponent(userEmail)}`;
      return api.usePost(url, item);
    },
    remove: async (userEmail, productName) => {
      const url = `/cart/remove?email=${encodeURIComponent(userEmail)}`;
      return api.usePost(url, { productName });
      // return api.usePost(url);
    },
  },
}

// Handle signup
function handleSignup(request, sendResponse) {
  console.log('Signup request received:', request.email);
  /*
  const user = {
    email: request.email,
    name: request.name,
    password: request.password // Note: In a real application, never store passwords in plain text
  };

  UserDB.add(user)
    .then(() => {
      console.log('Signup successful:', user.email);
      sendResponse({ success: true });
    })
    .catch(error => {
      console.error('Signup failed:', error);
      sendResponse({ success: false, error: error.toString() });
    });
  */
  fetch(`${serverUrl}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: request.email,
      name: request.name,
      password: request.password
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Signup successful:', request.email);
      sendResponse({ success: true });
    } else {
      console.error('Signup failed:', data.error);
      sendResponse({ success: false, error: data.error });
    }
  })
  .catch(error => {
    console.error('Signup failed:', error);
    sendResponse({ success: false, error: error.toString() });
  });
}

// Handle login
async function handleLogin (request, sendResponse) {
  console.log('Login request received:', request.email);
  const response = await fetch(`${serverUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: request.email,
      password: request.password
    }),
  })
  const data = await response.json();
  if (data.success) {
    const user = data.data.userData
    console.log('Login successful:', data);
    const userStore =  {
      email: user.email,
      name: user.name
    }
    await setLocalStorage('isLoggedIn', true);
    await setLocalStorage('user', userStore);

    await getLocalStorage('user');
    sendResponse({success: true, user: userStore});
    
    } else {
      console.log('Login failed:', data.error);
      sendResponse({success: false, error: data.error});
    }
}

// Handle add to cart
async function handleAddToCart(request, sendResponse) {
  console.log('Add to cart request received:', request.userEmail);
  
  const item = request.item;
  const userEmail = request.userEmail;
  try {
    const items = await api.cart.add(userEmail, item);
    console.log('Cart updated :', item);
    sendResponse({ success: true });
  }
  catch (error) {
    console.error('Error updating cart:', error);
    sendResponse({ success: false, error: error.toString() });
  }

}

// Handle remove from cart (new function)
async function handleRemoveFromCart(request, sendResponse) {
  console.log('Remove from cart request received:', request.userEmail, request.productName);
  try {
    const items = await api.cart.remove(request.userEmail, request.productName);
    console.log('Item removed from cart successfully', request.productName);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    sendResponse({ success: false, error: error.toString() });
  }

}
// Handle get cart
async function handleGetCart(request, sendResponse) {
  try {
    const items = await api.cart.get(request.userEmail);
    console.log('Cart retrieved successfully', items);
    sendResponse({ success: true, items });
  } catch (error) {
    console.error('Error getting cart:', error);
  }
  
  

}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Message received:', request.action);

  switch (request.action) {
    case 'signup':
      handleSignup(request, sendResponse);
      break;
    case 'login':
      await handleLogin(request, sendResponse);
      break;
    case 'addToCart':
      await handleAddToCart(request, sendResponse);
      console.log('add to cart request received:', request.userEmail);
      break;
    case 'removeFromCart':
      handleRemoveFromCart(request, sendResponse);
      console.log('remove from cart request received:', request.userEmail);
      break;
    case 'getCart':
      handleGetCart(request, sendResponse);
      console.log('get cart request received:', request.userEmail);
      break;
    default:
      console.error('Unknown action:', request.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true; // Indicates that the response is sent asynchronously
});