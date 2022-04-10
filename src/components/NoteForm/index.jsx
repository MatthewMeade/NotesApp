import React, { useEffect, useMemo, useState } from "react";

import {
    Container,
    Heading,
    FormControl,
    FormLabel,
    Button,
    Center,
    FormErrorMessage,
    useToast,
    Input,
} from "@chakra-ui/react";
import { AsyncCreatableSelect } from "chakra-react-select";
import { useNavigate, useParams } from "react-router";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./MDEditorStyles.css";
import { NotesService } from "../../db/notesService";
import { TagsService } from "../../db/tagsService";

// TODO: Notes should have titles

export default function NoteForm() {
    let { id } = useParams();

    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);

    const [doValidation, setDoValidation] = useState({ text: false, tags: false, title: false });

    const toast = useToast();

    let navigate = useNavigate();

    // Load note when editing
    useEffect(() => {
        if (!id) {
            setText("");
            setTitle("");
            setTags([]);
            setDoValidation({ text: false, tags: false, title: false });
            return;
        }

        NotesService.getNoteById(id).then((note) => {
            setText(note.text);
            setTags(note.tags);
            setTitle(note.title);
            setDoValidation({ text: true, tags: true, title: true });
        });
    }, [id]);

    // Slightly smarter validation
    useEffect(() => {
        const val = { ...doValidation };

        if (text !== "") {
            val.text = true;
        }

        if (title !== "") {
            val.title = true;
        }

        if (tags.length > 0) {
            val.tags = true;
        }
        setDoValidation(val);
    }, [text, tags, text]); // eslint-disable-line react-hooks/exhaustive-deps

    const textError = text === "";
    const titleError = title === "";
    const tagError = tags.length === 0;
    const inputErrors = textError || tagError || titleError;

    const _addNote = async () => {
        const [newNote] = await NotesService.addNote({ title, text, tags });
        toast({
            title: "Note created",
            description: "Your note has been saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate(`/note/${newNote.id}`);
    };

    const _updateNote = async () => {
        await NotesService.updateNote({ id, title, text, tags });
        toast({
            title: "Note Updated",
            description: "Your note has been saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate(`/note/${id}`);
    };

    const options = useMemo(
        () => ({
            spellChecker: false,
            placeholder: "Write your note here...",
            // TODO: Image Uploads
            // uploadImage: true,
            toolbar: [
                "bold",
                "italic",
                "strikethrough",
                "heading",
                "code",
                "quote",
                "unordered-list",
                "ordered-list",
                "link",
                "image",
                "table",
                "|",
                "clean-block",
                "|",
                "guide",
            ],
        }),
        []
    );

    return (
        <Container maxW="container.xl">
            <Heading mb="1em" mt="5px">
                {id ? "Edit" : "Add"} Note:
            </Heading>

            <FormControl mb="2em" isInvalid={doValidation.title && titleError}>
                <FormLabel htmlFor="email">Title:</FormLabel>
                <Input placeholder="Enter Note Title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                <FormErrorMessage>Title cannot be blank</FormErrorMessage>
            </FormControl>

            <FormControl mb="2em" isInvalid={doValidation.text && textError}>
                <FormLabel htmlFor="email">Note Body:</FormLabel>
                <SimpleMDE value={text} onChange={setText} options={options} />
                <FormErrorMessage>Note body cannot be blank</FormErrorMessage>
            </FormControl>

            <FormControl mb="3em" isInvalid={doValidation.tags && tagError}>
                <FormLabel htmlFor="email">Tags:</FormLabel>

                <AsyncCreatableSelect
                    isMulti
                    value={tags.map((tag) => ({ value: tag.id, label: tag.value }))}
                    name="tags"
                    placeholder="Select tags..."
                    closeMenuOnSelect={false}
                    size="md"
                    loadOptions={(value, callback) => {
                        TagsService.findTags(value).then((values) => {
                            callback(values.map((tag) => ({ value: tag.id, label: tag.value })));
                        });
                    }}
                    onCreateOption={async (value) => {
                        const { id } = TagsService.addTag({ value });
                        setTags([...tags, { value, id }]);
                    }}
                    onChange={(value) => {
                        setTags(value.map((tag) => ({ value: tag.label, id: tag.value })));
                    }}
                    noOptionsMessage={() => "Type to find or add tags"}
                />
                <FormErrorMessage>At least one tag is required</FormErrorMessage>
            </FormControl>

            <Center>
                {id ? (
                    <Button colorScheme={"green"} disabled={inputErrors} onClick={_updateNote}>
                        Save Note
                    </Button>
                ) : (
                    <Button colorScheme={"green"} disabled={inputErrors} onClick={_addNote}>
                        Add Note
                    </Button>
                )}
            </Center>
        </Container>
    );
}
