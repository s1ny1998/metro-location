'use strict';

const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { resolve } = require('path');

const authDocs = YAML.load(resolve('./docs/streams.yaml'));
const zoneDocs = YAML.load(resolve('./docs/zones.yaml'));
const giftDocs = YAML.load(resolve('./docs/gifts.yaml'));
const eventDocs = YAML.load(resolve('./docs/events.yaml'));
const fansAndFollowingDocs = YAML.load(resolve('./docs/fansAndFollowing.yaml'));
const staffDoc = YAML.load(resolve('./docs/staff.yaml'));

router.get('/', (req, res) => {
  res.sendFile(resolve('./docs/index.html'));
});

router.use('/streams', swaggerUi.serve, swaggerUi.setup(authDocs));
router.use('/zones', swaggerUi.serve, swaggerUi.setup(zoneDocs));
router.use('/gifts', swaggerUi.serve, swaggerUi.setup(giftDocs));
router.use('/events', swaggerUi.serve, swaggerUi.setup(eventDocs));
router.use('/FansAndFollowing', swaggerUi.serve, swaggerUi.setup(fansAndFollowingDocs));
router.use('/staff', swaggerUi.serve, swaggerUi.setup(staffDoc));

module.exports = router;
