const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios =require('axios');
const express =require('express');

const bot  = new TelegramBot(process.env.API_KEY_BOT);
bot.setWebHook(`${process.env.WEBHOOK_URL}/bot${process.env.API_KEY_BOT}`);
const app = express();
app.use(express.json());
app.post(`/bot${process.env.API_KEY_BOT}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(process.env.APP_PORT, () =>{
    console.log(`app listen ${process.env.APP_PORT}`)
})

bot.on('message', async (msg) => {
    const chaId = msg.chat.id;
    console.log(`${new Date()} get message ${msg.text} from ${chaId}`);
    if(msg.text==='/start') {
        bot.sendMessage(chaId, 'Привет, я бот который поможет тебе узнать погоду! Просто введи названия города');
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
        const dataWeather = await axios.get(`${process.env.API_WEATHER}?q=${city}&appid=${process.env.API_WEATHER_KEY}&lang=${process.env.API_WEATHER_RESPONCE_LANG}`);
        return `${city} - ${(dataWeather.data.weather[0].description)}\nТемпература: ${(dataWeather.data.main.temp-273.15).toFixed(2)}С°\nВлажность: ${dataWeather.data.main.humidity}%`;
    } catch(err){
        console.log(err);
        return;
    }
    
}
