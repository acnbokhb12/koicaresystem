import API_URL from './config.js'
import { createDeleteModal } from './confirm.js';
import { callToast } from './confirm.js';
import { changeImgShow } from './utils.js';
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';
import DOMAIN_URL from './domain.js';

// import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js';




let message = null;
let fishInformation = null;
let name = null;
let idFishInfor = null;
let listMyPond = null;
let isSubmitting = false;
let chartLen, chartWei;
// const loadingOverlay = document.getElementById('loading-overlay');
// console.log(loadingOverlay);

async function fetchFishInfor(id) {
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/fish/myfish/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        if (!response.ok) {
            window.location.href = `${DOMAIN_URL}/fish.html`;

        }
        const fish = await response.json();
        return fish;
    } catch (error) {
        window.location.href = `${DOMAIN_URL}/fish.html`;
    }
}


function conFirmDeleteFish() {
    try {
        const btnDelete = document.querySelector('.btn__delete-fish-detail');
        btnDelete.addEventListener('click', (e) => {
            e.preventDefault();
            if (idFishInfor || name) {
                createDeleteModal(name, async () => {
                    await deleteFish(idFishInfor);
                });
            }
        })
    } catch (error) {

    }
}

async function fetchMyPond() {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/pond/mypond`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);

    }
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
            sessionStorage.setItem('toastData', JSON.stringify({ resultDelete: true, messageDelete: message }));
            window.location.href = `${DOMAIN_URL}/fish.html`; 
        } else {
            callToast(false, message);
        }

    } catch (error) {
        console.error('Error deleting fish:', error);
    }
}

async function renderFishInfor(fish) {
    try {
        const htmlFishImgDetail = `
        <img class="fish__img-infor"
          src="${fish.fishImage}"
          alt="Koi fish"  />
    `;
        document.querySelector('.fish-img-info').innerHTML = htmlFishImgDetail;

        const htmlFishInfor = `
        <div class="info-item">
            <span class="label label-witdh">Fish Name:</span>
            <span class="value span-witdh name-value-fish"> ${fish.fishName}</span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Body Shape:</span>
            <span class="value span-witdh value-bodyshape">${fish.bodyShape}</span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Age:</span>
            <span class="value span-witdh">
              <span class="value-age">${fish.age}</span>
              <span class="sub_span-highlight">(Years)</span> </span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Length:</span>
            <span class="value span-witdh">
              <span class="value-length">${fish.length}</span>
              <span class="sub_span-highlight">(Cm)</span>
            </span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Weight:</span>
            <span class="value span-witdh">
              <span class="value-weight">${fish.weight}</span>
              <span class="sub_span-highlight">(Kg)</span> </span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Gender:</span>
            <span class="value span-witdh value-gender">${fish.gender}</span>
          </div>
          <div class="info-item">
            <span class="label label-witdh">Description:</span>
            <span class="value span-witdh value-desc">${fish.descriptionKoi}</span>
          </div>
    `;
        document.querySelector('.container__infor-fish-detail').innerHTML = htmlFishInfor;
        const htmlPondOfFish = `
            <div class="pond-item" style="display: block;">
                <div class="tilte-fish-growth  ">
                    <h1>The pond of this fish</h1>
                    <div class="text-right">
                        <a href="" class="back-btn grow__detail-btn viewpondfish">View Pond Detail</a>
                    </div>
                </div>
                <div class="pond-item-img mt-4">
                    <div class="pond-item-desc">
                        <p class="name_pond-fish">
                            This fish has not been assigned to a pond yet.
                        </p>
                    </div>
                    <div class="contain__pond-fish">
                        <img class="img_pond-fish" src="https://animals.sandiegozoo.org/sites/default/files/2016-11/Koi.jpg"
                            alt="Pond" />
                    </div>
                </div> 
            </div>
        `;
        document.querySelector('.container-pond-fish').innerHTML = htmlPondOfFish;
        if (fish.pondId !== null) {
            document.querySelector('.img_pond-fish').src = fish.pond.pondImage;
            document.querySelector('.name_pond-fish').innerText = fish.pond.pondName;
            document.querySelector('.viewpondfish').href = `${DOMAIN_URL}/pondinfor.html?id=${fish.pondId}`;

        } else {
            document.querySelector('.img_pond-fish').src = 'https://img.freepik.com/premium-photo/question-mark-wooden-cube-grey-background-faq-concept-ask-questions-find-answers-online-customer-support_29488-10170.jpg';
            document.querySelector('.viewpondfish').style.display = 'none';

        }


    } catch (error) {

    }

}

async function renderFishDevelopment(fishDevelop) {
    const lengths = fishDevelop.map(dev => dev.updateLength);
    const weights = fishDevelop.map(dev => dev.updateWeight);
    const days = fishDevelop.map(dev => dev.updateDate);
    console.log(weights)
    
    const htmlLength = `
    <div id="koiGrowthChart_length" style="width: 100%; height: 400px;"></div>
    `;
    document.getElementById('contain_length').innerHTML = htmlLength;
    chartLen = echarts.init(document.getElementById('koiGrowthChart_length'));
    const optionLen = {
        title: {
            text: 'Length of Fish',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: days,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
                rotate: 45,
                fontSize: 12,
                fontWeight: 'bold',
                margin: 20
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: lengths
          }
        ]
    };
    chartLen.setOption(optionLen);

    const htmlWeight = `
        <div id="koiGrowthChart_weight" style="width: 100%; height: 400px;"></div>
    `;
    document.getElementById('contain-weight').innerHTML = htmlWeight;
     chartWei = echarts.init(document.getElementById('koiGrowthChart_weight'));
    const optionWei = {
        title: {
          text: 'Weight of fish',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: days,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
                rotate: 45,
                fontSize: 12,
                fontWeight: 'bold',
                margin: 20
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} Gram'
            }
          }
        ],
        series: [
          {
            name: 'Gram',
            type: 'bar',
            barWidth: '60%',
            data: weights,
            itemStyle: {
              color: function (param) {
                return '#d29763';
              }
            }
          }
        ]
    };
    chartWei.setOption(optionWei); 

    window.onload = function () {
        // Đảm bảo resize cho cả hai biểu đồ
        window.addEventListener('resize', function () {
            chartLen.resize();  // Resize biểu đồ chiều dài
            chartWei.resize();  // Resize biểu đồ trọng lượng
        });
    };
    
}
// fetchFishInfor()

async function fetchAndRenderFish() {
    const urlParams = new URLSearchParams(window.location.search);
    const fId = urlParams.get('id');
    if (!fId) {
        // Không có ID trong URL
        window.location.href = `${DOMAIN_URL}/fish.html`;  
        return;
    }
    const fish = await fetchFishInfor(fId);
    name = fish.fishName;
    idFishInfor = fish.fishId;
    const ponds = await fetchMyPond();
    listMyPond = ponds;
    fishInformation = fish;
    renderFishInfor(fish);
    renderFishDevelopment(fish.fishDevelopments);
}

async function updateInformationFish(payload) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/fish/updateinfor`, {
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

function renderFishInforUpdateTable(fish, ponds) {
    const htmlFishTableUpdate = `
         <div class="container__infor__fish">
    <div class="infor__fish-detail">
        <div class="row row-fish-detail">
            <div class="col-md-4" style="padding: 0">
                <div class="img-edit-submit">
                    <div class="fish-img-info-edit m-auto">
                        <img id="imagePreview" src="${fish.fishImage}" alt="" style="height: 250px; object-fit: unset;" />
                    </div>
                    <div class="fish-edit-img-detail">
                        <form id="update__img-fish-infor" class="form-edit-img-fish" enctype="multipart/form-data" method="post">
                            <input type="hidden" name="fishID" value="${fish.fishId}" />
                            <input id="imageInput" name="ImgFish" type="file" accept="image/*" required>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div> 
            <div class="col-md-8 edit-info">
                <div class="text-right">
                    <button class="btn-close-fish">
                        <i class="fa-solid fa-xmark close-navbar-icon-btn-fish"></i>
                    </button>
                </div>
                <h2>Edit Information Fish</h2> 
                <form id="update__infor-fish" method="POST">
                    <div class="row row-edit-info-detail">
                        <input type="hidden" name="fishID" value="${fish.fishId}" />

                        <div class="col-md-6 edit-item-detail">
                            <span>Fish Name </span>
                            <input type="text" name="FishName" value="${fish.fishName}" placeholder="Enter fish name" required />
                        </div>

                        <div class="col-md-6 edit-item-detail">
                            <span>Body Shape</span>
                            <select name="BodyShape" style="width: 100%; padding: 4px;">  
                                <option value="Slim" ${fish.bodyShape == "Slim" ? 'selected' : ''} >Slim</option>
                                <option value="Fat" ${fish.bodyShape == "Fat" ? 'selected' : ''}>Fat</option>
                                <option value="Long" ${fish.bodyShape == "Long" ? 'selected' : ''}>Long</option>
                                <option value="Short" ${fish.bodyShape == "Short" ? 'selected' : ''}>Short</option>
                                <option value="Large" ${fish.bodyShape == "Large" ? 'selected' : ''}>Large</option>
                                <option value="Small" ${fish.bodyShape == "Small" ? 'selected' : ''}>Small</option>
                            </select>
                        </div> 
                        <div class="col-md-6 edit-item-detail">
                            <span>Age <span class="text-danger">(years)</span></span>
                            <input type="number" name="Age"  value="${fish.age}" step="0.1" placeholder="Enter age" required min="0.1" />
                        </div>  
                        <div class="col-md-6 edit-item-detail">
                            <span style="display: block;">Gender </span>
                            <select name="Gender" style="width: 100%; padding:0.4rem; " required>
                                <option value="Male" ${fish.gender == "Male" ? 'selected' : ''} >Male</option>
                                <option value="Female" ${fish.gender == "Female" ? 'selected' : ''}>Female</option>
                            </select>
                        </div> 
                        <div class="col-md-6 edit-item-detail">
                                <span>Description </span>
                                <input type="text" name="DescriptionKoi" value="${fish.descriptionKoi}" placeholder="Enter description" required />
                        </div>
                        <div class="col-md-6 edit-item-detail">
                            <span>Pond</span>
                            <select name="PondId" style="width: 100%; padding: 4px; border: 1px solid #000;">
                                <option value="">Unassigned</option>
                                ${ponds.map(function (p) {
        return `
                                        <option value="${p.pondId}" ${fish.pondId === p.pondId ? 'selected' : ''
            }   
                                        >${p.pondName}</option> 
                                    `
    })}      
                            </select>
                        </div>
                        <input type="hidden" value="${fish.fishId}" name="FishId">
                    </div> 
                    <div class="text-center">
                        <button type="submit" class="edit-btn blue-btn" style="margin-top: 10px">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
    `;
    document.getElementById('table__update-infor-fish').innerHTML = htmlFishTableUpdate;
    const modalElement = document.querySelector('.container__infor__fish');
    const btnClose = document.querySelector('.btn-close-fish');
    const miniTable = document.querySelector('.infor__fish-detail');
    changeImgShow();
    const closeModal = () => {
        modalElement.remove();
    };

    document.getElementById('update__infor-fish').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true; 
        const form = document.getElementById('update__infor-fish');
        const formData = new FormData(form);
        const payload = {
            fishId: parseInt(formData.get('fishID')), // Chuyển sang số nguyên nếu cần
            pondId: parseInt(formData.get('PondId')),
            fishName: formData.get('FishName'),
            bodyShape: formData.get('BodyShape'), // Chuyển sang số thực
            age: parseInt(formData.get('Age')),
            gender: formData.get('Gender'),
            descriptionKoi: formData.get('DescriptionKoi'),
        };
        const result = await updateInformationFish(payload);
        callToast(result, message);
        isSubmitting = false;
        closeModal();
        fetchAndRenderFish();
        
    });
    document.getElementById('update__img-fish-infor').addEventListener('submit', async function(event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;  
        
        loading();

        const form = document.getElementById('update__img-fish-infor');
        const formData = new FormData(form);
        
        try {
            const result = await updateImgFish(formData);
            callToast(result, message);
        } catch (error) {
            console.error('Error updating fish image:', error);
            callToast(false, 'Failed to update fish image.');
        } finally {
            isSubmitting = false;
            removeLoading();
            closeModal();
            fetchAndRenderFish(); // Cập nhật giao diện
        }
    });
    
    btnClose.addEventListener('click', closeModal);
    modalElement.addEventListener('click', closeModal);
    miniTable.addEventListener('click', (e) => {
        e.stopPropagation();
    }) ;
}

async function updateImgFish(formData) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/fish/updateimgfish`, {
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

const btnOpenFormUpdateFish = document.querySelector('.btn--editfish');
btnOpenFormUpdateFish.addEventListener('click', function () {
    renderFishInforUpdateTable(fishInformation, listMyPond);
});

fetchAndRenderFish();
conFirmDeleteFish();

window.onload = function () {
    // Đảm bảo resize cho cả hai biểu đồ
    window.addEventListener('resize', function () {
        if (chartLen) {
            chartLen.resize();  // Resize biểu đồ chiều dài
        }
        if (chartWei) {
            chartWei.resize();  // Resize biểu đồ trọng lượng
        }
    });
};