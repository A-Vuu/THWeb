// Khởi tạo giỏ hàng từ LocalStorage hoặc mảng rỗng
let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];

// Hàm lưu giỏ hàng vào LocalStorage
function saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
    updateCartUI();
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
    
    if (existingItem) {
        existingItem.quantity += parseInt(product.quantity);
    } else {
        cart.push(product);
    }
    
    saveCart();
    openCart();
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Hàm cập nhật số lượng trong giỏ hàng
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        removeFromCart(index);
    } else {
        saveCart();
    }
}

// Hàm mở giỏ hàng
function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}

// Hàm đóng giỏ hàng
function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

// Hàm cập nhật giao diện giỏ hàng
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total-price');
    
    // Cập nhật số lượng hiển thị trên icon
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalQty;
    
    // Hiển thị danh sách sản phẩm
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const priceNum = parseInt(item.price.replace(/\D/g, ''));
        total += priceNum * item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Size: ${item.size} | ${item.price}</p>
                <div class="cart-item-qty">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <i class="fa-solid fa-trash remove-item" onclick="removeFromCart(${index})"></i>
        `;
        cartItems.appendChild(itemEl);
    });
    
    cartTotal.innerText = total.toLocaleString('vi-VN') + 'đ';
}

// Tạo cấu trúc HTML cho giỏ hàng khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    const cartHTML = `
        <div id="cart-overlay" onclick="closeCart()"></div>
        <div id="cart-drawer">
            <div class="cart-header">
                <h3>Giỏ Hàng Của Bạn</h3>
                <i class="fa-solid fa-xmark" onclick="closeCart()"></i>
            </div>
            <div id="cart-items">
                <!-- Sản phẩm sẽ hiện ở đây -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Tổng cộng:</span>
                    <span id="cart-total-price">0đ</span>
                </div>
                <button class="btn checkout-btn">Thanh Toán Ngay</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    
    // Thêm badge số lượng vào icon giỏ hàng
    const cartIcon = document.querySelector('.fa-cart-shopping');
    if (cartIcon) {
        cartIcon.parentElement.style.position = 'relative';
        cartIcon.insertAdjacentHTML('afterend', '<span class="cart-count">0</span>');
        cartIcon.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    updateCartUI();
});
