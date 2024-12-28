const pool = require("../../config/db");

module.exports = {
    GetwayCreateOrderService: async (data) => {
        return new Promise((resolve, reject) => {
            const GET_PRICE = process.env.GET_PRICE.replace('<product_id>', data.products[0].product_id);
            console.log('GET_PRICE: ', GET_PRICE);

            pool.query(GET_PRICE, [], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length === 0) {
                    return reject(new Error('Product not found'));
                }
                console.log('results: ', results);

                const price = results[0].price * data.products[0].quantity;
                console.log('price: ', price);

                const Create_Query = process.env.CREATE_ORDER_QUERY
                    .replace('<order_id>', data.order_id)
                    .replace('<products>', JSON.stringify(data.products))
                    .replace('<customer_id>', data.customer_id)
                    .replace('<billing_account_id>', data.billing_account_id)
                    .replace('<billing_address>', data.billing_address)
                    .replace('<shipping_address>', data.shipping_address)
                    .replace('<Status>', 'OrderPlaced')
                    .replace('<price>', price);
                console.log('Create_Query: ', Create_Query);

                pool.query(Create_Query, [], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({ results, price });
                });
            });
        });
    },

    UpdateStatusOrderService: async (data) => {
        return new Promise((resolve, reject) => {
            if (!data.customer_id) {
                return reject(new Error("Customes ID are required."));
            }

            const Update_Query = process.env.UPDATE_ORDER_QUERY
                .replace('<billing_account_id>', data.billing_account_id)
                .replace('<Status>', data.status)
                .replace('<customer_id>', data.customer_id)
                .replace('<billing_address>', data.billing_address)
                .replace('<price>', data.price);

            console.log('Update_Query:', Update_Query);

            pool.query(Update_Query, (error, results) => {
                if (error) {
                    console.error("Error executing update query:", error);
                    return reject(error);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error("No order found with the given ID."));
                }
                console.log('results: ', results);
                resolve(results);
            });
        });
    },

    // GetListOfOrderListService: async (products) => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             // Validate product data
    //             products.forEach(product => {
    //                 if (!product.product_id || typeof product.price !== 'number') {
    //                     return reject(new Error('Invalid product data'));
    //                 }
    //             });
    
    //             const query = `SELECT * FROM orders WHERE product_id IN (${products.map(p => `'${p.product_id}'`).join(', ')}) AND price IN (${products.map(p => p.price).join(', ')})`;
    
    //             console.log('Query to fetch orders:', query);
    
    //             pool.query(query, (error, results) => {
    //                 if (error) {
    //                     console.error("Error fetching orders:", error);
    //                     return reject(error);
    //                 }
    
    //                 resolve(results);
    //             });
    //         } catch (error) {
    //             console.error('Error in GetListOfOrderListService:', error);
    //             reject(error);
    //         }
    //     });
    // }

};