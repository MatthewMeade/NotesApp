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

export const findTags = async (value) => {
    try {
        return await db.tags.where("value").startsWithIgnoreCase(value).toArray();
    } catch (error) {
        console.error({ error });

        return { error };
    }
};
