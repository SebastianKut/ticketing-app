export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'stripeId' }), // this makes sure that mock function returns a promise that resolves into an empty object
  },
};
