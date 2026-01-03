import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private channel: amqp.Channel;
  private isReady = false;

  async init() {
    if (this.isReady) return;

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('chat_queue');

    this.isReady = true;
  }

  async publish(message: any) {
    await this.init();
    this.channel.sendToQueue(
      'chat_queue',
      Buffer.from(JSON.stringify(message)),
    );
  }

  async consume(onMessage: (msg: any) => Promise<void>) {
    await this.init();

    await this.channel.consume('chat_queue', async (msg) => {
      if (msg) {
        await onMessage(JSON.parse(msg.content.toString()));
        this.channel.ack(msg);
      }
    });
  }
}
