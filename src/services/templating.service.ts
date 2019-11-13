import elementGenerator from './elementGenerator.service';

const templatingService = {
    getAllTemplates: (name, pages, imageUrl) => {
        const templates = [
            {
                filePath: 'src/index.js',
                template:
`import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`
            },
            {
                filePath: 'src/App.js',
                template:
`import React from 'react';
import MainComponent from './components/MainComponent.jsx';

function App() {
    return (
        <MainComponent/>
    );
}

export default App;
`
            },
            {
                filePath: 'package.json',
                template:
`{
    "name": "simplest",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "react": "^16.8.6",
        "react-dom": "^16.8.6",
        "react-scripts": "3.0.1",
        "react-router-dom": "^5.0.1"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": "react-app"
    },
    "browserslist": {
        "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
        ],
        "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
        ]
    }
}
`
            },
            {
                filePath: 'public/index.html',
                template:
`<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="${imageUrl}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>${name}</title>
    </head>
    <body style='margin: 0px;'>
    <div id="root"></div>
    </body>
</html>`
            },
            {
                filePath: './src/components/main.css',
                template:
`.element-center {
    text-align: center;
    width: '100%';
}
`
            },
            {
                filePath: './src/components/MainComponent.jsx',
                template:
`import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
${pages.map(page => (
        `import ${page.name} from './${page.name}';`
    )).join('\n')}
import './main.css';

class MainComponent extends Component {
state = {  }
render() { 
    return (
        <Router>
            ${pages.map(page => (
        `<Route exact path='${page.route}' component={${page.name}} />`
    )).join('\n           ')}
        </Router>
    );
}
}

export default MainComponent;
`
            }
        ];

        pages.forEach(page => {
            templates.push(
                {
                    filePath: `./src/components/${page.name}.jsx`,
                    template:
`import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

class ${page.name} extends Component {
    state = {  }
    render() {
        return (
            <div style={${JSON.stringify(page.elements.find((e) => e.name === 'Body').style)}}>
${elementGenerator.generateElements(page.elements)}
            </div>
        );
    }
}

export default ${page.name};
`
                });
        });

        return templates;
    }
};

export default templatingService;
