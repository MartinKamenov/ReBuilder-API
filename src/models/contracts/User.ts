import Project from './Project';

export default interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    imageUrl: string;
    projects: Array<Project>
}
