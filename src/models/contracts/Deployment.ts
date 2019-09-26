export default interface Deployment {
    id: string;
    name: string;
    username: string;
    userId: string;
    status: string;
    log: any[];
    deployUrl: string;
}

export enum Status {
    deployed = 'Deployed',
    inactive = 'Inactive',
    inDevelopment = 'In development'
}
