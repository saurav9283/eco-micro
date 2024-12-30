const { CreateBillingService, GetListBalanceAccountService } = require("./billing.services");

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
  },

  GetListBalanceAccountController: async (req, res) => {
    try {
      const data = JSON.parse(req.query.data);
      // console.log('data: ', data);
      let billing_account_id, card_number, availableBalance;
      data.forEach(element => {
        billing_account_id = element.billing_account_id;
        card_number = element.card_number;
        availableBalance = element.availableBalance;
      });
      console.log('billing_account_id, card_number, availableBalance: ', billing_account_id, card_number, availableBalance);
      GetListBalanceAccountService(billing_account_id, card_number, availableBalance, (err, data) => {
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