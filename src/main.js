const mainTiny = require('./js/tiny/mainTiny');
const mainShopify = require('./js/shopify/getShopifyOrders');

const callShopify = async () => {
    try {
        await mainShopify();
    } catch (err) {
        console.error('Error in Shopify:', err);
        setTimeout(callShopify, 300000); // Espera 5 minutos e tenta novamente
    }
};

const callTiny = async () => {
    try {
        await mainTiny();
    } catch (err) {
        console.error('Error in Tiny:', err);
        setTimeout(callTiny, 300000); // Espera 5 minutos e tenta novamente
    }
};

const startProcesses = async () => {
    try {
        setInterval(callShopify, 300000);
        setInterval(callTiny, 300000);

        console.log('Calling Shopify Orders...');
        await callShopify();
        console.log('Shopify Tasks Done!');

        console.log('Calling Tiny Orders...');
        await callTiny();
        console.log('Tiny Tasks Done!');
    } catch (err) {
        console.error('Main Process Error:', err);
        setTimeout(startProcesses, 300000); // Espera 5 minutos e tenta novamente
    }
};

startProcesses();
