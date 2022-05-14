import BaseService from './BaseService';

export default class NotesService extends BaseService {
    static tableName = 'Notes';

    static find({
        id, title, text, tags, date: { start, end } = {}
    } = {}) {
        const selector = {};

        if (id) {
            selector._id = id;
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

        if (tags) {
            selector.tags = { $in: tags };
        }

        return super.find(selector);
    }

    static preproccesUpdate(note) {
        const _note = { ...note };

        _note.tags = _note.tags.map((tag) => tag.id);

        return super.preproccesUpdate(_note);
    }

    static processResults(rows) {
        return rows.map((note) => ({ ...note, tags: note.tags.map((tag) => ({ ...tag, value: 'temp' })) }));
    }
}

if (process.env.NODE_ENV === 'development') {
    window.NotesService = NotesService;
}
