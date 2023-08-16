const express = require('express')
const router = express.Router();



router.get('/view', async (req, res) => {
    const customers = await req.db.findAllCustomers();
    res.render('viewdata', { title: 'View Customer Data', customers:customers });
});

router.post('/view', async (req, res) => {
    try {
        const db = await req.db;

        // Form data
        const formData = {
            billing_name: req.body.billing_name,
            shipping_name: req.body.shipping_name,
            billing_address: req.body.billing_address,
            shipping_address: req.body.shipping_address,
            email: req.body.email,
            phone_number: req.body.phone_number,
            username: req.body.username
        };

        const customerExists = await req.db.doesCustomerExist(
            formData.billing_name,
            formData.shipping_name,
            formData.billing_address,
            formData.shipping_address,
            formData.email,
            formData.phone_number,
            formData.username
        );

        console.log( customerExists , 'customerExists')

        if (!customerExists) {
            const newCustomer = await req.db.addCustomer(
                formData.billing_name.toLowerCase(),
                formData.shipping_name.toLowerCase(),
                formData.billing_address.toLowerCase(),
                formData.shipping_address.toLowerCase(),
                formData.email.toLowerCase(),
                formData.phone_number.toLowerCase(),
                formData.username.toLowerCase()
            );

            res.render('viewdata', {
                title: "Add Customer Data",
                message: "Customer Added!",
            });
        } else {
            // Render the same form page with error message
            res.render('viewdata', {
                title: "Add Customer Data",
                message: "Customer Already Exists!",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;