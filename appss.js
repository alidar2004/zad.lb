// Get DOM Elements
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;

nextDom.onclick = function () {
    showSlider('next');
};

prevDom.onclick = function () {
    showSlider('prev');
};

let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextDom.click();
}, timeAutoNext);

function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.list .item');
    let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next', 'prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextDom.click();
    }, timeAutoNext);
}

function showSidebar() {
    document.querySelector('.sidebar').style.display = 'flex';
}

function hideSidebar() {
    document.querySelector('.sidebar').style.display = 'none';
}

let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function () {
    if (cart.style.right === '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', function () {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

let products = null;
fetch('product.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        products = data;
        addDataToHTML();
    })
    .catch(error => console.error('Error fetching product data:', error));

function addDataToHTML() {
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    if (products && products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button onclick="addCart(${product.id})">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

let listCart = [];
function checkCart() {
    let cookie = document.cookie.split('; ').find(row => row.startsWith('listCart='));
    if (cookie) {
        try {
            listCart = JSON.parse(cookie.split('=')[1]);
        } catch (e) {
            console.error('Error parsing cart cookie:', e);
            listCart = [];
        }
    }
}
checkCart();

function addCart(idProduct) {
    let productInCart = listCart.find(item => item && item.id === idProduct);
    if (!productInCart) {
        let product = products.find(p => p.id === idProduct);
        product.quantity = 1;
        listCart.push(product);
    } else {
        productInCart.quantity++;
    }
    document.cookie = `listCart=${JSON.stringify(listCart)}; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;`;
    addCartToHTML();
}

function addCartToHTML() {
    let listCartHTML = document.querySelector('.listCart');
    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    listCartHTML.innerHTML = '';

    if (listCart && listCart.length > 0) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                    <img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price} / 1 product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

function changeQuantity(idProduct, type) {
    let productInCart = listCart.find(item => item && item.id === idProduct);
    if (type === '+') {
        productInCart.quantity++;
    } else if (type === '-') {
        productInCart.quantity--;
        if (productInCart.quantity <= 0) {
            listCart = listCart.filter(item => item.id !== idProduct);
        }
    }
    document.cookie = `listCart=${JSON.stringify(listCart)}; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;`;
    addCartToHTML();
}
