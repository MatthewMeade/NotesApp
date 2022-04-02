import React, { useEffect, useState } from "react";
import { Container, FormLabel, Grid, GridItem, VStack } from "@chakra-ui/react";

import { findTags, findNotes } from "../db";
import { AsyncSelect } from "chakra-react-select";
import Note from "./Note";

// TODO: Paging
export default function NotesList() {
    const [tags, setTags] = useState([]);

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        findNotes({ tags: tags.map((t) => t.id), fillTags: true }).then(setNotes);
    }, [tags]);

    return (
        <Container maxW="container.xl" bg="rgba(0,0,0,0.05)" pb={10}>
            {/* <Heading>My Notes:</Heading> */}

            <Grid templateColumns="min-content auto" gap={6} alignItems="center">
                <GridItem>
                    <FormLabel htmlFor="tags" pt="4px">
                        Tags:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <AsyncSelect
                        id="tags"
                        defaultOptions // Possibly remove this, requiring search to filter
                        isMulti
                        value={tags.map((tag) => ({ value: tag.id, label: tag.value }))}
                        name="tags"
                        placeholder="Select tags..."
                        closeMenuOnSelect={false}
                        size="md"
                        loadOptions={(value, callback) => {
                            findTags({ value }).then((values) => {
                                callback(values.map((tag) => ({ value: tag.id, label: tag.value })));
                            });
                        }}
                        onChange={(value) => {
                            setTags(value.map((tag) => ({ value: tag.label, id: tag.value })));
                        }}
                        noOptionsMessage={() => "Type to find or add tags"}
                    />
                </GridItem>
            </Grid>

            <VStack gap={10}>
                {notes.map((note) => (
                    <Note note={note} key={note.id} controlType="list" />
                ))}
            </VStack>
        </Container>
    );
}
