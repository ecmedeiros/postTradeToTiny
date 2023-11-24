const pool = require('./db')

async function selectOrders() {
    const tradeOrdes = []
    const ordersWithoutEcommerceNumber = await pool.query(`
    SELECT * FROM ecommerce.pedido_trocas WHERE label_enviada != true
    `)

    ordersWithoutEcommerceNumber.rows.forEach(order => {
        tradeOrdes.push(order.order_number)
    })

    return tradeOrdes
    // return ordersWithoutEcommerceNumber.rows
}

module.exports = selectOrders