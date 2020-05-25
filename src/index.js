import Twit from 'twit'
import Canvas, { createCanvas } from 'canvas'
import config from './config.json'
let Image = Canvas.Image;

let timeInMinutes = 15;

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
    return "rgb(" + r + "," + g + "," + b + ")";
}

const tweet = () => {

    const cor1 = genareteColor();
    const cor2 = genareteColor();


    contex.beginPath();
    contex.fillStyle = cor1;
    contex.moveTo(0, 0);
    contex.lineTo(0, 400);
    contex.lineTo(800, 400);
    contex.lineTo(800, 0);
    contex.fill();
    contex.beginPath();
    contex.moveTo(0, 400);
    contex.fillStyle = cor2;
    contex.lineTo(0, 800);
    contex.lineTo(800, 800);
    contex.lineTo(800, 400);
    contex.fill();

    const fs = require('fs')
        , out = fs.createWriteStream(__dirname + '/text.png')
        , stream = canvas.pngStream();
    const  dataUrl = canvas.pngStream().pipe(out);
    //I'm not sure if this bit is really necessary

    // first we must post the media to Twitter
    T.post('media/upload', 
	   { media_data: canvas.toBuffer().toString('base64') },
	    function (err, data, response) {

        	// now we can reference the media and post a tweet (media will attach to the tweet)
	        let mediaIdStr = data.media_id_string;
		let params = { status: `1: ${cor1} \n2: ${cor2}`, media_ids: [mediaIdStr] }

	        T.post('statuses/update', params, function (err, data, response) {
        	console.log(data)
        })
    })

}

setInterval( () => setTimeout(tweet, 30000), timeInMinutes * 60000)
