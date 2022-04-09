import { BaseService } from "./baseService";

const BASE_NOTE_QUERY = {
    from: "Notes",
    flatten: ["tags"],
    join: {
        with: "Tags",
        on: "Notes.tags=Tags.id",
        as: {
            id: "tagId",
            value: "tagValue",
        },
    },
};


// TODO: Fix PKs to not need parseInt everywhere

export class NotesService extends BaseService {
    static tableName = "Notes";

    static count() {
        return this.connection.count({
            from: this.tableName,
        });
    }

    static addNote(note) {
        const _note = { ...note, createdDate: new Date(), updatedDate: new Date() };
        return this.connection.insert({
            into: this.tableName,
            values: [convertTagsToIds(_note)],
            return: true,
            upsert: true,
        });
    }

    static removeNote(id) {
        return this.connection.remove({
            from: this.tableName,
            where: {
                id: parseInt(id),
            },
        });
    }

    static updateNote(note) {
        const _note = convertTagsToIds({ ...note, id: parseInt(note.id), updatedDate: new Date() });
        return this.connection.update({
            in: this.tableName,
            set: _note,
            where: {
                id: _note.id
            },
        });
    }

    static getAllNotes() {
        return this.connection.select({ ...BASE_NOTE_QUERY }).then(groupTablesCollectTags);
    }

    static async getNoteById(id) {
        id = parseInt(id);
        return (await this.findNotes({ id }))[0];
    }

    static findNotes({ id, title, text, tags, date: { start, end } = {} }) {
        const query = { ...BASE_NOTE_QUERY };

        if (title || text || tags?.length || start || end || id) {
            query.where = {};
        }

        if (id) {
            id = parseInt(id);
            query.where.id = id;
        }

        if (tags && tags.length > 0) {
            query.where.tags = {
                in: tags,
            };
        }

        if (title) {
            query.where.title = {
                regex: new RegExp(title, "i"),
            };
        }

        if (text) {
            query.where.text = {
                regex: new RegExp(text, "i"),
            };
        }

        if (start || end) {
            query.where.updatedDate = {};

            if (start) {
                query.where.updatedDate[">="] = start;
            }

            if (end) {
                query.where.updatedDate["<="] = end;
            }
        }

        return this.connection.select(query).then(groupTablesCollectTags);
    }

    static deleteAll() {
        return this.connection.clear(this.tableName);
    }
}

const convertTagsToIds = (note) => {
    return {
        ...note,
        tags: note.tags.map(({ id }) => id),
    };
};

const groupTablesCollectTags = (rows) => {
    const reduced = rows.reduce((acc, cur) => {
        if (!acc[cur.id]) {
            acc[cur.id] = { ...cur, tags: [] };
            delete acc[cur.id].tagId;
            delete acc[cur.id].tagValue;
        }

        acc[cur.id].tags.push({ id: cur.tagId, value: cur.tagValue });

        return acc;
    }, {});

    return Object.values(reduced);
};

window.NotesService = NotesService; // TODO: Only do this in dev mode
