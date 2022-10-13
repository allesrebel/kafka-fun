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
	    { value: 'Hello KafkaJS user!' },
	  ],
	})

	producer.disconnect();


	const consumer = kafka.consumer({ groupId: 'test-group' })

	await consumer.connect()
	await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

	await consumer.run({
		  eachMessage: async ({ topic, partition, message }) => {
			      console.log({
					    value: message.value.toString(),
					  })
			    },
	})
};

main();
