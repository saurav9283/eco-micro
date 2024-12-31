const pool = require("../../config/db");

async function getRabbitConnect() {
    return require('../../utils/Rabbitmq.js');
}

module.exports = {
    CreateShippingOrderServices: async (data, callback) => {
        console.log('data: ', data);
        try {
            const { order_id, shipping_address, products } = data;

            const CreateShipping = process.env.CREATE_SHIPPING
                .replace('<order_id>', order_id)
                .replace('<shipping_address>', shipping_address)
                .replace('<products>', JSON.stringify(products))
                .replace('<isPlaced>', 0)
                .replace('<isBilled>', 0)
            console.log('CreateShipping: ', CreateShipping);
            pool.query(CreateShipping, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        } catch (error) {
            console.log('error: ', error);
            callback(error, null);
        }
    },

    ShippingService: async (order_id,total_amount, callback) => {
        console.log('order_id: ', order_id);
        try {
            const Billing_Details = process.env.BILLING_DETAILS.replace('<order_id>', order_id);
            console.log('Billing_Details: ', Billing_Details);
            pool.query(Billing_Details, (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    console.log('result: ', result);
                    const products = JSON.parse(result[0].products);
                    const product_id = products[0].product_id;
                    const quantity = products[0].quantity;
                    console.log('product_id: ', product_id);
                    console.log('quantity: ', quantity);

                    const Fetch_Current_Stock = process.env.FETCH_CURRENT_STOCK.replace('<product_id>', product_id);
                    pool.query(Fetch_Current_Stock, async (err, stockResult) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            const current_stock = parseFloat(stockResult[0].quantity_on_hand);
                            console.log('current_stock: ', current_stock);
                            if (current_stock === 0) { // Product is out of stock
                                console.log('Product is out of stock');
                                const OutOfStockProduct = {
                                    order_id,
                                    type: 'shipping.back_ordered'
                                }
                                const RabbitConnect = await getRabbitConnect();
                                await RabbitConnect.publishToExchange("ff", OutOfStockProduct);

                            }
                            else if (current_stock < quantity) { // stock is less than quantity
                                console.log('stock is less than quantity order_refunded');
                                const orderRefundedMessage = {
                                    order_id,
                                    type: 'billing.order_refunded',
                                    price: total_amount
                                };
                                console.log('orderRefundedMessage: ', orderRefundedMessage);
                                const RabbitConnect = await getRabbitConnect();
                                await RabbitConnect.publishToExchange("ff", orderRefundedMessage);
                                console.log('Message published to exchange: billing.order_refunded');
                                return callback('Insufficient Balance', null);
                            }
                            else if (current_stock >= quantity) {
                                const new_stock = parseFloat(current_stock - quantity)
                                // console.log('new_stock: ', new_stock);

                                const Update_Stock = `UPDATE product SET quantity_on_hand = ${new_stock} WHERE product_id = '${product_id}'`;
                                console.log('Update_Stock: ', Update_Stock);

                                pool.query(Update_Stock, (err, updateResult) => {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        const Update_Order_Status = process.env.UPDATE_ORDER_STATUS.replace('<order_id>', order_id);
                                        pool.query(Update_Order_Status, async (err, statusResult) => {
                                            if (err) {
                                                callback(err, null);
                                            }
                                            else if (statusResult.affectedRows > 0) {
                                                const OrderShipped = {
                                                    order_id,
                                                    type: 'shipping.shipping_label_created'
                                                }
                                                const RabbitConnect = await getRabbitConnect();
                                                await RabbitConnect.publishToExchange("ff", OrderShipped);
                                                callback(null, statusResult);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.log('error: ', error);
            callback(error, null);
        }
    },

    GetListofShippingService: async (product_id, quantityOnHand, callback) => {
        console.log('product_id, quantityOnHand: ', product_id, quantityOnHand);
        const Get_Product = process.env.GET_PRODUCT_DETAILS.replace('<product_id>', product_id)
            .replace('<quantity_on_hand>', quantityOnHand);
        // console.log('Get_Product: ', Get_Product);
        pool.query(Get_Product, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }
}