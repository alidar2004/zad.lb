


function showSidebar() {
  document.querySelector('.sidebar').style.display = 'flex';
}

function hideSidebar() {
  document.querySelector('.sidebar').style.display = 'none';
}
function hideSidebarm() {
  document.querySelector('.cart-sidebar').style.display = 'none';
}
// Cart Logic
const cart = [];
const cartSidebar = document.querySelector(".cart-sidebar");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const deliveryCheckbox = document.getElementById("delivery-checkbox");

// Toggle Cart Sidebar
function toggleCart() {
  cartSidebar.classList.toggle("active");
}

// Add Item to Cart
function addToCart(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return; // If item not found, exit

  const existingItem = cart.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCart();
}

// Update Cart Display
function updateCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <span>${item.name}</span>
      <span>x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });

  if (deliveryCheckbox.checked) {
    total += 4;
  }

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Delivery Checkbox Listener
deliveryCheckbox.addEventListener("change", updateCart);

// Example Items
const items = [
  { id: 1, name: "Prayer Mat", price: 20, image:"../img/most1.jpd" },
  { id: 2, name: "Tasbeeh", price: 10, image: "https://via.placeholder.com/100" },
  { id: 3, name: "Quran", price: 25, image: "https://via.placeholder.com/100" },
];

// Render Items
const itemContainer = document.querySelector(".item-container");

items.forEach(item => {
  const card = document.createElement("div");
  card.className = "item-card";
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="item-image">
    <h2>${item.name}</h2>
    <p>$${item.price}</p>
    <button onclick="addToCart(${item.id})">Add to Cart</button>
  `;
  itemContainer.appendChild(card);
});

// Save Cart to Local Storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}