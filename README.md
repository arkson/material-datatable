# Material UI Data Table

This project was created using Angular v9. My strategy was to parse the address file into smaller blocks and then request them using a stubby server.
I used the material table library to view, edit and order the addresses, also implement a Custom Angular CDK Data Source for returning an observable containing the data that the table needs to display. To acomplish this i used a BehaviorSubject that emits a list of Addresses.

Run `npm install`

## Stubby server

Run `npm run prestart` to map address.txt to json files & start stubby server in port 1500.

## Development server

Run `npm run start` for a dev server. It will automatically navigate to `http://localhost:4200/`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

