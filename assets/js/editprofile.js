import API_URL from './config.js'
import { changeImgShow } from './utils.js';
import { callToast } from './confirm.js';
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';


let message = null;
let name = null;
let isSubmitting = false;

async function loadMyAccount() {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/account/myaccount`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        const acc = await response.json();
        return acc;
    } catch (error) {

    }
}

function renderEditInformationUser(acc){
    const htmlFormEdit = `
        <form class="form" id="form-1" method="post">
                            <div class="row row-form-edit"> 
                                <!-- Form Group (email address)-->
                                <div class="col-md-6">
                                    <label class="label-profile-edit" for="email">Email address</label>
                                    <input class="form-control" id="email" type="email" value="${acc.email}" readonly>
                                   <!-- dung co ma cham vo form-message , cai nay do js lam roi -->                                 
                                    <span class="form-message"></span>   
                                </div>
                                <!-- Form Group (username)-->
                                <div class="col-md-6 ">
                                    <label class="label-profile-edit" for="inputUsername">KoiCareId</label>
                                    <input class="form-control" id="KoiCareId" type="text" placeholder="Enter your username" readonly value="${acc.koiCareId}">
                                   <!-- dung co ma cham vo form-message , cai nay do js lam roi -->
                                   <span class="form-message"></span>
                                    <!-- <span class="error__bk">KoiCareId is exist</span>   -->
                                    
                                </div>
                                <div class="col-md-6 ">
                                    <label class="label-profile-edit" for="fullName">Name</label>
                                    <input class="form-control" id="fullName" name="fullName" type="text" placeholder="Enter your username" value="${acc.fullName}" required>
                                   <!-- dung co ma cham vo form-message , cai nay do js lam roi --> 
                                    <span class="form-message"></span> 
                                </div>
                                <div class="col-md-6">
                                    <label class="label-profile-edit" for="inputPhone">Phone number</label>
                                    <input class="form-control" id="phoneNumber" name="phoneNumber" type="tel" placeholder="Enter your phone number" value="${acc.phoneNumber}" required>
                                   <!-- dung co ma cham vo form-message , cai nay do js lam roi -->                                   
                                    <span class="form-message"></span> <!-- dont touch --> 
                                    
                                </div>
                                <div class="col-md-6 ">
                                    <label class="label-profile-edit" for="address">Address</label>
                                    <input class="form-control" id="address" name="address" type="text" placeholder="Enter your address" value="${acc.address}" required >
                                    <span class="form-message"></span>
                                </div>
                                <div class="col-md-6">
                                    <label class="label-profile-edit" for="inputBirthday">Gender</label>
                                    <select name="gender" id="" class="input__form ">
                                        <option value="Man" ${acc.gender == "Man" ? 'selected' : '' }>Man</option>
                                        <option value="Woman" ${acc.gender == "Woman" ? 'selected' : '' }>Woman</option>
                                        <option value="Orther" ${acc.gender == "Orther" ? 'selected' : '' }>Orther</option>
                                    </select>
                                </div>  
                            </div>  
                            <!-- Save changes button-->
                            <button class="btn btn-edit-img-profile" type="submit">Save changes</button>
                        </form>
    `;
    document.getElementById('contain__form_edit-infor').innerHTML = htmlFormEdit; 
    applyValidation();
}

function renderUpdateImgUser(acc){
    const htmlFormImg = `
        <div class="card-header">Profile Picture</div>
                    <div class="card-body text-center">
                        <!-- Profile picture image-->
                         <div class="text-center d-flex justify-content-center"> 
                             <img id="imagePreview" class="img-account-profile rounded-circle " src="${acc.userImage}" alt="">
                            </div>
                        <!-- Profile picture help block-->
                        <div class="desc-img">
                            <p>
                                JPG or PNG no larger than 5 MB 
                            </p>    
                        </div>
                        <!-- Profile picture upload button-->
                         <form id="form__update-img-account" method="post" enctype="multipart/form-data"> 
                            <input id="imageInput" name="ImgAccount" class="choose-edit-img-profile" type="file" accept="image/*">
                             <button class="btn btn-edit-img-profile" type="submit">Upload new image</button>
                         </form>
                    </div>
    `;
    document.getElementById('content__update-img-user').innerHTML = htmlFormImg;
    changeImgShow();
    document.getElementById('form__update-img-account').addEventListener('submit', async function(event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        loading();  
        
        const form = document.getElementById('form__update-img-account');
        const formData = new FormData(form);
        try {
            const result = await updateImgAccount(formData);
                   
        } catch (error) {
        }finally{
            isSubmitting = false;
            removeLoading();

        }
    })
}

async function updateImgAccount(formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/account/updateimg`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            },
        });
        const result = await response.json();
        message = result.message;
    
        if(response.ok){
            sessionStorage.setItem('toastData', JSON.stringify({ resultDelete: true, messageDelete: message }));      
            window.location.href = 'profilepage.html';    
        }else{
            callToast(false, message);
        }
        
    } catch (error) {
        console.error('Error deleting pond:', error);       
    }
}

function renderUpdatePassword(){
    const htmlUpdatePassword = `
        <form class="form" id="form-2" method="post"> 
                            <input type="hidden" name="accID" id="accID" value="">
                            <!-- Form Row-->
                            <div class="row  row-form-edit ">
                                <!-- Form Group (old pw)-->
                                <div class="col-md-6">
                                    <label class="label-profile-edit" for="inputFirstName">Old Password</label>
                                    <input class="form-control" name="password_old" id="password_old" type="password" placeholder="Enter your old password" >
                                    <!-- dung co ma cham vo form-message , cai nay do js lam roi -->
                                    <span class="form-message"></span> 
                                        <span class="error__bk"> </span>    
                                </div>
                                <div class="col-md-6">   </div>
                                <!-- Form Group (new pw)-->
                                <div class="col-md-6">
                                    <label class="label-profile-edit" for="inputLastName">New Password</label>
                                    <input class="form-control" id="password_new" name="password_new" type="password" placeholder="Enter your new password" >
                                    <!-- dung co ma cham vo form-message , cai nay do js lam roi -->                                    
                                    <span class="form-message"></span>
                                </div>
                                                                     
                                <div class="form-group col-md-6 ">
                                    <label class="label-profile-edit" for="password_confirmation">Confirm New Password</label>
                                    <input type="password" id="password_confirmation" name="txtconfirmpassword" class="form-control"
                                    placeholder="Confirm password" />
                                    <span class="form-message"></span>
                                </div> 
                            </div>     
                            <!-- Save changes button-->
                            <button class="btn btn-edit-img-profile" type="submit">Save changes</button>
                        </form>
    `;
    document.getElementById('update__form_password').innerHTML = htmlUpdatePassword;
    validatePassword();
}


async function fetchAndRenderFormEdit() {
    const account = await loadMyAccount();
    if (account) {
        renderEditInformationUser(account);
        renderUpdateImgUser(account); 
        renderUpdatePassword();
    }
}
fetchAndRenderFormEdit();

async function updateInforAccountAPI(formValues) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/account/updateaccount`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,   
            },
            body: JSON.stringify(formValues),  
        });
        const result = await response.json();
        message = result.message;
        if (response.ok) {
            sessionStorage.setItem('toastData', JSON.stringify({ resultDelete: true, messageDelete: message }));
            window.location.href = 'profilepage.html';
        }
    } catch (error) {
        
    }
}

function applyValidation(){
    Validator({
        form: '#form-1',
        errorSelector:'.form-message',
        rules: [ 
            Validator.isRequired('#fullName'),
            Validator.isRequired('#address'),
            Validator.isPhoneNumber('#phoneNumber','Phone number at least 10 number'), 
        ] ,
        onSubmit: function (formValues) {
            console.log(  formValues);
            updateInforAccountAPI(formValues);
        }
    });
}


function validatePassword(){
    Validator({
        form: '#form-2',
        errorSelector: '.form-message',
        rules: [
            Validator.minLength('#password_new', 6),
            Validator.isRequired('#password_confirmation'),
            Validator.isConfirmed('#password_confirmation',()=>{
            return document.querySelector('#form-2 #password_new').value;
        },'Password confirm not exactly')
        ]
    })
}