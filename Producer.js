const { Kafka } = require('kafkajs')
const request = require('request');
const url = 'http://api.openweathermap.org/data/2.5/forecast?lat=34.05&lon=-118.24&units=imperial&appid=5539d516237fd8de336fbaeb1d5639f8';
const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['localhost:9092']
});
let message = '';
const main = async function()
{

console.log(message);
	const producer = kafka.producer()

	await producer.connect()
	await producer.send({
	  topic: 'weather-warning',
	  messages: [
	    { value: message },
	  ],
	})
	producer.disconnect();
};

request(url, function (err, response, body) {
  	if(err){
    	console.log('error:', error);
	} else {
    	let weather = JSON.parse(body);	   
 	   	if(weather.list[1].main.temp > 100){
    		message = 'its over 100 degrees, its best to stay inside'
  	 	 }else if(weather.list[1].main.temp > 80 && weather.list[1].main.temp < 100 ) {
    		message = `It's ${weather.list[1].main.temp} degrees better wear something light`
  	 	}else if(weather.list[1].main.temp > 70 && weather.list[1].main.temp < 80 ) {
    		message = `It's ${weather.list[1].main.temp} degrees, its going to be perfect weather`
 	   	}else if(weather.list[1].main.temp < 70 ) {
    		message = `It's ${weather.list[1].main.temp} degrees better wear something warm`
 	   	}
 	 }
 	 main();
});
