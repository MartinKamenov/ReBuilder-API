import Page from './Page';

export default interface Project {
    id: string;
    name: string;
    username: string;
    userId: string;
    projectImageUrl: string;
    pages: Page[];
    description: string | null;
    creationDate: Date;
    lastUpdated: Date;
}
