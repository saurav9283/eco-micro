const RabbitConnect = require('./utils/Rabbitmq.js');

async function startConsumer() {
  try {
    await RabbitConnect.connect();
    RabbitConnect.subscribeToQueue('sales.order_placed');

    console.log('Consumers initialized successfully. Billing');
  } catch (error) {
    console.error('Error initializing consumers: Billing', error);
  }
}

// Run the consumer if this file is executed directly
if (require.main === module) {
  startConsumer();
}

module.exports = startConsumer;
