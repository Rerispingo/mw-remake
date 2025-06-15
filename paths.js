const path = await import('path');
const projectPath = path.resolve();

export function finalPath (relativePath) {
    return path.join(projectPath, relativePath);
}