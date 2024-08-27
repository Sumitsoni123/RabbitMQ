const amqp = require("amqplib");

const receiveMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue("order_queue", { durable: true });
    await channel.bindQueue("order_queue", exchange, "order.*");

    console.log("waiting for messages");

    channel.consume(
      "order_queue",
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
