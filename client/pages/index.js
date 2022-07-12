import { buildClient } from '../api/build-client';

function index({ currentUser }) {
  const message = currentUser
    ? `You are signed in as ${currentUser.email}`
    : 'You are NOT signed in';
  return <h1>{message}</h1>;
}

// getInitialProps gets executed on the server, apart from when we are already inside of our app so moving from another component or page
// then it gets executed in the browser
// when it gets executed on the server we need to reach out to ingress-nginx first to get to auth service
// because nginx is in different namespace than our services we have to construct domain name for /api/users/currentuser
// like this http://NAMEOFTHESERVICE.NAMESPACE.SVC.CLUSTER.LOCAL

// when request to currentuser is executed on the server we dnt automatically pass session information with cookies like browser do
// so we have to get that information from header of the request object that we get acces to in getInitialProps
// context argument has request object so we can extract things from it like cookies and headers
index.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default index;
