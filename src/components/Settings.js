import React, { useEffect, useState } from "react";

import { Container, Heading, Button, Center, useToast } from "@chakra-ui/react";
import { db } from "../db";

export default function Settings() {
    const toast = useToast();

    const [notes, setnotes] = useState(0);
    const [tags, settags] = useState(0);

    useEffect(() => {
        db.notes.count(setnotes);
        db.tags.count(settags);
    }, []);

    const deleteAllData = async () => {
        // TODO: Confirm first

        // TODO: Abstract this
        await db.tags.clear();
        await db.notes.clear();

        db.notes.count(setnotes);
        db.tags.count(settags);

        toast({
            title: "Data Deleted",
            description: "All notes and tags have been deleted",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    };

    return (
        <Container>
            <Heading mb="1em" mt="5px">
                Settings:
            </Heading>

            <box>
                <p>Notes: {notes}</p>
                <p>Tags: {tags}</p>
            </box>

            <box>
                Delete All Data:{" "}
                <Button colorScheme={"red"} size={"sm"} onClick={deleteAllData}>
                    Delete All Data
                </Button>
            </box>
        </Container>
    );
}
