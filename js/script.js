document.addEventListener('DOMContentLoaded', () => {
    // Load click sound
    const clickSound = new Audio('audio/click.mp3'); // Đảm bảo đường dẫn đúng
    clickSound.volume = 0.3; // Điều chỉnh âm lượng (0.0 đến 1.0)

    // Function to play click sound
    const playClickSound = () => {
        const clonedSound = clickSound.cloneNode();
        clonedSound.play().catch(e => console.log("Sound play prevented or failed:", e));
    };

    // Add click sound to all buttons and links
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('click', playClickSound);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle Hack Report Form Submission
const hackReportForm = document.getElementById('hackReportForm');
if (hackReportForm) {
    hackReportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... phần còn lại của code gửi tố cáo ...
    });
}
            playClickSound(); // Phát âm thanh click

            const playerName = document.getElementById('player').value;
            const hackType = document.getElementById('hackType').value;
            const evidence = document.getElementById('evidence').value;
            const description = document.getElementById('description').value;

            try {
                const response = await fetch('http://localhost:3000/api/report-hack', { // Thay đổi URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ playerName, hackType, evidence, description })
                });

                if (response.ok) {
                    alert('Báo cáo tố cáo thành công!');
                    window.location.href = 'admin.html'; // Chuyển hướng về trang admin
                } else {
                    const errorResponse = await response.text();
                    console.error('Server error during report:', response.status, errorResponse);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            } catch (error) {
                console.error('Network error during report:', error);
                // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
            }
        });
    }

    // Handle Registration Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            playClickSound();

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/register', { // Thay đổi URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    window.location.href = 'login.html'; // Chuyển hướng về trang đăng nhập
                } else {
                    const errorResponse = await response.text();
                    console.error('Server error during registration:', response.status, errorResponse);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            } catch (error) {
                console.error('Network error during registration:', error);
                // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
            }
        });
    }

    // Handle Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            playClickSound();

            const usernameOrEmail = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/login', { // Thay đổi URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernameOrEmail, password })
                });

                if (response.ok) {
                    alert('Đăng nhập thành công!');
                    window.location.href = 'index.html'; // Chuyển hướng về trang chính
                } else {
                    const errorResponse = await response.text();
                    console.error('Server error during login:', response.status, errorResponse);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            } catch (error) {
                console.error('Network error during login:', error);
                // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
            }
        });
    }

    // Script for falling money effect on Special Packages Card
    const specialPackagesCard = document.getElementById('special-packages-card');
    if (specialPackagesCard) {
        const fallingMoneyContainer = specialPackagesCard.querySelector('.falling-money-container');
        const numberOfBills = 20; // Số lượng tờ tiền rơi đồng thời

        function createMoneyBill() {
            const moneyBill = document.createElement('div');
            moneyBill.classList.add('money-bill');

            const size = Math.random() * (40 - 20) + 20; // Kích thước ngẫu nhiên từ 20px đến 40px
            moneyBill.style.width = `${size}px`;
            moneyBill.style.height = `${size * 0.7}px`; // Giả sử tỉ lệ 100:70

            const startX = Math.random() * 100; // Vị trí X ngẫu nhiên (0-100%)
            moneyBill.style.left = `${startX}%`;

            const animationDuration = Math.random() * (8 - 4) + 4; // Thời gian rơi ngẫu nhiên từ 4s đến 8s
            moneyBill.style.animationDuration = `${animationDuration}s`;
            moneyBill.style.animationDelay = `-${Math.random() * animationDuration}s`; // Tạo hiệu ứng rơi liên tục

            fallingMoneyContainer.appendChild(moneyBill);

            // Xóa tờ tiền sau khi nó rơi ra khỏi khung hình để tối ưu hiệu suất
            moneyBill.addEventListener('animationend', () => {
                moneyBill.remove();
                createMoneyBill(); // Tạo lại một tờ tiền mới
            });
        }

        // Tạo các tờ tiền ban đầu
        for (let i = 0; i < numberOfBills; i++) {
            createMoneyBill();
        }
    }
});
