const amqp = require("amqplib");

const pushNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";

    await channel.assertExchange(exchange, "fanout", { durable: true });
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("waiting for messages", queue);
    await channel.bindQueue(queue.queue, exchange, "");

    channel.consume(queue.queue, (message) => {
      if (message !== null) {
        const product = JSON.parse(message.content.toString());
        console.log("Sending push notification for product", product.name);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

pushNotification();
