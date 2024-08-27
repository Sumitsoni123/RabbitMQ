const amqp = require("amqplib");

const receiveMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue("payment_queue", { durable: true });
    await channel.bindQueue("payment_queue", exchange, "payment.*");

    console.log("waiting for messages");

    channel.consume(
      "payment_queue",
      (message) => {
        if (message !== null) {
          console.log("message received", JSON.parse(message.content));
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }
};

receiveMessage();
