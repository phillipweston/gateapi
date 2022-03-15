# Gate API
This is a work in progress, with the intention to be used in June for the Friends & Family summer campout.

This API ingests and server ticket information to be used by Gate App for event check-in. Credentials are intentionally hard coded to keep development simple. This application will be run offline via a Raspberry-Pi and written by community volunteers.

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
