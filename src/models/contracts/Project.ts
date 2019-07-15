import Page from './Page';

export enum Status {
    deployed = 'Deployed',
    inactive = 'Inactive',
    inDevelopment = 'In development'
}

export default interface Project {
    id: string;
    name: string;
    username: string;
    userId: string;
    projectImageUrl: string;
    pages: Page[];
    status: Status;
}
