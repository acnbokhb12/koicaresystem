import API_URL from './config.js'

// Đảm bảo token được gửi kèm theo trong các yêu cầu
async function checkToken() {
    const token = sessionStorage.getItem('authToken');
    try {
        const response = await fetch(`${API_URL}/token/validate-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token qua header
            },  
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Token is valid:", data);
            document.body.classList.remove('hidden');              
        } else {
            const error = await response.json();
            console.log("Token is invalid:", error.message);
            window.location.href = './login.html';  // Chuyển hướng đến trang login nếu token không hợp lệ
        }
    } catch (error) {
        console.error("Error:", error); 
        window.location.href = './login.html';  // Chuyển hướng đến trang login nếu có lỗi
    }
}

checkToken();
 