const TelegramBot = require('node-telegram-bot-api');

const token = '7057608563:AAEotFzag53RI69MQGTCVtv2n-XBRfF-K3U';
const bot = new TelegramBot(token, { polling: true });

//start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, октагон!');
});

//help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
    Список доступных команд:
    /help - возвращает список команд, с их описанием
    /site - отправляет в чат ссылку на сайт Октагона
    /creator - отправляет в чат мое ФИО
    `;
    bot.sendMessage(chatId, helpMessage);
});

//site
bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'https://students.forus.ru');
});

//creator
bot.onText(/\/creator/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Медушевская Вероника Витальевна');
});
