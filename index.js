const fs = require('fs');
const path = require('path');
const recast = require('recast');

// Función para eliminar comentarios de un archivo JavaScript o JSX
function removeCommentsFromJSFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = recast.parse(code);

    recast.types.visit(ast, {
        visitComment(path) {
            path.prune();
            return false;
        }
    });

    const output = recast.print(ast).code;
    fs.writeFileSync(filePath, output, 'utf-8');
}

// Función para eliminar comentarios de un archivo SQL
function removeCommentsFromSQLFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    // Expresión regular para eliminar comentarios SQL
    const uncommentedCode = code.replace(/--.*$|\/\*[\s\S]*?\*\//mg, '');
    fs.writeFileSync(filePath, uncommentedCode, 'utf-8');
}

// Función para recorrer un directorio y procesar archivos .js, .jsx y .sql
function processDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            removeCommentsFromJSFile(fullPath);
        } else if (fullPath.endsWith('.sql')) {
            removeCommentsFromSQLFile(fullPath);
        }
    });
}

// Ruta del directorio del proyecto
const projectDirectory = path.resolve(__dirname, 'Data');
// const projectDirectory = path.resolve(__dirname, '/Data');

// Procesar el directorio
processDirectory(projectDirectory);

console.log('Comentarios eliminados de todos los archivos .js, .jsx y .sql');