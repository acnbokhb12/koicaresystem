import API_URL from './config.js'

let currentPage = 1;
const blogsPerPage = 8;
let totalPages = 0;
let currentCateId = null; 

async function fetchBlogs(page) {
    try {
        const response = await fetch(`${API_URL}/blog/listblogs?page=${page}`);
        const blogs = await response.json();
        return blogs;
    } catch (error) {
        console.error('Error fetching blogs:', error);

    }
}

async function renderBlogs(blogs) {
    let idUser = null; // Khai báo idUser bên ngoài để có phạm vi toàn cục trong hàm
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/token/validate-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  
            },  
        });
        if (response.ok) {
            const data = await response.json(); 
            idUser = data.userId;  
        } 
    } catch (error) {
        console.error("Error validating token:", error);
    }
 
    const htmlBlogsMap = blogs.map(function (b) {
        return `
            <div class="post">
                <div class="post-header">
                    <img src="${b.userImage}" alt="">
                    <div>
                        <span class="name__user">${b.fullName}</span>
                        <span class="date__post">${b.blogsDate}</span>
                        <span class="category__blog-detail">${b.nameBlogCate}</span>
                    </div>
                    ${idUser == b.accId ? `
                    <form action="deleteBlog" method="POST" style="display:inline;">
                        <input type="hidden" name="postId" value="${b.blogId}">
                        <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                    </form>
                    ` : ''}
                </div>
                <div class="post-title">${b.title}</div>
                <div class="post-body">
                    <p>${b.content}</p>
                </div>
                <div class="post-image">
                    <img src="${b.blogsImage}" alt="">
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelector('.post__container').innerHTML = htmlBlogsMap;
}


async function fetchAndRenderBlogs(page) {
    const products = await fetchBlogs(page);
    if (products) {
        renderBlogs(products);
    }
}

async function fetchTotalAndCallRender() {
    fetch(`${API_URL}/blog/countblogs`)
    .then(res => res.json())
    .then(data => {
        totalPages = Math.ceil(data.totalBlogs / blogsPerPage);
        fetchAndRenderBlogs(currentPage);
        renderPagination(totalPages);
    });
} 

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
    const pageLinks = document.querySelectorAll('.pagination .page-link');

    pageLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            // e.preventDefault();
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

            if(currentCateId){
                fetchBlogsByCategoryId(currentCateId, currentPage);
            }else{
                fetchAndRenderBlogs(currentPage);
            }

            // Cập nhật giao diện phân trang
            renderPagination(totalPages);
        });
    });
}

async function fetchBlogCategory() {
    fetch(`${API_URL}/blogcate/listblogcate`)
        .then(function (res) {
            return res.json();
        })
        .then(function(posts){
            const htmlBlogsCateMap = posts.map(function(blc){
                return `
                    <li>
                        <a class="category__item-link" data-cate-id=${blc.idblogCate} href="#">
                             <h5>${blc.nameBlogCate}</h5>
                        </a> 
                    </li>            
                `
            }).join('');
            document.querySelector('.listblogs__category').innerHTML=htmlBlogsCateMap;

            const categoryLinks = document.querySelectorAll('.category__item-link');
            categoryLinks.forEach(function(link){
                link.addEventListener('click', function(e){
                    // e.preventDefault();
                    document.querySelectorAll('.category__item-link').forEach(function (item) {
                        item.classList.remove('active');
                    });
                    link.classList.add('active');
                    currentCateId  = this.getAttribute('data-cate-id'); // Lấy cateId từ thuộc tính data-cate-id
                    fetchBlogsByCategoryId(currentCateId, 1);
                })
            })

        })
}
async function fetchBlogsByCategoryId(cateId, page) {
    try {
        currentPage = page;
        const response = await fetch(`${API_URL}/blog/listblogsByCate?cateId=${cateId}&page=${page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blogs = await response.json();
        renderBlogs(blogs);

        fetch(`${API_URL}/blog/countblogsbycate?cateId=${cateId}`)
            .then(res => res.json())
            .then(data => {
                totalPages = Math.ceil(data.totalBlogs / blogsPerPage);
                renderPagination(totalPages);
            }); 
    } catch (error) {
        console.error('Error fetching blogs:', error); 
    }
    
}

fetchBlogCategory(); 
fetchTotalAndCallRender();