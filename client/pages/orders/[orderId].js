import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const milisecondsLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(milisecondsLeft / 1000));
    };

    // manually invoke findTimeLeft first because setInterva will invoke it afer 1 second for the first time
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // whenever we return a function from useEffect it will only be called when we navigate away from the component or the component will get rerendered
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) return <div>Order Expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })} //this will merge token and anything else in the body property of useRequest argument
        stripeKey="pk_test_51I7wrjLZv7WKvm6KLSx3FzeQ8fuxzQAdcH11QlQRFRY2qwPCmZzfOSegwCdXvofJzphwj9OjnJSqQyMOqnlio8sY00acMndlb8"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrdertShow.getInitialProps = async (context, client) => {
  const { ordertId } = context.query;
  const { data } = await client.get(`/api/orders/${ordertId}`);
  return { order: data };
};

export default OrderShow;
