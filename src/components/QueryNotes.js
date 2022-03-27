import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { Input, Code } from "@chakra-ui/react";
import { db } from "../db/dexie";

export default function QueryNotes() {
    const [text, setText] = useState("");
    const [tags, setTags] = useState([]);

    const notes = useLiveQuery(async () => {
        const notes = await db.notes
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
        return notes;
    }, [text, tags]);

    return (
        <div>
            <div>
                Text:
                <Input type="text" value={text} onChange={({ target }) => setText(target.value)} />
            </div>

            <br />

            <div>
                Tags:
                <Input type="tags" value={tags.join(",")} onChange={({ target }) => setTags(target.value.split(","))} />
            </div>
            <br />

            <Code>
                <pre>{JSON.stringify(notes, null, 2)}</pre>
            </Code>
        </div>
    );
}
