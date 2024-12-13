import API_URL from './config.js';
// import SUB_DOMAIN from './config.js';

import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';

document.getElementById('form1').addEventListener('submit', async function (e) {
    e.preventDefault();
    var apiFetchLogin = `${API_URL}/account/login`;
    try {
        const response = await fetch(apiFetchLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                koiCareId: document.getElementById('email-log').value,
                password: document.getElementById('password-title-signin').value
            })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('authToken', data.token);
            // sessionStorage.removeItem('authToken');
            window.location.href =  `../Home.html`;

        } else {
            const error = await response.json();
            document.getElementById('wrongNameOrPass').innerText = error.message;
        }

    } catch (err) {
        console.error('Error:', err);
        document.getElementById('message').innerText = 'An error occurred!';
    }
})


document.addEventListener("DOMContentLoaded", () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if(token){ 
        sessionStorage.setItem('authToken', token);
        window.location.href = `../Home.html`; 
    }
 
    const googleLoginBtn = document.getElementById("google-login-btn");
    googleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('a') 
        const googleOAuthURL = "https://accounts.google.com/o/oauth2/auth?scope=email profile openid&redirect_uri=https://localhost:7232/account/signin-google&response_type=code&client_id=519009830527-gcfie0931da89oufr9s747de2uu9854j.apps.googleusercontent.com&approval_prompt=force";     
        window.location.href = googleOAuthURL;
    })
})

 