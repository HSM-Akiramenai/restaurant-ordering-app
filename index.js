// Import menu data from external source
import menuArray from "/data.js";

const orderPlaced = document.getElementById("order-placed");
const checkoutSection = document.getElementById("checkout-section");
const paymentSection = document.getElementById("payment-section");
// Initialize an array to store items added to checkout
const checkoutArray = [];

// Add event listener for clicks on the document
document.addEventListener("click", (e) => {
  // Check if the clicked element has a data-add attribute
  // If yes, handle adding item to checkout
  // Else check if the clicked element has a data-remove attribute
  // If yes, handle removing item from checkout
  if (e.target.dataset.add) {
    handleAddBtnClick(Number(e.target.dataset.add));
  } else if (e.target.dataset.remove) {
    handleRemoveBtnClick(Number(e.target.dataset.remove));
  } else if (e.target.id === "checkout-order-btn") {
    handleCompleteOrderBtnClick();
  } else if (e.target.id === "payment-form-btn") {
    handlePayBtnClick(e);
  }
});

// Render the menu items on the page
renderMenu(menuArray);

function renderMenu(menuItems) {
  // Render each menu item and update the menu section's inner HTML
  document.getElementById("menu-section").innerHTML = menuItems
    .map((menuItem) => {
      const { name, ingredients, id, price, img, altText } = menuItem;
      // Add a data attribute to the button and span element and set its value to the id of the current item so the id can be accessed when clicking on the button.
      return `<div class="menu-item">
                    <img class="item-img" src="/images/${img}" alt="${altText}">
                    <div class="item-detail">
                        <h2 class="item-name">${name}</h2>
                        <p class="item-ingredients">${ingredients.join(
                          ", "
                        )}</p>
                        <p class="item-price">$${price}</p>
                    </div>
                    <button class="item-add-btn" data-add="${id}"><span data-add="${id}">+</span></button>
                </div>`;
    })
    .join(""); // Join all menu items into a single HTML string
}

function handleAddBtnClick(menuItemId) {
  if (orderPlaced.style.display === "flex") {
    orderPlaced.style.display = "none";
  }
  // Add the item to the checkout array
  addItemToCheckoutArray(menuItemId);
  // Update the displayed checkout items
  displayCheckoutItems();
  // Update the total price
  updateTotalPrice();
}

function addItemToCheckoutArray(menuItemId) {
  // Find the item to add from the menu array
  const itemToAdd = menuArray.find((menuItem) => {
    return menuItem.id === menuItemId;
  });

  // Check if the item is already in the checkout array
  const alreadyExistingItem = checkoutArray.find(
    (checkoutItem) => checkoutItem.id === itemToAdd.id
  );

  if (alreadyExistingItem) {
    // Update the existing item's quantity and price
    alreadyExistingItem.price += itemToAdd.price;
    alreadyExistingItem.quantity += 1;
  } else {
    // Add a new item to the checkout array with quantity 1
    checkoutArray.push({ ...itemToAdd, quantity: 1 });
  }
}

function displayCheckoutItems() {
  toggleVisibility(checkoutSection, true);

  // Grab the checkout-details element and set its innerHTML to the htmlString returned by the .map() method. The htmlString contains details of each item added to the checkout data.
  document.getElementById("checkout-details").innerHTML = checkoutArray
    .map((checkoutItem) => {
      // Use object-destructuring to use only the properties required from the object.
      const { name, id, price, quantity } = checkoutItem;
      // Add a data attribute to the button element and set its value to the id of the current item so the id can be accessed when clicking on the button.
      return `<div class="checkout-item">
                    <h3 class="checkout-item-name">${name}</h3>
                    <p class="checkout-item-quantity">x ${quantity}</p>
                    <button class="checkout-remove-btn" data-remove="${id}">remove</button>
                    <p class="checkout-item-price">$${price}</p>
                </div>`;
    })
    .join(""); // Join all checkout items into a single HTML string
}

function updateTotalPrice() {
  // Start total at 0 and currentItem at the first item in the checkout data.
  // Loop through the checkout data using .reduce() and add the currentItem.price to the total and return it.
  const totalPrice = checkoutArray.reduce((total, currentItem) => {
    return total + currentItem.price;
  }, 0);
  // Grab the checkout-total-price element and set its innerHTML to totalPrice
  document.getElementById("checkout-total-price").innerHTML = `$${totalPrice}`;
}

function handleRemoveBtnClick(checkoutItemId) {
  // Remove the clicked item from the checkout data.
  removeItemFromCheckoutArray(checkoutItemId);
  // Check if there are still items in checkout data.
  // If yes, display the remaining items.
  // If not, then hide the checkout section.
  if (checkoutArray.length > 0) {
    displayCheckoutItems();
  } else {
    toggleVisibility(checkoutSection, false);
  }
}

function removeItemFromCheckoutArray(checkoutItemId) {
  // Find the item inside the checkout data
  const itemToRemove = checkoutArray.find(
    (checkoutItem) => checkoutItem.id === checkoutItemId
  );
  // Find the index of the item inside the checkout data
  const index = checkoutArray.indexOf(itemToRemove);
  // Remove the item from the checkout data
  checkoutArray.splice(index, 1);
}

function handleCompleteOrderBtnClick() {
  // Display the payment modal
  toggleVisibility(paymentSection, true);
  // Empty the checkout data
  checkoutArray.length = 0;
}

function handlePayBtnClick(e) {
  const nameInput = document.getElementById("name-input");

  const paymentForm = document.getElementById("payment-form");

  e.preventDefault();

  toggleVisibility(paymentSection, false);
  toggleVisibility(checkoutSection, false);
  paymentForm.reset();

  displayConfirmationMessage(nameInput.value);
}

function toggleVisibility(element, isVisible) {
  element.style.display = isVisible ? "flex" : "none";
}

function displayConfirmationMessage(name) {
  const thankyouMsg = document.createElement("p");
  thankyouMsg.textContent = `Thanks, ${name}! Your order is on its way!`;
  orderPlaced.innerHTML = "";
  orderPlaced.appendChild(thankyouMsg);

  toggleVisibility(orderPlaced, true);
}
