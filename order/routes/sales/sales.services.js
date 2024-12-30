const pool = require("../../config/db");
const moment = require('moment');
// const RabbitConnect = require('../../utils/Rabbitmq.js');
async function getRabbitConnect() {
    return require('../../utils/Rabbitmq.js');
}

module.exports = {
    CreateSalesOrderService: async (data, callback) => {
        const { order_id, customer_id, products } = data;
        console.log('data:=-=- ', data);
        try {
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const GET_PRICE = process.env.GET_PRICE.replace('<product_id>', products[0].product_id);
            console.log('GET_PRICE: ', GET_PRICE);

            pool.query(GET_PRICE, [], (error, results) => {
                if (error) {
                    return callback(error);
                }
                if (results.length === 0) {
                    return callback(new Error('Product not found'));
                }
                console.log('results: ', results);

                const price = results[0].price * data.products[0].quantity;
                console.log('price: ', price);

                const Create_Query = process.env.CREATE_ORDER_QUERY
                    .replace('<order_id>', order_id)
                    .replace('<products>', JSON.stringify(products))
                    .replace('<customer_id>', customer_id)
                    .replace('<total_amount>', price)
                    .replace('<created_at>', currentDate)
                    .replace('<Status>', 'OrderPlaced');
                console.log('Create_Query: ', Create_Query);

                pool.query(Create_Query, [], async (error, results) => {
                    if (error) {
                        return callback(error);
                    }
                    console.log('Order created successfully in the database');

                    // Prepare message for publishing
                    const message = {
                        order_id,
                        customer_id,
                        products,
                        price,
                        type: 'sales.order_placed',
                    };
                    console.log('message: ', message);
                    try {
                        // Publish to RabbitMQ exchange that consume billing service
                        const RabbitConnect = await getRabbitConnect();
                        await RabbitConnect.publishToExchange("ff", message);

                        console.log('Message published to exchange: sales.order_placed');
                    } catch (publishError) {
                        console.error('Error publishing to RabbitMQ:', publishError);
                        return callback(publishError);
                    }

                    return callback(null, results);
                });
            });
        } catch (error) {
            // console.error('Unexpected error:', error);

            throw error; // If no valid callback, rethrow the error
        }
    },

    UpdateOrderFailService: async (order_id, callback) => {
        console.log('order_id: ', order_id);
        const Update_Query = process.env.UPDATE_ORDER_QUERY
            .replace('<order_id>', order_id)
            .replace('<Status>', 'PaymentFailed');
        console.log('Update_Query: ', Update_Query);
        pool.query(Update_Query, [], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.affectedRows === 0) {
                console.log('Order updated successfully in the database');
                return callback(new Error('Order not found'));
            }

        });
    },

    UpdateOrderRefundService: async (order_id, callback) => {
        console.log('order_id: ', order_id);
        const Update_Query = process.env.UPDATE_ORDER_QUERY
            .replace('<order_id>', order_id)
            .replace('<Status>', 'OrderRefunded');
        console.log('Update_Query: ', Update_Query);
        pool.query(Update_Query, [], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.affectedRows === 0) {
                console.log('Order updated successfully in the database');
                return callback(new Error('Order not found'));
            }

        });
    },

    UpdateOrderBilledService: async (order_id, callback) => {
        console.log('order_id: ', order_id);
        const Update_Query = process.env.UPDATE_ORDER_QUERY
            .replace('<order_id>', order_id)
            .replace('<Status>', 'OrderBilled');
        console.log('Update_Query: ', Update_Query);
        pool.query(Update_Query, [], (error, results) => {
            if (error) {
                return callback(error);
            }
            if(results.affectedRows === 0) {
                console.log('Order updated successfully in the database');
                return callback(new Error('Order not found'));
            }
            
        });
    },

    UpdateOrderShippedService: async (order_id, callback) => {
        console.log('order_id: ', order_id);
        const Update_Query = process.env.UPDATE_ORDER_QUERY
            .replace('<order_id>', order_id)
            .replace('<Status>', 'ShippingLabelCreated');
        console.log('Update_Query: ', Update_Query);
        pool.query(Update_Query, [], (error, results) => {
            if (error) {
                return callback(error);
            }
            if(results.affectedRows === 0) {
                console.log('Order updated successfully in the database');
                return callback(new Error('Order not found'));
            }
            
        });
    },

    UpdateOrderBackOrderedService: async (order_id, callback) => {
        console.log('order_id: ', order_id);
        const Update_Query = process.env.UPDATE_ORDER_QUERY
            .replace('<order_id>', order_id)
            .replace('<Status>', 'BackOrdered');
        console.log('Update_Query: ', Update_Query);
        pool.query(Update_Query, [], (error, results) => {
            if (error) {
                return callback(error);
            }
            if(results.affectedRows === 0) {
                console.log('Order updated successfully in the database');
                return callback(new Error('Order not found'));
            }
            
        });
    },
};
