# Days Since

> Application link - https://dayssince.royhersh.me

This is an educational side project I made in order to deepen my knowledge in full stack web application building especially in Node.js, MongoDB, ,React/Redux, Testing and Docker.

## Running dev environment using Docker

If you have docker installed on your machine, simply type:

```
npm run dev:docker
```

## Running dev environment locally

1. Install MongoDB on your local machine
2. Make sure you're on node at least 10.13
3. `npm run init`
4. `npm run dev`

### Running Tests

1. Server side: `npm run test:server` - make sure you have a mongo server up and running
2. Client Side: `npm run test:client`
3. Client's Coverage: `npm run test:client:coverage`

#### Upcoming Tasks:

- Write documentation for the API
- Implement item's counter reset button

#### Open Issues

- Count the days since 7am and not since last 24 hrs.
- Fix rendering order issues.
- Items are not updated on the fly, require refresh (setTimeout).

#### Futures Backlog:

- Suggest user to sign-up after x actions.
- Save history when an item is being reset to 0.
- show statistics such as average ratio I do X, longest/shortest interval of X etc`
- Set threshold alerts, e.g alert me If I didn't do sport for 3 days.
- Share items with other users.
- Rearrange items order.
- Days until feature.
