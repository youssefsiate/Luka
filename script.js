// Luka E-commerce Website JavaScript
// Shopping Cart Functionality

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('lukaCart')) || [];
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

// Update cart count display
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Add item to cart
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price.replace('$', '')),
            image: image,
            quantity: 1
        });
    }

    cartCount += 1;
    localStorage.setItem('lukaCart', JSON.stringify(cart));
    updateCartCount();
    alert('Article ajouté au panier !');
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        localStorage.setItem('lukaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

// Update item quantity in cart
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const quantityDiff = newQuantity - item.quantity;
        item.quantity = newQuantity;
        cartCount += quantityDiff;
        localStorage.setItem('lukaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-white">Votre panier est vide.</p></div>';
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="col-md-12 mb-3">
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid">
                        </div>
                        <div class="col-md-4">
                            <h5 class="text-white">${item.name}</h5>
                        </div>
                        <div class="col-md-2">
                            <p class="text-gold fw-bold">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control bg-dark text-white border-gold quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}">
                        </div>
                        <div class="col-md-1">
                            <p class="text-white fw-bold">$${itemTotal.toFixed(2)}</p>
                        </div>
                        <div class="col-md-1">
            <button class="remove-btn" data-product-id="${item.id}">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cartItemsContainer.innerHTML += cartItemHTML;
    });

    if (cartTotalElement) cartTotalElement.textContent = total.toFixed(2);

    // Add event listeners for quantity changes and remove buttons
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const newQuantity = parseInt(e.target.value);
            updateQuantity(productId, newQuantity);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Handle add to cart button clicks
function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const card = e.target.closest('.card-body');
            const name = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.text-gold').textContent;
            const image = e.target.closest('.card').querySelector('.card-img-top').src;

            addToCart(productId, name, price, image);
        });
    });
}

// Handle checkout modal
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Votre panier est vide !');
            } else {
                showPaymentMethodStep();
            }
        });
    }
}

// Show personal information step
function showPersonalInfoStep(selectedMethod) {
    document.getElementById('payment-method-step').style.display = 'none';
    document.getElementById('personal-info-step').style.display = 'block';
    document.getElementById('payment-details-step').style.display = 'none';
    document.getElementById('back-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'inline-block';
    document.getElementById('pay-now-btn').style.display = 'none';

    // Store selected method for later use
    window.selectedPaymentMethod = selectedMethod;
}

// Handle personal information form submission
function setupPersonalInfoForm() {
    const nextBtn = document.getElementById('next-btn');
    const personalInfoForm = document.getElementById('personal-info-form');

    if (nextBtn && personalInfoForm) {
        nextBtn.addEventListener('click', () => {
            // Validate personal info form
            const requiredFields = personalInfoForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            // Proceed to payment details step
            showPaymentDetailsStep(window.selectedPaymentMethod);
        });
    }
}

// Show payment method selection step
function showPaymentMethodStep() {
    document.getElementById('payment-method-step').style.display = 'block';
    document.getElementById('payment-details-step').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('pay-now-btn').style.display = 'none';
}

// Show payment details step
function showPaymentDetailsStep(selectedMethod) {
    document.getElementById('payment-method-step').style.display = 'none';
    document.getElementById('personal-info-step').style.display = 'none';
    document.getElementById('payment-details-step').style.display = 'block';
    document.getElementById('back-btn').style.display = 'inline-block';
    document.getElementById('pay-now-btn').style.display = 'inline-block';

    // Display selected method
    const methodNames = {
        'visa': 'Visa',
        'mastercard': 'Mastercard',
        'amex': 'American Express',
        'paypal': 'PayPal'
    };
    document.getElementById('selected-method').textContent = methodNames[selectedMethod] || selectedMethod;

    // Check payment option
    const paymentOption = document.querySelector('input[name="payment-option"]:checked').value;

    if (paymentOption === 'pay-delivery') {
        // For pay on delivery, show delivery confirmation
        document.getElementById('card-details-form').style.display = 'none';
        document.getElementById('paypal-confirmation').style.display = 'none';
        document.getElementById('delivery-confirmation').style.display = 'block';
    } else {
        // For pay now, show appropriate payment form
        if (selectedMethod === 'paypal') {
            document.getElementById('card-details-form').style.display = 'none';
            document.getElementById('paypal-confirmation').style.display = 'block';
            document.getElementById('delivery-confirmation').style.display = 'none';
        } else {
            document.getElementById('card-details-form').style.display = 'block';
            document.getElementById('paypal-confirmation').style.display = 'none';
            document.getElementById('delivery-confirmation').style.display = 'none';
        }
    }

    // Populate order summary
    populateOrderSummary();
}

// Handle payment method selection
function setupPaymentMethodSelection() {
    document.querySelectorAll('.payment-method-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedMethod = e.currentTarget.getAttribute('data-method');
            showPersonalInfoStep(selectedMethod);
        });
    });

    // Handle back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPaymentMethodStep();
        });
    }
}

// Populate order summary in payment modal
function populateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const modalTotal = document.getElementById('modal-total');

    if (!orderSummary || !modalTotal) return;

    orderSummary.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span class="text-white">${item.name} (x${item.quantity})</span>
                <span class="text-gold">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
        orderSummary.innerHTML += itemHTML;
    });

    modalTotal.textContent = total.toFixed(2);
}

// Handle payment form submission
function setupPaymentForm() {
    const payNowBtn = document.getElementById('pay-now-btn');
    const paymentForm = document.getElementById('payment-form');

    if (payNowBtn && paymentForm) {
        payNowBtn.addEventListener('click', () => {
            const selectedMethod = document.getElementById('selected-method').textContent;
            const paymentOption = document.querySelector('input[name="payment-option"]:checked').value;

            // For pay on delivery, no payment processing needed
            if (paymentOption === 'pay-delivery') {
                // Simulate order placement
                payNowBtn.disabled = true;
                payNowBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Placing Order...';

                setTimeout(() => {
                    // Clear cart after successful order
                    cart = [];
                    cartCount = 0;
                    localStorage.setItem('lukaCart', JSON.stringify(cart));
                    updateCartCount();

                    // Close modal and show success message
                    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                    modal.hide();

                    payNowBtn.disabled = false;
                    payNowBtn.innerHTML = 'Payer maintenant';

                    // Show success alert
                    alert('Commande passée avec succès ! Le paiement sera collecté à la livraison.');

                    // Re-render cart (will show empty)
                    renderCart();
                }, 2000);
                return;
            }

            // For PayPal, skip form validation and simulate redirect
            if (selectedMethod === 'PayPal') {
                // Simulate PayPal redirect
                payNowBtn.disabled = true;
                payNowBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Redirecting to PayPal...';

                setTimeout(() => {
                    // Clear cart after successful payment
                    cart = [];
                    cartCount = 0;
                    localStorage.setItem('lukaCart', JSON.stringify(cart));
                    updateCartCount();

                    // Close modal and show success message
                    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                    modal.hide();

                    payNowBtn.disabled = false;
                payNowBtn.innerHTML = 'Payer maintenant';

                // Show success alert
                alert('Paiement réussi ! Merci pour votre achat.');

                    // Re-render cart (will show empty)
                    renderCart();
                }, 2000);
                return;
            }

            // For card payments, validate form
            const requiredFields = paymentForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            // Simulate payment processing
            payNowBtn.disabled = true;
            payNowBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

            setTimeout(() => {
                // Clear cart after successful payment
                cart = [];
                cartCount = 0;
                localStorage.setItem('lukaCart', JSON.stringify(cart));
                updateCartCount();

                // Close modal and show success message
                const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                modal.hide();

                // Reset form
                paymentForm.reset();
                payNowBtn.disabled = false;
                payNowBtn.innerHTML = 'Payer maintenant';

                // Show success alert
                alert('Paiement réussi ! Merci pour votre achat.');

                // Re-render cart (will show empty)
                renderCart();
            }, 2000);
        });
    }
}

// Product search functionality
function setupProductSearch() {
    const searchInput = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    const productsContainer = document.getElementById('products-container');

    if (!searchInput || !productsContainer) return;

    // Get all product cards
    const productCards = Array.from(productsContainer.querySelectorAll('.col-lg-3'));

    function filterProducts(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        productCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();

            if (title.includes(term) || description.includes(term) || term === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Search on input
    searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            filterProducts(searchInput.value);
        });
    }

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterProducts(searchInput.value);
        }
    });
}

// Real-time validation for payment forms
function setupRealTimeValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', validateField);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;

    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');

    // Remove existing feedback
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'L\'email est requis');
        } else if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Veuillez saisir une adresse email valide');
        } else {
            field.classList.add('is-valid');
        }
        return;
    }

    // Card number validation
    if (fieldName === 'card-number') {
        const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
        if (value === '') {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Le numéro de carte est requis');
        } else if (!cardRegex.test(value.replace(/\s/g, ''))) {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Veuillez saisir un numéro de carte valide');
        } else {
            field.classList.add('is-valid');
        }
        return;
    }

    // Expiry date validation
    if (fieldName === 'expiry-date') {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (value === '') {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'La date d\'expiration est requise');
        } else if (!expiryRegex.test(value)) {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Veuillez saisir une date d\'expiration valide (MM/AA)');
        } else {
            field.classList.add('is-valid');
        }
        return;
    }

    // CVV validation
    if (fieldName === 'cvv') {
        const cvvRegex = /^\d{3,4}$/;
        if (value === '') {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Le CVV est requis');
        } else if (!cvvRegex.test(value)) {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Veuillez saisir un CVV valide');
        } else {
            field.classList.add('is-valid');
        }
        return;
    }

    // General required field validation
    if (field.hasAttribute('required')) {
        if (value === '') {
            field.classList.add('is-invalid');
            showValidationFeedback(field, 'Ce champ est requis');
        } else {
            field.classList.add('is-valid');
        }
    }
}

function showValidationFeedback(field, message) {
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    field.parentNode.appendChild(feedback);
}

// Newsletter subscription
function setupNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                // Simulate subscription
                alert('Merci de vous être abonné ! Vous recevrez nos dernières mises à jour.');
                emailInput.value = '';
                emailInput.classList.remove('is-valid', 'is-invalid');
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupAddToCartButtons();
    setupCheckout();
    setupPaymentForm();
    setupPaymentMethodSelection();
    setupPersonalInfoForm();
    setupProductSearch();
    setupRealTimeValidation();
    setupNewsletter();
    renderCart();
});
