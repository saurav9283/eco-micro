const { BillingProcessService } = require("../routes/Billing/billing.services");

const handleEvent = async (message) => {
    try {
        console.log('Handling event:', message);

        if (message.type === "sales.order_placed") {
            BillingProcessService(message, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result, "Billing Processed Successfully");
                }
            });
        } 
        else if(message.type === "billing.order_refunded")
        {
            console.log('Refund Processed Successfully');
            RefundedService(message.order_id, (err, result) => {
            });
        }
        else {
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
