const { CreateSalesOrderService, GetListProductsWithPriceService } = require("./sales.services");

module.exports = {
    CreateSalesOrderController: async (req, res) => {
        console.log('req.body: ', req.body);
        try {

            CreateSalesOrderService(req.body, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection error",
                        error: err.message || err
                    });
                }
                return res.status(200).json({
                    success: 1,
                    data: result
                });
            });
        } catch (error) {
            // console.error('Error in CreateSalesOrderService:', error);
            return res.status(500).json({
                success: 0,
                message: "Internal server error",
                error: error.message || error
            });
        }
    },

    GetListProductsWithPriceController: async (req, res) => {
        const data = JSON.parse(req.query.data);
        console.log('Data: ', data);
        let product_id, price;
        data.forEach(element => {
            product_id = element.product_id;
            price = element.price;
        });
        console.log('product_id,price: ', product_id, price);
        GetListProductsWithPriceService(product_id, price, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    error: err.message || err
                });
            }

            else {
                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        });
    }
};