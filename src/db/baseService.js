import { idbCon } from "./idbService";
export class BaseService {
    static connection = idbCon;

    static count() {
        return this.connection.count({
            from: this.tableName,
        });
    }

    static async add(values) {
        if (!Array.isArray(values)) {
            values = [this.preproccesUpdate(values)];
        } else {
            values = values.map(this.preproccesUpdate);
        }
        return (
            await this.connection.insert({
                into: this.tableName,
                values,
                return: true,
                upsert: true,
            })
        )[0];
    }

    static delete(id) {
        return this.connection.remove({
            from: this.tableName,
            where: {
                id: id,
            },
        });
    }

    static update(value) {
        return this.connection.update({
            in: this.tableName,
            set: this.preproccesUpdate(value),
            where: {
                id: value.id,
            },
        });
    }

    static async getAll() {
        return this.connection
            .select({
                ...(this.baseQuery ?? {}),
                from: this.tableName,
            })
            .then(this.processResults);
    }

    static async getById(id) {
        return this.processResults(
            await this.connection.select({
                ...(this.baseQuery ?? {}),
                from: this.tableName,
                where: {
                    id: id,
                },
            })
        )[0];
    }

    static find(query = {}) {
        if (Object.keys(query).length === 0) {
            return this.getAll();
        }
        return this.connection
            .select({
                from: this.tableName,
                ...(this.baseQuery ?? {}),
                where: {
                    ...query,
                },
            })
            .then(this.processResults);
    }

    static deleteAll() {
        return this.connection.clear(this.tableName);
    }

    static preproccesUpdate(obj) {
        return obj;
    }

    static processResults(rows) {
        return rows;
    }
}
