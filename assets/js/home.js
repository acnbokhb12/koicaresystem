import API_URL from './config.js'

let quantity = 8;
fetch(`${API_URL}/news/latestnews?quantity=${quantity}`,{
    method: 'GET',
    credentials: 'include',
})
    .then(function(res){
        return res.json();
    })
    .then(function(posts){
        var htmlMapNews = posts.map(function(n){
            var formattedDate = new Date(n.newsDate).toLocaleDateString('en-CA');
            return `
                <div class="swiper-slide news-card-item">
                            <a href="#" class="news-card-link">
                                <img src="${n.newsImage}"
                                    alt="" class="news-card-img">
                                <div class="news-card-more-info mr-0">
                                    <h3><i class="fa-solid fa-calendar-days"></i> ${formattedDate}</h3>
                                </div>
                                <div class="news-card-desc">
                                    <h2 class="news-card-title text-capitalize text-center">
                                        ${n.title}
                                    </h2>
                                    <p class="news-card-subtitle text-uppercase text-center">
                                        ${n.newsCategory.name}
                                    </p>
                                </div>
                            </a>
                        </div>
            `
        });
        var htmlNewsLatest = htmlMapNews.join('');
        document.querySelector('.news-card-list').innerHTML = htmlNewsLatest;
        var swiper = new Swiper(".latest__news-card-wrapper", {
            spaceBetween: 20,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 5500,
                disableOnineraction: false,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
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
    });

fetch(`${API_URL}/product/newproduct`)
    .then(function(res){
        return res.json();
    })
    .then(function(posts){
        var htmlMapNewProduct = posts.map(function(f){
            return `
            <div class="intro__service-item swiper-slide ">
                                <div class="intro__service-header-img">
                                    <img src="${f.image}"
                                        alt="">
                                </div>
                                <div class="intro__service-body-script">
                                    <h4>
                                        ${f.name}
                                    </h4>
                                    <p>
                                        ${f.description}
                                    </p>
                                </div>
                                <div class="intro__service-footer-link">
                                    <a href="productDetail.html?id=${f.productId}">View More</a>
                                </div>
                            </div>
            `
        });
        var htmlNewProducts = htmlMapNewProduct.join('');
        document.querySelector('.intro__service-list-cart').innerHTML = htmlNewProducts
        var swiper2 = new Swiper(".intro__service-container-cart", {
            spaceBetween: 20,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 5500,
                disableOnineraction: false,
            },
            navigation: {
                nextEl: ".move-next",
                prevEl: ".move-prev",
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
                1240: {
                    slidesPerView: 5,
                },
    
            },
        });
    });


