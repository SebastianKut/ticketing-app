import Link from 'next/link';

function index({ currentUser, tickets }) {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/ticket/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

// getInitialProps gets executed on the server, apart from when we are already inside of our app so moving from another component or page
// then it gets executed in the browser
// when it gets executed on the server we need to reach out to ingress-nginx first to get to auth service
// because nginx is in different namespace than our services we have to construct domain name for /api/users/currentuser
// like this http://NAMEOFTHESERVICE.NAMESPACE.SVC.CLUSTER.LOCAL

// when request to currentuser is executed on the server we dnt automatically pass session information with cookies like browser do
// so we have to get that information from header of the request object that we get acces to in getInitialProps
// context argument has request object so we can extract things from it like cookies and headers
index.getInitialProps = async (context, client, currentUser) => {
  // by passing client and currentUser when invoking manually getInitialProps in _app component we now have access to it here
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default index;
