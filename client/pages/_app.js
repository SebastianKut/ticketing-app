import 'bootstrap/dist/css/bootstrap.css';
// we can only import global css into the _app.js file

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// This code is a wrapper around the component we are trying to show on the screen
// pageProps are props that are passed to the component that we are trying to show on a screen
