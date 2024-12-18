// import API_URL from './config.js'

let account = null; 
async function checkLogin(){
    try {
        const authToken = sessionStorage.getItem('authToken');
        const signin = document.getElementById('signinlink');
        const taskInfor = document.querySelector('.header__link-account');
    
        if (authToken) {
            await loadMyAccount();
            signin.style.display = 'none';
            taskInfor.style.display = 'flex';

            if(account){ 
                document.querySelector('.img__user-acc').src = account.userImage;
                document.querySelector('.name__user-acc').innerText = account.fullName;
            }
        } else {
            signin.style.display = 'flex';
            taskInfor.style.display = 'none';
    
        }
    } catch {
    
    }finally{

    }
    
}
checkLogin();


// btn nav bar
const btnHambuger = document.querySelector('.hamburger__icon-btn');
const navBarMobile = document.querySelector('.nav-bar-menu');
const btnCloseNavBar = document.querySelector('.close-navbar-icon-btn');
btnHambuger.onclick = function (event) {
    navBarMobile.classList.add('open_navbar');
    btnHambuger.classList.add('close-btn-hambuger');
    event.stopPropagation();
};
navBarMobile.addEventListener('click', function (event) {
    event.stopPropagation(); // Ngăn chặn sự kiện truyền lên document
});
btnCloseNavBar.onclick = function () {
    navBarMobile.classList.remove('open_navbar');
    btnHambuger.classList.remove('close-btn-hambuger');
};
document.addEventListener('click', function () {
    navBarMobile.classList.remove('open_navbar');
    btnHambuger.classList.remove('close-btn-hambuger');
    console.log('aa')
    boardInforAcc.classList.remove('open__boardAcc-detail'); // DUNG CHUNG CHO KHI CLICK NGOAI AVATA THI SE CLOSE

});

// Confirm logout
const btnLogout = document.getElementById('btn-logout');
const modalConfirmLogout = document.getElementById('modal-logout-confirm_nav');
const modalContainerConfirmLogout = document.querySelector('.modal_container_confirm-logout');
const btnLogoutConfirm = document.querySelector('.btn-confirm-logout');
btnLogout.addEventListener('click', () => {
    modalConfirmLogout.classList.add('open');
});
const btnCloseLogout = document.querySelector('.btn-close-logout');
btnCloseLogout.addEventListener('click', () => {
    modalConfirmLogout.classList.remove('open');
});

modalConfirmLogout.addEventListener('click', () => {
    modalConfirmLogout.classList.remove('open');
});
modalContainerConfirmLogout.addEventListener('click', (e) => {
    e.stopPropagation();
});
btnLogoutConfirm.addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href =  'https://acnbokhb12.github.io/koicaresystem/Home.html';

})


//  
const accImg = document.querySelector('.header__link-task-img-acc img');
const boardInforAcc = document.querySelector('.header__link-task-description');
// Bắt sự kiện click trên accImg để mở boardInforAcc
accImg.addEventListener('click', function (event) {
    boardInforAcc.classList.add('open__boardAcc-detail');
    event.stopPropagation(); // Ngăn chặn sự kiện truyền lên document
});

document.addEventListener('click', function () {
    boardInforAcc.classList.remove('open__boardAcc-detail');
});

// ddd
function toggleSubMenuOnClick() {
    var listItemsNav = document.querySelectorAll('.contain__item-nav');
    for (var i = 0; i < listItemsNav.length; i++) {
        var navItem = listItemsNav[i];
        navItem.onclick = function (event) {
            var isParentNav = this.querySelector('.contain__sub-item_nav-link');
            if (isParentNav) {
                event.preventDefault(); // Prevent default link behavior
                // Toggle the submenu visibility on click
                isParentNav.style.display = (isParentNav.style.display === 'block') ? 'none' : 'block';
            }
        };
    }
}

const btnStopPro = document.querySelectorAll('.contain__sub-item_nav-items');
btnStopPro.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.stopPropagation();
    })
})

function handleResize() {
    if (window.innerWidth < 1000) {
        toggleSubMenuOnClick();
    } else {
        // Reset any inline styles to handle the hover behavior
        var subMenus = document.querySelectorAll('.contain__sub-item_nav-link');
        for (var i = 0; i < subMenus.length; i++) {
            subMenus[i].style.display = '';
        }
    }
}
window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

async function loadMyAccount() {
    const token = sessionStorage.getItem('authToken');
     try {
        const response = await fetch(`https://koicaresystemapikhanh-bhddfwefgsa2gddq.southeastasia-01.azurewebsites.net/account/myaccount`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        const acc = await response.json();
        account = acc; 
     } catch (error) {
        
     }
}





