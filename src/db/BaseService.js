import { v4 as uuid } from 'uuid';
import db from './db';

export default class BaseService {
    static tableName = '';

    static db = db;

    static indexes = [];

    static initPromise;

    static async init() {
        const promises = [];
        for (const index of this.indexes) {
            promises.push(
                this.db.createIndex({
                    index: {
                        fields: [index]
                    }
                })
            );
        }

        this.initPromise = Promise.all(promises);
    }

    static async count() {
        const result = await this.getAll();
        return result.length;
    }

    static async add(value) {
        if (Array.isArray(value)) {
            const values = value.map((v) => this.preproccesUpdate(v));
            return this.db.bulkDocs(values);
        }
        const _value = this.preproccesUpdate(value);
        return (await this.db.put(_value)).id;
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
        if (Array.isArray(id)) {
            const results = await this.db.allDocs({ keys: id, include_docs: true });
            return this.processResults(results.rows.map((row) => row.doc));
        }

        const result = await this.db.get(id);
        return (await this.processResults([result]))[0];
    }

    static async find(selector = {}, paging = {}) {
        await this.initPromise;

        const _selector = { ...selector };
        _selector.docType = this.tableName;
        _selector.___deleted = { $ne: true };

        const { skip, limit, sort: _sort } = paging;

        let sort = _sort;
        if (sort && !Array.isArray(sort)) {
            sort = [sort];
        }

        if (sort) {
            for (const key of sort) {
                if (!_selector[key]) {
                    _selector[key] = { $gt: 0 };
                }
            }
        }

        const results = await this.db.find({
            selector: _selector,
            skip,
            limit,
            sort
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
