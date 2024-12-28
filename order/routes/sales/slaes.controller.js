const { GetwayCreateOrderService, GetListOfOrderListService } = require('./sales.services');
const { UpdateStatusOrderService } = require('./sales.services');

module.exports = {
    CreateOrderGetWayController: async (req, res) => {
        try {
            GetwayCreateOrderService(req.body, (err, result) => {
                if (err) {
                    if (err.message === 'Product not found') {
                        return res.status(404).json({ message: 'Product not found' });
                    }

                    console.error('Error creating order:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                console.log('Received Order Data:', result);
                return res.status(201).json({ message: 'Order created successfully', data: result });
            });
        } catch (error) {
            console.error('Error creating order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    UpdateStatusOfOrderController: async (data, res) => {
        try {
            const results = await UpdateStatusOrderService(data, (err, result) => {
                if (err) {
                    console.error('Error updating order status:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(200).json({
                    message: `Order status updated successfully to '${data}'.`,
                    results,
                });

            })
        } catch (error) {
            console.error("Error in UpdateStatusOfOrderController:", error.message);
            res?.status(500)?.json({ message: error.message || "Internal server error." });
        }
    },

    // GetListOfOrderListController: async (req, res) => {
    //     try {
    //         const products = JSON.parse(req.query.products || '[]');

    //         if (!products || !Array.isArray(products) || products.length === 0) {
    //             return res.status(400).json({ message: 'No products found in the request' });
    //         }

    //         console.log('Received products:', products);

    //         GetListOfOrderListService(products, (error, results) => {
    //             if (error) {
    //                 console.error('Error in service:', error);
    //                 return res.status(500).json({ message: 'Error in creating order' });
    //             }

    //             return res.status(200).json({
    //                 message: 'Product data processed successfully',
    //                 results: results
    //             });
    //         });

    //     } catch (error) {
    //         console.error('Error processing the request:', error);
    //         return res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

};
