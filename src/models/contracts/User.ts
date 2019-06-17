import Project from './Project';

export default interface User {
    username: String;
    password: String;
    email: String;
    imageUrl: String;
    projects: Array<Project>
}