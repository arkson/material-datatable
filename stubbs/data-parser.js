'use-strict';

const fs = require('fs');

const sortByNumber = (arr, key) => {
    return arr.sort((x, y) => x[key] - y[key]);
}

const sortByText = (arr, key) => {
    return arr.sort((x, y) => {
        let a = x[key].toUpperCase(),
        b = y[key].toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
    });
}

const writeJSONFile = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const storeDataChunks = (arr, path) => {
    let n = arr.length/5;
    new Array(Math.ceil(arr.length / n))
      .fill()
      .map((_, i) => {
        writeJSONFile(arr.splice(0, n), `${path}/${i+1}.json`);
        })
}

function main() {
    try {
        let addresses = [];

        // regular expression to create 5 groups
        let regExp = /([^\s]+)+ (.+?),+ (.+?),+ ([^\s]+)+ ([^\s]+$)/;

        // read contents of the file
        const data = fs.readFileSync('addresses2.txt', 'UTF-8');

        // split the contents by new line
        const lines = data.split(/\r?\n/);

        // map data for each line in file
        lines.forEach((line, i) => {
            let groups = line.match(regExp);
            addresses[i] = {
                streetNumber: groups[1],
                street: groups[2],
                city: groups[3],
                state: groups[4],
                zipCode: groups[5]
            };
        });

        const defautAddresses = [...addresses];

        // addresses sorted in ascending order by index
        const sortedStreetNumbers = [...sortByNumber(addresses, 'streetNumber')];
        const sortedStreets = [...sortByText(addresses, 'street')];
        const sortedCities = [...sortByText(addresses, 'city')];
        const sortedStates = [...sortByText(addresses, 'state')];
        const sortedZipCodes = [...sortByNumber(addresses, 'zipCode')];

        // divide addresses in parts & save it into json files
        storeDataChunks(defautAddresses, 'addresses/default');
        storeDataChunks(sortedStreetNumbers, 'addresses/street-numbers');
        storeDataChunks(sortedStreets, 'addresses/streets');
        storeDataChunks(sortedCities, 'addresses/cities');
        storeDataChunks(sortedStates, 'addresses/states');
        storeDataChunks(sortedZipCodes, 'addresses/zip-codes');

    } catch (err) {
        console.error('Error: ', err);
    }
}

main();