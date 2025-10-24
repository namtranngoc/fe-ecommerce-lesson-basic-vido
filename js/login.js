// ====== USERS LOGIC ======
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
function getUsers() {
    return JSON.parse(localStorage.getItem('users'));
}
function addUser(name, email, password) {
    const users = getUsers();
    if (users.find(user => user.email === email)) {
        throw new Error('Email này đã được đăng ký!');
    }
    users.push({
        id: Date.now().toString(),
        name,
        email,
        password
    });
    localStorage.setItem('users', JSON.stringify(users));
}
function checkLogin(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng!');
    }
    return user;
}
function showMessage(msg, isError = false) {
    let msgDiv = document.getElementById('messageBox');

    let parent = document.querySelector('.container');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'messageBox';
        msgDiv.style.margin = '20px auto 0 auto';
        msgDiv.style.maxWidth = '400px';
        msgDiv.style.textAlign = 'center';
        msgDiv.style.fontSize = '15px';
        msgDiv.style.padding = '10px 15px';
        msgDiv.style.borderRadius = '6px';
        msgDiv.style.background = isError ? '#ffeaea' : '#eaffea';
        msgDiv.style.color = isError ? '#d8000c' : '#006400';
        msgDiv.style.border = isError ? '1px solid #d8000c' : '1px solid #006400';
        if (parent) parent.appendChild(msgDiv);
        else document.body.appendChild(msgDiv);
    }
    msgDiv.textContent = msg;
    msgDiv.style.display = 'block';
    msgDiv.style.background = isError ? '#ffeaea' : '#eaffea';
    msgDiv.style.color = isError ? '#d8000c' : '#006400';
    msgDiv.style.border = isError ? '1px solid #d8000c' : '1px solid #006400';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 3500);
}

function updateUserPassword(email, newPassword) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) throw new Error('Email không tồn tại!');
    users[idx].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
}

function checkLoginStatus() {
    const userToken = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const container = document.querySelector('.container');
    if (userToken && userName) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 0;">
                <h2>Xin chào, ${userName}!</h2>
                <button id="logoutBtn" style="margin-top:20px; padding:10px 30px; background:#ff4444; color:#fff; border:none; border-radius:5px; font-size:16px; cursor:pointer;">Đăng xuất</button>
                <div style="margin-top:20px;"><a href="index.html" style="color:#2575fc;">← Quay về trang chủ</a></div>
            </div>
        `;
        document.getElementById('logoutBtn').onclick = function() {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            window.location.reload();
        };
        showMessage('Đăng nhập thành công!');
    } else {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        // Thêm link quên mật khẩu
        let forgotLink = document.getElementById('forgotLink');
        if (!forgotLink) {
            forgotLink = document.createElement('div');
            forgotLink.innerHTML = '<a id="forgotLink" style="color:#2575fc;cursor:pointer;display:block;margin-top:10px;">Quên mật khẩu?</a>';
            loginForm.appendChild(forgotLink);
        }
        // Sự kiện chuyển form
        showRegister.addEventListener('click', () => {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            forgotForm.style.display = 'none';
        });
        showLogin.addEventListener('click', () => {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            forgotForm.style.display = 'none';
        });
        document.getElementById('forgotLink').onclick = () => {
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            forgotForm.style.display = 'block';
        };
        document.getElementById('showLoginFromForgot').onclick = () => {
            forgotForm.style.display = 'none';
            loginForm.classList.add('active');
        };
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const user = checkLogin(email, password);
                localStorage.setItem('userToken', user.id);
                localStorage.setItem('userName', user.name);
                showMessage('Đăng nhập thành công!');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            } catch (error) {
                showMessage(error.message, true);
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            try {
                addUser(name, email, password);
                showMessage('Đăng ký thành công! Vui lòng đăng nhập.');
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            } catch (error) {
                showMessage(error.message, true);
            }
           
        });
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;
            const newPass = document.getElementById('forgotNewPassword').value;
            try {
                updateUserPassword(email, newPass);
                showMessage('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
                forgotForm.style.display = 'none';
                loginForm.classList.add('active');
            } catch (error) {
                showMessage(error.message, true);
            }
        });
    }
}



// Kiểm tra trạng thái đăng nhập khi trang được tải
document.addEventListener('DOMContentLoaded', checkLoginStatus);