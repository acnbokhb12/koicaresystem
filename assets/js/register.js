import API_URL from './config.js'
import { callToast } from './confirm.js';
import DOMAIN_URL from './domain.js'; 
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';
let message = null;
let sameKoiCare = "";

function renderRegister(){
    const htmlRegisterform = `
        <form class="form" id="register__form" method="post">
                            <div class="row row__form"> 
                            <!-- KoiCareId -->
                            <div class="form-group col-md-6 ">
                                <label for="koicareid" class="form-label"> <i class="fa-solid fa-envelope  icon-signup"></i>
                                    KoiCareId</label> 
                                <input type="text" id="koicareid" name="koiCareId" class="input__form"
                                    placeholder="Enter koicareid">
                                <span class="form-message"></span>
                                <span class="form-message-error-bk">${sameKoiCare}</span>
                            </div> 
                            <!-- UserName -->
                            <div class="form-group col-md-6 ">
                                <label for="fullname" class="form-label"><i class="fa-solid fa-user icon-signup"></i>
                                    Name</label>

                                <input type="text" id="fullname" name="fullName" class="input__form"
                                    placeholder="UserName" />
                                <span class="form-message"></span>
                            </div> 
                            <!-- password -->
                            <div class="form-group col-md-6   "> 
                                <label for="password" class="form-label"><i
                                        class="fa-solid fa-lock icon-signup"></i> Password</label>
                                <input type="password" id="password" name="password"
                                    class="input__form " placeholder="Password" />
                                <span class="form-message"></span>
                            </div> 
                            <!-- pass wordd again -->
                            <div class="form-group col-md-6 ">
                                <label for="password_confirmation" class="form-label"><i class="fa-solid fa-lock icon-signup"></i> Confirm
                                    password</label>
                                <input type="password" id="password_confirmation" class="input__form"
                                    placeholder="Confirm password" />
                                <span class="form-message"></span>
                            </div> 
                            <button class="btn btn-info btn-signin-acc" type="submit">Sign Up</button><br>
                          </div>
                            <!-- Submit -->

                            </form>
    `;
    document.getElementById('form__register-acc-container').innerHTML = htmlRegisterform;
    validationRegister();    
}

async function createNewAccount(formValues) {
    loading();
    try {
        const response = await fetch(`${API_URL}/account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(formValues),  
        });
        const data = await response.json();
        if(response.ok){
            sessionStorage.setItem('authToken', data.token);
            window.location.href = `${DOMAIN_URL}/Home.html`;
        }else{
            sameKoiCare = data.koiCareId;
            if(!sameKoiCare){
                sameKoiCare = "";
            }
            renderRegister();
            message = data.message;
            if(message){
                callToast(false, message);
            }
            removeLoading();
        } 
    } catch (error) {
        
    }
} 

renderRegister();
function validationRegister(){
    Validator({
        form: '#register__form',
        errorSelector:'.form-message',
        rules: [ 
            Validator.isRequired('#koicareid'),
            Validator.isRequired('#fullname'),
            Validator.minLength('#password', 6),
            Validator.isRequired('#password_confirmation'),
            Validator.isConfirmed('#password_confirmation',()=>{
                return document.querySelector('#register__form #password').value;
            },'Password confirm not exactly')
        ],
         onSubmit: (data)=>{
            console.log(data);
            createNewAccount(data);
         }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if(token){ 
        sessionStorage.setItem('authToken', token);
        window.location.href = `${DOMAIN_URL}/Home.html`; 
    }
 
    const googleLoginBtn = document.getElementById("google-login-btn");
    googleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const googleOAuthURL = "https://accounts.google.com/o/oauth2/auth?scope=email profile openid&redirect_uri=https://koicaresystemapikhanh-bhddfwefgsa2gddq.southeastasia-01.azurewebsites.net/account/signin-google&response_type=code&client_id=519009830527-gcfie0931da89oufr9s747de2uu9854j.apps.googleusercontent.com&approval_prompt=force";             
        window.location.href = googleOAuthURL;
    })
})