import Page from './Page';

export default interface Project {
    id: string;
    name: string;
    username: string;
    userId: string;
    projectImageUrl: string;
    pages: Page[];
    creationDate: Date;
    lastUpdated: Date;
}
