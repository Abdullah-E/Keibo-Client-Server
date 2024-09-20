// This file is used to handle the popup.html page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        chrome.runtime.sendMessage({ action: 'login', email, password }, function(response) {
            console.log('Login response:', response);
            if (response && response.success) {
                alert('Login successful!');
                chrome.storage.local.set({ 'userEmail': email }, function() {
                    console.log('User email saved:', email);
                    // Close the popup after successful login
                    window.close();
                });
            } else {
                alert('Login failed: ' +  (response ? response.error : 'Unknown error'));
            }
        });
    });

    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            passwordToggle.textContent = '👁️';
        }
    });
});
