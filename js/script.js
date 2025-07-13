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

            const playerName = document.getElementById('player-name').value;
            const hackType = document.getElementById('hack-type').value;
            const evidence = document.getElementById('evidence').value;
            const description = document.getElementById('description').value;

            const reportData = { playerName, hackType, evidence, description };

            try {
                // Gửi dữ liệu tố cáo đến backend server của bạn
                // THAY ĐỔI 'http://localhost:3000/api/report-hack' thành URL API thực tế của bạn
                const response = await fetch('http://localhost:3000/api/report-hack', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reportData)
                });

                if (response.ok) { // Nếu request thành công (status 200-299)
                    alert('Tố cáo hack đã được gửi thành công! Admin sẽ xem xét sớm nhất.'); // Vẫn giữ thông báo thành công
                    hackReportForm.reset();
                    
                    // CHUYỂN HƯỚNG SANG TRANG ADMIN SAU KHI GỬI THÀNH CÔNG
                    window.location.href = 'admin.html'; 

                } else {
                    // Lỗi từ server (ví dụ: status 400, 500)
                    const errorResponse = await response.text();
                    console.error('Server error submitting hack report:', response.status, errorResponse);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            } catch (error) {
                // Lỗi mạng (không kết nối được đến server)
                console.error('Network error submitting hack report:', error);
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
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!'); // Vẫn giữ thông báo lỗi logic này
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
                    window.location.href = 'login.html'; // Chuyển hướng đến trang đăng nhập
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
});
document.addEventListener('DOMContentLoaded', () => {
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
