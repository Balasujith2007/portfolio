const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /Balasujith S/g, to: 'Balasujith S' },
    { from: /Balasujith/g, to: 'Balasujith' },
    { from: /kit28\.24bad049@gmail\.com/g, to: 'kit28.24bad026@gmail.com' },
    { from: /kit28\.24bad026@gmail\.com/g, to: 'kit28.24bad026@gmail.com' },
    { from: /\+917358095641/g, to: '+917358095641' },
    { from: /\+91 7358095641/g, to: '+91 7358095641' },
    { from: /BalasujithGowri-11/g, to: 'Balasujith2007' },
    { from: /bala-sujith-91a241335/g, to: 'bala-sujith-91a241335' },
    { from: /gowtham-m-0a8335377\//g, to: 'bala-sujith-91a241335/' },
    { from: /Balasujith_Resume\.pdf/g, to: 'Balasujith_Resume.pdf' },
    { from: /Balasujith-Resume\.pdf/g, to: 'Balasujith_Resume.pdf' },
    { from: /profile\.png/g, to: 'profile.jpeg' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.git' || file === 'build') return;
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    replacements.forEach(r => {
        if (content.match(r.from)) {
            content = content.replace(r.from, r.to);
            changed = true;
        }
    });
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
