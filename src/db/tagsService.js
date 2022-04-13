import { BaseService } from "./baseService";
export class TagsService extends BaseService {
    static tableName = "Tags";

    static find({ value }) {
        return super.find({
            value: {
                regex: new RegExp(value, "i"),
            },
        });
    }
}

if (process.env.NODE_ENV === "development") {
    window.TagsService = new TagsService();
}
