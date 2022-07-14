import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { buildClient } from '../../api/build-client';

function signout({ currentUser }) {
  // using useEffect and not getInitialProps for signout api call because I want to make sure
  // that we always call from the client and not server as signout route returns
  // empty cookie without jwt and server doesnt handle it (wouldnt automatically know how to delete cookie from the browser) but browser does automatically

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signout...</div>;
}

export default signout;
