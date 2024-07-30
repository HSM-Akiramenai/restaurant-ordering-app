import menuArray from "/data.js";

const checkoutArray = [];
let totalPrice = 0;

const checkoutSection = document.getElementById("checkout-section");
const paymentSection = document.getElementById("payment-section");
const overlay = document.getElementById("overlay");
const paymentForm = document.getElementById("payment-form");
const orderPlaced = document.getElementById("order-placed");

// EVENT LISTENERS

paymentForm.addEventListener("submit", handlePayBtnClick);

document.addEventListener("click", (e) => {
  if (e.target.dataset.add) {
    handleAddBtnClick(Number(e.target.dataset.add));
  } else if (e.target.dataset.remove) {
    handleRemoveBtnClick(Number(e.target.dataset.remove));
  } else if (e.target.id === "checkout-order-btn") {
    handleCompleteOrderBtnClick();
  } else if (e.target.id === "payment-close-btn") {
    handlePayCloseBtnClick();
  }
});

// INITIAL FUNCTION CALL (RENDER MENU ITEMS)

renderMenu(menuArray);

// RENDER MENU ITEMS IN MENU SECTION

function renderMenu(menuItems) {
  document.getElementById("menu-section").innerHTML = menuItems
    .map((menuItem) => {
      const { name, ingredients, id, price, img, altText } = menuItem;

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
    .join("");
}

// ADD ITEM BUTTON HANDLER

function handleAddBtnClick(menuItemId) {
  toggleVisibility(false, orderPlaced);
  addItemToCheckoutArray(menuItemId);
  displayCheckoutItems();
  updateTotalPrice();
}

// ADD ITEM TO CHECKOUT ARRAY

function addItemToCheckoutArray(menuItemId) {
  const itemToAdd = menuArray.find((menuItem) => {
    return menuItem.id === menuItemId;
  });

  const alreadyExistingItem = checkoutArray.find(
    (checkoutItem) => checkoutItem.id === itemToAdd.id
  );

  if (alreadyExistingItem) {
    alreadyExistingItem.price += itemToAdd.price;
    alreadyExistingItem.quantity += 1;
  } else {
    checkoutArray.push({ ...itemToAdd, quantity: 1 });
  }
}

// DISPLAY CHECKOUT SECTION

function displayCheckoutItems() {
  toggleVisibility(true, checkoutSection);

  document.getElementById("checkout-details").innerHTML = checkoutArray
    .map((checkoutItem) => {
      const { name, id, price, quantity } = checkoutItem;

      return `<div class="checkout-item">
                    <h3 class="checkout-item-name">${name}</h3>
                    <p class="checkout-item-quantity">x ${quantity}</p>
                    <button class="checkout-remove-btn" data-remove="${id}">remove</button>
                    <p class="checkout-item-price">$${price}</p>
                </div>`;
    })
    .join("");
}

// UPDATE TOTAL PRICE

function updateTotalPrice() {
  totalPrice = checkoutArray.reduce((total, currentItem) => {
    return total + currentItem.price;
  }, 0);

  document.getElementById("checkout-total-price").innerHTML = `$${totalPrice}`;
}

// REMOVE BUTTON HANDLER

function handleRemoveBtnClick(checkoutItemId) {
  removeItemFromCheckoutArray(checkoutItemId);

  if (checkoutArray.length > 0) {
    displayCheckoutItems();
  } else {
    toggleVisibility(false, checkoutSection);
  }
}

// REMOVE ITEM FROM CHECKOUT ARRAY

function removeItemFromCheckoutArray(checkoutItemId) {
  const itemToRemove = checkoutArray.find(
    (checkoutItem) => checkoutItem.id === checkoutItemId
  );

  const index = checkoutArray.indexOf(itemToRemove);

  checkoutArray.splice(index, 1);
}

// COMPLETE ORDER HANDLER

function handleCompleteOrderBtnClick() {
  document.getElementById(
    "payment-form-btn"
  ).textContent = `Pay $${totalPrice}`;
  toggleVisibility(true, overlay, paymentSection);
  checkoutArray.length = 0;
}

// PAYMENT BUTTON HANDLER

function handlePayBtnClick(e) {
  e.preventDefault();

  const paymentFormData = new FormData(paymentForm);
  const customerName = paymentFormData.get("customerName");

  displayConfirmationMessage(customerName);
  paymentForm.reset();
}

// DISPLAY ORDER CONFIRMATION MESSAGE

function displayConfirmationMessage(name) {
  const thankyouMsg = document.createElement("p");
  thankyouMsg.textContent = `Thanks, ${name}! Your order is on its way!`;
  orderPlaced.innerHTML = "";
  orderPlaced.appendChild(thankyouMsg);

  toggleVisibility(false, checkoutSection, paymentSection, overlay);
  toggleVisibility(true, orderPlaced);
}

// CLOSE PAYMENT MODAL

function handlePayCloseBtnClick() {
  toggleVisibility(false, paymentSection, overlay);
}

// TOGGLE ELEMENT VISIBILITY HELPER

function toggleVisibility(isVisible, ...elements) {
  elements.forEach((element) => {
    element.style.display = isVisible ? "flex" : "none";
  });
}
