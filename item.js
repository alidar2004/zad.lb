const cart = [];
const cartItemsList = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");

// Function to update the cart display
function updateCartDisplay() {
  cartItemsList.innerHTML = ""; // Clear the cart display
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
      ${item.name} - $${item.price} x ${item.quantity}
      <div class="cart-item-controls">
        <button class="decrement" data-id="${item.id}">-</button>
        <button class="increment" data-id="${item.id}">+</button>
      </div>
    `;
    cartItemsList.appendChild(cartItem);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Function to handle "Add to Cart" button click
function addToCart(event) {
  const button = event.target;
  const itemCard = button.closest(".item-card");
  const id = itemCard.getAttribute("data-id");
  const name = itemCard.getAttribute("data-name");
  const price = parseFloat(itemCard.getAttribute("data-price"));

  // Check if item already exists in the cart
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  // Update the cart display
  updateCartDisplay();
}

// Function to update item quantities
function updateQuantity(event) {
  const button = event.target;
  const id = button.getAttribute("data-id");
  const action = button.classList.contains("increment") ? "increment" : "decrement";

  const item = cart.find((item) => item.id === id);
  if (item) {
    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement" && item.quantity > 1) {
      item.quantity -= 1;
    } else if (action === "decrement" && item.quantity === 1) {
      cart.splice(cart.indexOf(item), 1); // Remove item from cart
    }
  }

  updateCartDisplay();
}

// Add event listeners to "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Add event listener for cart increment/decrement buttons
cartItemsList.addEventListener("click", (event) => {
  if (event.target.classList.contains("increment") || event.target.classList.contains("decrement")) {
    updateQuantity(event);
  }
});
// Function to handle the Buy Now button
function handleBuyNow() {
    if (cart.length === 0) {
      alert("عزيزي المشتري,يجب اختيار منتج واحد على الأقل للطلب");
      return;
    }
  
    // Clear the cart
    cart.length = 0; // Empty the cart array
    updateCartDisplay(); // Refresh the cart display
  
    // Show confirmation message
    alert("شكراا لكم");
  }
  
  // Add event listener to the Buy Now button
  document.getElementById("buy-button").addEventListener("click", handleBuyNow);