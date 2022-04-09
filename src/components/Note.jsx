import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    SlideFade,
    Tag,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

import { NotesService } from "../db/notesService";
import ConfirmableButton from "./ConfirmableButton";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Note({ note: _note, controlType = "page" }) {
    let { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [note, setNote] = useState(_note ?? { tags: [] });

    useEffect(() => {
        if (!id) {
            return;
        }

        NotesService.getNoteById(id).then((loadedNote) => {
            if (!loadedNote) {
                return navigate("/"); // TODO: 404
            }
            setNote(loadedNote);
        });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const isPage = controlType === "page";

    const cdate = new Date(note?.creationDate);
    const cdateStr = `${cdate.toLocaleDateString()} - ${cdate.toLocaleTimeString()}`;

    const udate = new Date(note?.updatedDate);
    const udateStr = `${udate.toLocaleDateString()} - ${udate.toLocaleTimeString()}`;

    const [isOpen, setOpen] = useState(true);

    const onDelete = async () => {
        await NotesService.removeNote(id);
        toast({
            title: "Note Deleted",
            description: "Your note has been Deleted",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate("/");
    };

    return (
        <>
            <Container maxW="container.xl">
                <Box w="100%" pt={2}>
                    <VStack align="left" onClick={() => setOpen(!isOpen)} borderBottom="1px solid grey">
                        <HStack alignItems={"center"} justifyContent="space-between">
                            <Heading>{note.title}</Heading> {/* Todo: make this editable*/}
                            <HStack>
                                <Link to={`/note/${note.id}/edit`}>
                                    <Button leftIcon={<EditIcon />} bg="none">
                                        Edit
                                    </Button>
                                </Link>

                                {isPage && (
                                    <ConfirmableButton
                                        title="Delete Note"
                                        body="Are you sure you want to delete this note?"
                                        button={{
                                            icon: <DeleteIcon />,
                                            label: "Delete",
                                            color: "red",
                                        }}
                                        onConfirm={onDelete}
                                    />
                                )}

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
                            {isPage && <Text as="i">Created: {cdateStr}</Text>}
                            <Text as="i">Last Updated: {udateStr}</Text>
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
        </>
    );
}
