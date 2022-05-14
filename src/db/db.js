import PouchDB from 'pouchdb';

import find from 'pouchdb-find';

PouchDB.plugin(find);

export default new PouchDB('my_database');
