window.onload = function () {
    document.getElementById('quantityA').value = localStorage.getItem('quantityA') || '';
    document.getElementById('quantityB').value = localStorage.getItem('quantityB') || '';
    document.getElementById('quantityC').value = localStorage.getItem('quantityC') || '';
    document.getElementById('giftA').checked = localStorage.getItem('giftA') === 'true';
    document.getElementById('giftB').checked = localStorage.getItem('giftB') === 'true';
    document.getElementById('giftC').checked = localStorage.getItem('giftC') === 'true';
};

function calculateBestDiscount(totalQuantity, quantities, prices) {
    const flat10Discount = totalQuantity > 20 ? 10 : 0;
    const bulk5Discount = Object.keys(quantities).reduce((total, product) => {
        const quantity = quantities[product];
        return total + (quantity > 10 ? prices[product] * 0.05 * quantity : 0);
    }, 0);

    const bulk10Discount = totalQuantity > 20 ? totalQuantity * 0.1 : 0;

    const tiered50Discount = Object.keys(quantities).reduce((total, product) => {
        const quantity = quantities[product];
        return total + (totalQuantity > 30 && quantity > 15 ? prices[product] * 0.5 * (quantity - 15) : 0);
    }, 0);

    return Math.max(flat10Discount, bulk5Discount, bulk10Discount, tiered50Discount);
}

function calculateCart() {
    const quantities = {
        productA: parseInt(document.getElementById('quantityA').value) || 0,
        productB: parseInt(document.getElementById('quantityB').value) || 0,
        productC: parseInt(document.getElementById('quantityC').value) || 0,
    };

    const prices = {
        productA: 20,
        productB: 40,
        productC: 50
    };

    const isGiftWrapped = {
        productA: document.getElementById('giftA').checked,
        productB: document.getElementById('giftB').checked,
        productC: document.getElementById('giftC').checked,
    };

    const totalQuantity = Object.values(quantities).reduce((total, quantity) => total + quantity, 0);

    const maxDiscount = calculateBestDiscount(totalQuantity, quantities, prices);

    const giftWrapFee = Object.values(isGiftWrapped).reduce((total, wrapped) => total + (wrapped ? 1 : 0), 0);
    const shippingFee = Math.ceil(totalQuantity / 10) * 5;

    const subtotal = Object.keys(quantities).reduce((total, product) => total + prices[product] * quantities[product], 0) - maxDiscount;

    const total = subtotal + giftWrapFee + shippingFee;

    const orderSummary = `
        <table>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          <tr>
            <td>Product A</td>
            <td>${quantities.productA}</td>
            <td>$${prices.productA * quantities.productA}</td>
          </tr>
          <tr>
            <td>Product B</td>
            <td>${quantities.productB}</td>
            <td>$${prices.productB * quantities.productB}</td>
          </tr>
          <tr>
            <td>Product C</td>
            <td>${quantities.productC}</td>
            <td>$${prices.productC * quantities.productC}</td>
          </tr>
        </table>
        <strong>Subtotal:</strong> $${subtotal.toFixed(2)}<br>
        <strong>Discount Applied:</strong> $${maxDiscount.toFixed(2)}<br>
        <strong>Shipping Fee:</strong> $${shippingFee.toFixed(2)}<br>
        <strong>Gift Wrap Fee:</strong> $${giftWrapFee.toFixed(2)}<br>
        <strong>Total:</strong> $${total.toFixed(2)}
      `;

    document.getElementById('orderSummary').innerHTML = orderSummary;

    localStorage.setItem('quantityA', quantities.productA);
    localStorage.setItem('quantityB', quantities.productB);
    localStorage.setItem('quantityC', quantities.productC);
    localStorage.setItem('giftA', isGiftWrapped.productA);
    localStorage.setItem('giftB', isGiftWrapped.productB);
    localStorage.setItem('giftC', isGiftWrapped.productC);
}