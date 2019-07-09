const ports = [];
let port = 3001;

const portService = {
    getPort: (projectId): number => {
        const foundPort = ports.find((p) => p.id === projectId);
        if(foundPort) {
            return foundPort.port;
        }

        ports.push({ id: projectId, port });
        return port++;
    },

    hasPort: (projectId): boolean => {
        return ports.includes((p) => p.id === projectId);
    }
};

export default portService;
