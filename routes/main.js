const express = require('express')
const router = express.Router();


router.get('/', async (req, res) => {

    res.render('homepage', {title: "Customer Compare / Add"});
});



module.exports = router;