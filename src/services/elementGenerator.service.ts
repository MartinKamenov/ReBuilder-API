// tslint:disable:max-line-length
import { componentTypes } from './componentTypes';
const screenWidth = 1200;

const getElement = (component) => {
    const copyOfStyle = Object.assign({}, component.style);
    Object.keys(copyOfStyle).forEach((key) => {
        if(Array.isArray(copyOfStyle[key])) {
            delete copyOfStyle[key];
        }
    });

    if(copyOfStyle.width.endsWith('px')) {
        const pixelsWidth = parseInt(copyOfStyle.width, 10);
        delete copyOfStyle.width;
        copyOfStyle.width = ((pixelsWidth / screenWidth) * 100) + '%';
    }
    switch(component.name) {
    case componentTypes.Header:
        return (
            `<h1 className='element-center' style={${JSON.stringify(copyOfStyle)}}>${component.innerText}</h1>`
        );
    case componentTypes.Text:
        return (
            `<div className='element-center' style={${JSON.stringify(copyOfStyle)}}>${component.innerText}</div>`
        );
    case componentTypes.Grid:
        return (
            `<div className='element-center' style={${JSON.stringify(copyOfStyle)}}>${component.innerText}</div>`
        );
    case componentTypes.Input:
        return (
            `<input className='element-center' style={${JSON.stringify(copyOfStyle)}}/>`
        );
    case componentTypes.Image:
        return (
            `<img alt='element' src={${JSON.stringify(component.src)}} className='element-center' style={${JSON.stringify(copyOfStyle)}}/>`
        );
    case componentTypes.RoutingLink:
        return (
            `<Link to='${component.to}' className='element-center' style={${JSON.stringify(copyOfStyle)}}>${component.innerText}</Link>`
        );
    case componentTypes.Container:
    case componentTypes.NavigationBar:
        return (
            `<div className='element-center' style={${JSON.stringify(copyOfStyle)}}>
${component.children.map((c) => getElement(c)).join('\n')}
</div>`
        );
    default:
        return (
            `<div className='element-center' style={${JSON.stringify(copyOfStyle)}}>${component.innerText}</div>`
        );
    }
};

const elementGenerator = {
    generateElements(elements) {
        let result = '';
        elements.forEach((component) => {
            result += getElement(component);
        });

        return result;
    }
};

export default elementGenerator;
