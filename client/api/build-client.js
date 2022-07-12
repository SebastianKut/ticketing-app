import axios from 'axios';
// modify axios depending if request is from server or client, so we can call the correct domain. ref comments @ client/index.js
const buildClient = ({ req }) => {
  // We have to figureout if we are on the server or browser by checkin if window object exists
  if (typeof window === 'undefined') {
    // this is server
    // by passing headers from req.headers we are passing cookies and session data (because only browser passes tis automatically and this is instance when we are on a server)
    // as well as cookies we have acces to host name (ticketing.dev) that we need for ingress to send us to the right place (see host name in ingress depl yaml)
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // this is on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export { buildClient };
