const amqp = require("amqplib");

const commentNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";

    await channel.assertExchange(exchange, "headers", { durable: true });
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("waiting for comments notification", queue);

    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "any",
      "notification-type-like": "like",
      "notification-type-comment": "comment",
    });

    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received Comments Notification", message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

commentNotification();
