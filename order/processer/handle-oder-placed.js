const { UpdateOrderFailService, UpdateOrderRefundService, UpdateOrderBilledService, UpdateOrderShippedService, UpdateOrderBackOrderedService, MonerRefundedService } = require("../routes/sales/sales.services");

const handleEvent = async (message) => {
    try {
        console.log('Handling event:', message);

        switch (message.type) {
            case 'billing.payment_failed':
                console.log(`Processing payment failed for order: ${message.order_id}`);
                UpdateOrderFailService(message.order_id, 'PaymentFailed', (error, results) => {
                    if (error) {
                        console.error('Error updating order status:', error);
                        return;
                    }
                    console.log('Order status updated to PaymentFailed');
                });
                break;

            case 'billing.order_refunded':
                console.log(`Processing refund for order: ${message.order_id}`);
                UpdateOrderRefundService(message.order_id, (error, results) => {
                    if(error) {
                        console.error('Error updating order status:', error);
                        return;
                    }
                    console.log('Order status updated to Refunded');
                });
                break;

            case 'billing.order_billed':
                console.log(`Processing successful billing.order_billed ${message.order_id}`);
                UpdateOrderBilledService(message.order_id, (error, results) => {
                    if(error) {
                        console.error('Error updating order status:', error);
                        return;
                    }
                    console.log('Order status updated to Billed');
                });
                break;


            case 'shipping.shipping_label_created':
                console.log(`Processing successful shipping.shipping_label_created ${message.order_id}`);
                UpdateOrderShippedService(message.order_id, (error, results) => {
                    if(error) {
                        console.error('Error updating order status:', error);
                        return;
                    }
                    console.log('Order status updated to Billed');
                });
                break;

            case 'shipping.back_ordered':
                console.log(`Processing successful shipping.back_ordered: ${message.order_id}`);
                UpdateOrderBackOrderedService(message.order_id, (error, results) => {
                    if(error) {
                        console.error('Error updating order status:', error);
                        return;
                    }
                    console.log('Order status updated to Billed');
                });
                break;

            default:
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
