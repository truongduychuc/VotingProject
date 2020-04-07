const router = require('express').Router();
const cors = require('cors');
const {UserController} = require('../controllers');

router.use(cors());
router.post('/authenticate', UserController.authenticate);

module.exports = router;
