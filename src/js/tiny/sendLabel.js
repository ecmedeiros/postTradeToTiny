const axios = require('axios')
require('dotenv').config()

async function sendLabel(idPedido) {
    
    const token = process.env.TINY_TOKEN;
    const marcadores = {
        marcadores: [
            {
                marcador: {
                    id: '180002',
                    descricao: 'troca'
                }
            }
        ]
    }

    const formato = "json";
    const url_tiny = "https://api.tiny.com.br/api2/pedido.marcadores.incluir";

    try {
        const response = await axios.post(url_tiny, null,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    token: token,
                    idPedido: idPedido,
                    formato,
                    marcadores
                },
            });
        console.log('Label sended for order: ', idPedido)
        return

    } catch (err) {
        console.error(err);
    }
}

module.exports = sendLabel