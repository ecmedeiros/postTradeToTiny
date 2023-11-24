const saveTrades = require('../../database/saveTinyOrders');
const sendLabel = require('./sendLabel');
const updateSendLabel = require('../../database/updateSendLabel');
const filterTinyOrders = require('./filterTinyOrders');

async function mainTiny() {
    const filteredTinyOrders = await filterTinyOrders()
    await saveTrades(filteredTinyOrders)
    console.log('Ordens salvas')

    if (filteredTinyOrders.length > 0) {
        for (let order of filteredTinyOrders) {
            console.log(order)

            await sendLabel(order.id_tiny)
            console.log('Enviei as Labels')

            await updateSendLabel(order.id_shopify)
            console.log('Marquei como enviado')
        }
    }
}

module.exports = mainTiny