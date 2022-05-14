import { BaseService } from './BaseService';

export class NotesService extends BaseService {
    static tableName = 'Notes';

    static find ({ id, title, text, tags, date: { start, end } = {} } = {}) {
        const selector = {};

        if (id) {
            selector._id = id;
        }

        if (title) {
            selector.title = { $regex: new RegExp(title, 'i') };
        }

        if (text) {
            selector.text = { $regex: new RegExp(text, 'i') };
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

    static preproccesUpdate (note) {
        note = { ...note };

        note.tags = note.tags.map(tag => tag.id);

        return super.preproccesUpdate(note);
    }

    static processResults (rows) {
        return rows.map(note => ({ ...note, tags: note.tags.map(tag => ({ ...tag, value: 'temp' })) }));
    }
}

if (process.env.NODE_ENV === 'development') {
    window.NotesService = NotesService;
}
