const { CreateBillingService } = require("./billing.services");

module.exports = {
  CreateBillingController: async (req, res) => {
    try {
      CreateBillingService(req.body, (err, data) => {
        if (err) {
          res.status(400).json({
            message: "Bad request"
          });
        } else {
          res.status(200).json({
            data: data
          });
        }
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error"
      });

    }
  }
}