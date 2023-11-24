const pool = require('./db')

async function saveTinyOrders(ordersToUpdate) {

    for (let order of ordersToUpdate) {
        console.log(order.id_tiny, order.id_shopify)


        const ordersWithoutEcommerceNumber = await pool.query(`
        update ecommerce.pedido_trocas 
        set numero_ecommerce = '${order.id_tiny}'
        where order_number = '${order.id_shopify}' 
        `)

    }
}



module.exports = saveTinyOrders