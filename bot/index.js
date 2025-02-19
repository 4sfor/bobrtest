const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios =require('axios');

const bot  = new TelegramBot(process.env.API_KEY_BOT, {polling: true});



bot.on('message', async (msg) => {
    const chaId = msg.chat.id;
    console.log(`${new Date()} get message ${msg.text} from ${chaId}`);
    if(msg.text==='/start') {
        bot.sendMessage(chaId, 'Привет, я бот который поможет тебе узнать погоду! Просто введи название города');
    } else {
        console.log(msg.text);
        const responce = await getWeather(msg.text);
        if(responce===undefined){
            bot.sendMessage(chaId, 'Не удалось получить данные. Проверьте название города или попробуйте позднее');
            return;
        }
        bot.sendMessage(chaId, responce);
    }

})

async function getWeather(city){
    try{
        const dataWeather = await axios.get(`${process.env.API_WEATHER}`, {params:{
            q:city,
            appid:process.env.API_WEATHER_KEY,
            lang:process.env.API_WEATHER_RESPONCE_LANG,
        },
        timeout: 5000,
    })
        return `${city} - ${(dataWeather.data.weather[0].description)}\nТемпература: ${(dataWeather.data.main.temp-273.15).toFixed(2)}С°\nВлажность: ${dataWeather.data.main.humidity}%`;
    } catch(err){
        console.log(err);
        return;
    }
    
}
