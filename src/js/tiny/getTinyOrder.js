const axios = require('axios')
require('dotenv').config()
const fs = require('fs')

async function getMaxPages() {
    const token = process.env.TINY_TOKEN;
    const search = "";
    const format = "json";
    const fields = "numero,situacao,numero_ecommerce,valor,codigo_rastreamento";
    const url_tiny = "https://api.tiny.com.br/api2/pedidos.pesquisa.php";

    try {
        const response = await axios.get(url_tiny, {
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                token,
                pesquisa: search,
                formato: format,
                campos: fields,
                pagina: '1',
            },
        });

        if (response.data.retorno.status === 'Erro') {
            const erro = response.data.retorno.erros[0].erro
            throw new Error(`> API returns an Error: ${erro} <`)
        }

        if (response.data.retorno.status === 'OK') {
            const maxPages = response.data.retorno.numero_paginas;
            return maxPages;
        }

    } catch (err) {
        console.error(err);
    }
}

async function getTinyOrders(pages) {
    const token_tiny = process.env.TINY_TOKEN;
    const search = "";
    const format = "json";
    const fields = "numero,situacao,numero_ecommerce,valor,codigo_rastreamento";
    const url_tiny = "https://api.tiny.com.br/api2/pedidos.pesquisa.php";
    // const page = pages
    const numeros_ecommerce = []

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            token: token_tiny,
            pesquisa: search,
            formato: format,
            campos: fields,
            pagina: pages,
        },
    }

    try {
        const response = await axios.get(url_tiny, config);

        if (response.data.retorno.status === 'OK') {
            const returnOrders = response.data.retorno.pedidos;

            if (!pages) {
                fs.writeFile('../src/json/tinyJson.json', JSON.stringify(returnOrders), (err) => { console.log(err) })
            } else {
                fs.appendFile('../src/json/tinyJson.json', JSON.stringify(returnOrders), (err) => { console.log(err) })
            }

            returnOrders.forEach(order => {
                numeros_ecommerce.push({id_shopify:order.pedido.numero_ecommerce,id_tiny :order.pedido.id })
            });

            return numeros_ecommerce;

        }

        if (response.data.retorno.status === 'Erro') {
            const erro = response.data.retorno.erros[0].erro
            throw new Error(`API returns an Error: ${erro}`)
        }

    } catch (err) {
        console.error(err);
    }
}

module.exports = {getTinyOrders,getMaxPages}