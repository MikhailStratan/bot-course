const telegramAPI = require('node-telegram-bot-api');
const { gameOptions, restartGame } = require('./options');
const TOKEN = '5485627089:AAHvk_wUCcWuDEOsTA-dUdtnpMocldGpuvc';

const bot = new telegramAPI(TOKEN, { polling: true });
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `I will think of a number from 1 to 9 and you will guess it!`);
    const randomNumber = Math.floor(Math.random() * 9 + 1);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Guess now!`, gameOptions);
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Initial hello!'},
        {command: '/info', description: 'Info about you'},
        {command: '/oppa', description: 'Something weird'},
        {command: '/game', description: 'Guess a number!'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;


        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/w/warmertogether/warmertogether_002.webp');
            return bot.sendMessage(chatId, 'Startuem!!!');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is: ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'My yours don`t understand');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (chats[chatId] == data) {
            return await bot.sendMessage(chatId, `This is marvelous, you picked ${data} and guessed the number!`, restartGame);
        } else {
            console.log(`${data}, ${chats[chatId]}`)
            return await bot.sendMessage(chatId, `Nope, this is not the number!`, restartGame);
        }
    })
}

start();
