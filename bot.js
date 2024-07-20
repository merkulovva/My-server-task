const TelegramBot = require('node-telegram-bot-api');
const qr = require('qr-image');
const puppeteer = require('puppeteer');
const fs = require('fs');

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
    !qr <текст или ссылка> - генерирует QR-код
    !webscr <URL> - отправляет скриншот сайта
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

//!qr
bot.onText(/!qr (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const qrText = match[1];

    try {
        const qrImage = qr.image(qrText, { type: 'png' });
        const qrImagePath = `qr_${Date.now()}.png`;
        const qrImageStream = fs.createWriteStream(qrImagePath);
        qrImage.pipe(qrImageStream);

        qrImageStream.on('finish', () => {
            setTimeout(() => {
                bot.sendPhoto(chatId, qrImagePath, { caption: 'QR-код' })
                    .then(() => fs.unlinkSync(qrImagePath))
                    .catch((error) => {
                        bot.sendMessage(chatId, 'Произошла ошибка при отправке QR-кода');
                        console.error(error);
                    });
            }, 1000);
        });
    } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка при генерации QR-кода');
        console.error(error);
    }
});

async function getBrowserInstance() {
    return await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
}

//!webscr
bot.onText(/!webscr (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];

    try {
        const browser = await getBrowserInstance();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const screenshotPath = `screenshot_${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await browser.close();

        setTimeout(() => {
            bot.sendPhoto(chatId, screenshotPath, { caption: 'Скриншот сайта' })
                .then(() => fs.unlinkSync(screenshotPath))
                .catch((error) => {
                    bot.sendMessage(chatId, 'Произошла ошибка при отправке скриншота');
                    console.error(error);
                });
        }, 1000);
    } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка при создании скриншота');
        console.error(error);
    }
});
