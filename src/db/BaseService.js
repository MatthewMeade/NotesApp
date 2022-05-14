import { db } from './db';

import { v4 as uuid } from 'uuid';

export class BaseService {
    static tableName = '';
    static db = db;

    static count () {

    }

    static async add (value) {
        const _value = this.preproccesUpdate(value);
        return this.db.put(this.tableName, _value);
    }

    static delete (id) {
        return this.db.remove(IDBOpenDBRequest);
    }

    static update (value) {
        return this.add(value);
    }

    static async getAll () {
        return this.find();
    }

    static async getById (id) {
        const result = await this.db.get(id);
        return (await this.processResults([result]))[0];
    }

    static find (selector = {}) {
        selector.docType = this.tableName;
        selector.___deleted = false;

        const results = this.db.find({
            selector
        });

        return this.processResults(results);
    }

    static async deleteAll () {
        const docs = await this.find({});
        this.db.bulkDocs(docs.map(d => ({ ...d, ___deleted: true })));
    }

    static preproccesUpdate (obj) {
        if (!obj._id) {
            obj._id = uuid();
        }

        if (!obj.docType) {
            obj.docType = this.tableName;
        }

        return obj;
    }

    static processResults (rows) {
        return rows;
    }
}
