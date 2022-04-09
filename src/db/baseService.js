import { idbCon } from "./idbService";
export class BaseService {
    // get connection() {
    //     return idbCon;
    // }
    static connection = idbCon;
}
