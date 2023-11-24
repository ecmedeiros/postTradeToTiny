const pool = require('./db')

async function insertTradeTable(shopify_order) {
    try {

        const result = await pool.query(`

        CREATE TABLE IF NOT EXISTS ecommerce.pedido_trocas (
            id SERIAL PRIMARY KEY,
            order_number int unique,
            numero_ecommerce int,
            label_enviada boolean
            );

        insert into ecommerce.pedido_trocas 
        (order_number,label_enviada)
        values 
        ('${shopify_order}',false)
        
        `)

        console.log('order inserted:', result)

    } catch (error) {

        if (error.code === '23505') {
            console.error('Não há trocas novas para salvar')
        }
    }
}

module.exports = insertTradeTable