// --- Dữ liệu xe yêu thích mẫu ---
let carsData = {
    'xe-may': [
        {
            id: 1,
            name: 'HONDA VISION 2024',
            transmission: 'Xe tay ga',
            seats: '2 chỗ',
            fuel: 'Xăng',
            rating: 5.0,
            trips: 1,
            location: 'Khu đô thị Văn Quán, Hà Đông',
            price: '150K',
            period: '/ngày',
            owner: 'Hoàng Long',
            ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
            tags: ['Miễn thế chấp']
        },
        {
            id: 2,
            name: 'YAMAHA JANUS 2023',
            transmission: 'Xe tay ga',
            seats: '2 chỗ',
            fuel: 'Xăng',
            rating: 4.9,
            trips: 12,
            location: 'Mỹ Đình, Nam Từ Liêm',
            price: '130K',
            period: '/ngày',
            owner: 'Minh Thư',
            ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600',
            tags: ['Miễn thế chấp', 'Giao xe tận nơi']
        }
    ],
    'o-to': [
        {
            id: 3,
            name: 'HYUNDAI SANTAFE 2024',
            transmission: 'Số tự động',
            seats: '7 chỗ',
            fuel: 'Dầu',
            rating: 5.0,
            trips: 40,
            location: 'Phố Huế, Hoàn Kiếm, Hà Nội',
            price: '1.350K',
            period: '/ngày',
            owner: 'Đức Mạnh',
            ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
            tags: ['Có tài xế chuyên nghiệp']
        }
    ]
};

let currentTab = 'xe-may';

// Hàm hiển thị danh sách xe
function renderCars() {
    const container = document.getElementById('cars-container');
    const items = carsData[currentTab];

    // Cập nhật số lượng đếm trên tab
    document.getElementById('count-xe-may').innerText = carsData['xe-may'].length;
    document.getElementById('count-o-to').innerText = carsData['o-to'].length;

    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <p>Chưa có chiếc xe nào trong danh sách yêu thích này.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(car => `
        <div class="car-card">
            <!-- Hình ảnh và nhãn -->
            <div class="car-image-box">
                <img src="${car.image}" alt="${car.name}">
                <div class="car-tags">
                    ${car.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button onclick="removeCar('${currentTab}', ${car.id})" class="card-heart-btn" title="Bỏ thích">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>

            <!-- Thông tin xe -->
            <div class="car-details">
                <div>
                    <h3 class="car-title">${car.name}</h3>
                    <div class="car-specs">
                        <span><i class="fa-solid fa-gear"></i> ${car.transmission}</span>
                        <span><i class="fa-solid fa-user-group"></i> ${car.seats}</span>
                        <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
                    </div>
                    <div class="car-rating">
                        <i class="fa-solid fa-star"></i> ${car.rating} <span>(${car.trips} chuyến)</span>
                    </div>
                    <div class="car-location">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${car.location}</span>
                    </div>
                </div>

                <div class="car-footer">
                    <div class="owner-info">
                        <img src="${car.ownerAvatar}" alt="${car.owner}" class="owner-avatar">
                        <span class="owner-name-text">${car.owner}</span>
                    </div>
                    <div class="car-price">
                        <span class="price-num">${car.price}</span>
                        <span class="price-unit">${car.period}</span>
                    </div>
                </div>
            </div>

            <!-- Nút thao tác -->
            <div class="car-actions">
                <button onclick="removeCar('${currentTab}', ${car.id})" class="btn-action btn-remove">Bỏ thích</button>
                <button onclick="showToast('Đang mở chi tiết xe...')" class="btn-action btn-detail">Xem chi tiết</button>
            </div>
        </div>
    `).join('');
}

// Chuyển đổi tab
function switchTab(tab) {
    currentTab = tab;
    const tabTuLai = document.getElementById('tab-xe-may');
    const tabCoTaiXe = document.getElementById('tab-o-to');

    if (tab === 'xe-may') {
        tabTuLai.classList.add('active');
        tabCoTaiXe.classList.remove('active');
    } else {
        tabCoTaiXe.classList.add('active');
        tabTuLai.classList.remove('active');
    }
    renderCars();
}

// Xóa xe khỏi danh sách
function removeCar(tab, id) {
    carsData[tab] = carsData[tab].filter(car => car.id !== id);
    renderCars();
    showToast("Đã xóa xe khỏi danh sách yêu thích!");
}

// Hiển thị thông báo Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Khởi chạy khi tải trang
window.onload = function () {
    renderCars();
};