// بيانات المنتجات (يمكنك تعديلها وإضافة المزيد)
const products = [
    { id: 1, name: 'خاتم عقيق يمني كبدي', category: 'عقيق', price: 450, oldPrice: 600, badge: 'new', imageIcon: 'fa-ring' },
    { id: 2, name: 'مسباح يسر مطعم بفضة', category: 'مسباح', price: 250, oldPrice: null, badge: 'hot', imageIcon: 'fa-praying-hands' },
    { id: 3, name: 'سبحة عقيق يماني أصلي', category: 'سبح', price: 350, oldPrice: 420, badge: 'sale', imageIcon: 'fa-gem' },
    { id: 4, name: 'حجر زمرد طبيعي', category: 'أحجار كريمة', price: 1200, oldPrice: 1500, badge: null, imageIcon: 'fa-gem' },
    { id: 5, name: 'خاتم عقيق شرف الشمس', category: 'عقيق', price: 300, oldPrice: null, badge: 'new', imageIcon: 'fa-ring' },
    { id: 6, name: 'سبحة كهرمان', category: 'سبح', price: 550, oldPrice: 650, badge: 'sale', imageIcon: 'fa-gem' }
];

// السلة
let cart = JSON.parse(localStorage.getItem('yemeniAgateCart')) || [];

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    
    // عرض المنتجات المميزة في الصفحة الرئيسية
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        renderProducts(products.slice(0, 4), featuredContainer);
    }

    // عرض كل المنتجات في صفحة المنتجات
    const allProductsContainer = document.getElementById('allProducts');
    if (allProductsContainer) {
        renderProducts(products, allProductsContainer);
    }
});

// دالة عرض المنتجات
function renderProducts(productsArray, container) {
    container.innerHTML = productsArray.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${product.imageIcon}"></i>
                <div class="product-badges">
                    ${product.badge === 'new' ? '<span class="product-badge badge-new">جديد</span>' : ''}
                    ${product.badge === 'sale' ? '<span class="product-badge badge-sale">تخفيض</span>' : ''}
                    ${product.badge === 'hot' ? '<span class="product-badge badge-hot">الأكثر مبيعاً</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <a href="https://wa.me/966501234567?text=مرحباً، أريد الاستفسار عن منتج: ${product.name}" class="action-btn whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h4 class="product-name">${product.name}</h4>
                <div class="product-price">
                    <span class="current-price">${product.price} ريال</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ريال</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// فلترة المنتجات (في صفحة المنتجات)
function filterProducts(category) {
    // تفعيل الزر النشط
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.trim() === category || (category === 'all' && tab.textContent.trim() === 'الكل')) {
            tab.classList.add('active');
        }
    });

    const allProductsContainer = document.getElementById('allProducts');
    if (!allProductsContainer) return;

    if (category === 'all') {
        renderProducts(products, allProductsContainer);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered, allProductsContainer);
    }
}

// التحكم بالسلة
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showToast();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) removeFromCart(productId);
        else saveCart();
    }
}

function saveCart() {
    localStorage.setItem('yemeniAgateCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) cartCountElement.textContent = count;
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>السلة فارغة</p>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            <div class="cart-item-image">
                <i class="fas ${item.imageIcon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ريال</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) cartTotalElement.textContent = `${total} ريال`;
    if (cartFooter) cartFooter.style.display = 'block';
}

// عرض رسالة التنبيه (Toast)
function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// إتمام الطلب عبر الواتساب
function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let text = "مرحباً، أود إتمام هذا الطلب من المتجر:%0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        text += `${index + 1}. ${item.name} - العدد: ${item.quantity} - السعر: ${item.price * item.quantity} ريال%0A`;
        total += (item.price * item.quantity);
    });

    text += `%0A*الإجمالي الكلي: ${total} ريال*%0A%0Aالرجاء تزويدي بتفاصيل الدفع والشحن.`;
    
    const whatsappUrl = `https://wa.me/966501234567?text=${text}`;
    window.open(whatsappUrl, '_blank');
}