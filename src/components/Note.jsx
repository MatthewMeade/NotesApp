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

        NotesService.getById(id).then((loadedNote) => {
            if (!loadedNote) {
                return navigate("/"); // TODO: 404
            }
            setNote(loadedNote);
        });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const isPage = controlType === "page";

    const date = new Date(note?.updatedDate);
    const dateStr = `${date.toDateString()} ${date.toLocaleTimeString()}`;

    const [isOpen, setOpen] = useState(true);

    const onDelete = async () => {
        await NotesService.delete(id);
        toast({
            title: "Note Deleted",
            description: "Your note has been Deleted",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate("/");
    };

    const controls = (
        <HStack justifyContent="right" py={isPage ? 3 : 0}>
            <Link to={`/note/${note.id}/edit`}>
                <Button leftIcon={<EditIcon />} size="md">
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

            {!isPage && (
                <Link to={`/note/${note.id}`}>
                    <Button leftIcon={<ViewIcon />} bg="none">
                        View Note
                    </Button>
                </Link>
            )}
        </HStack>
    );

    return (
        <>
            <Container maxW="container.xl">
                {isPage && controls}
                <Box w="100%" pt={2}>
                    <VStack align="left" onClick={() => setOpen(!isOpen)} borderBottom="1px solid grey">
                        <HStack alignItems={"center"} justifyContent="space-between">
                            <Heading size="md" isTruncated={!isPage}>
                                {note.title}
                            </Heading>

                            {!isPage && controls}
                        </HStack>

                        <Flex justify="space-between">
                            <Flex wrap="wrap" gap={1} pb={2}>
                                <p>Tags: </p>
                                {note.tags.map((tag) => (
                                    <Tag size="sm" key={tag.id}>
                                        {tag.value}
                                    </Tag>
                                ))}
                            </Flex>
                            <Text as="i">{dateStr}</Text>
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
