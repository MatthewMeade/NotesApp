import { loremIpsum } from 'lorem-ipsum';

import NotesService from '../db/notesService';
import TagsService from '../db/tagsService';

const NUM_TAGS = 25;
const NUM_NOTES = 100;

export const populateDB = async () => {
    const tags = loremIpsum({ count: window.NUM_TAGS ?? NUM_TAGS, units: 'words' })
        .split(' ')
        .map((t, i) => ({ value: t, _id: i.toString() }));

    await TagsService.add(tags);

    const notes = [];

    const numNotes = window.NUM_NOTES ?? NUM_NOTES;
    for (let i = 0; i < numNotes; i++) {
        const createdDate = Math.floor(Math.min(Date.now(), new Date().setDate(Math.random() * 30)));
        const updatedDate = Math.floor(Math.min(Date.now(), createdDate + 86400000 * 7 * Math.random()));
        notes.push({
            title: loremIpsum(),
            text: loremIpsum({ paragraphLowerBound: 1, paragraphUpperBound: 10, units: 'paragraphs' }),
            tags: randomTags(),
            createdDate,
            updatedDate
        });
    }

    await NotesService.add(notes);
};

const randomTags = () => {
    const ret = [];

    do {
        const id = Math.floor(Math.random() * NUM_TAGS);
        if (!ret.includes(id)) {
            ret.push(id);
        }
    } while (Math.random() >= 1 / 3);

    return ret.map((id) => ({ _id: `${id}` }));
};
