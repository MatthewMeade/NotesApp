import { BaseService } from "./baseService";
export class TagsService extends BaseService {
    static tableName = "Tags";

    static find({ value }, {skip, limit} = {}, count = false) {
        return super.find({
            value: {
                regex: new RegExp(value, "i"),
            },
        }, {skip, limit}, count);
    }
}

if (process.env.NODE_ENV === "development") {
    window.TagsService = new TagsService();
}
