const { Kafka } = require('kafkajs')

const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['localhost:9092']
})

const main = async function()
{
	const producer = kafka.producer()

	await producer.connect()
	await producer.send({
	  topic: 'test-topic',
	  messages: [
	    { value: 'Hello KafkaJS users!' },
	  ],
	})

	producer.disconnect();
};

main();
