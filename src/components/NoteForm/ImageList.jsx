import { DeleteIcon } from '@chakra-ui/icons';
import { SimpleGrid, Box, Image, Input, useBreakpointValue } from '@chakra-ui/react';
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

    const imageWidth = useBreakpointValue([100, 150, 200, 250]);
    return (
        <SimpleGrid
            columns={3}
            spacing={2}
            alignItems="center"
            bg="gray.900"
            templateColumns={`${imageWidth}px auto min-content`}
            mb={10}
        >
            <Box maxH={imageWidth * 0.66} overflow="hidden">
                <Image src={url} alt={name} margin="0 auto" />
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
                        label: <DeleteIcon />,
                        color: 'red'
                    }}
                    onConfirm={(() => deleteImage(name))}
                />
            </Box>
        </SimpleGrid>
    );
}
