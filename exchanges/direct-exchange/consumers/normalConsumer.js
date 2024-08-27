const amqp = require("amqplib");

const receiveMail = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("normal_mail_queue", { durable: false });

    channel.consume("normal_mail_queue", (message) => {
      if (message !== null) {
        console.log("mail received", JSON.parse(message.content));
        channel.ack(message)
      }
    });

  } catch (error) {
    console.log(error);
  }
};

receiveMail();
