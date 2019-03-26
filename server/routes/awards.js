const express = require('express');
const router = express.Router();

const Award = require('../models/award');

router.post('/create', (req, res) => {
    const today = new Date();

    const awardData = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        price: req.body.price,
        item: req.body.item,
        create_at: today,
        update_at: today
    }
    Award.findOne({
        where: {

        }
    }).then(award => {
        if (!award) {
            Award.create(awardData);
        } else {
            res.status(400).send({ message: 'Award already exists' });
        }
    })

})
module.exports = router;