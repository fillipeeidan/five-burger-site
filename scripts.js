/* ==========================================================================
   INTERACTIVE LOGIC - HAMBURGUERIA FIVE BURGER
   Aesthetic: High-End Custom Scroll seeking & Smooth Cart Mechanics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL-CONTROLLED VIDEO HERO PLAYBACK (With Lerp Interpolation)
    const heroSection = document.getElementById('hero-section');
    const video = document.getElementById('hero-video');
    
    let targetTime = 0;
    let currentTime = 0;
    const ease = 0.08; // Butter-smooth linear interpolation factor
    
    // Calculate scroll position and set target time in video
    function handleVideoScroll() {
        if (!heroSection || !video || isNaN(video.duration)) return;
        
        const rect = heroSection.getBoundingClientRect();
        const scrollOffset = -rect.top;
        const totalScrollableHeight = heroSection.scrollHeight - window.innerHeight;
        
        // Calculate scroll progress fraction (0 to 1)
        let scrollFraction = scrollOffset / totalScrollableHeight;
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));
        
        targetTime = scrollFraction * video.duration;
    }
    
    // Animation frame loop to smoothly transition video currentTime
    function updateVideo() {
        if (video && !isNaN(video.duration)) {
            // Lerp math: current = current + (target - current) * ease
            currentTime += (targetTime - currentTime) * ease;
            
            // Limit precision to avoid minor jittering
            if (Math.abs(currentTime - targetTime) > 0.005) {
                video.currentTime = currentTime;
            }
        }
        requestAnimationFrame(updateVideo);
    }
    
    // Listen to scroll events on window
    window.addEventListener('scroll', handleVideoScroll, { passive: true });
    
    // Pre-initialize video and start update loop when metadata is ready
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            handleVideoScroll();
            requestAnimationFrame(updateVideo);
        });
        
        // Safety fallback if video metadata was cached
        if (video.readyState >= 1) {
            handleVideoScroll();
            requestAnimationFrame(updateVideo);
        }
    }

    // 2. STICKY HEADER SCROLL EFFECT
    const mainNav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // 3. MOBILE MENU TOGGLE
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Toggle hamburger icon lines to an X
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'fixed';
                navMenu.style.top = '90px';
                navMenu.style.left = '24px';
                navMenu.style.width = 'calc(100% - 48px)';
                navMenu.style.background = 'rgba(15, 15, 15, 0.95)';
                navMenu.style.padding = '40px';
                navMenu.style.borderRadius = '24px';
                navMenu.style.border = '1px solid rgba(255,255,255,0.08)';
                navMenu.style.gap = '24px';
                navMenu.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                navMenu.style.display = '';
            }
        });

        // Close mobile menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    mobileToggle.click();
                }
            });
        });
    }

    // 4. CARDÁPIO TABS FILTERING
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-grid .menu-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            menuCards.forEach(card => {
                const cardCat = card.getAttribute('data-item-category');
                
                // Hide with transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (category === 'todos' || cardCat === category) {
                        card.style.display = 'flex';
                        // Trigger fade in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 5. TESTIMONIALS CAROUSEL
    const reviewsTrack = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    let currentSlide = 0;
    
    function getSlidesVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    function updateCarousel() {
        if (!reviewsTrack) return;
        const totalCards = reviewsTrack.querySelectorAll('.testimonial-card').length;
        const visibleSlides = getSlidesVisible();
        const maxSlide = totalCards - visibleSlides;
        
        if (currentSlide > maxSlide) currentSlide = maxSlide;
        if (currentSlide < 0) currentSlide = 0;
        
        const cardWidth = reviewsTrack.querySelector('.testimonial-card').offsetWidth;
        const offset = currentSlide * (cardWidth + 30); // 30 is the gap in css
        reviewsTrack.style.transform = `translateX(-${offset}px)`;
    }
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const totalCards = reviewsTrack.querySelectorAll('.testimonial-card').length;
            const visibleSlides = getSlidesVisible();
            if (currentSlide < totalCards - visibleSlides) {
                currentSlide++;
                updateCarousel();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });
        
        window.addEventListener('resize', updateCarousel);
    }

    // 6. SCROLL REVEAL EFFECT
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 6.5. PRODUCT DETAIL MODAL
    const productModalOverlay = document.getElementById('product-modal-overlay');
    const productModal = document.getElementById('product-modal');
    const modalProductImg = document.getElementById('modal-product-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnModalAdd = document.getElementById('btn-modal-add');
    
    let currentModalProduct = null; // Store product details when modal is open
    
    // Open Modal
    function openProductModal(event) {
        const card = event.currentTarget.closest('.menu-card');
        if (!card) return;
        
        const name = card.querySelector('.menu-card-title').textContent;
        const imgAttr = card.querySelector('.menu-card-img').getAttribute('src');
        const imgFullUrl = card.querySelector('.menu-card-img').src;
        const desc = card.querySelector('.menu-card-desc').textContent;
        const priceText = card.querySelector('.menu-card-price').textContent;
        
        // Parse numerical price
        const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
        
        // Store current product data for add-to-cart
        currentModalProduct = { name, price, img: imgAttr };
        
        // Populate modal contents
        modalTitle.textContent = name;
        modalDesc.textContent = desc;
        modalPrice.textContent = priceText;
        modalProductImg.src = imgFullUrl;
        modalProductImg.alt = name;
        
        // Show modal
        productModalOverlay.classList.add('active');
        productModal.classList.add('active');
    }
    
    // Close Modal
    function closeProductModal() {
        productModalOverlay.classList.remove('active');
        productModal.classList.remove('active');
        currentModalProduct = null;
    }
    
    // Bind click event to menu card descriptions
    const cardDescriptions = document.querySelectorAll('.menu-card-desc');
    cardDescriptions.forEach(desc => {
        desc.addEventListener('click', openProductModal);
    });
    
    // Bind close events
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeProductModal);
    }
    if (productModalOverlay) {
        productModalOverlay.addEventListener('click', closeProductModal);
    }
    
    // Bind Escape key to close modal
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && productModal && productModal.classList.contains('active')) {
            closeProductModal();
        }
    });
    
    // Bind Add to Cart inside modal
    if (btnModalAdd) {
        btnModalAdd.addEventListener('click', () => {
            if (currentModalProduct) {
                addToCart(currentModalProduct.name, currentModalProduct.price, currentModalProduct.img);
                closeProductModal();
            }
        });
    }

    // Cart Order Type Selector Interactivity
    const orderTypeBtns = document.querySelectorAll('.order-type-btn');
    const addressBlock = document.getElementById('cart-delivery-address');
    const addressInput = document.getElementById('delivery-address-input');
    
    orderTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            orderTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const radio = btn.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Show address block only for delivery
                if (addressBlock) {
                    addressBlock.style.display = radio.value === 'delivery' ? 'flex' : 'none';
                }
                
                updateCheckoutButton();
            }
        });
    });

    if (addressInput) {
        addressInput.addEventListener('input', () => {
            updateCheckoutButton();
        });
    }

    // Initial checkout button state setup
    updateCheckoutButton();
});

// Helper for banner highlights redirection & auto filter
function scrollAndFilter(category) {
    const cardapioSection = document.getElementById('cardapio');
    if (cardapioSection) {
        cardapioSection.scrollIntoView({ behavior: 'smooth' });
        const targetTab = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (targetTab) {
            setTimeout(() => targetTab.click(), 500);
        }
    }
}

/* ==========================================================================
   7. SHOPPING CART SYSTEM
   ========================================================================== */
let cart = [];

// DOM Elements
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const floatingCartBtn = document.getElementById('floating-cart-btn');
const floatingCartCount = document.getElementById('floating-cart-count');

// Toggle Cart Drawer
function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartDrawer.classList.toggle('active');
}

// Add Item to Cart
function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    
    updateCartUI();
    
    // Automatically open the cart drawer for instant feedback
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
}

// Change Quantity
function changeQty(name, delta) {
    const item = cart.find(item => item.name === name);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }
    
    updateCartUI();
}

// Calculate and Update UI elements
function updateCartUI() {
    // Calculate quantities & totals
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Update count badges
    cartCount.textContent = totalItems;
    floatingCartCount.textContent = totalItems;
    
    // Show/Hide Floating Button based on empty state
    if (totalItems > 0) {
        floatingCartBtn.classList.add('visible');
    } else {
        floatingCartBtn.classList.remove('visible');
    }
    
    // Render list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <div class="cart-empty-icon">
                    <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <h3>Sua sacola está vazia</h3>
                <p>Navegue pelo nosso cardápio e adicione seus lanches favoritos.</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" onclick="changeQty('${item.name}', -1)">-</button>
                    <span class="cart-qty-num">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update total price text
    cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    
    // Sync checkout button state
    updateCheckoutButton();
}

// Update Checkout Button State & Styling dynamically
function updateCheckoutButton() {
    const btnCheckout = document.querySelector('.btn-checkout');
    const selectedTypeInput = document.querySelector('input[name="order-type"]:checked');
    if (!btnCheckout || !selectedTypeInput) return;
    
    const selectedType = selectedTypeInput.value;
    const isCartEmpty = cart.length === 0;
    
    // Read address input
    const addressInput = document.getElementById('delivery-address-input');
    const addressValue = addressInput ? addressInput.value.trim() : '';
    
    if (isCartEmpty) {
        if (selectedType === 'reserva') {
            btnCheckout.style.opacity = '1';
            btnCheckout.style.cursor = 'pointer';
            btnCheckout.style.pointerEvents = 'auto';
            const btnSpan = btnCheckout.querySelector('span');
            if (btnSpan) btnSpan.textContent = 'Reservar Mesa via WhatsApp';
        } else {
            btnCheckout.style.opacity = '0.5';
            btnCheckout.style.cursor = 'not-allowed';
            btnCheckout.style.pointerEvents = 'none';
            const btnSpan = btnCheckout.querySelector('span');
            if (btnSpan) btnSpan.textContent = 'Finalizar via WhatsApp';
        }
    } else {
        // If cart has items, check if it's delivery and if address is empty
        if (selectedType === 'delivery' && !addressValue) {
            btnCheckout.style.opacity = '0.5';
            btnCheckout.style.cursor = 'not-allowed';
            btnCheckout.style.pointerEvents = 'none';
            const btnSpan = btnCheckout.querySelector('span');
            if (btnSpan) btnSpan.textContent = 'Digite o endereço de entrega';
        } else {
            btnCheckout.style.opacity = '1';
            btnCheckout.style.cursor = 'pointer';
            btnCheckout.style.pointerEvents = 'auto';
            const btnSpan = btnCheckout.querySelector('span');
            if (btnSpan) {
                if (selectedType === 'reserva') {
                    btnSpan.textContent = 'Reservar e Adiantar Pedido';
                } else if (selectedType === 'retirada') {
                    btnSpan.textContent = 'Pedir para Retirada';
                } else {
                    btnSpan.textContent = 'Finalizar via WhatsApp';
                }
            }
        }
    }
}

// Format Order and Checkout to WhatsApp
function checkoutWhatsApp() {
    const selectedTypeInput = document.querySelector('input[name="order-type"]:checked');
    const selectedType = selectedTypeInput ? selectedTypeInput.value : 'delivery';
    const isCartEmpty = cart.length === 0;
    
    const addressInput = document.getElementById('delivery-address-input');
    const addressValue = addressInput ? addressInput.value.trim() : '';
    
    // Prevent checkout for empty cart in delivery or retirada modes
    if (isCartEmpty && selectedType !== 'reserva') return;
    
    // Prevent checkout for delivery mode if address is empty
    if (selectedType === 'delivery' && !isCartEmpty && !addressValue) return;
    
    let message = `🍔 *Novo Pedido - Five Burger SP* \n\n`;
    
    if (selectedType === 'delivery') {
        message += `Olá! Gostaria de fazer o seguinte pedido para *Delivery*:\n`;
    } else if (selectedType === 'retirada') {
        message += `Olá! Gostaria de fazer o seguinte pedido para *Retirada no Balcão*:\n`;
    } else if (selectedType === 'reserva') {
        if (isCartEmpty) {
            message = `Olá! Gostaria de fazer uma *Reserva de Mesa* na hamburgueria. \n\nPor favor, me confirme a disponibilidade de datas e horários!`;
        } else {
            message += `Olá! Gostaria de fazer uma *Reserva de Mesa* e já adiantar o seguinte pedido:\n`;
        }
    }
    
    if (!isCartEmpty) {
        message += `--------------------------------------\n`;
        cart.forEach(item => {
            message += `*${item.quantity}x* ${item.name} — R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });
        message += `--------------------------------------\n`;
        
        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        message += `*Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}\n\n`;
        
        if (selectedType === 'delivery') {
            message += `📍 *Endereço de Entrega:* ${addressValue}\n\n`;
            message += `Por favor, envie o tempo estimado de entrega e as formas de pagamento!`;
        } else if (selectedType === 'retirada') {
            message += `Por favor, me informe em quanto tempo o pedido ficará pronto para que eu possa ir retirar!`;
        } else if (selectedType === 'reserva') {
            message += `Gostaria de agendar a reserva. Por favor, me confirme se há mesas disponíveis e quais são os horários!`;
        }
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511922035606?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}
