/* eslint-disable import/no-webpack-loader-syntax */
import { DATA_TYPE, Connection } from "jsstore";

const getWorkerPath = () => {
    if (process.env.NODE_ENV === "development") {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    } else {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

const workerPath = getWorkerPath().default;
export const idbCon = new Connection(new Worker(workerPath));
export const dbname = "NotesApp";

const getDatabase = () => {
    const tblStudent = {
        name: "Notes",
        columns: {
            id: {
                primaryKey: true,
                dataType: DATA_TYPE.String,
            },
            title: {
                notNull: true,
                dataType: DATA_TYPE.String,
            },
            text: {
                dataType: DATA_TYPE.String,
                notNull: true,
            },
            createdDate: {
                notNull: true,
                dataType: DATA_TYPE.DateTime,
            },
            updatedDate: {
                dataType: DATA_TYPE.DateTime,
                notNull: true,
            },
            tags: {
                dataType: DATA_TYPE.Array,
                multiEntry: true,
            },
        },
    };

    const tblTags = {
        name: "Tags",
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true,
            },
            value: {
                notNull: true,
                dataType: DATA_TYPE.String,
            },
        },
    };

    const dataBase = {
        name: dbname,
        tables: [tblStudent, tblTags],
    };
    return dataBase;
};

export const initJsStore = () => {
    try {
        const dataBase = getDatabase();
        idbCon.initDb(dataBase);
    } catch (ex) {
        console.error(ex);
    }
};
