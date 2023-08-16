let customers = [];


fetch('/data')
    .then(res => res.json())
    .then(data => {
        const customerCards = document.getElementById("customercard-container");
        const template = document.getElementById("customercard-template");

        customers = data.map(customer => {
            const card = template.content.cloneNode(true).children[0];
            const header = card.children[0];
            const body = card.children[1];
            header.innerHTML = `<b>${customer.billing_name}</b>`;
            body.innerHTML = `
                Shipping Name: ${customer.shipping_name}<br>
                Billing Address: ${customer.billing_address}<br>
                Shipping Address: ${customer.shipping_address}<br>
                Email address: ${customer.email}<br>
                Phone number: ${customer.phone_number}<br>
                Username: ${customer.username}
            `;

            customerCards.appendChild(card);
            return{billing_name:customer.billing_name,
            shipping_name:customer.shipping_name,
            billing_address:customer.billing_address,
            shipping_address:customer.shipping_address,
            email:customer.email,
            phone:customer.phone_number,
            username:customer.username,
            element:card}
        });
        const formInput = document.querySelector("#customerform")

        formInput.addEventListener("input", e => {
            const value = e.target.value.toLowerCase()
            const visibleCustomers = customers.filter(customer => {
                const isVisible =
                    (customer.billing_name && customer.billing_name.toLowerCase().includes(value)) ||
                    (customer.shipping_name && customer.shipping_name.toLowerCase().includes(value)) ||
                    (customer.billing_address && customer.billing_address.toLowerCase().includes(value)) ||
                    (customer.shipping_address && customer.shipping_address.toLowerCase().includes(value)) ||
                    (customer.email && customer.email.toLowerCase().includes(value)) ||
                    (customer.phone && customer.phone.toString().includes(value)) ||
                    (customer.username && customer.username.toLowerCase().includes(value));
                customer.element.classList.toggle('invisible', !isVisible)
                return isVisible;
            })
            if(!visibleCustomers){
                customerCards.innerHTML=`No results found`
                }else{
                    customerCards.innerHTML=``
                    for(let i of visibleCustomers ){
                        customerCards.append(i.element)}
                        }

        })
    })
    .catch(error => {
        console.error('Error fetching data:', error);
});
