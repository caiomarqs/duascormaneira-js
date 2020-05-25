"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _twit = _interopRequireDefault(require("twit"));

var _canvas = _interopRequireWildcard(require("canvas"));

var _config = _interopRequireDefault(require("./config.json"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Image = _canvas["default"].Image;
var timeInMinutes = 15;
var T = new _twit["default"]({
  consumer_key: _config["default"]["consumer_key"],
  consumer_secret: _config["default"]["consumer_secret"],
  access_token: _config["default"]["access_token"],
  access_token_secret: _config["default"]["access_token_secret"]
}); //Generate the canvas

var canvas = (0, _canvas.createCanvas)(800, 800);
var contex = canvas.getContext('2d');

var genareteColor = function genareteColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
};

var tweet = function tweet() {
  var cor1 = genareteColor();
  var cor2 = genareteColor();
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

  var fs = require('fs'),
      out = fs.createWriteStream(__dirname + '/text.png'),
      stream = canvas.pngStream();

  var dataUrl = canvas.pngStream().pipe(out); //I'm not sure if this bit is really necessary
  // first we must post the media to Twitter

  T.post('media/upload', {
    media_data: canvas.toBuffer().toString('base64')
  }, function (err, data, response) {
    // now we can reference the media and post a tweet (media will attach to the tweet)
    var mediaIdStr = data.media_id_string;
    var params = {
      status: "1: ".concat(cor1, " \n2: ").concat(cor2),
      media_ids: [mediaIdStr]
    };
    T.post('statuses/update', params, function (err, data, response) {
      console.log(data);
    });
  });
};

setInterval(function () {
  return setTimeout(tweet, 30000);
}, timeInMinutes * 60000);