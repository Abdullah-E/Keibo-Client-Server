chrome.runtime.onInstalled.addListener(() => {
  console.log('Keibo installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getToolbarUrl') {
    const toolbarUrl = chrome.runtime.getURL('toolbar.html');
    sendResponse({ url: toolbarUrl });
  }
  return true;  // Indicates we will send a response asynchronously
});