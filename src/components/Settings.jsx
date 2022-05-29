import { DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import {
    Button, Container, Heading, SimpleGrid, useToast, VStack
} from '@chakra-ui/react';
import download from 'downloadjs';
import React, { useEffect, useState } from 'react';
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
            <Heading my="1em" textAlign="center" size="2xl">
                Settings
            </Heading>

            <VStack align="left" gap={10} mt={20}>
                <VStack align="left" gap={5}>
                    <Heading size="lg" textAlign="center">Manage Data</Heading>

                    <SimpleGrid columns={2} textAlign="center">
                        <p>
                            Notes:
                            {notes}
                        </p>
                        <p>
                            Tags:
                            {tags}
                        </p>
                    </SimpleGrid>

                    <ExportButton />
                    <DeleteButton
                        updateCounts={updateCounts}
                        confirmText="Are you sure you want to delete all application data? This can not be undone,
             you may want to export your data first"
                        buttonText="Delete All Data"
                        icon={<DeleteIcon />}
                    />
                    <DeleteButton
                        updateCounts={generateData}
                        buttonText="Regenerate Data"
                        confirmText="Are you sure you want to delete and regenerate all app data?
                        This can not be undone, you may want to export your data first"
                        icon={<RepeatIcon />}
                    />
                </VStack>
            </VStack>
        </Container>
    );
}

function DeleteButton({ updateCounts, buttonText, confirmText, icon }) {
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
            body={confirmText}
            button={{
                icon,
                label: buttonText,
                color: 'red'
            }}
            onConfirm={() => deleteAllData()}
        />
    );
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function ExportButton() {
    const doExport = async () => {
        const promises = (await db.allDocs({ include_docs: true, attachments: true })).rows
            .map(async (d) => {
                if (d.doc.attachments) {
                    const _promises = d.doc.attachments.map(async ({ name, data, id }) => ({
                        id,
                        name,
                        data: await blobToBase64(data)
                    }));

                    d.doc.attachments = await Promise.all(_promises);
                }

                return d;
            });

        const data = await Promise.all(promises);

        const timestamp = new Date().toISOString().replaceAll('T', '_').replaceAll(':', '-')
            .slice(0, -8);

        download(JSON.stringify(data, null, 2), `NotesAppExport_${timestamp}.json`, 'text/json');
    };

    return <Button onClick={() => doExport()}>Export Data</Button>;
}
