const express = require('express');
const mapController = require('../controllers/MapController')

const router = express.Router();

router.get('/addHazard', mapController.addHazard)
    .get('/documentHazard', mapController.documentHazard)
    .get('/reportHazard', mapController.reportHazard)
    .get('/endHazard', mapController.endHazard);

module.exports =  router;