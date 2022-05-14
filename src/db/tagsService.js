import BaseService from './BaseService';

export default class TagsService extends BaseService {
    static tableName = 'Tags';

    static find({ value }) {
        return super.find({
            value: { $regex: value }
        });
    }
}

if (process.env.NODE_ENV === 'development') {
    window.TagsService = TagsService;
}
