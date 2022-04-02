import React, { useEffect, useState } from "react";
import {
    Box,
    useColorModeValue,
    HStack,
    Text,
    Button,
    VStack,
    Tag,
    Flex,
    SlideFade,
    Heading,
    Container,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, MinusIcon, ViewIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router";

import { findTags, findNotes } from "../db";
import { Link } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Note({ note: _note, controlType = "page" }) {
    let { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState(_note ?? { tags: [] });

    useEffect(() => {
        if (!id) {
            return;
        }

        findNotes({ id }).then(([loadedNote]) => {
            if (!loadedNote) {
                return navigate("/"); // TODO: 404
            }
            setNote(loadedNote);
        });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const isPage = controlType === "page";

    const date = new Date(note?.creationDate);
    const dateStr = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

    const [isOpen, setOpen] = useState(true);

    return (
        <Container maxW="container.xl">
            <Box w="100%" pt={2}>
                <VStack align="left" onClick={() => setOpen(!isOpen)} borderBottom="1px solid grey">
                    <HStack alignItems={"center"} justifyContent="space-between">
                        <Heading>This is the note title </Heading> {/* Todo: make this editable*/}
                        <HStack>
                            <Link to={`/note/${note.id}/edit`}>
                                <Button leftIcon={<EditIcon />} bg="none">
                                    Edit
                                </Button>
                            </Link>

                            {/* TODO: Make this on click of the title */}
                            {!isPage && (
                                <Link to={`/note/${note.id}`}>
                                    <Button leftIcon={<ViewIcon />} bg="none">
                                        View Note
                                    </Button>
                                </Link>
                            )}
                        </HStack>
                    </HStack>

                    <Flex wrap="wrap" gap={1} pb={2}>
                        <p>Tags: </p>
                        {note.tags.map((tag) => (
                            <Tag size="sm" key={tag.id}>
                                {tag.value}
                            </Tag>
                        ))}
                    </Flex>
                    <Flex justify="space-between">
                        {isPage && <Text as="i">Created: {dateStr}</Text>}
                        <Text as="i">Last Updated: {dateStr}</Text>
                    </Flex>
                </VStack>

                <SlideFade in={isOpen || isPage} initialScale={0} unmountOnExit>
                    <Box
                        bg={useColorModeValue("gray.100", "gray.900")}
                        m={"0 10px"}
                        p={2}
                        mt={1}
                        minH={isPage ? 250 : 125}
                    >
                        <MarkdownRenderer text={note.text} />
                    </Box>
                </SlideFade>
            </Box>
        </Container>
    );
}
