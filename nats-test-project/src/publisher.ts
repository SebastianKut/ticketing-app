import nats from 'node-nats-streaming';

console.clear();
// create client to connect to nats streaming server - in nats documentation its called stan
const stan = nats.connect('ticketing', 'abc', {
  // to get quick and easy acces to NATS Pod that runs in Kubernetes we can use 3 things (go through nginx, create nodePort or use port forwarding )
  // we will use port forwarding command is:
  // kubectl port-forward <nats pod name> throughPortNumber:toPortNumber
  url: 'http://localhost:4222',
});

// client then will listen for an event. Cant use async await because its an event driven architecture
stan.on('connect', () => {
  console.log('Publisher connected to NATS');
  // we can only send JSON to nats
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // to publish event to NATS (known as message in the documentation) we pass subject(which is channel name basically, data as JSON, and optional callback function)
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
