const amqp = require("amqplib");

const sendNotification = async (headers, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";

    await channel.assertExchange(exchange, "headers", { durable: true });

    channel.publish(exchange, "", Buffer.from(message), {
      persistent: true,
      headers,
    });
    console.log("notification sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error: ", error);
  }
};

sendNotification(
  {
    "x-match": "all",
    "notification-type": "new_video",
    "content-type": "video",
  },
  "New music video uploaded"
);

sendNotification(
  {
    "x-match": "all",
    "notification-type": "live_stream",
    "content-type": "gaming",
  },
  "live Stream Started"
);

sendNotification(
  {
    "x-match": "any",
    "notification-type-like": "like",
    "notification-type-comment": "comment",
  },
  "Someone liked your comment"
);
