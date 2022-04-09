import { Tag } from "@chakra-ui/react";
import { BaseService } from "./baseService";

export class TagsService extends BaseService {
    static tableName = "Tags";

    static count() {
        return this.connection.count({
            from: this.tableName,
        });
    }

    static addTag(tag) {
        return this.connection.insert({
            into: this.tableName,
            values: [tag],
            return: true,
            upsert: true,
        });
    }

    static removeTag(id) {
        return this.connection.remove({
            from: this.tableName,
            where: {
                id: id,
            },
        });
    }

    static updateTag(tag) {
        return this.connection.update({
            in: this.tableName,
            set: tag,
            where: {
                id: Tag.id,
            },
        });
    }

    static getAllTags() {
        return this.connection.select({
            from: this.tableName,
        });
    }

    static getTagById(id) {
        return this.connection.select({
            from: this.tableName,
            where: {
                id: id,
            },
        });
    }

    static findTags(value) {
        return this.connection.select({
            from: this.tableName,
            where: {
                value: {
                    regex: new RegExp(value, "i"),
                },
            },
        });
    }

    static deleteAll() {
        return this.connection.clear(this.tableName);
    }
}

window.TagsService = new TagsService();
