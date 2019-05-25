import { IList, ListAction, ListContext, ListItem } from 'coc.nvim';
export default class Project implements IList {
    private projects;
    readonly name = "project";
    readonly description = "project list";
    readonly defaultAction = "open";
    actions: ListAction[];
    constructor(projects: Record<string, number>);
    loadItems(_context: ListContext): Promise<ListItem[]>;
}
