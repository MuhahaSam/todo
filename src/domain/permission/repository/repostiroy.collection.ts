import ListRepostiory from "../../list/repository.ts/list";
import PeronListRepository from "../../list/repository.ts/person_list";
import PermissionRepository from "./permission";
import PersonRepository from "../../../auth/repostitory/person";

export default class PermissionRepositoryCollection {
    readonly listRepository = new ListRepostiory()
    readonly personRepostiroy = new PersonRepository()
    readonly personListRepository = new PeronListRepository()
    readonly permissionRepository = new PermissionRepository()
}