const amqp = require("amqplib");

const liveStreamNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";

    await channel.assertExchange(exchange, "headers", { durable: true });
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("waiting for live stream Notification", queue);

    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "all",
      "notification-type": "live_stream",
      "content-type": "gaming",
    });

    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received Live Stream Notification", message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

liveStreamNotification();
