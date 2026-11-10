let bookings = [
    {
        id: "BK001",
        customer: "Nguyễn Anh",
        phone: "0912 345 678",
        vehicle: "VinFast VF8",
        plate: "30K-123.45",
        start: "2026-11-10",
        end: "2026-11-12",
        price: 3000000,
        status: "confirmed"
    },
    {
        id: "BK002",
        customer: "Trần Linh",
        phone: "0987 654 321",
        vehicle: "Honda City",
        plate: "30A-456.78",
        start: "2026-11-12",
        end: "2026-11-14",
        price: 1700000,
        status: "pending"
    },
    {
        id: "BK003",
        customer: "Minh Hoàng",
        phone: "0901 222 333",
        vehicle: "Mercedes C300",
        plate: "30A-789.12",
        start: "2026-11-09",
        end: "2026-11-11",
        price: 5000000,
        status: "active"
    },
    {
        id: "BK004",
        customer: "Phạm Huy",
        phone: "0933 555 666",
        vehicle: "VinFast VF5",
        plate: "30K-987.65",
        start: "2026-11-15",
        end: "2026-11-17",
        price: 1400000,
        status: "confirmed"
    },
    {
        id: "BK005",
        customer: "Quốc Tuấn",
        phone: "0977 111 222",
        vehicle: "Toyota Camry",
        plate: "30A-321.09",
        start: "2026-11-08",
        end: "2026-11-10",
        price: 3600000,
        status: "cancelled"
    }
];

const statusLabels = {
    confirmed: "Đã xác nhận",
    pending: "Chờ xác nhận",
    active: "Đang thuê",
    cancelled: "Đã hủy"
};

const statusColors = {
    confirmed: "confirmed",
    pending: "pending",
    active: "active",
    cancelled: "cancelled"
};

/* ==========================
   CALENDAR
========================== */

let currentDate = new Date(2026, 10, 9);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatVietnameseDate(dateString) {
    const [year, month, day] = dateString.split("-");

    return `${day}/${month}/${year}`;
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3",
        "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9",
        "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    document.getElementById("monthYear").innerText =
        `${monthNames[month]} năm ${year}`;

    const calendar = document.getElementById("calendarDays");
    calendar.innerHTML = "";

    // Ngày đầu tháng
    const firstDay = new Date(year, month, 1);

    // Chuyển Chủ nhật thành vị trí cuối tuần
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // Ngày cuối tháng
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Hiển thị 42 ô để lịch luôn đủ 6 hàng
    const totalCells = 42;

    const today = formatDate(new Date());

    for (let i = 0; i < totalCells; i++) {
        const dayNumber = i - startDay + 1;

        const cellDate = new Date(year, month, dayNumber);
        const dateString = formatDate(cellDate);

        const isCurrentMonth = cellDate.getMonth() === month;
        const isToday = dateString === today;

        const cell = document.createElement("div");

        cell.className = "calendar-day";

        if (!isCurrentMonth) {
            cell.classList.add("other-month");
        }

        if (isToday) {
            cell.classList.add("today");
        }

        cell.innerHTML = `
            <span class="day-number">
                ${cellDate.getDate()}
            </span>
        `;

        // Đơn thuê đang diễn ra trong ngày
        const dayBookings = bookings.filter(booking => {
            return (
                dateString >= booking.start &&
                dateString <= booking.end
            );
        });

        dayBookings.slice(0, 3).forEach(booking => {
            const event = document.createElement("div");

            event.className =
                `calendar-event ${statusColors[booking.status]}`;

            event.innerText =
                `${booking.vehicle} • ${booking.customer}`;

            event.title =
                `${booking.id} - ${booking.customer}`;

            event.addEventListener("click", () => {
                showBookingDetail(booking);
            });

            cell.appendChild(event);
        });

        if (dayBookings.length > 3) {
            const more = document.createElement("div");

            more.className = "more-events";

            more.innerText =
                `+${dayBookings.length - 3} đơn khác`;

            cell.appendChild(more);
        }

        calendar.appendChild(cell);
    }
}

function changeMonth(amount) {
    currentDate.setMonth(
        currentDate.getMonth() + amount
    );

    renderCalendar();
}

function goToday() {
    currentDate = new Date();

    renderCalendar();
}

/* ==========================
   LỌC ĐƠN THUÊ
========================== */

function filterBookings() {
    const search = document
        .getElementById("searchBooking")
        .value.toLowerCase();

    const status = document
        .getElementById("bookingStatus")
        .value;

    const rows = document.querySelectorAll("#bookingTable tr");

    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();

        const matchSearch = text.includes(search);

        const matchStatus =
            !status || row.dataset.status === status;

        const visible = matchSearch && matchStatus;

        row.style.display = visible ? "" : "none";

        if (visible) {
            visibleCount++;
        }
    });

    document.getElementById("emptyBookings").hidden =
        visibleCount > 0;
}

/* ==========================
   POPUP CHI TIẾT ĐƠN
========================== */

function viewBooking(button) {
    const row = button.closest("tr");

    const id = row.cells[0].innerText.trim();

    const booking = bookings.find(item =>
        item.id === id.replace("#", "")
    );

    if (booking) {
        showBookingDetail(booking);
    }
}

function showBookingDetail(booking) {
    document.getElementById("detailBookingId").innerText =
        "#" + booking.id;

    document.getElementById("detailBookingStatus").innerText =
        statusLabels[booking.status];

    document.getElementById("detailCustomer").innerText =
        booking.customer;

    document.getElementById("detailPhone").innerText =
        booking.phone;

    document.getElementById("detailVehicle").innerText =
        booking.vehicle;

    document.getElementById("detailPlate").innerText =
        booking.plate;

    document.getElementById("detailStart").innerText =
        formatVietnameseDate(booking.start);

    document.getElementById("detailEnd").innerText =
        formatVietnameseDate(booking.end);

    document.getElementById("detailTotal").innerText =
        booking.price.toLocaleString("vi-VN") + "đ";

    document.getElementById("bookingModal")
        .classList.add("show");
}

function closeBookingModal() {
    document.getElementById("bookingModal")
        .classList.remove("show");
}

/* ==========================
   TẠO ĐƠN THUÊ MỚI
========================== */

function openBookingModal() {
    document.getElementById("createBookingModal")
        .classList.add("show");
}

function closeCreateModal() {
    document.getElementById("createBookingModal")
        .classList.remove("show");

    document.getElementById("createBookingForm").reset();
}

document.getElementById("createBookingForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const customer =
            document.getElementById("newCustomer").value.trim();

        const phone =
            document.getElementById("newPhone").value.trim();

        const vehicle =
            document.getElementById("newVehicle").value;

        const start =
            document.getElementById("newStart").value;

        const end =
            document.getElementById("newEnd").value;

        const price =
            Number(document.getElementById("newPrice").value);

        if (end < start) {
            alert("Ngày trả xe phải sau ngày nhận xe!");
            return;
        }

        const newId =
            "BK" + String(bookings.length + 1).padStart(3, "0");

        const newBooking = {
            id: newId,
            customer,
            phone,
            vehicle,
            plate: "Chưa cập nhật",
            start,
            end,
            price,
            status: "pending"
        };

        bookings.push(newBooking);

        addBookingToTable(newBooking);

        renderCalendar();
        updateStatistics();

        closeCreateModal();

        alert("Tạo lịch thuê thành công!");
    });

/* ==========================
   THÊM ĐƠN VÀO BẢNG
========================== */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function addBookingToTable(booking) {
    const table = document.getElementById("bookingTable");

    const initials = booking.customer
        .split(" ")
        .map(word => word[0])
        .slice(-2)
        .join("")
        .toUpperCase();

    const row = document.createElement("tr");

    row.dataset.status = booking.status;

    row.innerHTML = `
        <td><strong>#${escapeHTML(booking.id)}</strong></td>

        <td>
            <div class="customer-info">
                <div class="customer-avatar">
                    ${escapeHTML(initials)}
                </div>

                <div>
                    <strong>${escapeHTML(booking.customer)}</strong>
                    <span>${escapeHTML(booking.phone)}</span>
                </div>
            </div>
        </td>

        <td>
            <strong>${escapeHTML(booking.vehicle)}</strong>
            <span class="sub-text">${escapeHTML(booking.plate)}</span>
        </td>

        <td>${formatVietnameseDate(booking.start)}</td>
        <td>${formatVietnameseDate(booking.end)}</td>

        <td class="price">
            ${booking.price.toLocaleString("vi-VN")}đ
        </td>

        <td>
            <span class="booking-status ${booking.status}">
                ${statusLabels[booking.status]}
            </span>
        </td>

        <td>
            <button class="action-btn" onclick="viewBooking(this)">
                👁
            </button>
        </td>
    `;

    table.prepend(row);

    filterBookings();
}

/* ==========================
   CẬP NHẬT THỐNG KÊ
========================== */

function updateStatistics() {
    document.getElementById("totalBookings").innerText =
        bookings.length;

    document.getElementById("activeBookings").innerText =
        bookings.filter(b => b.status === "active").length;

    document.getElementById("upcomingBookings").innerText =
        bookings.filter(b => b.status === "confirmed").length;

    document.getElementById("pendingBookings").innerText =
        bookings.filter(b => b.status === "pending").length;
}

/* ==========================
   XUẤT CSV
========================== */

function exportBookings() {
    const rows = document.querySelectorAll("#bookingTable tr");

    let csv =
        "Ma don,Khach hang,So dien thoai,Xe,Ngay nhan,Ngay tra,Tong tien,Trang thai\n";

    rows.forEach(row => {
        if (row.style.display === "none") return;

        const cells = row.querySelectorAll("td");

        if (cells.length) {
            const values = [
                cells[0].innerText,
                cells[1].innerText,
                cells[2].innerText,
                cells[3].innerText,
                cells[4].innerText,
                cells[5].innerText,
                cells[6].innerText
            ];

            csv += values
                .map(value => `"${value.replace(/"/g, '""')}"`)
                .join(",") + "\n";
        }
    });

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "danh-sach-don-thue.csv";

    link.click();

    URL.revokeObjectURL(url);
}

/* ==========================
   ĐÓNG POPUP KHI CLICK NỀN
========================== */

document.querySelectorAll(".booking-modal").forEach(modal => {
    modal.addEventListener("click", function (event) {
        if (event.target === this) {
            this.classList.remove("show");
        }
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeBookingModal();
        closeCreateModal();
    }
});

/* ==========================
   KHỞI TẠO GIAO DIỆN
========================== */

renderCalendar();
updateStatistics();