const express = require('express')
const router = express.Router();



router.get('/view', async (req, res) => {
    const customers = await req.db.findAllCustomers();
    res.render('viewdata', { title: 'View Customer Data', customers:customers });
});


module.exports = router;