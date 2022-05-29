/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/* eslint-disable no-alert */
import { v4 as uuid } from 'uuid';

import React, { useEffect, useMemo, useState } from 'react';

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
    Text
} from '@chakra-ui/react';
import { AsyncCreatableSelect } from 'chakra-react-select';
import { useNavigate, useParams } from 'react-router';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './MDEditorStyles.css';
import NotesService from '../../db/notesService';
import TagsService from '../../db/tagsService';
import ImageList from './ImageList';

export default function NoteForm() {
    const { id } = useParams();

    const [note, setNote] = useState({ text: '', title: '', tags: [] });
    const [attachments, setAttachments] = useState([]);

    const updateNote = (key, value) => {
        setNote({ ...note, [key]: value });
    };

    const addImage = (data, success) => {
        const _attachments = [...attachments];

        let fileName = data.name;
        while (_attachments.some((n) => n.name === fileName)) {
            fileName = prompt(
                `A file with the name ${fileName} already exists, would you like to name this file something else`,
                fileName
            );
        }

        if (fileName === null) {
            return; // User cancelled
        }

        const file = {
            id: uuid(),
            name: fileName,
            data
        };

        _attachments.push(file);

        setAttachments(_attachments);
        success(fileName);
    };

    const deleteImage = (fileName) => {
        setAttachments(attachments.filter((n) => n.name !== fileName));

        const noteText = note.text.replaceAll(`![](${fileName})`, '');
        updateNote('text', noteText);
    };

    const updateImageTitle = (key, value) => {
        const titleExists = attachments.some((n) => n.name === value);

        if (titleExists) {
            toast({
                title: `An image named ${value} already exists`,
                description: 'Rename or delete the other image',
                status: 'error',
                duration: 9000,
                isClosable: true
            });

            return;
        }

        const _attachments = attachments.map((a) => {
            if (a.name === key) {
                a.name = value;
            }
            return a;
        });

        const noteText = note.text.replaceAll(`![](${key})`, `![](${value})`);
        updateNote('text', noteText);

        setAttachments(_attachments);
    };

    const [doValidation, setDoValidation] = useState({ text: false, tags: false, title: false });

    const toast = useToast();

    const navigate = useNavigate();

    // Load note when editing
    useEffect(() => {
        if (!id) {
            setNote({ text: '', title: '', tags: [] });
            setAttachments([]);
            setDoValidation({ text: false, tags: false, title: false });
            return;
        }

        NotesService.getById(id).then((loadedNote) => {
            if (!loadedNote) {
                return navigate('/add');
            }

            setNote(loadedNote);
            setAttachments(loadedNote.attachments ?? []);
            setDoValidation({ text: true, tags: true, title: true });
        });
    }, [id]);

    // Slightly smarter validation, don't warn until after edited
    useEffect(() => {
        const val = { ...doValidation };

        if (note.text !== '') {
            val.text = true;
        }

        if (note.title !== '') {
            val.title = true;
        }

        if (note.tags.length > 0) {
            val.tags = true;
        }
        setDoValidation(val);
    }, [note]);

    const textError = note.text === '';
    const titleError = note.title === '';
    const tagError = note.tags.length === 0;
    const inputErrors = textError || tagError || titleError;

    const _addNote = async () => {
        const newNote = await NotesService.add(note);
        newNote.attachments = attachments;
        toast({
            title: 'Note created',
            description: 'Your note has been saved',
            status: 'success',
            duration: 9000,
            isClosable: true
        });
        navigate(`/note/${newNote._id}`);
    };

    const _updateNote = async () => {
        const newNote = { ...note };
        newNote.attachments = attachments;

        await NotesService.update(newNote);
        toast({
            title: 'Note Updated',
            description: 'Your note has been saved',
            status: 'success',
            duration: 9000,
            isClosable: true
        });
        navigate(`/note/${id}`);
    };

    const options = useMemo(() => ({
        spellChecker: false,
        placeholder: 'Write your note here...',
        uploadImage: true,
        toolbar: [
            'bold',
            'italic',
            'strikethrough',
            'heading',
            'code',
            'quote',
            'unordered-list',
            'ordered-list',
            'link',
            'image',
            'table',
            '|',
            'clean-block',
            '|',
            'guide'
        ],
        imageUploadFunction: addImage

    }), [attachments]);

    return (
        <Container maxW="container.xl">
            <Heading mb="1em" mt={5}>
                <Text align="center">
                    {id ? 'Edit Note' : 'Add Note'}
                </Text>
            </Heading>

            <FormControl mb="2em" isInvalid={doValidation.title && titleError}>
                <FormLabel htmlFor="email">Title:</FormLabel>
                <Input
                    placeholder="Enter Note Title..."
                    value={note.title}
                    onChange={(e) => updateNote('title', e.target.value)}
                />
                <FormErrorMessage>Title cannot be blank</FormErrorMessage>
            </FormControl>

            <FormControl mb="2em" isInvalid={doValidation.text && textError}>
                <FormLabel htmlFor="email">Note Body:</FormLabel>
                <SimpleMDE
                    value={note.text}
                    onChange={(value) => updateNote('text', value)}
                    options={options}
                />
                <FormErrorMessage>Note body cannot be blank</FormErrorMessage>
            </FormControl>

            <FormControl mb="3em" isInvalid={doValidation.tags && tagError}>
                <FormLabel htmlFor="email">Tags:</FormLabel>

                <AsyncCreatableSelect
                    isMulti
                    value={note.tags.map((tag) => ({ value: tag._id, label: tag.value }))}
                    name="tags"
                    placeholder="Select tags..."
                    closeMenuOnSelect={false}
                    size="md"
                    loadOptions={(value, callback) => {
                        TagsService.find({ value }).then((values) => {
                            callback(values.map((tag) => ({ value: tag._id, label: tag.value })));
                        });
                    }}
                    onCreateOption={async (value) => {
                        const newID = await TagsService.add({ value });
                        updateNote('tags', [...note.tags, { value, _id: newID }]);
                    }}
                    onChange={(value) => {
                        updateNote('tags', value.map((tag) => ({ value: tag.label, _id: tag.value })));
                    }}
                    noOptionsMessage={() => 'Type to find or add tags'}
                />
                <FormErrorMessage>At least one tag is required</FormErrorMessage>
            </FormControl>

            <Center>
                {id ? (
                    <Button colorScheme="green" disabled={inputErrors} onClick={_updateNote} w="100%" maxW="500px">
                        Save Note
                    </Button>
                ) : (
                    <Button colorScheme="green" disabled={inputErrors} onClick={_addNote} w="100%" maxW="500px">
                        Add Note
                    </Button>
                )}
            </Center>

            <ImageList attachments={attachments ?? {}} deleteImage={deleteImage} updateImageTitle={updateImageTitle} />
        </Container>
    );
}
