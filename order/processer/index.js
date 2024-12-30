module.exports = {
    "billing.payment_failed" : [require('./handle-oder-placed')],
    "billing.order_refunded" : [require('./handle-oder-placed')],
    "billing.order_billed" : [require('./handle-oder-placed')],
    "shipping.shipping_label_created" : [require('./handle-oder-placed')],
    "shipping.back_ordered" : [require('./handle-oder-placed')]
    
}