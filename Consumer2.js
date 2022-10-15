const { Kafka } = require('kafkajs')

const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['localhost:9092']
})

const main = async function()
{
	const consumer = kafka.consumer({ groupId: 'group2' })

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
