const elementGenerator = {
    generateElements: (droppedComponents) => {
        let result = '';
        droppedComponents.forEach((component) => {
            switch(component.name) {
                case 'Header':
                    result +=
`<h1 className='element-center' style={${JSON.stringify(component.style)}}>${component.innerText}</h1>`;
                    break;
                case 'Text':
                    result +=
`<div className='element-center' style={${JSON.stringify(component.style)}}>${component.innerText}</div>`;
                    break;
                case 'Grid':
                    result +=
`<div className='element-center' style={${JSON.stringify(component.style)}}>${component.innerText}</div>`;
                    break;
                default:
                    result +=
`<div className='element-center' style={${JSON.stringify(component.style)}}>${component.innerText}</div>`;
                    break;
            }
        });

        return result;
    }
};

export default elementGenerator;
