const { CreateBillingService } = require("./billing.services");
const RabbitConnect = require('../../utils/Rabbitmq');

module.exports = {
  CreateBillingController: async (data) => {
    const { customer_id, billing_account_id, billing_address, price } = data;
    try {
      await CreateBillingService(data);

      console.log('Billing processed successfully');

      await RabbitConnect.publishToQueue('shipping.shipping_label_created', JSON.stringify({
        customer_id,
        billing_account_id,
        billing_address,
        price,
      }));
    } catch (error) {
      console.error('Error in billing controller:', error);
    }
  }
};
