'use strict';

const clientSqs = require('@aws-sdk/client-sqs');
const { SQSClient } = clientSqs;

const sqsClient = new SQSClient({ region: 'us-west-2' });

const queues = {
  packages: 'https://sqs.us-west-2.amazonaws.com/819185359731/packages.fifo',
  flowerDelivery: 'https://sqs.us-west-2.amazonaws.com/819185359731/flowers-delivery',
};

module.exports = { sqsClient, queues };