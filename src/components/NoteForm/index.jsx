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
    Input
} from '@chakra-ui/react';
import { AsyncCreatableSelect } from 'chakra-react-select';
import { useNavigate, useParams } from 'react-router';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './MDEditorStyles.css';
import NotesService from '../../db/notesService';
import TagsService from '../../db/tagsService';

export default function NoteForm() {
    const { id } = useParams();

    const [note, setNote] = useState({ text: '', title: '', tags: [] });

    const updateNote = (key, value) => {
        setNote({ ...note, [key]: value });
    };

    const [doValidation, setDoValidation] = useState({ text: false, tags: false, title: false });

    const toast = useToast();

    const navigate = useNavigate();

    // Load note when editing
    useEffect(() => {
        if (!id) {
            setNote({ text: '', title: '', tags: {} });
            setDoValidation({ text: false, tags: false, title: false });
            return;
        }

        NotesService.getById(id).then((loadedNote) => {
            setNote(loadedNote);
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
        await NotesService.update(note);
        toast({
            title: 'Note Updated',
            description: 'Your note has been saved',
            status: 'success',
            duration: 9000,
            isClosable: true
        });
        navigate(`/note/${id}`);
    };

    const options = useMemo(
        () => ({
            spellChecker: false,
            placeholder: 'Write your note here...',
            // TODO: Image Uploads
            // uploadImage: true,
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
            ]
        }),
        []
    );

    return (
        <Container maxW="container.xl">
            <Heading mb="1em" mt="5px">
                {id ? 'Edit' : 'Add'}
                {' '}
                Note:
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
                <SimpleMDE value={note.text} onChange={(value) => updateNote('title', value)} options={options} />
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
                    <Button colorScheme="green" disabled={inputErrors} onClick={_updateNote}>
                        Save Note
                    </Button>
                ) : (
                    <Button colorScheme="green" disabled={inputErrors} onClick={_addNote}>
                        Add Note
                    </Button>
                )}
            </Center>
        </Container>
    );
}
