import { BaseService } from "./baseService";
import { v4 as uuid } from "uuid";

export class NotesService extends BaseService {
    static tableName = "Notes";

    static baseQuery = {
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

    static find({ id, title, text, tags, date: { start, end } = {} }) {
        if (id) {
            return super.getById(id);
        }

        const where = {};

        if (tags && tags.length > 0) {
            where.tags = {
                in: tags,
            };
        }

        if (title) {
            where.title = {
                regex: new RegExp(title, "i"),
            };
        }

        if (text) {
            where.text = {
                regex: new RegExp(text, "i"),
            };
        }

        if (start || end) {
            where.updatedDate = {};

            if (start) {
                where.updatedDate[">="] = start;
            }

            if (end) {
                where.updatedDate["<="] = end;
            }
        }

        return super.find(where);
    }

    static preproccesUpdate(note) {
        note = { ...note };

        if (!note.id) {
            note.id = uuid();
        }

        if (!note.createdDate) {
            note.createdDate = Date.now();
        }

        note.updatedDate = note.updatedDate ?? Date.now(); // Support custom updatedDate for testing

        note.tags = note.tags?.map(({ id }) => id);

        return note;
    }

    static processResults(rows) {
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
    }
}

if (process.env.NODE_ENV === "development") {
    window.NotesService = NotesService;
}
