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
} from "@chakra-ui/react";
import { addNote, addTag, findNotes, findTags } from "../../db";
import { AsyncCreatableSelect } from "chakra-react-select";
import { useNavigate, useParams } from "react-router";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./MDEditorStyles.css";
import { updateNote } from "../../db/notes";

// TODO: Edit Note

// TODO: Notes should have titles

export default function NoteForm() {
    let { id } = useParams();

    const [text, setText] = useState("");
    const [tags, setTags] = useState([]);

    const [doValidation, setDoValidation] = useState({ text: false, tags: false });

    const toast = useToast();

    let navigate = useNavigate();

    // Load note when editing
    useEffect(() => {
        if (!id) {
            setText("");
            setTags([]);
            setDoValidation({ text: false, tags: false })
            return;
        }

        findNotes({ id }).then(([note]) => {
            setText(note.text);
            setTags(note.tags);
            setDoValidation({ text: true, tags: true });
        });
    }, [id]);

    // Slightly smarter validation
    useEffect(() => {
        const val = { ...doValidation };

        if (text !== "") {
            val.text = true;
        }

        if (tags.length > 0) {
            val.tags = true;
        }
        setDoValidation(val);
    }, [text, tags]); // eslint-disable-line react-hooks/exhaustive-deps

    const textError = text === "";
    const tagError = tags.length === 0;
    const inputErrors = textError || tagError;

    const _addNote = async () => {
        // TODO: Error Handling
        const id = await addNote(text, tags);        
        toast({
            title: "Note created",
            description: "Your note has been saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate(`/note/${id}`);
    };

    const _updateNote = async () => {
        await updateNote(id, {text, tags});
        toast({
            title: "Note Updated",
            description: "Your note has been saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        navigate(`/note/${id}`);
    }

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
                        findTags({ value }).then((values) => {
                            callback(values.map((tag) => ({ value: tag.id, label: tag.value })));
                        });
                    }}
                    onCreateOption={async (value) => {
                        const id = await addTag(value);
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
