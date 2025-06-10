const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}
function getCart() {
    try {
        const raw = localStorage.getItem('myCart');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
function saveCart(cartArray) {
    localStorage.setItem('myCart', JSON.stringify(cartArray));
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#product1 .prd .cart a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); 
            const prdCard = this.closest('.prd');
            if (!prdCard) return;
            const imgEl = prdCard.querySelector('img');
            const brandEl = prdCard.querySelector('.des span');
            const titleEl = prdCard.querySelector('.des h5');
            const priceEl = prdCard.querySelector('.des h4');

            const productObj = {
                id: imgEl.getAttribute('src'), 
                img: imgEl.getAttribute('src'),
                brand: brandEl ? brandEl.innerText.trim() : '',
                title: titleEl ? titleEl.innerText.trim() : '',
                price: priceEl
                    ? parseFloat(priceEl.innerText.replace(/[^0-9.\-]/g, '')) || 0
                    : 0,
                quantity: 1
            };

            const cart = getCart();
            const existingIndex = cart.findIndex(item => item.id === productObj.id);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(productObj);
            }

            saveCart(cart);

            alert(`“${productObj.title}” has been added to your cart.`);
        });
    });
});
function getCart() {
    try {
        const raw = localStorage.getItem('myCart');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('myCart', JSON.stringify(cart));
}
function renderCart() {
    const cart = getCart();
    const tbody = document.querySelector('#cart table tbody');
    tbody.innerHTML = ''; 

    let grandTotal = 0;

    if (cart.length === 0) {
        const trEmpty = document.createElement('tr');
        const tdEmpty = document.createElement('td');
        tdEmpty.colSpan = 6;
        tdEmpty.style.textAlign = 'center';
        tdEmpty.style.padding = '20px 0';
        tdEmpty.innerText = 'Your cart is empty.';
        trEmpty.appendChild(tdEmpty);
        tbody.appendChild(trEmpty);
    } else {
        cart.forEach((item, index) => {
            const lineTotal = item.price * item.quantity;
            grandTotal += lineTotal;

            const tr = document.createElement('tr');

            const tdRemove = document.createElement('td');
            const removeLink = document.createElement('a');
            removeLink.href = '#';
            removeLink.innerHTML = '<i class="fa-solid fa-trash" style="color: #465b52;"></i>';
            removeLink.addEventListener('click', function (e) {
                e.preventDefault();
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
            });
            tdRemove.appendChild(removeLink);
            tr.appendChild(tdRemove);

            const tdImg = document.createElement('td');
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.title;
            img.style.width = '80px';
            tdImg.appendChild(img);
            tr.appendChild(tdImg);

            const tdProd = document.createElement('td');
            tdProd.innerText = item.title;
            tr.appendChild(tdProd);

            const tdPrice = document.createElement('td');
            tdPrice.innerText = `$${item.price.toFixed(2)}`;
            tr.appendChild(tdPrice);

            const tdQty = document.createElement('td');
            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.value = item.quantity;
            qtyInput.style.width = '50px';
            qtyInput.addEventListener('change', function () {
                let newQty = parseInt(qtyInput.value);
                if (isNaN(newQty) || newQty < 1) {
                    newQty = 1;
                    qtyInput.value = '1';
                }
                item.quantity = newQty;
                saveCart(cart);
                renderCart();
            });
            tdQty.appendChild(qtyInput);
            tr.appendChild(tdQty);
            const tdSub = document.createElement('td');
            tdSub.innerText = `$${lineTotal.toFixed(2)}`;
            tr.appendChild(tdSub);

            tbody.appendChild(tr);
        });
    }

    const summaryTable = document.querySelector('#cart-add #subtotal table');
    if (summaryTable) {
        summaryTable.rows[0].cells[1].innerText = `$ ${grandTotal.toFixed(2)}`;
        summaryTable.rows[2].cells[1].innerText = `$ ${grandTotal.toFixed(2)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
