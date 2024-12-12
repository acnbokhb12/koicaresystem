import API_URL from './config.js'

let currentPage = 1;
const newsPerPage = 6;
let totalPages = 0;


async function fetchTrendingNews() {
    try {
        const response = await fetch(`${API_URL}/news/trendingnews`);
        const newsList = await response.json();
        return newsList;
    } catch (error) {
        console.error('Error fetching products:', error);
    }

}

function renderTrendingNews(news) {
    const trendingTop = news[0];
    const trendingBottom = news.slice(1, 5);
    const tredingRight = news.slice(5);

    document.querySelector('.trending-top-img img').src = trendingTop.newsImage;
    document.querySelector('.trending-top-img').href = `newsDetail.html?id=${trendingTop.newsId}`;
    document.querySelector('.trending-top-cap span').innerText = trendingTop.newsCategory.name;
    document.querySelector('.trending-top-cap h2').innerText = trendingTop.title;

    const trendingBottomHtml = trendingBottom.map(function (n) {
        return `
            <div class="col-sm-6 col-lg-3">
                                        <a href="newsDetail.html?id=${n.newsId}" class="trending-bottom-single">
                                            <div class="trending-bottom-img">
                                                <img src="${n.newsImage}" alt="">
                                            </div>
                                            <div class="trending-bottom-cap">
                                                <span>
                                                    ${n.newsCategory.name}
                                                </span>
                                                <h4>
                                                    ${n.title}
                                                </h4>
                                            </div>
                                            
                                        </a>
                                    </div>
        `
    });
    var htmlJoinTrendingBottom = trendingBottomHtml.join('');
    document.querySelector('.row-trending-bottom').innerHTML = htmlJoinTrendingBottom;

    const trendingRightHtml = tredingRight.map(nr => `
           <a href="newsDetail.html?id=${nr.newsId}" class="trend-right-single d-flex">
                                <div class="tren-right-img">
                                    <img src="${nr.newsImage}" alt="">
                                </div>
                                <div class="trend-rigth-cap">
                                    <span>
                                        ${nr.newsCategory.name}
                                    </span>
                                    <h4>
                                        ${nr.title}
                                    </h4>
                                </div>
                            </a>
        `).join('');
    document.querySelector('.col-trending-right').innerHTML = trendingRightHtml;


}

async function fetchAndRenderTrendingNews() {
    const news = await fetchTrendingNews();
    if (news) {
        renderTrendingNews(news);
    }
}

async function fetchNewsByCateID(id) {
    try{
        const response = await fetch(`${API_URL}/news/newscate?cateId=${id}`);
        const newsList = await response.json();
        return newsList;
    }catch(error){
        console.error('Error fetching products:', error);
    }
}

function renderNewsCateV1(news){
    const newsCateV1html = news.map(function(n){
        var date = new Date(n.newsDate);
        var formattedDate = date.toISOString().split('T')[0] + ' / ' + date.toISOString().split('T')[1].slice(0, 5);
        
        return `
        <div class="container__news-item swiper-slide">
                                    <a href="newsDetail.html?id=${n.newsId}" class="container__news-item-desc">
                                        <img src="${n.newsImage}" alt="">
                                        <div class="container__news-item-cap">
                                            <div class="news-item-cap-detail">
                                                <span>
                                                   ${n.newsCategory.name}
                                                </span>
                                                <p>
                                                    ${formattedDate}
                                                </p>
                                            </div>
                                            <h4>  ${n.title}  
                                            </h4>
                                        </div>
                                    </a>
                                </div>
        `}).join('');
        document.querySelector('.container__news_catevone').innerHTML = newsCateV1html;


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
}
function renderNewsCateV2(news){
    const newsCateV1html = news.map(function(n){
        var date = new Date(n.newsDate);
        var formattedDate = date.toISOString().split('T')[0] + ' / ' + date.toISOString().split('T')[1].slice(0, 5);
        
        return `
        <div class="container__news-item swiper-slide">
                                    <a href="newsDetail.html?id=${n.newsId}" class="container__news-item-desc">
                                        <img src="${n.newsImage}" alt="">
                                        <div class="container__news-item-cap">
                                            <div class="news-item-cap-detail">
                                                <span>
                                                   ${n.newsCategory.name}
                                                </span>
                                                <p>
                                                    ${formattedDate}
                                                </p>
                                            </div>
                                            <h4>  ${n.title}  
                                            </h4>
                                        </div>
                                    </a>
                                </div>
        `}).join('');
        document.querySelector('.container__news_catevtwo').innerHTML = newsCateV1html;
 
        var swiperNewsv2 = new Swiper(".container__news", {
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
}

async function fetchAndRenderNewsCate() {
    let cateIdOne = 1;
    let cateIdTwo = 4;
    const newsCateOne =  await fetchNewsByCateID(cateIdOne);
    const newsCateTwo =  await fetchNewsByCateID(cateIdTwo);

    if(newsCateOne){
        renderNewsCateV1(newsCateOne);
    }
    if(newsCateTwo){
        renderNewsCateV2(newsCateTwo);
    }
}

async function fetchNewsPaging(page) {
    try{
        const response = await fetch(`${API_URL}/news/newspaging?page=${page}`);
        const news = await response.json();
        return news;
    }catch(error){
        console.error('Error fetching products:', error);
    } 
}

function renderNewsPaging(news){
    const htmlNewsPagingMap = news.map(function (n){
        var date = new Date(n.newsDate);
        var formattedDate = date.toISOString().split('T')[0] + ' / ' + date.toISOString().split('T')[1].slice(0, 5);
        
        return `
         <div class="col-lg-6 col-newspaging">
                                <a href="newsDetail.html?id=${n.newsId}" class="item__news__link position-relative">
                                    <img class="img-fluid w-100" src="${n.newsImage}" alt="">
                                    <div class="news-item-continuous bg-white border border-top-0 ">
                                        <div class="item-continuous-cate-date contain-cate-date">
                                            <span class="span__for-cate">
                                                ${n.newsCategory.name}
                                            </span>
                                            <span class="span__for-date">
                                                ${formattedDate}
                                            </span>

                                        </div>
                                        <h2 class="item-continuous-title">
                                        ${n.title}
                                        </h2>
                                         
                                    </div>
                                </a> 
                            </div>
        `
    }).join('');
    document.querySelector('.col-newspaging').innerHTML = htmlNewsPagingMap;
} 

async function fetchAndRenderNews(page) {
    const news = await fetchNewsPaging(page);
    if(news){
        renderNewsPaging(news);
    }
}
  
fetch(`${API_URL}/news/countallnews`)
    .then(res => res.json())
    .then(data => {
        totalPages = Math.ceil(data.totalProduct / newsPerPage);
        fetchAndRenderNews(currentPage); // Gọi hàm hiển thị tin tức cho trang đầu tiên
        renderPagination(totalPages); // Hiển thị phân trang
    })
    .catch(error => {
        console.error('Error fetching total news count:', error);
    });



function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination-list');
    let html = '';
    
    // Nút Previous
    if (currentPage > 1) {
    html += `
        <li class="page-item">
            <a id="prevPage" class="page-link" href="#"><i class="fa-solid fa-chevron-left"></i></a>
        </li>
    `;
    }
    // Hiển thị trang đầu tiên
    if (currentPage > 3) {
        html += `
            <li class="page-item">
                <a class="page-link" href="#">1</a>
            </li>
        `;
        if (currentPage > 4) {
            html += `<li class="page-item"><p class="mb-0 page-link page__dot-dot"><i class="fa-solid fa-ellipsis"></i></p></li>`;
        }
    } 
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item">
                <a class="page-link ${i === currentPage ? 'active' : ''}" href="#">${i}</a>
            </li>
        `;
    }

    // Hiển thị trang cuối cùng
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            html += `<li class="page-item"><p class="mb-0 page-link page__dot-dot"><i class="fa-solid fa-ellipsis"></i></p></li>`;
        }
        html += `
            <li class="page-item">
                <a class="page-link" href="#">${totalPages}</a>
            </li>
        `;
    }

    // Nút Next
    if (currentPage < totalPages) { 
    html += `
        <li class="page-item">
            <a id="nextPage" class="page-link" href="#"><i class="fa-solid fa-chevron-right"></i></a>
        </li>
    `;
    }    
    paginationContainer.innerHTML = html;

    // Gán sự kiện click cho các nút
    addPaginationEvents();
}

function addPaginationEvents() {
    const pageLinks = document.querySelectorAll('.pagination-list .page-link');
    
    pageLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.classList.contains('page__dot-dot') || link.classList.contains('disabled')) {
                e.preventDefault(); // Ngăn chặn hành động mặc định
                return; // Không làm gì thêm
            }


            if (link.id === 'prevPage') {
                if (currentPage > 1) currentPage--;
            } else if (link.id === 'nextPage') {
                if (currentPage < totalPages) currentPage++;
            } else {
                currentPage = parseInt(link.innerText.trim(), 10);
            } 

            fetchAndRenderNews(currentPage);

            // Cập nhật giao diện phân trang
            renderPagination(totalPages);
        });
    });
} 


fetchAndRenderTrendingNews();
fetchAndRenderNewsCate();