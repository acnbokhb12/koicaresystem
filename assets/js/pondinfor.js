import API_URL from './config.js'
import { createDeleteModal } from './confirm.js';
import { callToast } from './pond.js';
import { changeImgShow } from './utils.js';
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';

let message = null;
let name = null;
let idPond = null;
let isSubmitting = false;

let pondDetailIndor = null;

async function fetchPondInfor() {
    const urlParams = new URLSearchParams(window.location.search);
    const pondId = urlParams.get('id');
    if (!pondId) {
        // Không có ID trong URL
        window.location.href = 'pond.html';
        return;
    }
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/pond/mypond/${pondId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        if (!response.ok) {
            window.location.href = 'pond.html';
        }
        const pond = await response.json();
        if (pond) {
            pondDetailIndor = pond;
            setElementSrc('.pond-img-infor-detail', pond.pondImage);
            setElementText('.value-pond-name', pond.pondName);
            setElementText('.value-depth', pond.depth);
            setElementText('.value-volume', pond.volume);
            setElementText('.value-draincount', pond.drainCount);
            setElementText('.value-pumpower', pond.pumpPower);
            setElementText('.value-quantity-fish', pond.numberOfFish);
            setElementText('.value-desc', pond.description);
            setElementText('.value-skimmer', pond.skimmer);

            renderFishInPond(pond.fish, pond.numberOfFish);

            idPond = pond.pondId;
            name = pond.pondName;
        } else {
            window.location.href = '/pond.html';
        }

    } catch (error) {
        window.location.href = '/pond.html';

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
            // callToast(true, message);
            sessionStorage.setItem('toastData', JSON.stringify({ resultDelete: true, messageDelete: message }));
            window.location.href = 'pond.html';
        } else {
            callToast(false, message);
        }

    } catch (error) {
        console.error('Error deleting pond:', error);
    }
}

function setElementText(selector, value) {
    document.querySelector(selector).innerText = value;
}

function setElementSrc(selector, value) {
    document.querySelector(selector).src = value;
}

function renderFishInPond(listFish, numberOfFish) {
    if (numberOfFish > 5) {
        const htmlFishInPondMap = listFish.map(function (f) {
            return `
              <div class="container__news-item swiper-slide">
                        <a href="fishinfor.html?id=${f.fishId}" class="container__news-item-desc">
                            <img src="${f.fishImage}"
                                alt="">
                            <div class="container__news-item-cap">
                                <div class="news-item-cap-detail">
                                    <span>
                                        ${f.fishName}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
        `
        }).join('');
        document.querySelector('.container__list-fish').innerHTML = htmlFishInPondMap;
        var swiperNews = new Swiper(".container__news", {
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 5500,
                disableOnineraction: false,
            },
            navigation: {
                nextEl: ".f_owl-next",
                prevEl: ".f_owl-prev",
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                450: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },

            },
        });
    } else {
        const containerListArrow = document.querySelector('.container-list-arrow');

        const containerListFishHTML = `
         <div class=" container-list-fish ">
            <div class="row">
                ${listFish.map(function (f) {
            return `
                        <a href="fishinfor.html?id=${f.fishId}" class="fish-item col-md-4 col-sm-6 mb-4">
                            <div class="fish-item-img">
                                <img src="${f.fishImage}" alt="">
                                <div class="fish-item-desc">
                                    <p> ${f.fishName}</p>
                                </div>
                            </div> 
                        </a> 
                    `
        }).join('')
            }
            </div>
         </div>
        `;
        containerListArrow.innerHTML = containerListFishHTML;
    }


}


function conFirmDeletePond() {
    try {
        const btnDelete = document.querySelector('.delete-btn-pond');
        btnDelete.addEventListener('click', (e) => {
            e.preventDefault();

            if (idPond || name) {
                createDeleteModal(name, async () => {
                    await deletePond(idPond);
                });
            }
        })
    } catch (error) {

    }
}

async function updateInforPond(payload) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/pond/updateinfor`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Thêm token vào header nếu cần
            },
            body: JSON.stringify(payload), // Gửi payload dưới dạng JSON
        });
        const result = await response.json();
        message = result.message;
        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        return false;

    }
}

function showPondUpdateForm(pond) {
    const pondUpdateFormHTML = `
        <div class="container__infor__pond">
        <div class="infor__pond-detail">
            <div class="row row-pond-detail">
                <div class="col-md-4" style="padding: 0;">
                    <div class="img-edit-submit">
                        <div class="pond-img-info-edit">
                            <img id="imagePreview" src="${pond.pondImage}" alt="" > 
                        </div>
                        <div class="pond-edit-img-detail">
                             <form id="form__update_img-pond" class="form-edit-img-pond" method="post" enctype="multipart/form-data">
                                    <input type="hidden" name="PondId" value="${pond.pondId}">
                                    <input id="imageInput" name="ImagePond" type="file" accept="image/*" >
                                    <button type="submit">Submit</button>
                             </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-8 edit-info">
                    <div class="text-right">
                        <button
                            class="btn-close-pond"><i class="fa-solid fa-xmark close-navbar-icon-btn-pond"></i>
                        </button>
                    </div>
                    <h2>Edit Pond</h2>
                    <form action="#" method="POST" id="form__update-pond">
                        <div class="row row-edit-info-detail">
                            <input type="hidden" name="pondId" value="${pond.pondId}">
                            <div class="col-md-6 edit-item-detail">
                                <span>Pond Name</span>
                                <input type="text" class="pond-name" name="PondName" placeholder="Enter your pond name" value="${pond.pondName}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Depth (m)</span>
                                <input type="number" class="pond-depth" name="Depth" step="0.1" placeholder="Enter depth in meters" value="${pond.depth}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Volume (l)</span>
                                <input type="number" class="pond-volume" name="Volume" step="0.1" min="0.1" placeholder="Enter volume in liters" value="${pond.volume}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Drain Count</span>
                                <input type="number" class="drain-count" name="DrainCount" min="1" placeholder="Enter number of drains" value="${pond.drainCount}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Pump Power (l/h)</span>
                                <input type="number" step="0.1" class="pump-power" name="PumpPower" min="1" placeholder="Enter pump power in liters per hour" value="${pond.pumpPower}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Description</span>
                                <input type="text" class="pond-description" name="Description" placeholder="Enter pond description" value="${pond.description}" required>
                            </div>
                            <div class="col-md-6 edit-item-detail">
                                <span>Skimmer</span>
                                <input type="number" class="skimmer" name="Skimmer" min="0" placeholder="Enter skimmer quantity" value="${pond.skimmer}" required>
                            </div>
                        </div>
                        <div class="text-center">
                            <button class="edit-btn" style="margin-top: 10px; ">
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
    const targetElement = document.getElementById('pondFormUpdate');
    targetElement.innerHTML = pondUpdateFormHTML;
    const btnClose = document.querySelector('.btn-close-pond');
    const modalElement = document.querySelector('.container__infor__pond');
    const miniTab = document.querySelector('.infor__pond-detail');
    changeImgShow();
    const closeModal = () => {
        modalElement.remove();
    };

    document.getElementById('form__update-pond').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const form = document.getElementById('form__update-pond');
        const formData = new FormData(form);
        const payload = {
            pondId: parseInt(formData.get('pondId')), // Chuyển sang số nguyên nếu cần
            pondName: formData.get('PondName'),
            description: formData.get('Description'),
            volume: parseFloat(formData.get('Volume')), // Chuyển sang số thực
            depth: parseFloat(formData.get('Depth')),
            pumpPower: parseFloat(formData.get('PumpPower')),
            drainCount: parseInt(formData.get('DrainCount')),
            skimmer: parseInt(formData.get('Skimmer')),
        };
        const result = await updateInforPond(payload);
        callToast(result, message);

        isSubmitting = false;
        closeModal();
        fetchPondInfor(); 
    });

    document.getElementById('form__update_img-pond').addEventListener('submit',async function(event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;
        loading(); 

        const form = document.getElementById('form__update_img-pond');
        const formData = new FormData(form);
        try {
            const result = await updateImgPond(formData);
            callToast(result, message);
            
        } catch (error) {
            callToast(false, 'Failed to update fish pond.');
            
        }finally{
            isSubmitting = false; 
            removeLoading();
            closeModal();
            fetchPondInfor();
        }

    })

    btnClose.addEventListener('click', closeModal);
    modalElement.addEventListener('click', closeModal);
    miniTab.addEventListener('click', (e) => {
        e.stopPropagation();
    })

}

async function updateImgPond(formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/pond/updateimg`, {
            method: 'PUT',
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


const btnOpenFormUpdate = document.querySelector('.edit-btn-out');
btnOpenFormUpdate.addEventListener('click', function () {
    showPondUpdateForm(pondDetailIndor);
});


conFirmDeletePond();
fetchPondInfor();


