"use strict";
const shoppingListArr = JSON.parse(localStorage.getItem('shoppingList')) || [];
const shoppingList = document.querySelector('#shoppingList');
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'});
const inputContainer = document.querySelector('.inputContainer');
const productInputs = inputContainer.querySelectorAll('input');
const showBrandInputs = document.querySelectorAll('.product');
const deleteList = document.querySelector('#delete');
const newProduct = document.querySelector('#newProduct')
let id = 1;


function Product(quant, name) {
    const product = {
        id,
        name,
        quant,
        brands: [],
        sortByPrice: function() {
            this.brands.sort((a, b) => a.price > b.price ? 1 : -1);
            return this.brands;
        },
        sortByCb: function() {
            this.brands.sort((a, b) => a.cb > b.cb ? 1 : -1);
            return this.brands;
        },
        newBrand: function(name, un, price) {
            const brand = {
                name,
                un,
                price,
                html:
                `
                <li class="brand">
                    <span class="name">${name}</span>
                    <span class="quant">${un} un</span>
                    <span class="price">${formatter.format(price.toFixed(2))}</span>
                    <span class="cb">${formatter.format((price / un).toFixed(2))}/un</span>
                </li>`,
            }
            this.brands.push(brand);
            return this.brands;
        },
        html:
        `<li class="product" data-product-ref="${id}">
            <span class="quant" onclick="toggleShow(${id})">${quant}</span>
            <span class="name" onclick="toggleShow(${id})">${name}</span>
            <button class="arrow" onclick="toggleShow(${id})")">&#x25B2;</button>
            <div class="brandInputContainer show-${id}">
                <input type="text" placeholder="Brand Name" name="nameBrand" class="nameBrand">
                <input type="number" placeholder="Qtd" name="quantBrand" class="quantBrand">
                <input type="number" placeholder="Price" name="priceBrand" class="priceBrand">
                <input type="submit" value="+" class="addBrand" onclick="addBrand(${id})">
            </div>
            <ul class="brands product-ref${id}"></ul>
        </li>`,
    }
    id++
    return product;
}

function addBrand(id) {
    const product = document.querySelector(`[data-product-ref="${id}"]`);
    const nameBrand = product.querySelector("input[name='nameBrand']").value;
    if (nameBrand == '') return;
    const quantBrand = Number(product.querySelector("input[name='quantBrand']").value);
    if (quantBrand < 1 || quantBrand > 99) return;
    const priceBrand = Number(product.querySelector("input[name='priceBrand']").value);
    if (priceBrand < 1 || priceBrand > 99) return;
    
    const prod = shoppingListArr[Number(id)-1];
    prod.newBrand(nameBrand, quantBrand, priceBrand);

    populateList(shoppingListArr, shoppingList);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingListArr));
}

function addProduct() {
    const quantProduct = document.querySelector('#quantProduct');
    if (!checkInput(quantProduct)) return;
    const nameProduct = document.querySelector('#nameProduct');
    if (!checkInput(nameProduct)) return;

    const prod = Product(Number(quantProduct.value), nameProduct.value);

    shoppingListArr.push(prod);
    populateList(shoppingListArr, shoppingList);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingListArr));

    nameProduct.value = '';
    quantProduct.value = '';
}

function populateList(arr, list) {
    list.innerHTML = 
    arr.map(item => item.html).join('');
    arr.map(item => {
        if(item.brands) {
            const brandlist = document.querySelector(`.product-ref${item.id}`);
            populateList(item.brands, brandlist);  
        }
    }).join('');
}

function activate() {
    this.classList.add('active');
}

function toggleShow(id) {
    const inputs = document.querySelector(`.show-${id}`);
    const arrow = inputs.parentElement.querySelector('.arrow');

    if(inputs.classList.contains('active')) {
        inputs.classList.remove('active');
        arrow.classList.remove('open');

    } else {
        inputs.classList.add('active');
        arrow.classList.add('open');
    }
}

function checkInput(input) {
    const value = input.value;
    if (value == "" || value == null || value == undefined || value < 1 || value > 99) return false;
    else {
        return true;
    }
}

newProduct.addEventListener('click', addProduct);

productInputs.forEach(input => {
    input.addEventListener('keyup', (e) => {
        if (input.type == 'submit') {
            addProduct();
            return input.parentElement.firstElementChild.focus();
        } else if (e.keyCode == 13 && checkInput(input)) {
            return input.nextElementSibling.focus();
        }
    })
})

deleteList.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = window.location.href;
})

populateList(shoppingListArr, shoppingList);