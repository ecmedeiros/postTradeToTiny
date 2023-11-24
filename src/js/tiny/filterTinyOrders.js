const { getTinyOrders, getMaxPages } = require('./getTinyOrder')
const getTradeOrders = require('../../database/selectTradeOrders')



async function filterTinyOrders() {
    const maxPages = await getMaxPages()
    const allTinyOrders = []

    const LastPageTinyOrders = await getTinyOrders(maxPages)
    const LastTinyOrders = await getTinyOrders(maxPages - 1)

    LastPageTinyOrders.forEach(order => allTinyOrders.push(order))
    LastTinyOrders.forEach(order => allTinyOrders.push(order))

    const tradeOrders = await getTradeOrders()

    const filteredTinyOrders = allTinyOrders.filter(order => tradeOrders.includes(Number(order.id_shopify)))

    return filteredTinyOrders
}

module.exports = filterTinyOrders
