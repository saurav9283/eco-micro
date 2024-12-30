const pool = require("../../config/db");

async function getRabbitConnect() {
    return require('../../utils/Rabbitmq.js');
}

module.exports = {
    CreateBillingService: (data, callback) => {
        console.log('data: ', data);
        try {
            const { order_id, billing_account_id, billing_address } = data;

            const create_billing = process.env.CREATE_BILLING
                .replace('<order_id>', order_id)
                .replace('<billing_account_id>', billing_account_id)
                .replace('<billing_address>', billing_address);
            console.log('create_billing: ', create_billing);

            pool.query(create_billing, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null);

        }
    },

    BillingProcessService: async (data, callback) => {
        console.log('Received Billing Data:', data);

        const { order_id, customer_id, products, price, type } = data;
        console.log('price: ', price);
        const Get_Billing_Details = process.env.GET_BILLING_DETAILS
            .replace('<order_id>', order_id);
        console.log('Get_Billing_Details: ', Get_Billing_Details);

        pool.query(Get_Billing_Details, async (err, result) => {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                if (result.length > 0) {
                    console.log('Billing Details:', result);
                    const billing_account_id = result[0].billing_account_id;

                    const Get_Account_Balance = process.env.GET_ACCOUNT_BALANCE
                        .replace('<billing_account_id>', billing_account_id)
                        .replace('<order_id>', order_id);
                    console.log('Get_Account_Balance: ', Get_Account_Balance);
                    pool.query(Get_Account_Balance, async (err, result) => {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        }
                        console.log('result: ', result);
                        if (result[0].balance < price) {
                            console.log('Insufficient Balance');
                            const paymentFailedMessage = {
                                order_id,
                                type: 'billing.payment_failed',
                            };
                            console.log('paymentFailedMessage: ', paymentFailedMessage);
                            const RabbitConnect = await getRabbitConnect();
                            await RabbitConnect.publishToExchange("ff", paymentFailedMessage);

                            // await RabbitConnect.publishToExchange("ff", paymentFailedMessage);
                            console.log('Message published to exchange: billing.payment_failed');
                        }
                        else if (result[0].balance >= price) {
                            const remaining_balance = result[0].balance - price;
                            const Update_Account_Balance = process.env.UPDATE_ACCOUNT_BALANCE
                                .replace('<billing_account_id>', billing_account_id)
                                .replace('<remaining_balance>', remaining_balance);
                            console.log('Update_Account_Balance: ', Update_Account_Balance);
                            pool.query(Update_Account_Balance, async (err, result) => {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                }
                                // console.log('result: ', result);
                                if (result.affectedRows > 0) {
                                    const orderBilledMessage = {
                                        order_id,
                                        type: 'billing.order_billed',
                                    };
                                    console.log('orderBilledMessage: ', orderBilledMessage);
                                    const RabbitConnect = await getRabbitConnect();
                                    await RabbitConnect.publishToExchange("ff", orderBilledMessage);
                                    console.log('Message published to exchange: billing.order_billed');
                                    callback(null, 'Billing successful');
                                }
                            });
                        }
                        else {
                            const orderRefundedMessage = {
                                order_id,
                                type: 'billing.order_refunded',
                            };
                            console.log('orderRefundedMessage: ', orderRefundedMessage);
                            const RabbitConnect = await getRabbitConnect();
                            await RabbitConnect.publishToExchange("ff", orderRefundedMessage);
                            console.log('Message published to exchange: billing.order_refunded');
                            return callback('Insufficient Balance', null);
                        }

                    });

                }
            }
        });


    },

    GetListBalanceAccountService: (billing_account_id, card_number, availableBalance, callback) => {
        console.log('billing_account_id, card_number, availableBalance: ', billing_account_id, card_number, availableBalance);
        try {
            const Get_List_Balance_Account = process.env.GET_LIST_BALANCE_ACCOUNT
                .replace('<billing_account_id>', billing_account_id)
                .replace('<card_number>', card_number)
                .replace('<availableBalance>', availableBalance);
            // console.log('Get_List_Balance_Account: ', Get_List_Balance_Account);

            pool.query(Get_List_Balance_Account, (err, result) => {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        } catch (error) {
            console.log(error);
            callback(error, null);
        }
    }
}