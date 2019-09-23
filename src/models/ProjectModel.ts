import Project, { Status } from './contracts/Project';
import Page from './contracts/Page';

export default class ProjectModel implements Project {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public userId: string,
        public projectImageUrl: string,
        public pages: Page[],
        public status: Status,
        public uploadUrl: string,
    ) {}
}
