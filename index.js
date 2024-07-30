import menuArray from "/data.js";

const orderPlaced = document.getElementById("order-placed");
const checkoutSection = document.getElementById("checkout-section");
const paymentSection = document.getElementById("payment-section");

const checkoutArray = [];

document.addEventListener("click", (e) => {
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

renderMenu(menuArray);

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

function handleAddBtnClick(menuItemId) {
  if (orderPlaced.style.display === "flex") {
    orderPlaced.style.display = "none";
  }
  addItemToCheckoutArray(menuItemId);
  displayCheckoutItems();
  updateTotalPrice();
}

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

function displayCheckoutItems() {
  toggleVisibility(checkoutSection, true);

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

function updateTotalPrice() {
  const totalPrice = checkoutArray.reduce((total, currentItem) => {
    return total + currentItem.price;
  }, 0);
  document.getElementById("checkout-total-price").innerHTML = `$${totalPrice}`;
}

function handleRemoveBtnClick(checkoutItemId) {
  removeItemFromCheckoutArray(checkoutItemId);

  if (checkoutArray.length > 0) {
    displayCheckoutItems();
  } else {
    toggleVisibility(checkoutSection, false);
  }
}

function removeItemFromCheckoutArray(checkoutItemId) {
  const itemToRemove = checkoutArray.find(
    (checkoutItem) => checkoutItem.id === checkoutItemId
  );
  const index = checkoutArray.indexOf(itemToRemove);
  checkoutArray.splice(index, 1);
}

function handleCompleteOrderBtnClick() {
  toggleVisibility(paymentSection, true);
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

function displayConfirmationMessage(name) {
  const thankyouMsg = document.createElement("p");
  thankyouMsg.textContent = `Thanks, ${name}! Your order is on its way!`;
  orderPlaced.innerHTML = "";
  orderPlaced.appendChild(thankyouMsg);

  toggleVisibility(orderPlaced, true);
}

function toggleVisibility(element, isVisible) {
  element.style.display = isVisible ? "flex" : "none";
}
