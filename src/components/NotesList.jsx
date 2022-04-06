import React, { useEffect, useState } from "react";
import { Container, FormLabel, Grid, GridItem, VStack, Input } from "@chakra-ui/react";

import { findTags, findNotes } from "../db";
import { AsyncSelect } from "chakra-react-select";
import Note from "./Note";

// TODO: Paging
export default function NotesList() {
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        findNotes({ title: title, tags: tags.map((t) => t.id), fillTags: true }).then(setNotes);
    }, [tags, title]);

    return (
        <Container maxW="container.xl" bg="rgba(0,0,0,0.05)" pb={10}>
            {/* <Heading>My Notes:</Heading> */}

            <Grid templateColumns="min-content auto" gap={6} alignItems="center" mb={10}>
                <GridItem>
                    <FormLabel htmlFor="email" pt="4px">
                        Title:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <Input placeholder="Search by title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                </GridItem>
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
                        placeholder="Search by tags..."
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
