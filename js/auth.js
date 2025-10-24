// Kiểm tra trạng thái đăng nhập
function checkAuthStatus() {
    const userToken = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const authContainer = document.getElementById('authButtons');
    
    if (authContainer) {
        if (userToken && userName) {
            // Đã đăng nhập
            authContainer.innerHTML = `
                <span class="nav-link d-flex align-items-center">
                    <span class="user-name me-2">Xin chào, ${userName}</span>
                    <button onclick="handleLogout()" class="btn btn-danger btn-sm">Đăng xuất</button>
                </span>
            `;
        } else {
            // Chưa đăng nhập - không cần ghi đè nút đăng nhập mặc định
            return;
        }
    }
}

// Xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.reload(); // Tải lại trang sau khi đăng xuất
}

// Thêm CSS cho phần authentication
const style = document.createElement('style');
style.textContent = `
    .user-name {
        color: #666;
    }
`;
document.head.appendChild(style);

// Đặt hàm handleLogout là global để có thể gọi từ onclick
window.handleLogout = handleLogout;

// Kiểm tra trạng thái khi trang được tải
document.addEventListener('DOMContentLoaded', checkAuthStatus);