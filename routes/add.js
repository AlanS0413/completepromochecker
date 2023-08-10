const express = require('express')
const router = express.Router();



router.get('/add', async (req, res) => {
    const custs = await req.db.findAllCustomers();
    res.render('add', { title: 'Add Customer Data', show_login: true, custs });
});


router.post('/add', async (req, res) => {
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
                formData.billing_name,
                formData.shipping_name,
                formData.billing_address,
                formData.shipping_address,
                formData.email,
                formData.phone_number,
                formData.username
            );

            res.render('add', {
                title: "Add Customer Data",
                message: "Customer Added!",
            });
        } else {
            // Render the same form page with error message
            res.render('add', {
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