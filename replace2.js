const fs = require('fs');

const replacements = [
    { from: /sathishsudha20060831@gmail\.com/g, to: 'kit28.24bad026@gmail.com' },
    { from: /<h3>AI &amp; Data Science Graduate<\/h3>\s*<p>Analytical B\.Tech student in AI and Data Science with strong foundations in data structures, algorithms, C, C\+\+, and Python\. Skilled in web development, scripting, and competitive programming\.<\/p>\s*<p>Passionate about machine learning, data analysis, and building impactful full-stack applications that solve real-world problems\.<\/p>/g, to: '<h3>Objectives</h3>\n                    <p>Detail-oriented B.Tech graduate specializing in AI and Data Science with expertise in Python, C, C++, data structures, web development, and machine learning. Seeking opportunities to apply analytical and technical skills in building efficient and data-driven solutions.</p>' },
    { from: /<p>KIT - Kalaignar Karunanidhi Institute of Technology, Coimbatore<\/p>\s*<p>CGPA: 8\.45 &nbsp;·&nbsp; Expected Graduation: January 2028<\/p>/g, to: '<p>KIT - KalaignarKarunanidhi Institute of Technology, Coimbatore</p>\n                        <p>CGPA: 8.45</p>\n                        <p>Expected in 01/2028</p>' },
    { from: /<h3>Hackathon Participant<\/h3>\s*<span class="timeline-date"><i class="fas fa-calendar-alt"><\/i> Inter-college & KIT<\/span>\s*<ul>\s*<li>Completed first hackathon at inter-college \(24 hrs\) and secured Top 10 place<\/li>\s*<li>Completed 2nd hackathon at KIT \(36 hrs\) with teammates<\/li>\s*<\/ul>/g, to: '<h3>Hackathon:</h3>\n                        <ul>\n                            <li>I had completed my first hackathon at inter-college 24 hrs ,then I secured top 10 place,</li>\n                            <li>I had completed 2nd hackathon at kit 36 hrs with our teamates</li>\n                        </ul>' },
    { from: /<h3>Intern<\/h3>\s*<span class="timeline-date"><i class="fas fa-calendar-alt"><\/i> Internship<\/span>\s*<ul>\s*<li>Worked as an intern, contributing to development tasks\.<\/li>\s*<\/ul>/g, to: '<h3>As an Intern :</h3>' },
    { from: /<p class="tech-stack">Next\.js · MERN Stack · Cloud Services<\/p>/g, to: '<p class="tech-stack">Next.js / MERN Stack / Cloud Services</p>' },
    { from: /<p class="tech-stack">Python · Machine Learning · Data Analysis<\/p>\s*<p>Developed a system to analyze smartphone usage patterns and detect signs of excessive usage behavior\.<\/p>/g, to: '<p class="tech-stack">Python / Machine Learning / Data Analysis</p>\n                        <p>Developed a system to analyze smartphone usage patterns and detect signs of excessive usage behavior</p>' },
    { from: /<p class="tech-stack">Python · Data Structures · Algorithms<\/p>/g, to: '<p class="tech-stack">Python / Data Structures / Algorithms</p>' },
    { from: /<p class="tech-stack">MERN Stack · React · Node\.js<\/p>/g, to: '<p class="tech-stack">MERN Stack / React / Node.js</p>' }
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
        console.log('Updated in: ' + file);
    }
});
