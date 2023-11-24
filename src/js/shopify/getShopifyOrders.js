require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const insertTradeTable = require('../../database/insertTradeTables')

const jsonPath = '../src/json'
const accessToken = process.env.SHOPIFY_TOKEN
const shopifyDomain = process.env.DOMAIN

async function dumpJSON(data, archiveName, append) {
    const textJson = JSON.stringify(data)
    append ?
        fs.writeFile(`${jsonPath}/${archiveName}`, textJson, (err) => err ? console.error(err) : console.log('sucefully write shopJson.json'))
        :
        fs.writeFile(`${jsonPath}/${archiveName}`, textJson, (err) => err ? console.error(err) : console.log('sucefully append orders to shopJson.json'))
}

async function fetchOrders() {
    try {
        const since_id = getLastPage();

        const ordersUrl = `https://${shopifyDomain}/admin/api/2022-01/orders.json?limit=250&since_id=${since_id}`

        const config = {
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
        };

        const response = await axios.get(ordersUrl, config)
        const orders = response.data.orders;

        if (orders.length > 0) {
            const lastOrderId = orders[orders.length - 1].id;
            dumpJSON(lastOrderId, 'lastPage.json', false)
            return orders
        } else {
            return []
        }

    } catch (error) {
        console.error(error)
    }
}


function getLastPage() {
    try {
        const readedPage = fs.readFileSync(`${jsonPath}/lastPage.json`)
        return readedPage.toString()

    } catch (err) {
        console.error(err)
        return 'error'
    }
}

async function FilterTrades(orders) {
    const trades = []

    orders.map(order => {
        if (typeof order.discount_codes[0] != 'undefined') {
            const code = order.discount_codes

            code.forEach(code => {
                if (code.code.includes('TROCA')) {
                    trades.push(order.order_number)
                };
            });
        }
    })

    const lastOrderId = orders[orders.length - 1].id;

    dumpJSON(orders, 'shopJson.json', true)
    dumpJSON(lastOrderId, 'lastPage.json', false)

    return trades
}

async function saveTrades(trades) {
    for (let trade of trades) {
        insertTradeTable(trade)
    }
}

//main
async function main() {
    const orders = await fetchOrders();
    if (orders.length > 0) {
        const trades = await FilterTrades(orders)
        await saveTrades(trades)
    }
}

module.exports = main