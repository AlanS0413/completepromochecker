const express = require('express')
const router = express.Router();
const multer = require('multer');
const fastcsv = require("fast-csv");




const upload = multer({ storage: multer.memoryStorage() });
router.get('/uploadinfo', async (req, res) => {
    res.render('uploadinfo', { title: 'CSV Upload', show_login: true, at_Home: false});
});


router.post('/uploadinfo', upload.single('csvFile'), async (req, res) => {
    try {
        const db = req.db;
        const csvData = [];

        const processCustomerData = async (data) => {
            // Here data is an object containing the properties of a customer
            const allCustomers = await db.findAllCustomers();

            const customerExists = allCustomers.some(customer => 
                customer.billing_name === data.billing_name &&
                customer.shipping_name === data.shipping_name &&
                customer.billing_address === data.billing_address &&
                customer.shipping_address === data.shipping_address &&
                customer.email === data.email &&
                customer.phone_number === data.phone_number &&
                customer.username === data.username
            );

            return customerExists;
        };

        if (req.file) {
            const csvStream = fastcsv.parse({ headers: true })
                .on("data", function (data) {
                    csvData.push(data);
                })
                .on("end", async function () {
                    for (const record of csvData) {
                        const recordLowercase = {
                            billing_name: record.billing_name.toLowerCase().trim(),
                            shipping_name: record.shipping_name.toLowerCase().trim(),
                            billing_address: record.billing_address.toLowerCase().trim(),
                            shipping_address: record.shipping_address.toLowerCase().trim(),
                            email: record.email.toLowerCase().trim(),
                            phone_number: record.phone_number.toLowerCase().trim(),
                            username: record.username.toLowerCase().trim()
                        };

                        const customerExists = await processCustomerData(recordLowercase);

                        if (!customerExists) {
                            const newCustomer = await db.addCustomer(
                                recordLowercase.billing_name,
                                recordLowercase.shipping_name,
                                recordLowercase.billing_address,
                                recordLowercase.shipping_address,
                                recordLowercase.email,
                                recordLowercase.phone_number,
                                recordLowercase.username
                            );
                        } else {
                            console.log("Customer already exists: ", recordLowercase);
                        }
                    }
                    res.render('uploadinfo', { 
                        title: 'CSV Upload',
                        message: "Successfully Uploaded CSV"
                    });
                });
            csvStream.write(req.file.buffer);
            csvStream.end();
        }
    } catch (err) {
        console.error(err);
        res.render('uploadinfo', { message: err.message });
    }
});


module.exports = router;