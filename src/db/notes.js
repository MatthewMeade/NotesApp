import { db } from "./dexie";

export const addNote = async (text, tags) => {
    try {
        const id = db.notes.add({ text, tags, creationDate: Date.now() });
        return id;
    } catch (error) {
        console.error({ error });

        return { error };
    }
};

export const findNotes = async (text, tags) => {
    try {
        return await db.notes
            .where("tags")
            .anyOf(tags)
            .filter((note) => {
                if (!text) {
                    return true;
                }
                return note.text.includes(text);
            })
            .distinct()
            .toArray();
    } catch (error) {
        console.error({ error });

        return { error };
    }
};
