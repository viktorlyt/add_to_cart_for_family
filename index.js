import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://cart-for-family-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "goods");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("goods");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let goodsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < goodsArray.length; i++) {
      let currentItem = goodsArray[i];

      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToGoodsEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet"
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToGoodsEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", () => {
    let exactLocationOfItemInDB = ref(database, `goods/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
