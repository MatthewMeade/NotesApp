import React, { useEffect, useState } from "react";
import ColorModeSwitcher from "../ColorModeSwitcher";

import { Container, Heading, Button, Box, useToast, HStack } from "@chakra-ui/react";
import { TagsService } from "../db/tagsService";
import { NotesService } from "../db/notesService";

export default function Settings() {
    const toast = useToast();

    const [notes, setnotes] = useState(0);
    const [tags, settags] = useState(0);

    useEffect(() => {
        TagsService.count().then(settags);
        NotesService.count().then(setnotes);
    }, []);

    const deleteAllData = async () => {
        // TODO: Confirm first

        TagsService.deleteAll();
        NotesService.deleteAll();

        setnotes(0);
        settags(0);

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

            <HStack my={10}>
                {/* TODO: Light mode styling needs work */}
                <p>Color mode</p>
                <ColorModeSwitcher />
            </HStack>

            <Box>
                <p>Notes: {notes}</p>
                <p>Tags: {tags}</p>
            </Box>

            <Box>
                Delete All Data:{" "}
                <Button colorScheme={"red"} size={"sm"} onClick={deleteAllData}>
                    Delete All Data
                </Button>
            </Box>
        </Container>
    );
}
