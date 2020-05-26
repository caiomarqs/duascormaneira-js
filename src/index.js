import Twit from 'twit'
import Canvas, { createCanvas } from 'canvas'
import config from './config.json'
let Image = Canvas.Image;

let timeInMinutes = 59;

const T = new Twit({
    consumer_key: config["consumer_key"],
    consumer_secret: config["consumer_secret"],
    access_token: config["access_token"],
    access_token_secret: config["access_token_secret"]
})

//Generate the canvas
let canvas = createCanvas(800, 800);
let contex = canvas.getContext('2d');

const genareteColor = () => {
    let r = Math.floor((Math.random() * 256));
    let g = Math.floor((Math.random() * 256));
    let b = Math.floor((Math.random() * 256));
    return [r, g, b]
}

const totalHex = (cor) => {
    let r = rgbToHex(cor[0])
    let g = rgbToHex(cor[1])
    let b = rgbToHex(cor[2])
    return `#${r}${g}${b}`
}

const rgbToHex = (cor) => {
    let hex = Number(cor).toString(16)
    if (hex.length < 2) {
        hex = "0" + hex
    }
    return hex
}

const tweet = () => {

    const cor1 = genareteColor();
    const cor2 = genareteColor();


    contex.beginPath();
    contex.fillStyle = `rgb(${cor1[0]},${cor1[1]},${cor1[2]})`;
    contex.moveTo(0, 0);
    contex.lineTo(0, 400);
    contex.lineTo(800, 400);
    contex.lineTo(800, 0);
    contex.fill();
    contex.beginPath();
    contex.moveTo(0, 400);
    contex.fillStyle = `rgb(${cor2[0]},${cor2[1]},${cor2[2]})`;
    contex.lineTo(0, 800);
    contex.lineTo(800, 800);
    contex.lineTo(800, 400);
    contex.fill();

    const hex1 = totalHex(cor1)
    const hex2 = totalHex(cor2)

    const fs = require('fs')
        , out = fs.createWriteStream(__dirname + '/text.png')
        , stream = canvas.pngStream();
    const dataUrl = canvas.pngStream().pipe(out);
    //I'm not sure if this bit is really necessary

    // first we must post the media to Twitter
    T.post('media/upload',
        { media_data: canvas.toBuffer().toString('base64') },
        function (err, data, response) {

            // now we can reference the media and post a tweet (media will attach to the tweet)
            let mediaIdStr = data.media_id_string;
            let params = { status: `${hex1}\n${hex2}`, media_ids: [mediaIdStr] }

            T.post('statuses/update', params, function (err, data, response) {
                console.log(data)
            })
        })

}

setInterval(() => setTimeout(tweet, 30000), timeInMinutes * 60000)
