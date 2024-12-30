const axios = require('axios');
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

            const apiResponses = await Promise.all([
                axios.post('http://localhost:7000/api/v1/sales/orders', { order_id, products, customer_id }),
                axios.post('http://localhost:8000/api/v1/billing/orders', { order_id, billing_account_id, billing_address }),
                axios.post('http://localhost:9000/api/v1/shipping/orders', { order_id, shipping_address, products })
            ]);


            return res.status(200).json({ message: 'Order created successfully' });


        } catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
