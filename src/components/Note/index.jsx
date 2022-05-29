import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    SkeletonText,
    SlideFade,
    Tag,
    Text,
    useColorModeValue,
    useToast,
    VStack, Skeleton,
    Stack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import NotesService from '../../db/notesService';
import ConfirmableButton from '../ConfirmableButton';
import MarkdownRenderer from '../MarkdownRenderer';

import './styles.css';

export default function Note({ note: _note, controlType = 'page' }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [note, setNote] = useState(_note ?? { tags: [], attachments: [] });

    useEffect(() => {
        if (!id) {
            return;
        }

        NotesService.getById(id).then((loadedNote) => {
            if (!loadedNote) {
                return navigate('/'); // TODO: 404
            }
            setNote(loadedNote);
        });
    }, [id]);

    const isPage = controlType === 'page';

    const date = new Date(note?.updatedDate);
    const dateStr = `${date.toDateString()} ${date.toLocaleTimeString()}`;

    const [isOpen, setOpen] = useState(true);

    const onDelete = async () => {
        await NotesService.delete(id);
        toast({
            title: 'Note Deleted',
            description: 'Your note has been Deleted',
            status: 'success',
            duration: 9000,
            isClosable: true
        });
        navigate('/');
    };

    const controls = (
        <HStack justifyContent={{ base: 'space-between', md: 'right' }} py={isPage ? 3 : 0}>
            <Link to={`/note/${note._id}/edit`}>
                <Button leftIcon={<EditIcon />} size="md">
                Edit
                </Button>
            </Link>

            {isPage && (
                <ConfirmableButton
                    title="Delete Note"
                    body="Are you sure you want to delete this note?"
                    button={{
                        icon: <DeleteIcon />,
                        label: 'Delete',
                        color: 'red'
                    }}
                    onConfirm={onDelete}
                />
            )}

            {!isPage && (
                <Link to={`/note/${note._id}`}>
                    <Button leftIcon={<ViewIcon />} bg="none">
                    View Note
                    </Button>
                </Link>
            )}
        </HStack>
    );

    const imageMap = note?.attachments?.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

    return (
        <Container maxW="container.xl">
            {isPage && controls}
            <Box w="100%" pt={2} className="note">
                <VStack
                    align="left"
                    onClick={() => setOpen(!isOpen)}
                    borderBottom="1px solid grey"
                    className={`noteHeader ${isOpen ? 'note_open' : 'note_closed'}`}
                >

                    <Stack alignItems="center" justifyContent="space-between" direction={{ base: 'column', md: 'row' }}>
                        <Heading size="md" textAlign={{ base: 'left', md: 'center' }}>
                            <Box textAlign={{ base: 'center', md: 'left' }}>

                                {note.title}
                            </Box>
                        </Heading>

                        <Box
                            display={{ base: 'none', md: 'block' }}
                        >
                            {!isPage && controls}
                        </Box>

                    </Stack>

                    <Flex justify="space-between" flexDirection={{ base: 'column', md: 'row' }}>
                        <Flex wrap="wrap" gap={1} pb={2} justifyContent="center">
                            {note.tags.map((tag) => (
                                <Tag size="sm" key={tag._id}>
                                    {tag.value}
                                </Tag>
                            ))}
                        </Flex>
                        <Text as="i" display={{ base: 'none', md: 'block' }}>{dateStr}</Text>
                    </Flex>

                    <Box
                        px={10}
                        display={{ base: 'block', md: 'none' }}
                    >
                        {!isPage && controls}
                    </Box>
                </VStack>

                <SlideFade in={isOpen || isPage} unmountOnExit>
                    <Box
                        bg={useColorModeValue('gray.100', 'gray.900')}
                        m="0 10px"
                        p={2}
                        mt={1}
                        minH={isPage ? 250 : 125}
                    >
                        <MarkdownRenderer text={note.text} imageMap={imageMap} />
                    </Box>
                </SlideFade>
            </Box>
        </Container>
    );
}

export function NoteSkeleton() {
    return (
        <Container maxW="container.xl">
            <Box w="100%" pt={2}>
                <VStack align="left" borderBottom="1px solid grey">
                    <HStack alignItems="center" justifyContent="space-between">

                        <Skeleton width="75%" height="40px" />

                        <HStack justifyContent="right" py={3}>
                            <Skeleton width="100px" height="40px" />
                            <Skeleton width="100px" height="40px" />
                        </HStack>
                    </HStack>

                    <Flex justify="space-between">
                        <Flex wrap="wrap" gap={1} pb={2}>
                            <Skeleton width="50px" height="24px" />
                            <Skeleton width="75px" height="24px" />
                            <Skeleton width="60px" height="24px" />
                            <Skeleton width="50px" height="24px" />
                        </Flex>

                        <Box w="200px">
                            <SkeletonText noOfLines={1} spacing="4" />
                        </Box>
                    </Flex>
                </VStack>

                <SkeletonText mt="4" noOfLines={4} spacing="4" />
            </Box>
        </Container>
    );
}
