// Database name and version
console.log('Background script loaded.');
const dbName = 'ExtensionDB';
const dbVersion = 1;

// Sample users for testing
const sampleUsers = [
  { email: 'john@example.com', name: 'John Doe', password: 'password123' },
  { email: 'jane@example.com', name: 'Jane Smith', password: 'securepass' },
  { email: 'bob@example.com', name: 'Bob Johnson', password: 'bobpass123' },
  {email: 'sal@keibo.com', name: 'Salar', password: '123'}
];

// Open the database
function openDB() {
  return new Promise((resolve, reject) => {
      console.log('Opening database...');
      const request = indexedDB.open(dbName, dbVersion);

      request.onerror = event => {
          console.error('Error opening database:', event.target.error);
          reject('Error opening database');
      };

      request.onsuccess = event => {
          console.log('Database opened successfully');
          resolve(event.target.result);
      };

      request.onupgradeneeded = event => {
          console.log('Upgrading database...');
          const db = event.target.result;

          // Create an object store for users
          if (!db.objectStoreNames.contains('users')) {
              console.log('Creating users object store');
              const userStore = db.createObjectStore('users', { keyPath: 'email' });
              userStore.createIndex('name', 'name', { unique: false });

              // Add sample users
              sampleUsers.forEach(user => {
                  userStore.add(user);
              });
              console.log('Sample users added');
          }

          // Create an object store for cart
          if (!db.objectStoreNames.contains('cart')) {
              console.log('Creating cart object store');
              db.createObjectStore('cart', { keyPath: 'userEmail' });
          }
      };
  });
}

// User operations
const UserDB = {
  add: (user) => {
    return new Promise((resolve, reject) => {
      console.log('Adding user:', user.email);
      openDB().then(db => {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.add(user);

        request.onerror = event => {
          console.error('Error adding user:', event.target.error);
          reject('Error adding user');
        };

        request.onsuccess = event => {
          console.log('User added successfully:', user.email);
          resolve(event.target.result);
        };
      }).catch(error => {
        console.error('Error in add user transaction:', error);
        reject(error);
      });
    });
  },

  get: (email) => {
    return new Promise((resolve, reject) => {
      console.log('Getting user:', email);
      openDB().then(db => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const request = store.get(email);

        request.onerror = event => {
          console.error('Error getting user:', event.target.error);
          reject('Error getting user');
        };

        request.onsuccess = event => {
          console.log('User retrieved:', event.target.result ? event.target.result.email : 'Not found');
          resolve(event.target.result);
        };
      }).catch(error => {
        console.error('Error in get user transaction:', error);
        reject(error);
      });
    });
  },

  update: (user) => {
    return new Promise((resolve, reject) => {
      console.log('Updating user:', user.email);
      openDB().then(db => {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.put(user);

        request.onerror = event => {
          console.error('Error updating user:', event.target.error);
          reject('Error updating user');
        };

        request.onsuccess = event => {
          console.log('User updated successfully:', user.email);
          resolve(event.target.result);
        };
      }).catch(error => {
        console.error('Error in update user transaction:', error);
        reject(error);
      });
    });
  }
};

// Cart operations
const CartDB = {
  get: (userEmail) => {
    return new Promise((resolve, reject) => {
      console.log('Getting cart for user:', userEmail);
      openDB().then(db => {
        const transaction = db.transaction(['cart'], 'readonly');
        const store = transaction.objectStore('cart');
        const request = store.get(userEmail);

        request.onerror = event => {
          console.error('Error getting cart:', event.target.error);
          reject('Error getting cart');
        };

        request.onsuccess = event => {
          console.log('Cart retrieved for user:', userEmail);
          resolve(event.target.result ? event.target.result.items : []);
        };
      }).catch(error => {
        console.error('Error in get cart transaction:', error);
        reject(error);
      });
    });
  },

  update: (userEmail, items) => {
    return new Promise((resolve, reject) => {
      console.log('Updating cart for user:', userEmail);
      openDB().then(db => {
        const transaction = db.transaction(['cart'], 'readwrite');
        const store = transaction.objectStore('cart');
        const request = store.put({ userEmail, items });

        request.onerror = event => {
          console.error('Error updating cart:', event.target.error);
          reject('Error updating cart');
        };

        request.onsuccess = event => {
          console.log('Cart updated successfully for user:', userEmail);
          resolve(event.target.result);
        };
      }).catch(error => {
        console.error('Error in update cart transaction:', error);
        reject(error);
      });
    });
  }
};

// Message listener for various actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request.action);

  switch (request.action) {
    case 'signup':
      handleSignup(request, sendResponse);
      break;
    case 'login':
      handleLogin(request, sendResponse);
      break;
    case 'addToCart':
      handleAddToCart(request, sendResponse);
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

// Handle signup
function handleSignup(request, sendResponse) {
  console.log('Signup request received:', request.email);
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
}

// Handle login
function handleLogin(request, sendResponse) {
  console.log('Login request received:', request.email);
  UserDB.get(request.email)
    .then(user => {
      if (user && user.password === request.password) { // Note: In a real application, use proper password hashing and comparison
        console.log('Login successful:', user.email);
        chrome.storage.local.set({isLoggedIn: true, user: {email: user.email, name: user.name}}, () => {
          sendResponse({success: true, user: {email: user.email, name: user.name}});
        });
      } else {
        console.log('Login failed: Invalid credentials');
        sendResponse({success: false, error: 'Invalid credentials'});
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      sendResponse({success: false, error: 'An error occurred'});
    });
}

// Handle add to cart
function handleAddToCart(request, sendResponse) {
  console.log('Add to cart request received:', request.userEmail);
  CartDB.get(request.userEmail)
    .then(items => {
      const existingItemIndex = items.findIndex(item => item.product === request.item.product);
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        items[existingItemIndex].quantity += request.item.quantity;
      } else {
        // Add new item if it doesn't exist
        items.push(request.item);
      }
      return CartDB.update(request.userEmail, items);
    })
    .then(() => {
      console.log('Cart updated successfully', request.item.product);
      sendResponse({ success: true });
    })
    .catch(error => {
      console.error('Error updating cart:', error);
      sendResponse({ success: false, error: error.toString() });
    });
}

// Handle remove from cart (new function)
function handleRemoveFromCart(request, sendResponse) {
  console.log('Remove from cart request received:', request.userEmail, request.productName);
  CartDB.get(request.userEmail)
    .then(items => {
      const updatedItems = items.filter(item => item.product !== request.productName);
      return CartDB.update(request.userEmail, updatedItems);
    })
    .then(() => {
      console.log('Item removed from cart successfully', request.productName);
      sendResponse({ success: true });
    })
    .catch(error => {
      console.error('Error removing item from cart:', error);
      sendResponse({ success: false, error: error.toString() });
    });
}

// Handle get cart
function handleGetCart(request, sendResponse) {
  if (request.action === 'getCart') {
    console.log('Get cart request received:', request.userEmail);
    CartDB.get(request.userEmail)
      .then(items => {
        console.log('Cart retrieved successfully', items);
        sendResponse({ success: true, items });
      })
      .catch(error => {
        console.error('Error getting cart:', error);
        sendResponse({ success: false, error });
      });
    return true;
    }}