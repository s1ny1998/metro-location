'use strict';

const express = require('express');
const locationControl = require('../controllers/location');

const router = express.Router();

router.route('/')
  .get(locationControl.getRoute);

module.exports = router;
