import { DeleteIcon } from '@chakra-ui/icons';
import {
    Box, Button, Container, Heading, HStack, useToast, VStack
} from '@chakra-ui/react';
import download from 'downloadjs';
import React, { useEffect, useState } from 'react';
import ColorModeSwitcher from '../ColorModeSwitcher';
import db from '../db/db';
import NotesService from '../db/notesService';
import TagsService from '../db/tagsService';
import { populateDB } from '../util/populateDB';
import ConfirmableButton from './ConfirmableButton';

export default function Settings() {
    const [notes, setnotes] = useState(0);
    const [tags, settags] = useState(0);

    const generateData = async () => {
        await populateDB();
        updateCounts();
    };

    const updateCounts = () => {
        TagsService.count().then(settags);
        NotesService.count().then(setnotes);
    };

    useEffect(() => {
        updateCounts();
    }, []);

    return (
        <Container>
            <Heading mb="1em" mt="5px">
                Settings:
            </Heading>

            <VStack align="left" gap={10}>
                <HStack>
                    {/* TODO: Light mode styling needs work */}
                    <p>Color mode</p>
                    <ColorModeSwitcher />
                </HStack>

                <VStack align="left" gap={5}>
                    <Heading size="lg">Manage Data:</Heading>

                    <Box>
                        <p>
                            Notes:
                            {notes}
                        </p>
                        <p>
                            Tags:
                            {tags}
                        </p>
                    </Box>

                    <ExportButton />
                    <DeleteButton updateCounts={updateCounts} />
                    <DeleteButton updateCounts={generateData} buttonText="Regenerate Data" />
                </VStack>
            </VStack>
        </Container>
    );
}

function DeleteButton({ updateCounts, buttonText = 'Delete All Data' }) {
    const toast = useToast();
    const deleteAllData = async () => {
        await TagsService.deleteAll();
        await NotesService.deleteAll();

        updateCounts();

        toast({
            title: 'Data Deleted',
            description: 'All notes and tags have been deleted',
            status: 'success',
            duration: 9000,
            isClosable: true
        });
    };

    return (
        <ConfirmableButton
            title={buttonText}
            body="Are you sure you want to delete all application data? This can not be undone,
             you may want to export your data first"
            button={{
                icon: <DeleteIcon />,
                label: buttonText,
                color: 'red'
            }}
            onConfirm={() => deleteAllData()}
        />
    );
}

function ExportButton() {
    const doExport = async () => {
        // const notes = await NotesService.getAll();
        // const tags = await TagsService.getAll();

        const data = await db.allDocs({ include_docs: true, attachments: true })
            .then((d) => JSON.stringify(d, null, 2));

        const timestamp = new Date().toISOString().replaceAll('T', '_').replaceAll(':', '-')
            .slice(0, -8);

        download(data, `NotesAppExport_${timestamp}.json`, 'text/json');
    };

    return <Button onClick={() => doExport()}>Export Data</Button>;
}
