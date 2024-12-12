import API_URL from './config.js'
import { callToast } from './confirm.js';


async function loadMyAccount() {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/account/myaccount`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            }
        });
        const acc = await response.json();
        return acc;
    } catch (error) {

    }
}


function renderProfileInfor(acc) {
    const htmlProfile = `
        <div class="profile-container"> 
                    <div class="custom-container">
                        <div class="img_profile">
                            <img src="${acc.userImage}"
                                class="profile-img" alt="User Profile Image">
                        </div>
                        <h1 class="user_name">HELLO, ${acc.fullName}</h1>
                        <a href="editProfile.html" class="infor">EDIT INFORMATION</a>
                        <a href="#" class="infor">SIGN OUT</a>
                    </div> 
                    <!-- Profile Details Section -->
                    <div class="profile-details">
                        <h1>Profile Details</h1>
                        <div class="row">
                            <div class="profile-item col-lg-6 top">
                                <h3>Name</h3>
                                <p>${acc.fullName}</p>
                            </div>
                            <div class="profile-item col-lg-6 top">
                                <h3>Email</h3>
                                <p>${acc.email ?? '_ _ _'}</p>
                            </div> 
                            <div class="profile-item col-lg-6 under">
                                <h3>Phone Number</h3>
                                <p>${acc.phoneNumber ?? '_ _ _'}</p>
                            </div>
                            <div class="profile-item col-lg-6 under">
                                <h3>Address</h3>
                                <p>${acc.address ?? '_ _ _'}</p>
                            </div> 
                            <div class="profile-item col-lg-6 under">
                                <h3>Gender</h3>
                                <p>${acc.gender ?? '_ _ _'}</p>
                            </div> 
                        </div>
                    </div>
                </div>
    `;
    document.getElementById('contain__infor-acc-js').innerHTML = htmlProfile;
}

async function fetchAndRenderProfile() {
    const account = await loadMyAccount();
    if (account) {
        renderProfileInfor(account);
    }
}
fetchAndRenderProfile();

document.addEventListener('DOMContentLoaded', () => {
    const toastData = sessionStorage.getItem('toastData');
    if (toastData) {
        const { resultDelete, messageDelete } = JSON.parse(toastData);
        callToast(resultDelete, messageDelete);

        // Xóa dữ liệu để không hiển thị lại toast khi reload
        sessionStorage.removeItem('toastData');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const toastData = sessionStorage.getItem('toastData');
    if (toastData) {
        const { resultDelete, messageDelete } = JSON.parse(toastData);
        callToast(resultDelete, messageDelete);

        // Xóa dữ liệu để không hiển thị lại toast khi reload
        sessionStorage.removeItem('toastData');
    }
});