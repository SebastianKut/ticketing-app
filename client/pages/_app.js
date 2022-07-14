import 'bootstrap/dist/css/bootstrap.css';
// we can only import global css into the _app.js file
import { buildClient } from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

// This code is a wrapper around the component we are trying to show on the screen
// pageProps are props that are passed to the component that we are trying to show on a screen

// Argument passed to getInitialProps in the custom app component have a different structure than context argument passed in the other components
// normal componnents contex = {req, res}, here in the app component context = {component, ctx: {req, res}}
// When you call getInitialProps in here, getInitialProps in the page components will not be invoked. Its how Next was designed so we need to invoke it manually
AppComponent.getInitialProps = async (appContext) => {
  //This will be available in all of our pages
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // invoking getInitialProps function manually from the index page component since it will not happen automatially because we invoking getInitailProps for AppComponent here. Remember if you invoke getInitialProps in the custom wrapper component the page components will not have it invoked, hence why manual call to it here

  // some pages will not have getInitialProps defined so lets check for it to avoid error
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    // whatever we returning from below getInitialProps will show up as pageProps argument to AppComponent
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  // we return currentUser from data and pageProps returned from getInitialProps defined inside rendered component
  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
