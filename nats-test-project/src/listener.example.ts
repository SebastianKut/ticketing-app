import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// clear console from unneccesary output messages
console.clear();

// 2nd argument is an id, we generate random string so we can run multiple independent copies of this listener (npm run listen)
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listiner connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  // setManualAckMode changes default behavior and makes sure that the event received was processed properly by listener and received status completed. If not then it sends event again
  // this can prevent in losing event data send to the listener to be lost for example when listener failed to save that data to DB due to DB connection error
  // To make sure we get all events redelivered in case listener goes off line we have to make sure we use following 3 things. We add setDeliverAllAvailable() and setDurableName('listener-service-name) as well as using queue-group-name
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('orders-service');
  // 2nd argument is a que group. Cue group allows for events (messages) to be emited to only one of the multiple copies of the listeners subscribed to the channel, so we dnt duplicate
  // events to all the copies of listeners (that wolud trigger same event to duplicate data for example create 2 copies of the same tickets). Instead wwhen we have 2 copies of the same listener
  // we add it to the same que group and cue group will only send it to one of them essentially distributing the load of all incoming events between them
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );
  // theres no callback after subscription with received data instead we have to use subscription.on('message)
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`);
    }
    // this sends back message to streaming server that the event has been processed succesfully - works when you set setManualAckMode option
    msg.ack();
  });
});

// Kill the client on signal intteruption or termination (so everytime its restarted in the terminal or killed by control + C)
// This is to minimise the risk of losing emitted events when listener is down
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// Turn above logic into abstract class
// abstract method allows us to tell typescript which properties have to be defined in the subclasses that extend this abstract class
// by using word abstract
abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, message: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // this method will run all the logic in that we have defined in this class
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
