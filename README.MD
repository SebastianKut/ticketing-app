# Ticketing app

An open source framework for building e-commerce web app based on microservices. Written in Typescript using Express JS on the backend and Next JS on the client side (Javascript). It also utilises following technologies:

- Docker
- Kubernetess
- Skaffold
- MongoDB
- Jest
- NATS Streaming Server
- Ingress-nginx
- Bull Js
- Redis
- Stripe

Microservices communicate in an async fasion through NATS Streaming Server, by publishing and listening to events. Each service runs its own version of MongoDB. Everything runs on Docker and Kubernetess.
There is certain amount of data duplication in order to keep each microservice independent.
The solution for concurency issues and events being processed in the wrong order, is an implementation of document versioning in mongoDB. Each published event will only be processed by another relevant service if the last saved record version was correct (published version minus 1).

Common modules and shared code has been published as an npm library for an ease of use.

All services implement tests using JEST library. When creating a pull request github actions have been created to run test automatically to check validity of the code.

## Description of Microservices - overview

### Auth

Auth service is responsible for authorisation and authentication.
It consist of 4 routes - sign in, sign out, sign up which are self explanatory as well as current user route which checks if user is logged in and returns an instance of the user.
Authentication was build on Jason Web Token which is created when user signs up or signs in to the service, then it is passed to the client as a cookie.

### Expiration

Expiration service is responsible for an expiration of an order. When user purchases a ticket expiration service will emit an event after specified amount of time (60 seconds) that order has expired. This event is then consumed by order service and which cancells an order if payment hasn't been made within this time.
Expiration services uses Bull Js and Redis to create and stores queues which are then published as order expired events. It listens for order created events emitted by Orders service.

### Orders

Responsible for handling orders. Orders service has 4 routes:
new - responsible for creating a new order,
index - responsible for showing all orders that belong to the user that is currently logged in
show - returns order details given orderId as a query parameter
delete - deletes the order

Orders service implements 2 models: Order model and its own copy of Ticket model.

It listens for following events:

- ticket updated
- ticket created
- payment created
- expiration complete

Then it process them accordingly.

Orders service also publishes following events:

- order created
- order cancelled

### Payments

Paymets service is responsible for handling the payments. It implements Stripe. The overview of Stripe works as follows:
Client service sends card details to Stripe -> Stripe sends back a token back to client after checking card details -> Client receives token from Stripe and sends token and orderId to Payments service -> Payments service creates a charge with Stripe, saves payment to its database and publishes payment created event.
Payment service implements two models: Payment model and its own copy of Orders model. Not that not all the data from Orders model is duplicated from Orders service - only relevant data that Payments service requires.
The following listeners are implemented in this service:

- order cancelled
- order created,

as well as publisher of payment created.

### Tickets

Tickets service is responsible for handling tickets. Similarily to Orders service it implements 4 routes:

- new - for creating new tickets
- index - to show all tickets
- show - to return tickets by id query parameter
- update - to update ticket details

It publishes 2 events:

- ticket created
- ticket updated

It listens to 2 events:

- order created
- order cancelled

### Client

Client service is a front end service of Next Js client. Simple bootstrap structure to comunicate with backend services, created as a base for further development and updates. It uses axios for handling the requests and bootstrap to handle css.

## Common module

Common module has been deployed to npm and it contains all shared code that is being reused between all microservices as an npm module. These modules include different custom erros, events and middlewares such as error handelers, auth middleware and validators

## Setup

To run copy of this microservices app you need Docker, Kubernetess and Skaffold as well as ingress-nginx. Check official websites on guides of how to get these installed on your machine.

Clone this repository to your local machine and install all dependencies in each services directory (auth, client etc) for further development.

You will also need to implement your secret keys as environment variables:
JWT_KEY - this can be any string that you want
STRIPE_KEY - get this by creating an account with stripe. This is your stripe secret key.

The command for deploying a key secret to kubernetess is:
kubectl create secret generic <name-of-the-secret> —from-literal=<keyname>=<keyvalue>

For example to set up JWT_KEY environment variable in kubernetess use following command:
kubectl create secret generic jwt-secret —from-literal=JWT_KEY=somestring

You will also need to set up host file on your local machine to redirect requests to ticketing.dev domain to your localhost. On MacOS/Linux the host file is on /etc/hosts. You need to open this file in admin mode to be able to save changes. Inside host file put:
127.0.0.1 ticketing.dev

To run start the app on your local machine make sure you are in the main directory where skaffold.yaml is located then type skaffold dev. Make sure that docker and kubernetess are running as well. Now you should be able to go to https://ticketing.dev to open the client.

To run tests for each of the microservices make sure you are in the right directory and spin up test environment with npm run test.
