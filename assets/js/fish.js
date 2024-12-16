import API_URL from './config.js';
import DOMAIN_URL from './domain.js'; 
import { changeImgShow } from './utils.js';
import { createDeleteModal } from './confirm.js';
import { toastMessage } from './confirm.js';
import { loading } from './confirm.js'
import { removeLoading } from './confirm.js'



let myPond = null;
let isSubmitting = false;
let message = null;
let type = null;
let title = null;

async function fetchMyFishs() {
    const token = sessionStorage.getItem('authToken');
    try{
        const response = await fetch(`${API_URL}/fish/myfish`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        return await response.json(); 
    }catch(error){
        console.error('Error fetching products:', error);

    }
}
async function fetchMyPond() {
    const token = sessionStorage.getItem('authToken');
    try{
        const response = await fetch(`${API_URL}/pond/mypond`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        return await response.json(); 
    }catch(error){
        console.error('Error fetching products:', error);

    }
}

function renderMyFishs(fishs){
    const myFishsHtmlMap = fishs.map(function(f){
        return `
            <div class="fish-item-d col-lg-3 col-md-4 col-sm-6" data-idFish="${f.fishId}">
                <div class="fish-item ">
                    <div class="fish-item-detail">
                        <div class="fish-img-detail">
                            <a class="d-block" href="fishinfor.html?id=${f.fishId}" >
                                <img src="${f.fishImage}"
                                    alt="${f.fishName}">
                            </a>
                        </div>
                        <div class="fish-info">
                            <a href="fishinfor.html?id=${f.fishId}" class="link__to-fish-detail">
                                ${f.fishName} 
                            </a>
                            <p> ${f.descriptionKoi}
                             </p>
                            <a href="" class="link-delete-fish" data-fid="${f.fishId}" data-nameDelete="${f.fishName}">Delete</a>
                        </div>
                    </div>
                </div>
            </div> 
        `
    }).join('');
    document.querySelector('.fish-list').innerHTML = myFishsHtmlMap;
    document.querySelectorAll('.link-delete-fish').forEach(function(link){
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const fId = this.getAttribute('data-fid');
            const name = this.getAttribute('data-nameDelete');
            createDeleteModal(name, async () => {
                await deleteFish(fId);
            })            
        })
    })
}
async function deleteFish(fishID) {
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/fish/deletefish/${fishID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        const result = await response.json();
        message = result.message;
        if (response.ok) {
            document.querySelector(`div[data-idFish="${fishID}"]`).remove();
            callToast(true, message);
        } else {
            callToast(false, message);
        }

    } catch (error) {
        console.error('Error deleting fish:', error);
    }
}

async function fetchMyFishAndRender() {
    const myFishs = await fetchMyFishs();
    const ponds = await fetchMyPond();
    myPond = ponds;
    if(myFishs){
        renderMyFishs(myFishs);
    }
}

function callToast(result, message) {
    if (result) {
        title = "Success";
        type = "success";
    } else {
        title = "Error";
        type = "error";
    }
    toastMessage(type, title, message);
}

async function createNewFish(formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/fish/createfish`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            },
        });
        const result = await response.json();
        message = result.message;
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        title = "Error";
        type = "error";
        return false;
    }
}

async function renderTableCreateFish(myPond) {
    const htmlCreateTable = `
        <div class="container__infor__fish">
        <div class="infor__fish-detail">
            <form  id="form__create_new-fish" method="post">
                <div class="row row-fish-detail">
                    <div class="col-md-4  " style="padding: 0">
                        <div class="img-edit-submit">
                            <div class="fish-img-info-edit mb-4">
                                <img id="imagePreview"
                                    src="https://plus.unsplash.com/premium_photo-1723672584731-52b5f1a67543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29pJTIwZmlzaHxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Koi Pond" style=" style="height: 250px; width:250px; object-fit: unset;">
                            </div>
                            <div class="fish-edit-img-detail">
                                <input id="imageInput" type="file" name="ImgFish" accept="image/*">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 edit-info">
                        <div class="text-right">
                            <button class="btn-close-fish">
                                <i class="fa-solid fa-xmark close-navbar-icon-btn-fish"></i>
                            </button>
                        </div>
                        <h2>New Information</h2> 
                        <div class="row row-edit-info-detail">
                            <div class="col-sm-6 edit-item-detail">
                                <span>Fish Name </span>
                                <input type="text" name="FishName" placeholder="Enter fish name" required />
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Body Shape </span>
                                <select name="BodyShape" style="width: 100%;  border: 1px solid #000;">  
                                        <option value="Slim" selected>Slim</option>
                                        <option value="Fat">Fat</option>
                                        <option value="Long">Long</option>
                                        <option value="Short">Short</option>
                                        <option value="Large">Large</option>
                                        <option value="Small">Small</option>
                                    </select>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Age <span class="text-danger">(years)</span> </span>
                                <input type="number" name="Age" placeholder="Enter age" required />
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Length <span class="text-danger">(cm)</span></span>
                                <input type="number" step="0.1" name="Length" placeholder="Enter length in cm" required />
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Weight <span class="text-danger">(kg)</span></span>
                                <input type="number" step="0.1" name="Weight" placeholder="Enter weight in kg" required />
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Gender </span>
                                <select name="Gender" style="width: 100%; padding: 4px; border: 1px solid #000;">
                                    <option selected value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Description </span>
                                <input type="text" name="DescriptionKoi" placeholder="Enter description" required />
                            </div>
                             <div class="col-sm-6 edit-item-detail">
                                <span>Choose your pond </span>
                                <select name="PondId" style="width: 100%; border: 1px solid #000;">
                                    <option value="">Unasigned</option>
                                    ${myPond.map(function(p){
                                        return `
                                            <option value="${p.pondId}">${p.pondName}</option>
                                        `;
                                    })} 
                                </select>
                             </div>
                        </div>
                        <div class="text-center">
                            <button class="edit-btn blue-btn" style="margin-top: 10px">
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    </div>
    `;
    document.getElementById('table__create-fish').innerHTML = htmlCreateTable;
    changeImgShow();
    const modalElement = document.querySelector('.container__infor__fish');
    const btnClose = document.querySelector('.btn-close-fish');
    const miniTable = document.querySelector('.infor__fish-detail');

    const closeModal = () => {
        modalElement.remove();
    };

    document.getElementById('form__create_new-fish').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;
 
        loading();

        const form = document.getElementById('form__create_new-fish');
        const formData = new FormData(form);
        try {
            const result = await createNewFish(formData);
            callToast(result, message);            
        } catch (error) {
            console.error('Error create fish:', error);
            callToast(false, message);                        
        }finally{
            isSubmitting = false; 
            removeLoading();  
            closeModal();
            fetchMyFishAndRender();
        }         
    });



    btnClose.addEventListener('click', closeModal);
    modalElement.addEventListener('click', closeModal);
    miniTable.addEventListener('click',(e)=>{
        e.stopPropagation();
    })


}
const btnAddNew = document.querySelector('.btn__add-new-fish');
btnAddNew.addEventListener('click', function(){
    renderTableCreateFish(myPond);
})

fetchMyFishAndRender()

document.addEventListener('DOMContentLoaded', () => {
    const toastData = sessionStorage.getItem('toastData');
    if (toastData) {
        const { resultDelete, messageDelete } = JSON.parse(toastData);
        callToast(resultDelete, messageDelete);

        // Xóa dữ liệu để không hiển thị lại toast khi reload
        sessionStorage.removeItem('toastData');
    }
});