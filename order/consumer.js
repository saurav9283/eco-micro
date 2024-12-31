const RabbitConnect = require('./utils/Rabbitmq.js');

async function startConsumer() {
  try {
    await RabbitConnect.connect();
    RabbitConnect.subscribeToQueue('billing.payment_failed');
    RabbitConnect.subscribeToQueue('billing.order_refunded');
    RabbitConnect.subscribeToQueue('billing.order_billed');
    RabbitConnect.subscribeToQueue('shipping.shipping_label_created');
    RabbitConnect.subscribeToQueue('shipping.back_ordered');

    console.log('Consumers initialized successfully. Order');
  } catch (error) {
    console.error('Error initializing consumers: Order', error);
  }
}

// Run the consumer if this file is executed directly
if (require.main === module) {
  startConsumer();
}

module.exports = startConsumer;
