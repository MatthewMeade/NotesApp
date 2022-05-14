import { BaseService } from './BaseService';
export class TagsService extends BaseService {
    static tableName = 'Tags';

    static find ({ value }) {
        return this.db.find({
            selector: {
                value: { $regex: new RegExp(value, 'i') }
            }
        });
    }
}

if (process.env.NODE_ENV === 'development') {
    window.TagsService = TagsService;
}
