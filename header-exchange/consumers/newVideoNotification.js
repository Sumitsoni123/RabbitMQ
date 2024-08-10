const amqp = require("amqplib");

const newVideoNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";

    await channel.assertExchange(exchange, "headers", { durable: true });
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("waiting for new Video Notification", queue);

    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "all",
      "notification-type": "new_video",
      "content-type": "video",
    });

    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received New Video Notification", message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

newVideoNotification();
