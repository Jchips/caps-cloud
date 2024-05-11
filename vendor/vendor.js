'use strict';

const AWS = require('aws-sdk');
const Chance = require('chance');
AWS.config.update({ region: 'us-west-2' }); // might get an error without

const sns = new AWS.SNS();
const chance = new Chance();

const store = '1-206-flowers';
const topic = 'arn:aws:sns:us-west-2:819185359731:pickup.fifo';

function Payload() {
  this.orderId = chance.guid();
  this.customer = chance.name();
  this.store = store;
  this.vendorUrl = 'https://sqs.us-west-2.amazonaws.com/819185359731/flowers-delivery';
}

// Send pickup requests to SNS `pickup` topic (which adds them to `packages` queue)
async function sendPickup() {
  const payload = {
    Message: JSON.stringify(new Payload()),
    MessageGroupId: store,
    TopicArn: topic,
  }

  console.log('payload:', payload);

  try {
    const pickupMessage = await sns.publish(payload).promise();
    console.log(`${store} vendor sent pickup request:`, pickupMessage.MessageId);
    console.log('');
  } catch (e) {
    console.error('failed to send the pickup message', e);
  }
}

setInterval(() => {
  sendPickup();
}, 3000);

setTimeout(() => {
  process.exit();
}, 10000);