const TelegramBot = require('node-telegram-bot-api');

const token = '7057608563:AAEotFzag53RI69MQGTCVtv2n-XBRfF-K3U';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        bot.sendMessage(chatId, 'Привет, октагон!');
    }
});