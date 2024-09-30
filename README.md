# Gate API
This is a work in progress, with the intention to be used in June for the Friends & Family summer campout.

This API ingests the server ticket information to be used by Gate App for event check-in. Credentials are intentionally hard coded to keep development simple. This application will be run offline via a Raspberry-Pi and written by community volunteers.

This API ingests and serves ticket information to be used by [Gate App](https://github.com/phillipweston/gateapp) for the event check-in. Credentials are intentionally hard coded to keep development simple with no need to share a .env or similar. This application will be run offline via a Raspberry Pi and completed with community help. 

### Setup
1. `docker-compose up`
2. `npm install -g knex`
3. `knex migrate:latest`
4. `knex seed:run`

### Flow
1. Tickets are seeded into the database. Users may have many tickets.
2. Tickets may be transferred from one user to another, or to a brand new user.

### TBD
1. User can consume a ticket
2. Create a ticket to be created out of thin air for admin purposes(currently only done via CSV seed)
3. Waiver form timestamp added to User object
4. License plate added to User object
5. Fix routing so it's not all under /user
