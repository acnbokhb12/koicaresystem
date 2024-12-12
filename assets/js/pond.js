import API_URL from './config.js';
import { createDeleteModal } from './confirm.js';
import { toastMessage } from './confirm.js'; 
import { changeImgShow } from './utils.js';
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';


export let message = null;
let type = null;
let title = null;
let isSubmitting = false;

// let sure = inforToast;
async function fetchMyPond() {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/pond/mypond`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            },
        });
        const ponds = await response.json();
        return ponds;

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderMyPonds(ponds) {
    try {
        const myPondsHtmlMap = ponds.map(function (p) {
            return `
         <div class="col-md-4 col-sm-6" data-idPond="${p.pondId}">
                <div class="pond-item  ">
                    <div class="pond-item-detail">
                        <div class="pond-img-detail">
                            <a class="d-block" href="pondinfor.html?id=${p.pondId}" >
                                <img src="${p.pondImage}"
                                alt="s">
                            </a>
                        </div>
                        <div class="pond-info">
                            <a href="pondinfor.html?id=${p.pondId}" class="link__to-pond-detail">
                              ${p.pondName}
                            </a>
                            <p>
                                ${p.description}
                            </p>
                            <a href="" class="link-delete-pond" data-id="${p.pondId}" data-nameDelete="${p.pondName}" >Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        `
        }).join('');
        document.querySelector('.pond-list').innerHTML = myPondsHtmlMap;
        document.querySelectorAll('.link-delete-pond').forEach(function (link) {
            link.addEventListener('click', async function (e) {
                e.preventDefault();
                const pondId = this.getAttribute('data-id');
                const name = this.getAttribute('data-nameDelete');
                createDeleteModal(name, async () => {
                    await deletePond(pondId);
                });
            })
        })
    } catch (error) {

    }
}

async function deletePond(pondId) {
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/pond/deletepond/${pondId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        const result = await response.json();
        message = result.message;
        if (response.ok) {
            document.querySelector(`div[data-idPond="${pondId}"]`).remove();
            callToast(true, message);
        } else {
            callToast(false, message);
        }

    } catch (error) {
        console.error('Error deleting pond:', error);
    }
}
async function fetchMyPondAndRender() {
    const myPonds = await fetchMyPond();
    if (myPonds) {
        renderMyPonds(myPonds);
    }
}

export function callToast(result, message) {
    if (result) {
        title = "Success";
        type = "success";
    } else {
        title = "Error";
        type = "error";
    }
    toastMessage(type, title, message);
}

// Hàm để gửi dữ liệu tạo Pond
async function createNewPond(formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/pond/createpond`, {
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
fetchMyPondAndRender();

function showPondForm() {
    const pondFormHTML = `
    <div class="container__infor__pond">
        <div class="infor__pond-detail">
            <form method="post" enctype="multipart/form-data" id="fomr_fill-new-pond">
                <div class="row row-pond-detail">
                    <div class="col-md-4 p-0 m-auto" >
                        <div class="img-edit-submit">
                            <div class="pond-img-info-edit"> 
                                    <img id="imagePreview" src="https://www.thesprucepets.com/thmb/tucFN5e5O9-vbhr0jhbeL8zkFLY=/3572x0/filters:no_upscale():strip_icc()/GettyImages-1148621267-fbe7fcc9e0eb41078b0ee63bc3edc2b3.jpg" alt="Koi Pond">                       
                                </div>
                            <div class="pond-edit-img-detail">
                                <input id="imageInput" name="ImagePond" type="file" accept="image/*" style=""font-weight:bold;>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 edit-info">
                        <div class="text-right">
                            <button class="btn-close-pond">
                                <i class="fa-solid fa-xmark close-navbar-icon-btn-pond"></i>
                            </button>
                        </div>
                        <h2>Add New Pond</h2>
                        <div class="row row-edit-info-detail">
                            <div class="col-sm-6 edit-item-detail">
                                <span>Pond Name</span>
                                <input type="text" class="pond-name" name="PondName" placeholder="Enter your pond name" required>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Depth <span class="text-danger">(m)</span> </span>
                                <input type="number" class="pond-depth" name="Depth" step="0.1" placeholder="Enter depth in meters" required>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Volume <span class="text-danger">(l)</span></span>
                                <input type="number" class="pond-volume" name="Volume" step="0.1" min="0.1" placeholder="Enter volume in liters" required>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Drain Count</span>
                                <input type="number" class="drain-count" name="DrainCount" min="1" placeholder="Enter number of drains" required>
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Pump Power <span class="text-danger">(l/h)</span></span>
                                <input type="number" step="0.1" class="pump-power" name="PumpPower" min="1" placeholder="Enter pump power in liters per hour" >
                            </div>
                            <div class="col-sm-6 edit-item-detail">
                                <span>Skimmer</span>
                                <input type="number" class="skimmer" name="Skimmer" min="0" placeholder="Enter skimmer quantity" >
                            </div>
                            <div class="col-sm-12 edit-item-detail">
                                <span>Description</span>
                                <input type="text" class="pond-description" value="" name="Description" placeholder="Enter pond description" >
                            </div>
                             
                        </div>
                        <div class="text-center">
                            <button class="edit-btn" type="submit" style="margin-top: 10px;">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </form>              
        </div>
    </div>
    `;

    try {
        const targetElement = document.getElementById('pondFormCreate'); // Chọn nơi bạn muốn chèn form
        targetElement.innerHTML = pondFormHTML;
    } catch (error) {

    }
    changeImgShow();
    const btnClose = document.querySelector('.btn-close-pond');

    const closeModal = () => {
        const modalElement = document.querySelector('.container__infor__pond');
        modalElement.remove();
    };

    document.getElementById('fomr_fill-new-pond').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        loading();

        const form = document.getElementById('fomr_fill-new-pond');
        const formData = new FormData(form);

        try {
            const result = await createNewPond(formData);
            callToast(result, message);
            
        } catch (error) {
            callToast(false, message); 
        }finally{
            isSubmitting = false; 
            removeLoading(); 
            fetchMyPondAndRender();
            closeModal(); 
        }
         
    });

    btnClose.addEventListener('click', closeModal);
}
const btnOutOpen = document.querySelector('.edit-btn-out');
btnOutOpen.addEventListener('click', function () {
    showPondForm();
});

document.addEventListener('DOMContentLoaded', () => {
    const toastData = sessionStorage.getItem('toastData');
    if (toastData) {
        const { resultDelete, messageDelete } = JSON.parse(toastData);
        callToast(resultDelete, messageDelete);

        // Xóa dữ liệu để không hiển thị lại toast khi reload
        sessionStorage.removeItem('toastData');
    }
});