import PouchDB from 'pouchdb';

import find from 'pouchdb-find';

PouchDB.plugin(find);

console.log('New Pouch DB initialized');
const db = new PouchDB('my_database');

export { db };
