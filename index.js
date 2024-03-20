let menu = {};
const menuItems = document.getElementById("menu-items")
const dishSection = document.getElementById("dish");
const cartForm = document.getElementById("cart-form");
let currentItem;

function displayItem(item) {
    currentItem = item.id;
    dishSection.querySelector("#dish-image").src = item.image;
    dishSection.querySelector("#dish-name").textContent = item.name;
    dishSection.querySelector("#dish-description").textContent = item.description;
    dishSection.querySelector("#dish-price").textContent = item.price;
    document.querySelector("#number-in-cart").textContent = item["number_in_bag"]
}

function updateTotal() {
    let total = 0;
    for (const id in menu) {
        total += (Number(menu[id]["number_in_bag"])*Number(menu[id].price))
    }
    document.querySelector("#total-cost").textContent=total;
}


fetch("http://localhost:3000/menu")
.then(response => response.json())
.then(menuGotten => {
    menuGotten.forEach(item => {
        menu[item.id] = item;
        const span = document.createElement("span");
        span.id = item.id;
        span.textContent = item.name;
        menuItems.append(span);
    });
    displayItem(menu[1]);
    updateTotal();
})
.catch(error => console.log(error))

menuItems.addEventListener("click",event => displayItem(menu[event.target.id]));

cartForm.addEventListener("submit",event => {
    event.preventDefault();
    menu[currentItem]["number_in_bag"] += Number(cartForm.querySelector("#cart-amount").value);
    fetch(`http://localhost:3000/menu/${currentItem}`,{
        method: "PATCH",
        header: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "number_in_bag":  menu[currentItem]["number_in_bag"]
        })
    })
    .then(response => response.json())
    .then(item => {
        document.querySelector("#number-in-cart").textContent = item["number_in_bag"];
        updateTotal();
        cartForm.querySelector("#cart-amount").value = ""
    })
})