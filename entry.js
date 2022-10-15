const { Kafka } = require('kafkajs')

const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['localhost:9092']
})

// really should be something like 6000 (slightly higher than 1 heartbeat)
const warning_signal_msts = 3;
// a variable to keep track of last heartbeat timestamp
var last_heartbeat_msts = 0;

// timer handler for missing hearbeats
const missingHbHandler = async function()
{
	console.log("Oh no!! Missed a heartbeat");
}

// start a oneshot resetable timer for the warning
// Should be warning_signal_msts/1000! but changed for demo
const oneshot_timer_hdl = setTimeout(missingHbHandler, 6000);

const heartbeatCheck = async function(e)
{
	console.log(JSON.stringify(e)); // for demo
	const this_heartbeat_msts = e.timestamp;
	oneshot_timer_hdl.refresh() // reset the timer

	// exit early if we don't have a previous heartbeat
	if( last_heartbeat_msts === 0 )
	{
		last_heartbeat_msts = this_heartbeat_msts;
		return;
	}

	// compare delta between heartbeats
	if( this_heartbeat_msts - last_heartbeat_msts > warning_signal_msts )
		console.log("Oh no!!! Heartbeat took longer than expected");
}

const runManager = async function()
{
	const consumer = kafka.consumer({ groupId: 'test-group' });
	await consumer.connect();

	// listen to our own heartbeat
	const { HEARTBEAT } = consumer.events;
	const removeHeartbeatListener = consumer.on(HEARTBEAT, heartbeatCheck);

	await consumer.run(); // will start Consumer runnable under the hood
};

runManager();
