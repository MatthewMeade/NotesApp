import BaseService from './BaseService';

export default class TagsService extends BaseService {
    static tableName = 'Tags';

    static indexes = ['value'];

    static find(_selector = {}, paging = {}) {
        const { value, id } = _selector;

        const selector = {};

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

        return super.find(selector, paging);
    }
}

if (process.env.NODE_ENV === 'development') {
    window.TagsService = TagsService;
}

// TagsService.init();
