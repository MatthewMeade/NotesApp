import BaseService from './BaseService';
import TagsService from './tagsService';

export default class NotesService extends BaseService {
    static tableName = 'Notes';

    static indexes = ['title', 'text', 'updatedDate'];

    static find(_selector = {}, paging = {}, options = {}) {
        const { id, title, text, tags, date: { start, end } = {} } = _selector;

        const selector = {};

        if (id) {
            if (Array.isArray(id)) {
                selector._id = { $in: id };
            } else {
                selector._id = id;
            }
        }

        if (title) {
            selector.title = { $regex: title };
        }

        if (text) {
            selector.text = { $regex: text };
        }

        if (start || end) {
            selector.updatedDate = {};

            if (start) {
                selector.updatedDate.$gte = start;
            }
            if (end) {
                selector.updatedDate.$lte = end;
            }
        }

        if (tags && tags.length > 0) {
            selector.tags = { $elemMatch: { $in: tags } };
        }

        return super.find(selector, paging, options);
    }

    static preproccesUpdate(note) {
        const _note = { ...note };

        _note.tags = _note.tags.map((tag) => tag._id);
        _note.updatedDate = Date.now();

        return super.preproccesUpdate(_note);
    }

    static async processResults(rows) {
        const allTagIDs = [...new Set(rows.map((r) => r.tags).flat())];

        const allTags = (await TagsService.getById(allTagIDs)).reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {});

        return rows.map((note) => ({
            ...note,
            tags: note.tags.map((tag) => allTags[tag])
        }));
    }
}

if (process.env.NODE_ENV === 'development') {
    window.NotesService = NotesService;
}

NotesService.init();
