// db.js
import Dexie from "dexie";
import "dexie-observable";
import "dexie-syncable";

export const db = new Dexie("myDatabase");

db.version(1).stores({
    notes: "$$id, text, *tags", // Primary key and indexed props
});
