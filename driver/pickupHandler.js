
'use strict';

const { ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { sqsClient, queues } = require('../util');
const handleDeliver = require('./transitHandler');

/**
 * retrieves `pickup` notifications from `packages` SQS queue
 * deletes the messages from the queue once they are recieved
*/
async function handlePickup() {
  try {
    const receivedPackage = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: queues.packages,
      })
    );
    if (receivedPackage.Messages?.length > 0) {
      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: queues.packages,
          ReceiptHandle: receivedPackage.Messages[0].ReceiptHandle,
        })
      );

      const payload = JSON.parse(receivedPackage.Messages[0].Body);
      console.log(`Driver received pickup request ${payload.MessageId} with package ${JSON.parse(payload.Message).orderId}`);
      setTimeout(() => {
        handleDeliver(payload.Message);
        setTimeout(() => {
          handlePickup();
        }, 1000);
      }, 3000);
    } else {
      console.log('no packages ready for pickup');
      setTimeout(() => {
        handlePickup();
      }, 1000);
    }
  } catch (e) {
    console.error('handlePickup failed', e);
  }
}

module.exports = handlePickup;
