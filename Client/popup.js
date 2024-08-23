// No additional white space or background should be set

document.getElementById('add-to-cart').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.getElementById('floating-toolbar').style.display = 'block'
      }
    })
  })
})

document.getElementById('view-cart').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        document.getElementById('cart-container').style.display = 'block'
      }
    })
  })
})
