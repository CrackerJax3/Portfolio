// Custom deploy script — avoids gh-pages ENAMETOOLONG on Windows.
// Pushes dist/ to the gh-pages branch using git directly.
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const dist = resolve('dist');
if (!existsSync(dist)) {
    console.error('dist/ not found — run npm run build first');
    process.exit(1);
}

const run = (cmd, opts = {}) => {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: dist, ...opts });
};

// Get the remote URL from the current repo
const remote = execSync('git remote get-url origin', { cwd: resolve('.') }).toString().trim();
console.log(`Remote: ${remote}`);

run('git init -b gh-pages');
run('git add -A');
run('git commit -m "deploy"');
run(`git push --force "${remote}" gh-pages`);

console.log('\nDeployed to gh-pages branch.');
