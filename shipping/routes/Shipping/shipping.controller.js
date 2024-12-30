const { CreateShippingOrderServices, GetListofShippingService } = require("./shipping.services");

module.exports = {
    CreateShippingOrderController: async (req, res) => {
        try {
            CreateShippingOrderServices(req.body, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Shipping Order."
                    });
                } else {
                    res.status(200).send(data);
                }
            });
        } catch (error) {
            console.log('error: ', error);

        }
    },

    GetListofShippingController: async (req, res) => {
        const data = JSON.parse(req.query.data);
        console.log('data: ', data);
        let product_id, quantityOnHand
        data.forEach(element => {
            product_id = element.product_id;
            quantityOnHand = element.quantityOnHand;
        });
        console.log('product_id: ', product_id);
        console.log('quantityOnHand: ', quantityOnHand);
        try {
            GetListofShippingService(product_id ,quantityOnHand, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Shipping Order."
                    });
                } else {
                    res.status(200).send(data);
                }
            });
        } catch (error) {
            console.log('error: ', error);
        }
    }
}