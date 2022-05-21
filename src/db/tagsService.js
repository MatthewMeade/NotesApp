import BaseService from './BaseService';

export default class TagsService extends BaseService {
    static tableName = 'Tags';

    static find({ value, id } = {}) {
        const selector = { };
        if (value) {
            selector.value = { $regex: value };
        }

        if (id) {
            if (Array.isArray(id)) {
                selector._id = { $in: id };
            } else {
                selector._id = id;
            }
        }

        return super.find(selector);
    }
}

if (process.env.NODE_ENV === 'development') {
    window.TagsService = TagsService;
}
