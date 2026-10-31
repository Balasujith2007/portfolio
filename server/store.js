const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');
const BACKUP_FILE = path.join(DATA_DIR, 'portfolio.backup.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('Data file not found');
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err);
    if (fs.existsSync(BACKUP_FILE)) {
      try {
        const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf8');
        return JSON.parse(backupRaw);
      } catch (backupErr) {
        console.error('Error reading backup file:', backupErr);
      }
    }
    return {
      about: {},
      skills: [],
      projects: [],
      experience: []
    };
  }
}

function writeData(data) {
  const tmpFile = `${DATA_FILE}.tmp.${Date.now()}`;
  try {
    const serialized = JSON.stringify(data, null, 2);
    // Write to temporary file first
    fs.writeFileSync(tmpFile, serialized, 'utf8');

    // Create a backup of existing file before replacing
    if (fs.existsSync(DATA_FILE)) {
      try {
        fs.copyFileSync(DATA_FILE, BACKUP_FILE);
      } catch (backupErr) {
        console.warn('Could not create backup:', backupErr.message);
      }
    }

    // Atomic rename
    fs.renameSync(tmpFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('Error saving data atomically:', err);
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch (e) {}
    }
    throw new Error('Failed to persist portfolio data');
  }
}

// Public view: filters out unpublished items and sorts by displayOrder
function getPublicPortfolio() {
  const data = readData();

  const publicSkills = (data.skills || [])
    .filter(sec => sec.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map(sec => ({
      ...sec,
      skills: Array.isArray(sec.skills) ? sec.skills : []
    }));

  const publicProjects = (data.projects || [])
    .filter(proj => proj.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const publicExperience = (data.experience || [])
    .filter(exp => exp.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return {
    about: data.about || {},
    skills: publicSkills,
    projects: publicProjects,
    experience: publicExperience,
    accomplishments: data.accomplishments || [],
    certifications: data.certifications || []
  };
}

// Admin view: returns everything including draft/unpublished items
function getAdminPortfolio() {
  return readData();
}

function updateAbout(aboutData) {
  const data = readData();
  data.about = {
    ...data.about,
    ...aboutData
  };
  writeData(data);
  return data.about;
}

function updateSkills(skillsList) {
  if (!Array.isArray(skillsList)) {
    throw new Error('Skills must be an array');
  }
  const data = readData();
  data.skills = skillsList.map((item, index) => ({
    id: item.id || `sec-${Date.now()}-${index}`,
    title: String(item.title || 'Untitled Section').trim(),
    icon: String(item.icon || '🛠').trim(),
    category: String(item.category || 'General').trim(),
    published: item.published !== false,
    displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index + 1,
    skills: Array.isArray(item.skills)
      ? item.skills.map(s => String(s).trim()).filter(Boolean)
      : []
  }));
  writeData(data);
  return data.skills;
}

function updateProjects(projectsList) {
  if (!Array.isArray(projectsList)) {
    throw new Error('Projects must be an array');
  }
  const data = readData();
  data.projects = projectsList.map((item, index) => {
    if (!item.title || !String(item.title).trim()) {
      throw new Error(`Project at position ${index + 1} requires a title`);
    }
    return {
      id: item.id || `proj-${Date.now()}-${index}`,
      title: String(item.title).trim(),
      description: String(item.description || '').trim(),
      detailedDescription: String(item.detailedDescription || item.description || '').trim(),
      category: String(item.category || 'Web Application').trim(),
      tech: Array.isArray(item.tech) 
        ? item.tech.map(t => String(t).trim()).filter(Boolean)
        : (typeof item.tech === 'string' ? item.tech.split(',').map(t => t.trim()).filter(Boolean) : []),
      github: String(item.github || '').trim(),
      demoUrl: String(item.demoUrl || '').trim(),
      imageUrl: String(item.imageUrl || '').trim(),
      featured: Boolean(item.featured),
      published: item.published !== false,
      displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index + 1
    };
  });
  writeData(data);
  return data.projects;
}

function updateExperience(experienceList) {
  if (!Array.isArray(experienceList)) {
    throw new Error('Experience must be an array');
  }
  const data = readData();
  data.experience = experienceList.map((item, index) => {
    if (!item.title || !String(item.title).trim()) {
      throw new Error(`Experience entry at position ${index + 1} requires a title/role`);
    }
    return {
      id: item.id || `exp-${Date.now()}-${index}`,
      title: String(item.title).trim(),
      company: String(item.company || '').trim(),
      duration: String(item.duration || '').trim(),
      type: String(item.type || 'Full-time').trim(),
      startDate: String(item.startDate || '').trim(),
      endDate: String(item.endDate || '').trim(),
      currentlyWorking: Boolean(item.currentlyWorking),
      published: item.published !== false,
      displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index + 1,
      responsibilities: Array.isArray(item.responsibilities)
        ? item.responsibilities.map(r => String(r).trim()).filter(Boolean)
        : (typeof item.responsibilities === 'string' ? item.responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : [])
    };
  });
  writeData(data);
  return data.experience;
}

function updateAll(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid portfolio payload');
  }
  const current = readData();
  const nextData = {
    about: payload.about ? { ...current.about, ...payload.about } : current.about,
    skills: payload.skills ? payload.skills : current.skills,
    projects: payload.projects ? payload.projects : current.projects,
    experience: payload.experience ? payload.experience : current.experience,
    accomplishments: payload.accomplishments ? payload.accomplishments : current.accomplishments,
    certifications: payload.certifications ? payload.certifications : current.certifications
  };
  writeData(nextData);
  return nextData;
}

module.exports = {
  readData,
  writeData,
  getPublicPortfolio,
  getAdminPortfolio,
  updateAbout,
  updateSkills,
  updateProjects,
  updateExperience,
  updateAll
};
