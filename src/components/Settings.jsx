import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Heading, HStack, useToast, VStack } from "@chakra-ui/react";
import download from "downloadjs";
import React, { useEffect, useState } from "react";
import ColorModeSwitcher from "../ColorModeSwitcher";
import { NotesService } from "../db/notesService";
import { TagsService } from "../db/tagsService";
import ConfirmableButton from "./ConfirmableButton";

export default function Settings() {
    const [notes, setnotes] = useState(0);
    const [tags, settags] = useState(0);

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
                        <p>Notes: {notes}</p>
                        <p>Tags: {tags}</p>
                    </Box>

                    <ExportButton />
                    <DeleteButton updateCounts={updateCounts} />
                </VStack>
            </VStack>
        </Container>
    );
}

const DeleteButton = ({ updateCounts }) => {
    const toast = useToast();
    const deleteAllData = async () => {
        await TagsService.deleteAll();
        await NotesService.deleteAll();

        updateCounts();

        toast({
            title: "Data Deleted",
            description: "All notes and tags have been deleted",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    };

    return (
        <ConfirmableButton
            title="Delete All Data"
            body="Are you sure you want to delete all application data? This can not be undone, you may want to export your data first"
            button={{
                icon: <DeleteIcon />,
                label: "Delete All Data",
                color: "red",
            }}
            onConfirm={() => deleteAllData()}
        />
    );
};

const ExportButton = () => {
    const doExport = async () => {
        const notes = await NotesService.getAllNotes();
        const tags = await TagsService.getAllTags();

        const timestamp = new Date().toISOString().replaceAll("T", "_").replaceAll(":", "-").slice(0, -8);

        download(JSON.stringify({ notes, tags }, null, 2), `NotesAppExport_${timestamp}.json`, "text/json");
    };

    return <Button onClick={() => doExport()}>Export Data</Button>;
};
