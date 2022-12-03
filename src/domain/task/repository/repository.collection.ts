import PersonRepository from "../../../auth/repostitory/person";
import TaskRepository from "./task";
import ListRepostiory from "../../list/repository/list";

export default class TaskRepositoiewCollection{
    readonly personRep = new PersonRepository()
    readonly taskRep = new TaskRepository()
    readonly listRep = new ListRepostiory()
}