'use strict';

const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const { sqsClient } = require('../util');

// Adds delivered notification to vendor's SQS queue once package is delivered
async function handleDeliver(payload) {
  payload = JSON.parse(payload);
  console.log(`package ${payload.orderId} delivered`);

  try {
    await sqsClient.send(
      new SendMessageCommand({
        MessageBody: JSON.stringify(payload),
        QueueUrl: payload.vendorUrl,
      })
    );

    setTimeout(async () => {
      console.log(`package ${payload.orderId} added to delivery queue for ${payload.store}`);
    }, 1000);
  } catch (e) {
    console.error('error adding package to delivered queue', e);
  }
}

module.exports = handleDeliver;
