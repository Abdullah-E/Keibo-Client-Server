// const createToolbar = () => {
//     console.log('newcontent.js loaded');

//     const toolbarStyleStr = `
//         #floating-toolbar {
//             position: fixed;
//             bottom: 0;
//             left: 50%;
//             transform: translateX(-50%);
//             width: 100%;
//             max-width: 1500px;
//             background-color: #bfa5cd;
//             padding: 10px 20px;
//             box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
//             z-index: 9999;
//             box-sizing: border-box;
//         }
//     `;

//     const toolbar = document.createElement('div');
//     toolbar.id = 'floating-toolbar';

//     // Apply styles immediately
//     const toolbarStyle = document.createElement('style');
//     toolbarStyle.textContent = toolbarStyleStr;
//     document.head.appendChild(toolbarStyle);

//     // Attempt to load the HTML content
    
//     const toolbarUrl = chrome.runtime.getURL('toolbar.html');
//     console.log('Attempting to load toolbar from:', toolbarUrl);

//     fetch(toolbarUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.text();
//         })
//         .then(html => {
//             toolbar.innerHTML = html;
//             document.body.appendChild(toolbar);
//             console.log('Toolbar loaded successfully');
//         })
//         .catch(error => {
//             console.error('Failed to load toolbar:', error);
//             toolbar.textContent = 'Failed to load toolbar content';
//             document.body.appendChild(toolbar);
//         });

//     return toolbar;
// };

// createToolbar();

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
            /* box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); */
            z-index: 9999;
            box-sizing: border-box;
            border: none;
            border-radius: 20px;
}
      }
    `;
  
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
  };
  
  createToolbar();