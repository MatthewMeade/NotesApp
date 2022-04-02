import React, { useEffect, useMemo, useState } from "react";

import {
    Container,
    Heading,
    Textarea,
    FormControl,
    FormLabel,
    Button,
    Center,
    FormErrorMessage,
    useToast,
} from "@chakra-ui/react";
import { addNote, addTag, findTags } from "../../db";
import { AsyncCreatableSelect } from "chakra-react-select";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./MDEditorStyles.css";

// TODO: Edit Note

export default function NoteForm({id}) {
    const [text, setText] = useState("");
    const [tags, setTags] = useState([]);

    const [doValidation, setDoValidation] = useState({ text: false, tags: false });

    const toast = useToast();

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
        await addNote(text, tags);
        setText("");
        setTags([]);
        setDoValidation({ text: false, tags: false });

        toast({
            title: "Note created",
            description: "Your note has been saved",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
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
                Add Note:
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
                        findTags({value}).then((values) => {
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
                <Button colorScheme={"green"} disabled={inputErrors} onClick={_addNote}>
                    Add Note
                </Button>
            </Center>
        </Container>
    );
}
