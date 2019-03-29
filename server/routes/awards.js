const express = require('express');
const router = express.Router();

const Award = require('../models/award');

router.post('/create', (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const awardData = {
        name: req.body.name,
        //description: req.body.description,
        year: null,
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        prize: req.body.prize,
        item: req.body.item,
        create_at: today,
        update_at: today
    }
    Award.findAll({
        where: {
            name: req.body.name,
            year: year
        }
    }).then(awards => {
        if (!awards) {
            awardData.year = year;
            Award.create(awardData);
            res.status(200).send({ message: 'Create award successfully.' });
        } else {
            res.status(400).send({ message: 'Award already exists.' });
        }
    }).catch(err => {
        res.status(400).send({ error: err })
    })

})
module.exports = router;