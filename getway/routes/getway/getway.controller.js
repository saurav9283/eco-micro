const { GetwayCreateOrderService } = require('../getway/getway.services');
const { publishToQueue } = require('../../utils/Rabbitmq');

module.exports = {
    CreateOrderGetWayController: async (req, res) => {
        try {
            const {
                order_id,
                products,
                customer_id,
                billing_account_id,
                billing_address,
                shipping_address
            } = req.body;

            if (!order_id || !products || !customer_id || !billing_account_id || !billing_address || !shipping_address) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const message = {
                order_id,
                products,
                customer_id,
                billing_account_id,
                billing_address,
                shipping_address
            }
            publishToQueue('sales.order_placed', JSON.stringify(message));
            console.log('Message published  sales.order_placed', message);

            return res.status(200).json({ message: 'Order created successfully' });
        } catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
