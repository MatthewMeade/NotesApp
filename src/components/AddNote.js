import React, { useEffect, useState } from "react";

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
import { addNote, addTag, findTags } from "../db";
import { AsyncCreatableSelect } from "chakra-react-select";

export default function AddNote() {
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

    return (
        <Container maxW="container.xl">
            <Heading mb="1em" mt="5px">
                Add Note:
            </Heading>

            {/* TODO: Markdown! */}
            <FormControl mb="2em" isInvalid={doValidation.text && textError}>
                <FormLabel htmlFor="email">Note Body:</FormLabel>
                <Textarea
                    value={text}
                    onChange={({ target }) => setText(target.value)}
                    placeholder="Write your note here..."
                />
                <FormErrorMessage>Note body cannot be blank</FormErrorMessage>
            </FormControl>

            <FormControl mb="3em" isInvalid={doValidation.tags && tagError}>
                <FormLabel htmlFor="email">Tags:</FormLabel>
                {/* <Input
                    type="tags"
                    value={tags.join(",")}
                    onChange={({ target: { value } }) => setTags(value.length > 0 ? value.split(",") : [])}
                /> */}

                <AsyncCreatableSelect
                    isMulti
                    value={tags.map((tag) => ({ value: tag.id, label: tag.value }))}
                    name="tags"
                    placeholder="Select tags..."
                    closeMenuOnSelect={false}
                    size="md"
                    loadOptions={(value, callback) => {
                        findTags(value).then((values) => {
                            callback(values.map((tag) => ({ value: tag.id, label: tag.value })));
                        });
                    }}
                    onCreateOption={async (value) => {
                        const id = await addTag(value);
                        setTags([...tags, { value, id }]);
                    }}
                    onChange={(value) => {
                        setTags(value.map((tag) => ({ value: tag.label, id: tag.value })));
                        console.log(value);
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
