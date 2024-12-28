const pool = require('../../config/db');
const RabbitConnect = require('../../utils/Rabbitmq');
module.exports = {
    CreateBillingService: async (data) => {
        const { customer_id, billing_account_id, billing_address, price } = data;
        console.log('Received Billing Data:', data);

        try {
            const CHECK_BALANCE = process.env.CHECK_BALANCE
                .replace('<billing_account_id>', billing_account_id);
            console.log('CHECK_BALANCE: ', CHECK_BALANCE);
            pool.query(CHECK_BALANCE, async (error, results) => {
                if (error) {
                    throw error;
                }
                console.log('results: ', results);

                if (results.length > 0) {
                    console.log('Balance:', results[0].balance);
                    console.log('Price:', price);

                    if (results[0].balance < price) {
                        console.log("billing.payment_failed");
                        await RabbitConnect.publishToQueue('billing.payment_failed', JSON.stringify({
                            customer_id,
                            billing_account_id,
                            billing_address,
                            price,
                        }));
                        await RabbitConnect.publishToQueue('billing.order_refunded', JSON.stringify({
                            customer_id,
                            billing_account_id,
                            billing_address,
                            price,
                        }));
                        // throw new Error('Insufficient balance');
                    }
                } else {
                    console.error('No results found');
                }

            });



        } catch (error) {
            console.error('Error in billing service:', error);
        }
    }
};
