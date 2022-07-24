// the client that we pass to newCreateEvent and others has to be a client property that has a publish function
// with the fllowing arguments, one of them being a callback function that gets envoked right away
// we can see that in base Publisher abstract class in common module, cuz thats were our client eventually gets used

// export const natsWrapper = {
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };

// To mock a function to be able to check if we actually publish an event we can use jest.fn() instead

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
