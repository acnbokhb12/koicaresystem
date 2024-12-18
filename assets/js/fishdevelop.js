import API_URL from './config.js';
import DOMAIN_URL from './domain.js';

let chartLen, chartWei;
let fishID = null;
let fishEntity = null;

async function fetchLatestDevelop(id) {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/fishdevelop/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        if (!response.ok) {
            window.location.href = `${DOMAIN_URL}/fish.html`; 
        }
        return await response.json(); 
    } catch (error) {
        window.location.href = `${DOMAIN_URL}/fish.html`;
    }
}

async function fetchInformationFish(id) {
  const token = sessionStorage.getItem('authToken');
  try {
    const response = await fetch(`${API_URL}/fish/getfishdevelop?id=${id}`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`, // Gửi token qua header
      }
  });
  if (!response.ok) {
    window.location.href = `${DOMAIN_URL}/fish.html`; 
  }
  return await response.json(); 
  } catch (error) {
    window.location.href = `${DOMAIN_URL}/fish.html`; 
  }
}

function renderDevelopLatest(fishDevelop){
    const lengthD = fishDevelop.map(dev => dev.updateLength);
    const weghtD = fishDevelop.map(dev => dev.updateWeight);
    const date = fishDevelop.map(dev => dev.updateDate);
    renderDevelopLength(lengthD, date);
    renderDevelopWeight(weghtD, date);
}

function renderDevelopLength(lengthD, date){
    const htmlLength = `
        <div class="col-md-9 item_grow_fish">
            <div id="koiGrowthChart_length" style="width: 100%; height: 500px;"></div>
          </div>
          <div class="col-md-3 item_grow_fish-detail">
            <h2>Search statistics </h2>
            <form action="" id="date_growth-length">
              <div class="form-date-input-growth">
                <label class="lable_form-date" for="">From Date:</label>
                <input id="input_date_length_from" class="input_form-date lastweek_growth-input" type="date" name=""
                  id="">
              </div>
              <div class="form-date-input-growth">
                <label class="lable_form-date" for="">To Date:</label>
                <input id="input_date_length_to" class="input_form-date today_growth-input" type="date" >
              </div>
              <button class="btn-submit-search-date" type="submit">Search</button>
            </form>
          </div>
    `;
    document.querySelector('.row__length').innerHTML = htmlLength;
    chartLen = echarts.init(document.getElementById('koiGrowthChart_length'));
     if(chartLen){
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
                data: date,
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
                data: lengthD
              }
            ]
        };
        chartLen.setOption(optionLen);
     }
     document.getElementById('date_growth-length').addEventListener('submit', (e) => {
        e.preventDefault();
        const fromDate = new Date(document.getElementById('input_date_length_from').value);
        const toDate = new Date(document.getElementById('input_date_length_to').value);
    
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          alert('Please Choose From Date and To Date.');
          return;
        }
        if (fromDate > toDate) {
          alert('From Date can not larger than To Date');
          return;
        }
        const timeDifference = toDate.getTime() - fromDate.getTime();
        const dayDifference = timeDifference / (1000 * 3600 * 24);
    
        console.log(dayDifference)
        if (dayDifference < 1) {
          alert('The gap between From Date and To Date must be at least 1 day.');
        } else if (dayDifference > 12) {
          alert('The gap between From Date and To Date cannot be more than 12 days.');
        } else {
          e.target.submit();
        }
      });
}

function renderDevelopWeight(weghtD, date){
    const htmlWeight = `
    <div class="col-md-9 item_grow_fish">
            <div id="koiGrowthChart_weight" style="width: 100%; height: 500px;"></div>
          </div>
          <div class="col-md-3 item_grow_fish-detail">
            <h2>Search statistics </h2>
            <form action="#" id="date_growth-weight">
              <div class="form-date-input-growth">
                <label class="lable_form-date" for="">From Date:</label>
                <input id="input_date_weight_from" class="input_form-date lastweek_growth-input" type="date" name=""
                  id="">
              </div>
              <div class="form-date-input-growth">
                <label class="lable_form-date" for="">To Date:</label>
                <input id="input_date_weight_to" class="input_form-date today_growth-input" type="date" name="" id="">
              </div>
              <button class="btn-submit-search-date" type="submit">Search</button>
            </form>
          </div>
    `;
    document.querySelector('.row__weight').innerHTML = htmlWeight;
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
            data: date,
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
            data: weghtD,
            itemStyle: {
              color: function (param) {
                return '#d29763';
              }
            }
          }
        ]
    };
    chartWei.setOption(optionWei); 

    document.getElementById('date_growth-weight').addEventListener('submit', (e) => {
        e.preventDefault();
        const fromDate = new Date(document.getElementById('input_date_weight_from').value);
        const toDate = new Date(document.getElementById('input_date_weight_to').value);
    
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          alert('Please Choose From Date and To Date.');
          return;
        }
        if (fromDate > toDate) {
          alert('From Date can not larger than To Date');
          return;
        }
        const timeDifference = toDate.getTime() - fromDate.getTime();
        const dayDifference = timeDifference / (1000 * 3600 * 24);
    
        console.log(dayDifference)
        if (dayDifference < 1) {
          alert('The gap between From Date and To Date must be at least 1 day.');
        } else if (dayDifference > 12) {
          alert('The gap between From Date and To Date cannot be more than 12 days.');
        } else {
          e.target.submit();
        }
      });
}


async function fetchAndRender(){
    const urlParams = new URLSearchParams(window.location.search);
    const fId = urlParams.get('id');
    if (!fId) { 
        window.location.href = `${DOMAIN_URL}/fish.html`;  
        return;
    }
    fishID = fId;
    document.querySelector('.back-btn').href = `fishinfor.html?id=${fId}`;
    const develop = await fetchLatestDevelop(fId);
    fishEntity = await fetchInformationFish(fId); 
    if(develop){
        renderDevelopLatest(develop);
    }
    
}
fetchAndRender();

function renderTableAddDevelelop(fishEntity){
    const htmlTable = `
     <div class="container__infor__fish" >
    <div class="infor__fish-detail minitab__fish-develop">
      <div class="row row-fish-detail">
        <div class="col-md-4  " style="padding: 0">
          <div class="img-edit-submit img-edit-submit-vst">
            <div class="fish-img-info-edit">
              <img
                src="${fishEntity.fishImage}"
                alt="Koi Pond">
            </div>
            <div>
              <h3>${fishEntity.fishName}</h3>
            </div>
            <div>
              <p class="mb-0 text-title-deve ">Length: <span class="text-value-deve">${fishEntity.length}</span> <span class="text-danger">(Cm)</span> </p>
               <p class="mb-0 text-title-deve">Weight: <span class="text-value-deve">${fishEntity.weight}</span> <span class="text-danger">(kg)</span> </p>
            </div>
          </div>
        </div>
        <div class="col-md-8 edit-info">
          <div class="text-right">
            <button class="btn-close-fish">
              <i class="fa-solid fa-xmark close-navbar-icon-btn-fish"></i>
            </button>
          </div>
          <h2>New Development</h2>
          <form action="" id="fomr_fill-news">
            <div class="row row-edit-info-detail m-0">
              <div class="col-12 edit-item-detail">
                <span>Weight(Gram) </span>
                <input type="number" value="" placeholder="Enter age" required />
              </div>
              <div class="col-12 edit-item-detail">
                <span>Length (cm) </span>
                <input type="number" step="0.1" value="" placeholder="Enter length in cm" required />
              </div>
              <div class="col-12 edit-item-detail">
                <span>Date </span>
                <input type="date" step="0.1" value="" placeholder="Enter length in cm" required />
              </div>
            </div>
            <div class="text-center">
              <button class="edit-btn blue-btn" type="submit" style="margin-top: 10px">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', htmlTable); 
    const tableAdd = document.querySelector(".container__infor__fish");
    const closeModal = () => {
        tableAdd.remove();
    };
    const btnClose = document.querySelector(".btn-close-fish");
    const minitab = document.querySelector('.minitab__fish-develop');
    btnClose.addEventListener('click', closeModal);
    tableAdd.addEventListener('click', closeModal);
    minitab.addEventListener('click', (e)=>{
      e.stopPropagation();
    });
}

document.querySelector('.btn__add-develop').addEventListener('click',()=>{
  renderTableAddDevelelop(fishEntity);
});

// btn__contain-develop

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