require('dotenv').config();
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBIT_URL || process.env.DOCKER_IMAGE_RABBITMQ;
const processors = require('../processer/index.js');

let connection, channel;

async function connect() {

    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
}

const subscribeToQueue = async (queueName, handleEvent) => {
    console.log('queueName: ', queueName);
    try {
        if (!channel) await connect();
        await channel.assertExchange('ff', 'fanout', { durable: true }); // create exchange

        await channel.assertQueue(queueName, { durable: true }); // create queue
        channel.bindQueue(queueName, 'ff', ''); // bind queue to exchange
        channel.consume(queueName, async (msg) => {  // consume message from queue

            if (msg !== null) {
                try {
                    const message = JSON.parse(msg.content.toString());
                    console.log('message: ', message);
                    const handlers = processors[message.type];
                    console.log('handlers: ', handlers);
                    if (!handlers || handlers.length === 0) {
                        channel.ack(msg);
                        console.error(`No handlers found for message type: ${message.type}`);
                        return;
                    }
                    handlers.forEach(handler => {
                        handler.handleEvent(message);
                    });
                    console.log('Received message:', message);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error handling message:', error);

                    channel.nack(msg, false, false);
                }
                
            }
        });
    } catch (error) {
        console.error('Error subscribing to queue:', error);
        throw error;
    }
};

async function publishToExchange(exchangeName, data) {
    console.log('exchangeName: ', exchangeName);
    console.log('data: ', data);
    if (!channel) await connect();
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });
    const message = JSON.stringify(data);
    console.log('message: ', message);

    channel.publish(exchangeName, "", Buffer.from(message), { persistent: false });
    console.log(`Message published to exchange:=-=- ${exchangeName}`);
}



module.exports = {
    subscribeToQueue,
    publishToExchange,
    connect,
};