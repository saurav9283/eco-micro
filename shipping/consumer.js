const RabbitConnect = require('./utils/Rabbitmq.js');

async function startConsumer() {
  try {
    await RabbitConnect.connect();
    RabbitConnect.subscribeToQueue('sales.order_placed');
    RabbitConnect.subscribeToQueue('billing.order_billed');
    console.log('Consumers initialized successfully. Shipping');
  } catch (error) {
    console.error('Error initializing consumers: Shipping', error);
  }
}

// Run the consumer if this file is executed directly
if (require.main === module) {
  startConsumer();
}

module.exports = startConsumer;
