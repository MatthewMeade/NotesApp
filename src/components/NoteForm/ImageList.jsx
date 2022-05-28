import { DeleteIcon } from '@chakra-ui/icons';
import { SimpleGrid, Box, Image, Input } from '@chakra-ui/react';
import React from 'react';

import ConfirmableButton from '../ConfirmableButton';

export default function ImageList({ attachments, deleteImage, updateImageTitle }) {
    const items = attachments
        .map((attachment) => (
            <ImageListItem
                key={attachment.id}
                name={attachment.name}
                attachment={attachment}
                deleteImage={deleteImage}
                updateImageTitle={updateImageTitle}
            />
        ));
    return (
        <Box my={100}>{items}</Box>
    );
}

function ImageListItem({ name, attachment, deleteImage, updateImageTitle }) {
    const url = URL.createObjectURL(attachment.data);

    return (
        <SimpleGrid
            columns={3}
            spacing={10}
            alignItems="center"
            bg="gray.900"
            templateColumns="0.5fr auto min-content"
            mb={10}
        >
            <Box h={150}>
                <Image src={url} alt={name} height="100%" margin="0 auto" />
            </Box>
            <Box display="block">

                <Input
                    value={name}
                    onChange={(e) => updateImageTitle(name, e.target.value)}
                />
            </Box>
            <Box pr={10}>

                <ConfirmableButton
                    title="Delete Image"
                    body={[`Are you sure you want to delete ${name}?`,
                        'This will also remove the markdown associated with the image from the note body']}
                    button={{
                        icon: <DeleteIcon />,
                        label: 'Delete',
                        color: 'red'
                    }}
                    onConfirm={(() => deleteImage(name))}
                />
            </Box>
        </SimpleGrid>
    );
}
