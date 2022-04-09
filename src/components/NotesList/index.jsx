import React, { useEffect, useState } from "react";
import { Container, FormLabel, Grid, GridItem, VStack, Input, HStack } from "@chakra-ui/react";

import { AsyncSelect } from "chakra-react-select";
import Note from "../Note";

import "./styles.css";
import { NotesService } from "../../db/notesService";
import { TagsService } from "../../db/tagsService";

// TODO: Paging
export default function NotesList() {
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const date = {
            start: dateFrom ? new Date(dateFrom) : undefined,
            end: dateTo ? new Date(Date.parse(dateTo) + 86400000) : undefined, // end of day
        };

        // findNotes({ title: title, tags: tags.map((t) => t.id), date, fillTags: true }).then(setNotes);

        NotesService.findNotes({ title: title, tags: tags.map((t) => t.id), date }).then(setNotes);
    }, [tags, title, dateFrom, dateTo]);

    return (
        <Container maxW="container.xl" bg="rgba(0,0,0,0.05)" pb={10} pt={5}>
            {/* <Heading>My Notes:</Heading> */}

            <Grid templateColumns="min-content auto" gap={6} alignItems="center" mb={10}>
                <GridItem>
                    <FormLabel htmlFor="title" pt="4px">
                        Title:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <Input
                        placeholder="Search by title..."
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </GridItem>
                <GridItem>
                    <FormLabel pt="4px">Date:</FormLabel>
                </GridItem>
                <GridItem>
                    <HStack>
                        <Input
                            id="dateFrom"
                            name="From"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            placeholder="Beginning Of Time"
                        />
                        <Input
                            id="dateTo"
                            name="To"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            placeholder="Today"
                        />
                    </HStack>
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
                            TagsService.findTags(value).then((values) => {
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
