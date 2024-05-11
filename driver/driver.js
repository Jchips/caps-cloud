'use strict';

const handlePickup = require('./pickupHandler');

handlePickup();

setTimeout(() => {
  process.exit();
}, 20000);