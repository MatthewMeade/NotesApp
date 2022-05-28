import React, { useEffect, useState } from 'react';
import {
    Container, FormLabel, Grid, GridItem, VStack, Input, HStack, Heading
} from '@chakra-ui/react';

import { AsyncSelect } from 'chakra-react-select';
import InfiniteScroll from 'react-infinite-scroller';

import './styles.css';
import { useDebouncedCallback } from 'use-debounce';
import NotesService from '../../db/notesService';
import TagsService from '../../db/tagsService';
import Note, { NoteSkeleton } from '../Note';

const PAGE_SIZE = 25;

export default function NotesList() {
    const [filter, setFilter] = useState({
        title: '',
        tags: [],
        dateFrom: '',
        dateTo: ''
    });

    const [notes, setNotes] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const find = (page) => {
        const date = {
            start: filter.dateFrom ? new Date(filter) : undefined,
            end: filter.dateTo ? new Date(Date.parse(filter.dateTo) + 86400000) : undefined // end of day
        };

        return NotesService.find(
            { title: filter.title, tags: filter?.tags?.map((t) => t.id), date },
            page ? { skip: notes.length, limit: PAGE_SIZE, sort: [{ updatedDate: 'desc' }] } : {}
        );
    };

    const loadMore = (clear) => {
        find(true).then((newNotes) => {
            setIsLoading(false);

            if (clear) {
                return setNotes(newNotes);
            }
            return setNotes([...notes, ...newNotes]);
        });
    };

    const onFilterUpdate = useDebouncedCallback(() => {
        setResultCount(0);
        setNotes([]);
        setIsLoading(true);
        find(false).then((results) => {
            setResultCount(results.length);
            loadMore(true);
        });
    }, 200);

    const updateFilter = (key, value) => {
        setFilter({ ...filter, [key]: value });
    };

    useEffect(() => {
        onFilterUpdate();
    }, [filter]);

    return (
        <Container maxW="container.xl" bg="rgba(0,0,0,0.05)" pb={10} pt={5}>
            <Grid templateColumns="min-content auto" gap={6} alignItems="center" mb={10}>
                <GridItem>
                    <FormLabel htmlFor="title" pt="4px">
                        Title:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <Input
                        placeholder="Search by title..."
                        id="title"
                        value={filter.title}
                        onChange={(e) => updateFilter('title', e.target.value)}
                    />
                </GridItem>
                <GridItem>
                    <FormLabel pt="4px">Date:</FormLabel>
                </GridItem>
                <GridItem>
                    <HStack>
                        <Input
                            id="dateFrom"
                            name="From"
                            type="date"
                            value={filter.dateFrom}
                            onChange={(e) => updateFilter('dateFrom', e.target.value)}
                            placeholder="Beginning Of Time"
                        />
                        <Input
                            id="dateTo"
                            name="To"
                            type="date"
                            value={filter.dateTo}
                            onChange={(e) => updateFilter('dateTo', e.target.value)}
                            placeholder="Today"
                        />
                    </HStack>
                </GridItem>
                <GridItem>
                    <FormLabel htmlFor="tags" pt="4px">
                        Tags:
                    </FormLabel>
                </GridItem>
                <GridItem>
                    <AsyncSelect
                        id="tags"
                        defaultOptions // Possibly remove this, requiring search to filter
                        isMulti
                        value={filter?.tags?.map((tag) => ({ value: tag._id, label: tag.value }))}
                        name="tags"
                        placeholder="Search by tags..."
                        closeMenuOnSelect={false}
                        size="md"
                        loadOptions={(value, callback) => {
                            TagsService.find({ value }).then((values) => {
                                callback(values.map((tag) => ({ value: tag._id, label: tag.value })));
                            });
                        }}
                        onChange={(value) => {
                            updateFilter('tags', value.map((tag) => ({ value: tag.label, id: tag.value })));
                        }}
                        noOptionsMessage={() => 'Type to find or add tags'}
                    />
                </GridItem>
            </Grid>

            {isLoading ? <NoteSkeleton /> : (
                notes.length > 0 ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => loadMore()}
                        hasMore={resultCount > notes.length}
                        loader={(
                            <NoteSkeleton key={0} />
                        )}
                        useWindow
                    >
                        <VStack gap={10}>
                            {notes.map((note) => (
                                <Note note={note} key={note._id} controlType="list" />
                            ))}
                        </VStack>
                    </InfiniteScroll>
                ) : (<Heading textAlign="center">No Notes Found</Heading>)
            )}

        </Container>
    );
}
