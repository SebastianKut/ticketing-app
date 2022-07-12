module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
// This is to fix watching for changes by next when running inside docker container
// If this doesnt help the next fix is to list out pods in kubernetes then manually kill client pod.
// deployment will re run it straight away with chnges reflected
// kubectl get pods
// kubectl delete pod <pod-name>
