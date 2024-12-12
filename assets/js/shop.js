import API_URL from './config.js'
let currentPage = 1;
const productsPerPage = 16;
let totalPages = 0;
let currentCateId = null;
let searchQuery = null;
async function fetchProducts(page) {
    try {
        const response = await fetch(`${API_URL}/product/listproducts?page=${page}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
function renderProducts(products) {
    const htmlsP = products.map(function (p) {
        return `
            <div class="col-lg-3 col-md-4 col-6 product-item">
                <a href="productDetail.html?id=${p.productId}" class="home-product-item__link">
                    <div class="shop__product_item-desc">
                        <div class="create__blank"></div>
                        <!-- product item -->
                        <div class="shop__product__img">
                            <img src="${p.image}" alt="">
                        </div>
                        <div class="shop__product__des-detail">
                            <!-- title -->
                            <h4 class="shop__product-name">${p.name}</h4>
                            <!-- description -->
                            <p class="shop__product-description">
                                ${p.description}
                            </p>
                            <!-- price & category -->
                            <div class="contain-cat-price">
                                <h5 class="shop__product-price">${p.price}</h5>
                                <h5 class="shop__product-category-list">
                                    <p class="shop__product-category-item">
                                        ${p.category.categoryName}
                                    </p>
                                </h5>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    });
    document.querySelector('.row_product_list').innerHTML = htmlsP.join('');
    
    // Format price
    const priceElements = document.querySelectorAll('.shop__product-price');
    priceElements.forEach(function (element) {
        let price = parseInt(element.innerText);
        let formattedAmount = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        element.innerText = formattedAmount;
    });
}

async function fetchAndRenderProducts(page) {
    const products = await fetchProducts(page);
    if (products) {
        renderProducts(products);
    }
}


async function fetchCategoryProduct() {
    fetch(`${API_URL}/productcate/listproductcategories`)
        .then(function (res) {
            return res.json();
        })
        .then(function (posts) {
            var htmlProductCate = posts.map(function (ct) {
                return `
               <li class="category-item col-lg-12 col-custom-cate">
                  <a href="#" class="category-item__link" data-cate-id="${ct.categoryId}">
                    ${ct.categoryName}   
                  </a>
                </li> 
            `
            });
            var htmlJoinCate = htmlProductCate.join('');
            document.querySelector('.category-list').innerHTML = htmlJoinCate;

            const categoryLinks = document.querySelectorAll('.category-item__link');
            categoryLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault(); 
                    document.querySelectorAll('.category-item').forEach(function (item) {
                        item.classList.remove('category-item--active');
                    });
                    currentCateId  = this.getAttribute('data-cate-id'); // Lấy cateId từ thuộc tính data-cate-id
                    const parentLink = link.parentElement;
                    parentLink.classList.add('category-item--active'); 

                    fetchProductsByCategory(currentCateId,1); // Gọi hàm fetch sản phẩm theo danh mục
                });
            });
        })
} 
async function fetchProductsByCategory(cateId, page) {
    try {
        currentPage = page;
        // Gọi API để lấy danh sách sản phẩm theo danh mục và trang
        const response = await fetch(`${API_URL}/product/productsbycate?idCate=${cateId}&page=${page}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json();

        // Hiển thị sản phẩm
        renderProducts(products);

        // Cập nhật lại phân trang
        fetch(`${API_URL}/product/countproductbycate?cateId=${cateId}`)
            .then(res => res.json())
            .then(data => {
                totalPages = Math.ceil(data.totalProduct / productsPerPage);
                renderPagination(totalPages);
            });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
 
fetch(`${API_URL}/product/countproduct`)
    .then(res => res.json())
    .then(data => {
        totalPages = Math.ceil(data.totalProduct / productsPerPage);
        fetchAndRenderProducts(currentPage);
        renderPagination(totalPages);
    });
   function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
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
                <a class="page-link ${i === currentPage ? 'active__page' : ''}" href="#">${i}</a>
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
                
                if (currentCateId) {
                    fetchProductsByCategory(currentCateId, currentPage);
                }else if(searchQuery){
                    fetchProductsBySearch(searchQuery, currentPage )
                }else{    
                    fetchAndRenderProducts(currentPage);
                }
    
                // Cập nhật giao diện phân trang
                renderPagination(totalPages);
            });
        });
    } 
        
    fetchCategoryProduct();

    const searchForm = document.getElementById('searchNameForm');
    const searchInput = document.getElementById('searchNameInput');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn form reload trang
        searchQuery = searchInput.value.trim();  
        currentPage = 1;  
        currentCateId = null;
        document.querySelectorAll('.category-item--active').forEach(function (item) {
            item.classList.remove('category-item--active');
        });
        fetchProductsBySearch(searchQuery, currentPage);  
    });

    function fetchProductsBySearch(name, page = 1) {
        const searchUrl = `${API_URL}/product/search?name=${encodeURIComponent(name)}&page=${page}`;
        const countUrl = `${API_URL}/product/countproductsearch?name=${encodeURIComponent(name)}`;

        fetch(countUrl)
        .then(res => res.json())
        .then(data => {
            const totalProduct = data.totalProduct;
            totalPages = Math.ceil(totalProduct / productsPerPage);

            // Gọi API lấy danh sách sản phẩm
            return fetch(searchUrl);
        })
        .then(res => res.json())
        .then(products => {
            renderProducts(products); // Gọi hàm render sản phẩm
            renderPagination(totalPages); // Gọi hàm render phân trang
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tìm kiếm sản phẩm.');
        });

    }


   
     