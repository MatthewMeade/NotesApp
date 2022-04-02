import React, { useEffect, useState } from "react";
import {
    Container,
    FormLabel,
    Grid,
    GridItem,
    Box,
    useColorModeValue,
    HStack,
    Text,
    Button,
    VStack,
    Tag,
    Flex,
    Fade,
    SlideFade,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";

import { findTags, findNotes } from "../db";
import { AsyncSelect } from "chakra-react-select";
import { Link } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";

export default function NotesList() {
    const [tags, setTags] = useState([]);

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        findNotes({ tags: tags.map((t) => t.id), fillTags: true }).then(setNotes);
    }, [tags]);

    return (
        <Container maxW="container.xl">
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

            <VStack>
                {notes.map((note) => (
                    <NoteBox note={note} key={note.id} />
                ))}
            </VStack>
        </Container>
    );
}

const NoteBox = ({ note }) => {
    const date = new Date(note.creationDate);
    const dateStr = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

    const [isOpen, setOpen] = useState(true);

    return (
        <Box bg={useColorModeValue("gray.100", "gray.900")} w="100%">
            <VStack
                align="left"
                onClick={() => setOpen(!isOpen)}
                _hover={{ backgroundColor: useColorModeValue("whiteAlpha.200", "blackAlpha.500"), cursor: "pointer" }}
            >
                <HStack alignItems={"center"} justifyContent="space-between" px={3}>
                    <Text as="i">Date: {dateStr}</Text>

                    <HStack>
                        {isOpen ? (
                            <MinusIcon onClick={() => setOpen(!isOpen)} />
                        ) : (
                            <AddIcon onClick={() => setOpen(!isOpen)} />
                        )}

                        <Link to={`/note/${note.id}?edit=true`}>
                            <Button leftIcon={<EditIcon />} bg="none">
                                Edit
                            </Button>
                        </Link>
                    </HStack>
                </HStack>
                <Flex wrap="wrap" gap={1} pb={2} px={3}>
                    {note.tags.map((tag) => (
                        <Tag size="sm" key={tag.id}>
                            {tag.value}
                        </Tag>
                    ))}
                </Flex>
            </VStack>
            <SlideFade in={isOpen} initialScale={1} unmountOnExit>
                <Box bg={useColorModeValue("whiteAlpha.200", "blackAlpha.200")} px={2} py={2}>
                    <MarkdownRenderer text={note.text} />
                </Box>
            </SlideFade>
        </Box>
    );
};
