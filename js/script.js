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
                // Đóng menu khi nhấp vào một mục điều hướng (trên di động)
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Handle Hack Report Form Submission
    const hackReportForm = document.getElementById('hackReportForm');
    if (hackReportForm) {
        hackReportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            playClickSound(); // Phát âm thanh click

            const playerName = document.getElementById('player-name').value;
            const hackType = document.getElementById('hack-type').value;
            const evidence = document.getElementById('evidence').value;
            const reporterName = document.getElementById('reporter-name').value;

            try {
                // Thay đổi URL này thành URL API backend của bạn để gửi tố cáo
                const response = await fetch('http://localhost:3000/api/report-hack', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ playerName, hackType, evidence, reporterName })
                });

                if (response.ok) {
                    alert('Tố cáo hack đã được gửi thành công!');
                    hackReportForm.reset(); // Xóa form sau khi gửi
                } else {
                    const errorResponse = await response.text();
                    console.error('Server error during hack report:', response.status, errorResponse);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            } catch (error) {
                console.error('Network error during hack report:', error);
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

    // Toggle menu for mobile
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            playClickSound();
        });

        // Close menu when clicking outside (overlay)
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && !e.target.closest('#main-nav') && !e.target.closest('#menu-toggle')) {
                document.body.classList.remove('nav-open');
            }
        });
    }
});
