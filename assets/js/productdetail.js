import API_URL from './config.js';
import { callToast } from './confirm.js';
import { loading } from './confirm.js';
import { removeLoading } from './confirm.js';

let message = null;
let isSubmitting = false;


async function fetchProductDetail(id) {
    try {
        const response = await fetch(`${API_URL}/product/${id}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();
        return product;
    } catch (error) {

    }
}

function renderProductDetail(product) {
    const htmlProduct = `
        <div class="row">
              <!-- info img -->
              <div class="product__content__detail-info-img col-md-6">
                <div class="product__detail-img"> 
                    <img id="img__product"
                    src="${product.image}"
                    alt="">
                </div>
              </div>
              <!-- info product detail  -->
              <div class="product__content__detail-sumary col-md-6">
                <h1 id="name__product" class="product__content__detail-title">
                    ${product.name}
                </h1>
                <div class="product__content__detail-rating"> 
                  <div class="product__content__detail-rating-customer"> 
                    <h2 id="category__product" class="title_cate_pd">
                        ${product.category.categoryName}
                    </h2>
                  </div>
                </div>
                <div class="product__content__detail-desc">
                  <p id="desc__product">
                     ${product.description}
                  </p>
                </div>
                <p class="product__content__detail-price">
                  <span id="product__detail-price-id" class="product__detail-price">
                        ${product.price}
                  </span>
                </p>
                <!-- quantity buy product -->
                <div class="product__content__detail-form">
                  <form id="add-to-cart" method="post">
                    <input type="hidden" id="product_Id" value="${product.productId}" />
                    <div class="product__detail-form-desc">
                      <h1>Quantity</h1>
                      <div class="product__detail-quantity-btn">
                        <button type="button" class="minus-btn-quantity"><i class="fa-solid fa-minus"></i></button>
                        <input type="number" min="1" id="quantity-input" value="1">
                        <button type="button" class="plus-btn-quantity"><i class="fa-solid fa-plus"></i></button>
                      </div>
                      <!-- submit buy product -->
                      <div class="product__btnbuy-ing-pro">
                        <button type="submit" name="acction" value="buyProduct" class="product__detail-buybtn ">
                          <i class="fa-solid fa-cart-shopping"></i> Add product to cart
                        </button> 
                      </div>
                    </div>
                  </form>
                </div>
                
                <!-- extra  -->
                <div class="product__content__extra">
                  <div class="product__content__extra-info">
                    <ul class="product__content__extra-info-list">
                      <li>Free global shipping on all orders</li>
                      <li>30 days easy returns if you change your mind</li>
                      <li>Order before noon for same day dispatch</li>
                    </ul>
                  </div>
                  <div class="product__content__extra-brand">
                    <h5>Guaranteed Safe Checkout</h5>
                    <img src="./assets/img/content/brand.png" alt="">
                  </div> 
                </div>
              </div>
            </div>
    `;
    document.querySelector('.product__content_grid').innerHTML = htmlProduct;
    let amount = parseInt(document.getElementById('product__detail-price-id').innerText);
    let formattedAmount = amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    document.getElementById('product__detail-price-id').innerText = formattedAmount;

    const minusBtn = document.querySelector('.minus-btn-quantity');
    const plusBtn = document.querySelector('.plus-btn-quantity');
    const quantityInput = document.getElementById('quantity-input');

    minusBtn.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;

    });

    document.getElementById('add-to-cart').addEventListener('submit', async function (e) {
        e.preventDefault();
        loading();

        const pId = document.getElementById('product_Id').value;
        const quantity = document.getElementById('quantity-input').value;

        const requestBody = {
            productId: parseInt(pId),
            quantity: parseInt(quantity)
        };
        console.log(requestBody);
        const result = await addProductToCart(requestBody);
        removeLoading();
        callToast(result, message);

    })
}

async function addProductToCart(requestBody) {
    const token = sessionStorage.getItem('authToken');
    if(!token){
        window.location.href = 'login.html';
    }
    try {
        const response = await fetch(`${API_URL}/cart/addtocart`, {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
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


async function fetchAndRenderProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
        // Không có ID trong URL
        window.location.href = 'shop.html';
        return;
    }
    const product = await fetchProductDetail(productId);
    if (product) {
        renderProductDetail(product);
    } else {
        window.location.href = 'shop.html';
    }
}
fetchAndRenderProduct();

// fetchProductDetail();