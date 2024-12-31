module.exports = {
    "sales.order_placed" : [require('./handle-oder-placed.js')],
    "billing.order_refunded" : [require('./handle-oder-placed.js')]
}