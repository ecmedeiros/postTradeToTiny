const pool = require('./db')

async function updateSendLabel(order_number) {

    const sendLabels = await pool.query(`
    UPDATE ecommerce.pedido_trocas SET label_enviada = true WHERE order_number ='${order_number}'
    `)

}

module.exports = updateSendLabel