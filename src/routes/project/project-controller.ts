import ProjectRepository from "../../models/repositories/ProjectRepository";

const controller = {
    getAllProjects: async (projectRepository: ProjectRepository) => {
        const projects = await projectRepository.getAllProjects();
        return projects;
    }
};

export default controller;