import { db } from "./dexie";

export const addTag = async (value) => {
    try {
        const id = db.tags.add({ value });
        return id;
    } catch (error) {
        console.error({ error });

        return { error };
    }
};

export const findTags = async ({ value, ids }) => {
    if (ids && !Array.isArray(ids)) {
        ids = [ids];
    }

    try {
        if (ids) {
            return await db.tags.where("id").anyOf(ids).toArray();
        }

        if (value) {
            return await db.tags.where("value").startsWithIgnoreCase(value).toArray();
        }

        return db.tags.toArray();
    } catch (error) {
        console.error({ error });

        return { error };
    }
};
