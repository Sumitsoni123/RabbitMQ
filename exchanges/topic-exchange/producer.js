const amqp = require("amqplib");

const sendMessage = async (routingKey, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";

    await channel.assertExchange(exchange, "topic", { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log("mail sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error: ", error);
  }
};

sendMessage("order.placed", { orderId: 12345, status: "placed" });
sendMessage("payment.processed", { orderId: 67890, status: "processed" });
