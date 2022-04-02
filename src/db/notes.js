import { db } from "./dexie";
import { findTags } from "./tags";

export const addNote = async (text, tags = []) => {
    tags = tags.map((t) => t.id ?? t);
    try {
        const id = db.notes.add({ text, tags, creationDate: Date.now() });
        return id;
    } catch (error) {
        console.error({ error });

        return { error };
    }
};

export const findNotes = async ({ text, tags = [], fillTags = true }) => {
    tags = tags.map((t) => t.id ?? t);

    try {
        let docs = db.notes;

        if (tags.length > 0) {
            docs = docs.where("tags").anyOf(tags);
        } else {
            docs = docs.toCollection();
        }

        if (text) {
            docs = docs.filter((note) => {
                if (!text) {
                    return true;
                }
                return note.text.includes(text);
            });
        }
        const notes = await docs.distinct().sortBy("createdDate");

        if (!fillTags) {
            return notes;
        }

        const includedTags = [...new Set(notes.reduce((acc, cur) => [...acc, ...cur.tags], []))];

        const _tags = (await findTags({ ids: includedTags })).reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});

        return notes.map((note) => ({ ...note, tags: note.tags.map((id) => _tags[id]) }));
    } catch (error) {
        console.error({ error });

        return { error };
    }
};
