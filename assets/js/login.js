import API_URL from './config.js'; 
import DOMAIN_URL from './domain.js';

import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';

let message = "";

function renderLogin(){
    const htmlLogin = `
     <div id="sign-in-form" class="container__sigin-form form-container">
                <div class="user-sign-container">

                    <header class="header__screen-log">
                        <!-- <h1 class="signin-header-title">Welcome back!</h1> -->
                        <a href="Home.html" class="header__img-log">
                            <img src="./assets/img/logo/logoSignin.jpg" alt="">
                        </a>
                        <p class="header-desc">Sign In to manage your Koi Care System</p>
                    </header>
                    <div class="body__input-container">
                        <form class="form" id="form1" method="post">
                            <!-- username --> 
                            <div class="form-group" style="margin-bottom: 0;">  
                                <input type="text" id="email-log" name="txtemail" class="input__form"
                                 placeholder="koicare ID" required><br>
                             </div>
                            <!-- password -->
                            <div class="form-group">
                            <input type="password" id="password-title-signin" name="txtpassword"
                                class="input__form mt-4 last-child" placeholder=" Enter your password" required /><br>
                            </div>
                                <!-- take error something --> 
                             <div class="wrong__acc mt-2">
                                 <span id="wrongNameOrPass" class=""></span>
                             </div>
                             <div class="link-forgot-acc">

                                 <a href="#" class="">Forgot password?</a><br>
                             </div>

                            <button class="btn btn-info btn-signin-acc ">Sign In</button><br>
                        </form>
                        <p class="footer__screen__acc_according">
                            Don't have an account?<a href="register.html" class="signup-btn-link" id="come-signup">Sign
                                Up</a>
                        </p>
                    </div>
                    <div class="flex-row contain__login-google">
                        <a href="" class="btn google btn-google" id="google-login-btn">
                            <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                    <path style="fill:#FBBB00;" d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
                        c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
                        C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
                    <path style="fill:#518EF8;" d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                        c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                        c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"></path>
                    <path style="fill:#28B446;" d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                        c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                        c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
                    <path style="fill:#F14336;" d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                        c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                        C318.115,0,375.068,22.126,419.404,58.936z"></path> 
                    </svg> 
                            Google  
             </a> 
                    </div>



                    <footer class="footer__screen__acc">
                        <div class="policy__service-more">
                            <p>This site is protected by reCAPTCHA Enterprise and the Google 
                                <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a>
                                 and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply</p>
                        </div>
                    </footer>

                </div>
            </div> 
    `;
    document.querySelector('.info__user-container').innerHTML = htmlLogin;
    document.getElementById('form1').addEventListener('submit', async function (e) {
        e.preventDefault(); 
        loading();
        const payload = {
            koiCareId: document.getElementById('email-log').value,
            password: document.getElementById('password-title-signin').value
        } 
        const result = await postLogin(payload);
        if(result){
            window.location.href =  `${DOMAIN_URL}/Home.html`;
        }else{
            document.getElementById('wrongNameOrPass').innerText = message; 
            removeLoading();
        }
    });

    const googleLoginBtn = document.getElementById("google-login-btn");
    googleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('a') 
        const googleOAuthURL = "https://accounts.google.com/o/oauth2/auth?scope=email profile openid&redirect_uri=https://koicaresystemapikhanh-bhddfwefgsa2gddq.southeastasia-01.azurewebsites.net/account/signin-google&response_type=code&client_id=519009830527-gcfie0931da89oufr9s747de2uu9854j.apps.googleusercontent.com&approval_prompt=force";     
        window.location.href = googleOAuthURL;
    })
} 

async function postLogin(payload) { 
    try {
        const response = await fetch(`${API_URL}/account/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }); 
        const result = await response.json();
        if (response.ok) { 
            sessionStorage.setItem('authToken', result.token); 
            return true;
        }
        message = result.message;
        return false;
    } catch (err) {
        console.error('Error:', err);
        document.getElementById('message').innerText = 'An error occurred!';
        message = "";
        return false; 
    }
}

renderLogin();

document.addEventListener("DOMContentLoaded", () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if(token){ 
        sessionStorage.setItem('authToken', token);
        window.location.href = `https://acnbokhb12.github.io/koicaresystem/Home.html`; 
    } 
})

 