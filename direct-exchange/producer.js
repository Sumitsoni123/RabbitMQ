const amqp = require("amqplib");

const sendMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const normalRoutingKey = 'normal_mail_queue';
    const subscribedRoutingKey = "subscribed_mail_queue";

    const message = {
      from: "pappu@p.com",
      to: "spcl@c.com",
      subject: "my subject",
      body: "hello boy",
    };

    await channel.assertExchange(exchange, "direct", { durable: false });

    await channel.assertQueue("normal_mail_queue", { durable: false });
    await channel.bindQueue("normal_mail_queue", exchange, normalRoutingKey);

    await channel.assertQueue("subscribed_mail_queue", { durable: false });
    await channel.bindQueue("subscribed_mail_queue", exchange, subscribedRoutingKey);

    channel.publish(exchange, subscribedRoutingKey, Buffer.from(JSON.stringify(message)));
    console.log("mail sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

sendMail();