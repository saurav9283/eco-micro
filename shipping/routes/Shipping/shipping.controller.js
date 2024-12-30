const { CreateShippingOrderServices } = require("./shipping.services");

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
    }
}