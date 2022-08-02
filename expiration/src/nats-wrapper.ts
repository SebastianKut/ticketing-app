// The goal is to create instance of nats connection to be available to every file in our app
// SImilar way to how mongo DB works so we dnt have to initialize it every time we want to use it
import nats, { Stan } from 'node-nats-streaming';
class NatsWrapper {
  // typescript wants us to initialize _client either straight away or in the constructor.
  // By adding ? we tell TS that this property may be undefined for a period of time
  // we dnt want to initialize _client in constructor because we wnat to export "empty" and uninitialized client
  // in an instance of this class
  private _client?: Stan;

  // _client is undefined until we call connect() but we have to expose this client to the outside world (for example we have to pass when publishing new event)
  // we can prevent client from being used inside of the getter
  // to acces getter we just call natsWrapper.client
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    // clusterId argument will come from cid parameter taht we passed to args in nats-depl.yaml and equals to 'ticketing'
    this._client = nats.connect(clusterId, clientId, { url });

    // wrap event listener on "connect" with promise so we can use await
    return new Promise<void>((resolve, reject) => {
      // we use this.client and not this._client! cuz we are accessing client through getter which means it will exist so dnt have t use ! to get rid of typescript warning
      this.client.on('connect', () => {
        console.log('connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// exporting instance of the class not the class itself so we have acces to the nats client
// without having to initialize it
export const natsWrapper = new NatsWrapper();
