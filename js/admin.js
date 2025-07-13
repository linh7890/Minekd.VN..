document.addEventListener('DOMContentLoaded', () => {
    const reportList = document.getElementById('report-list');
    const adminLogoutBtn = document.getElementById('admin-logout');

    // Load click sound (assuming you have audio/click.mp3)
    const clickSound = new Audio('audio/click.mp3');
    clickSound.volume = 0.3;
    const playClickSound = () => {
        const clonedSound = clickSound.cloneNode();
        clonedSound.play().catch(e => console.log("Sound play prevented or failed:", e));
    };

    // Add click sound to all buttons on this page
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('click', playClickSound);
    });

    const fetchHackReports = async () => {
        // Hiển thị thông báo đang tải khi trang admin được mở
        reportList.innerHTML = '<p>Đang tải tố cáo hack từ server...</p>'; 

        try {
            // Đây là URL API backend của bạn để lấy tố cáo hack
            // THAY ĐỔI 'http://localhost:3000/api/admin/hack-reports'
            // thành URL thực tế của backend server của bạn.
            const response = await fetch('http://localhost:3000/api/admin/hack-reports', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Nếu bạn có xác thực (ví dụ: JWT token), bạn sẽ thêm nó vào đây:
                    // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                const reports = await response.json();
                displayReports(reports);
            } else {
                // Xử lý các lỗi HTTP từ server
                const errorText = await response.text();
                console.error('Lỗi khi tải tố cáo hack từ server:', response.status, errorText);
                reportList.innerHTML = '<p>Không thể tải tố cáo hack.</p>'; // Thay đổi thông báo chung chung
            }
        } catch (error) {
            // Xử lý lỗi mạng hoặc server không phản hồi
            console.error('Lỗi mạng hoặc server không phản hồi khi tải tố cáo hack:', error);
            reportList.innerHTML = '<p>Không thể tải tố cáo hack.</p>'; // Thay đổi thông báo chung chung
        }
    };

    const displayReports = (reports) => {
        reportList.innerHTML = ''; // Xóa các báo cáo cũ

        if (!reports || reports.length === 0) { // Đảm bảo kiểm tra reports có tồn tại không
            reportList.innerHTML = '<p>Hiện chưa có tố cáo hack nào.</p>'; // Hiển thị khi không có tố cáo
            return;
        }

        reports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.classList.add('report-item');
            // Đảm bảo rằng backend trả về 'id', 'playerName', 'hackType', 'evidence', 'description', 'timestamp'
            // hoặc điều chỉnh các trường này cho phù hợp với dữ liệu backend của bạn.
            reportItem.setAttribute('data-id', report.id);

            reportItem.innerHTML = `
                <h3>Người chơi: ${report.playerName}</h3>
                <p><strong>Loại hack:</strong> ${report.hackType}</p>
                <p><strong>Bằng chứng:</strong> <a href="${report.evidence}" target="_blank">${report.evidence || 'Không có'}</a></p>
                <p><strong>Mô tả:</strong> ${report.description}</p>
                <p><em>Gửi lúc: ${new Date(report.timestamp).toLocaleString()}</em></p>
                <button class="action-button approve">Xử lý (Ban)</button>
                <button class="action-button delete">Xóa</button>
            `;
            reportList.appendChild(reportItem);
        });

        // Add event listeners to the action buttons
        reportList.querySelectorAll('.action-button.approve').forEach(button => {
            button.addEventListener('click', (e) => {
                playClickSound();
                const reportId = e.target.closest('.report-item').getAttribute('data-id');
                const playerName = e.target.closest('.report-item').querySelector('h3').innerText.replace('Người chơi: ', '');
                handleReportAction(reportId, 'approve', playerName);
            });
        });

        reportList.querySelectorAll('.action-button.delete').forEach(button => {
            button.addEventListener('click', (e) => {
                playClickSound();
                const reportId = e.target.closest('.report-item').getAttribute('data-id');
                handleReportAction(reportId, 'delete');
            });
        });
    };

    const handleReportAction = async (reportId, actionType, playerName = '') => {
        if (actionType === 'approve') {
            if (confirm(`Bạn có chắc chắn muốn xử lý (BAN) người chơi ${playerName} cho tố cáo này?`)) {
                try {
                    // Gửi yêu cầu BAN đến backend
                    // THAY ĐỔI URL này cho phù hợp với API xử lý tố cáo của backend
                    const response = await fetch(`http://localhost:3000/api/admin/process-report/${reportId}`, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        },
                        body: JSON.stringify({ action: 'ban', playerName: playerName })
                    });

                    if (response.ok) {
                        alert(`Đã gửi yêu cầu BAN ${playerName}. Tố cáo đã được xử lý.`); // Vẫn giữ thông báo thành công
                        // Xóa tố cáo khỏi danh sách sau khi xử lý thành công
                        document.querySelector(`.report-item[data-id="${reportId}"]`).remove();
                        if (reportList.children.length === 0) {
                            reportList.innerHTML = '<p>Hiện chưa có tố cáo hack nào.</p>';
                        }
                    } else {
                        const errorText = await response.text();
                        console.error('Server error processing report:', response.status, errorText);
                        // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                    }
                } catch (error) {
                    console.error('Network error processing report:', error);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            }
        } else if (actionType === 'delete') {
            if (confirm('Bạn có chắc chắn muốn xóa tố cáo này?')) {
                try {
                    // Gửi yêu cầu XÓA đến backend
                    // THAY ĐỔI URL này cho phù hợp với API xóa tố cáo của backend
                    const response = await fetch(`http://localhost:3000/api/admin/delete-report/${reportId}`, { 
                        method: 'DELETE',
                        headers: {
                            // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                        }
                    });

                    if (response.ok) {
                        alert('Tố cáo đã được xóa.'); // Vẫn giữ thông báo thành công
                        document.querySelector(`.report-item[data-id="${reportId}"]`).remove();
                        if (reportList.children.length === 0) {
                            reportList.innerHTML = '<p>Hiện chưa có tố cáo hack nào.</p>';
                        }
                    } else {
                        const errorText = await response.text();
                        console.error('Server error deleting report:', response.status, errorText);
                        // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                    }
                } catch (error) {
                    console.error('Network error deleting report:', error);
                    // KHÔNG HIỂN THỊ THÔNG BÁO LỖI CHO NGƯỜI DÙNG
                }
            }
        }
    };

    // Admin Logout
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playClickSound();
            // Trong ứng dụng thực tế, bạn sẽ gửi yêu cầu logout đến backend
            // và xóa token xác thực (nếu có) khỏi localStorage hoặc session storage.
            // localStorage.removeItem('adminToken'); // Ví dụ
            alert('Bạn đã đăng xuất khỏi Admin Panel.');
            window.location.href = 'login.html';
        });
    }

    // Initial load of hack reports when admin page loads
    fetchHackReports();
});