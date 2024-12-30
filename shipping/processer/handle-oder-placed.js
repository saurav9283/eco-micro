const { ShippingService } = require("../routes/Shipping/shipping.services");

const handleEvent = async (message) => {
    try {
        console.log('Handling event:', message);

        if (message.type === "billing.order_billed") {
            console.log(`Processing order: ${message.order_id}`);
            ShippingService(message.order_id, (err, data) => {
                if (err) {
                    console.error('Error processing order:', err);
                    return;
                }
                else{
                    console.log('Order processed:', data);
                }
            });
        } else {
            console.warn('Unknown event type:', message.type);
        }
    } catch (error) {
        console.error('Error in handleEvent:', error);
        throw error;
    }
};

module.exports = {
    handleEvent,
};
