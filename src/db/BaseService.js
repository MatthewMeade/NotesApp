import { v4 as uuid } from 'uuid';
import db from './db';

export default class BaseService {
    static tableName = '';

    static db = db;

    static count() {

    }

    static async add(value) {
        const _value = this.preproccesUpdate(value);
        return (await this.db.put(this.tableName, _value)).id;
    }

    static delete(id) {
        return this.db.remove(id);
    }

    static update(value) {
        return this.add(value);
    }

    static async getAll() {
        return this.find();
    }

    static async getById(id) {
        const result = await this.db.get(id);
        return (await this.processResults([result]))[0];
    }

    static async find(selector = {}) {
        const _selector = { ...selector };
        _selector.docType = this.tableName;
        _selector.___deleted = false;

        const results = await this.db.find({
            selector: _selector
        });

        return this.processResults(results.docs);
    }

    static async deleteAll() {
        const docs = await this.find({});
        this.db.bulkDocs(docs.map((d) => ({ ...d, ___deleted: true })));
    }

    static preproccesUpdate(obj) {
        const newObj = { ...obj };
        if (!newObj._id) {
            newObj._id = uuid();
        }

        if (!newObj.docType) {
            newObj.docType = this.tableName;
        }

        return newObj;
    }

    static processResults(rows) {
        return rows;
    }
}
