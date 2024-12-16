import API_URL from './config.js'
let quantityNews = 7;
async function fetchNewsApi(id) {
    try {
        const response = await fetch(`${API_URL}/news/getnews/${id}`);
        const news = await response.json();
        return news;
    } catch (error) {
        console.error('Error fetching news:', error);
        
    }
}

async function fetchNewsLatestApi() {
    try {
        const response = await fetch(`${API_URL}/news/latestnews?quantity=${quantityNews}`);
        const news = await response.json();
        return news;
    } catch (error) {
        console.error('Error fetching news:', error); 
    }
}



function renderNewsDetail(news){
    var date = new Date(news.newsDate);
    var formattedDate = date.toISOString().split('T')[0] + ' / ' + date.toISOString().split('T')[1].slice(0, 5);

    document.querySelector('.news__img').src = news.newsImage;
    document.querySelector('.title__news').innerText = news.title;
    document.querySelector('.desc-all-infor').innerHTML = news.newsDescription;

    document.querySelector('.cate_news').innerText = news.newsCategory.name;
    document.querySelector('.date__post-news').innerText = formattedDate; 
}

function renderNewsLatest(news){
    const htmlNewsLatestMap = news.map(function(n){
        return `
            <a href="newsDetail.html?id=${n.newsId}" class="trend-right-single item__trens-new-latest d-flex" data-id="${n.newsId}">
                            <div class="tren-right-img">
                                <img src="${n.newsImage}" alt="">
                            </div>
                            <div class="trend-rigth-cap">
                                <span>
                                    ${n.newsCategory.name}
                                </span>
                                <h4>
                                    ${n.title}
                                </h4>
                            </div>
            </a> 
        `
    }).join('');
    document.querySelector('.content-news-trend').innerHTML = htmlNewsLatestMap;
    document.querySelectorAll('.item__trens-new-latest').forEach(function (link) {
        link.addEventListener('click', async function (e) {
            e.preventDefault();
            const newsId = this.getAttribute('data-id');
            const newUrl = `newsDetail.html?id=${newsId}`;
            history.pushState({ newsId }, '', newUrl);  
            const news = await fetchNewsApi(newsId);
            renderNewsDetail(news);
        });
    }); 

}



async function fetchAndRenderNewsDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsID = urlParams.get('id');
    if (!newsID) {
        window.location.href = 'news.html';
        return;
    }
    const news = await fetchNewsApi(newsID);
    if (!news) {
        console.error('News not found');
        document.querySelector('.news__container').innerHTML = '<p>News not found.</p>';
        return;
    }
    const newsLatest = await fetchNewsLatestApi();
    renderNewsDetail(news);
    renderNewsLatest(newsLatest);
}
 

fetchAndRenderNewsDetail()