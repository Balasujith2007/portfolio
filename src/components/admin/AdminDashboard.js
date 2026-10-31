import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserEdit, FaTools, FaLaptopCode, FaBriefcase, FaKey,
  FaSignOutAlt, FaTimes, FaPlus, FaTrash, FaEdit, FaSave,
  FaUndo, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash,
  FaStar, FaExternalLinkAlt, FaChartBar, FaShieldAlt
} from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const {
    isAdminOpen, setIsAdminOpen, sessionToken, logout,
    fetchPublicData
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('overview');
  const [adminData, setAdminData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, title }

  // Item currently being edited in modal or sub-panel
  const [editingItem, setEditingItem] = useState(null); // { type: 'project'|'skillCategory'|'experience', item }

  // Security tab state
  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  // Fetch full admin data (including unpublished drafts)
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      const res = await fetch('/api/admin/portfolio', {
        headers,
        credentials: 'include'
      });
      if (res.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
        logout();
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setAdminData(JSON.parse(JSON.stringify(json.data)));
        setOriginalData(JSON.parse(JSON.stringify(json.data)));
      }
    } catch (err) {
      showToast('error', 'Failed to load portfolio management data.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, logout]);

  useEffect(() => {
    if (isAdminOpen) {
      fetchAdminData();
    }
  }, [isAdminOpen, fetchAdminData]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  if (!isAdminOpen) return null;

  // Save changes to backend
  const handleSaveAll = async (updatedData = adminData) => {
    setIsSaving(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
      };
      const res = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });
      if (res.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
        logout();
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save portfolio changes');
      }
      setAdminData(JSON.parse(JSON.stringify(json.data)));
      setOriginalData(JSON.parse(JSON.stringify(json.data)));
      showToast('success', 'Changes saved & published successfully!');
      fetchPublicData();
    } catch (err) {
      showToast('error', err.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Discard changes
  const handleCancel = () => {
    if (originalData) {
      setAdminData(JSON.parse(JSON.stringify(originalData)));
      showToast('success', 'Unsaved edits discarded. Reverted to saved version.');
    }
  };

  // ABOUT SECTION HANDLERS
  const handleAboutChange = (field, value) => {
    setAdminData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  const handleEducationChange = (field, value) => {
    setAdminData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        education: {
          ...prev.about.education,
          [field]: value
        }
      }
    }));
  };

  const handleRolesChange = (text) => {
    const roles = text.split('\n').map(r => r.trim()).filter(Boolean);
    handleAboutChange('roles', roles);
  };

  // STATS COUNTERS
  const handleStatChange = (id, field, value) => {
    const updatedStats = (adminData.about.stats || []).map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    );
    handleAboutChange('stats', updatedStats);
  };

  // SKILLS MANAGEMENT HANDLERS
  const toggleSkillPublish = (categoryId) => {
    const nextSkills = adminData.skills.map(cat => 
      cat.id === categoryId ? { ...cat, published: !cat.published } : cat
    );
    const nextData = { ...adminData, skills: nextSkills };
    setAdminData(nextData);
  };

  const deleteSkillCategory = (categoryId) => {
    const nextSkills = adminData.skills.filter(cat => cat.id !== categoryId);
    setAdminData({ ...adminData, skills: nextSkills });
    setConfirmDelete(null);
    showToast('success', 'Skill category deleted.');
  };

  const saveSkillCategory = (categoryData) => {
    let nextSkills;
    if (categoryData.id) {
      nextSkills = adminData.skills.map(cat => 
        cat.id === categoryData.id ? categoryData : cat
      );
    } else {
      const newCategory = {
        ...categoryData,
        id: `sec-${Date.now()}`,
        displayOrder: adminData.skills.length + 1,
        published: true
      };
      nextSkills = [...adminData.skills, newCategory];
    }
    setAdminData({ ...adminData, skills: nextSkills });
    setEditingItem(null);
    showToast('success', 'Skill category updated.');
  };

  // PROJECTS MANAGEMENT HANDLERS
  const toggleProjectPublish = (projectId) => {
    const nextProjects = adminData.projects.map(p => 
      p.id === projectId ? { ...p, published: !p.published } : p
    );
    setAdminData({ ...adminData, projects: nextProjects });
  };

  const toggleProjectFeatured = (projectId) => {
    const nextProjects = adminData.projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    );
    setAdminData({ ...adminData, projects: nextProjects });
  };

  const deleteProject = (projectId) => {
    const nextProjects = adminData.projects.filter(p => p.id !== projectId);
    setAdminData({ ...adminData, projects: nextProjects });
    setConfirmDelete(null);
    showToast('success', 'Project removed.');
  };

  const saveProject = (projectData) => {
    if (!projectData.title || !projectData.title.trim()) {
      showToast('error', 'Project title is required.');
      return;
    }
    let nextProjects;
    if (projectData.id) {
      nextProjects = adminData.projects.map(p => 
        p.id === projectData.id ? projectData : p
      );
    } else {
      const newProj = {
        ...projectData,
        id: `proj-${Date.now()}`,
        displayOrder: adminData.projects.length + 1,
        published: true,
        featured: false
      };
      nextProjects = [...adminData.projects, newProj];
    }
    setAdminData({ ...adminData, projects: nextProjects });
    setEditingItem(null);
    showToast('success', 'Project updated.');
  };

  // EXPERIENCE MANAGEMENT HANDLERS
  const toggleExpPublish = (expId) => {
    const nextExp = adminData.experience.map(e => 
      e.id === expId ? { ...e, published: !e.published } : e
    );
    setAdminData({ ...adminData, experience: nextExp });
  };

  const deleteExperience = (expId) => {
    const nextExp = adminData.experience.filter(e => e.id !== expId);
    setAdminData({ ...adminData, experience: nextExp });
    setConfirmDelete(null);
    showToast('success', 'Experience entry removed.');
  };

  const saveExperience = (expData) => {
    if (!expData.title || !expData.title.trim()) {
      showToast('error', 'Role/Position title is required.');
      return;
    }
    let nextExp;
    if (expData.id) {
      nextExp = adminData.experience.map(e => 
        e.id === expData.id ? expData : e
      );
    } else {
      const newExp = {
        ...expData,
        id: `exp-${Date.now()}`,
        displayOrder: adminData.experience.length + 1,
        published: true
      };
      nextExp = [...adminData.experience, newExp];
    }
    setAdminData({ ...adminData, experience: nextExp });
    setEditingItem(null);
    showToast('success', 'Experience entry updated.');
  };

  // PIN CHANGE HANDLER
  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (!/^\d{4}$/.test(pinForm.newPin)) {
      setPinError('New PIN must be exactly 4 numeric digits.');
      return;
    }
    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinError('New PIN and confirmation PIN do not match.');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
      };
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ newPin: pinForm.newPin })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to change PIN');
      }
      setPinSuccess('PIN updated successfully. Use your new PIN for future logins.');
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      showToast('success', 'Admin PIN successfully updated!');
    } catch (err) {
      setPinError(err.message || 'Error updating PIN.');
    }
  };

  return (
    <div className="admin-portal-overlay">
      <div className="admin-portal-container">
        {/* TOP NAVIGATION / HEADER */}
        <header className="admin-portal-header">
          <div className="admin-brand">
            <div className="admin-logo">
              <span>{'<'}</span>BS<span>{'/>'}</span>
            </div>
            <div className="admin-title-box">
              <h1>Portfolio Management</h1>
              <p>Manage and update your portfolio content dynamically</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="admin-status-badge">
              <FaShieldAlt /> Authenticated Session
            </div>
            <button 
              className="btn-admin-action save-btn"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              title="Save all changes to server"
            >
              <FaSave /> {isSaving ? 'Saving...' : 'Save & Publish'}
            </button>
            <button 
              className="btn-admin-action cancel-btn"
              onClick={handleCancel}
              title="Discard unsaved edits"
            >
              <FaUndo /> Discard
            </button>
            <button 
              className="btn-admin-action logout-btn"
              onClick={logout}
              title="Log out and end admin session"
            >
              <FaSignOutAlt /> Logout
            </button>
            <button 
              className="btn-admin-close"
              onClick={() => setIsAdminOpen(false)}
              aria-label="Close Admin Portal"
            >
              <FaTimes />
            </button>
          </div>
        </header>

        {/* TOAST ALERTS */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              className={`admin-toast ${toast.type}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DASHBOARD BODY */}
        <div className="admin-portal-body">
          {/* SIDEBAR TABS */}
          <aside className="admin-sidebar">
            <nav className="admin-nav-tabs">
              <button 
                className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaChartBar /> Overview
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <FaUserEdit /> Personal & About
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                <FaTools /> Skills
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FaLaptopCode /> Projects
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                <FaBriefcase /> Experience
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FaKey /> PIN & Security
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="admin-main-panel">
            {isLoading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner"></div>
                <p>Loading your portfolio content...</p>
              </div>
            ) : adminData ? (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="admin-tab-content">
                    <div className="tab-header">
                      <h2>Dashboard Overview</h2>
                      <p>Quick summary of published and draft portfolio items.</p>
                    </div>

                    <div className="overview-stats-grid">
                      <div className="stat-card">
                        <div className="stat-card-icon projects-icon"><FaLaptopCode /></div>
                        <div className="stat-card-details">
                          <span className="stat-card-count">{adminData.projects?.length || 0}</span>
                          <span className="stat-card-label">Total Projects</span>
                          <span className="stat-card-sub">
                            {adminData.projects?.filter(p => p.published).length || 0} Published
                          </span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-card-icon skills-icon"><FaTools /></div>
                        <div className="stat-card-details">
                          <span className="stat-card-count">{adminData.skills?.length || 0}</span>
                          <span className="stat-card-label">Skill Categories</span>
                          <span className="stat-card-sub">
                            {adminData.skills?.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0)} Technologies
                          </span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-card-icon exp-icon"><FaBriefcase /></div>
                        <div className="stat-card-details">
                          <span className="stat-card-count">{adminData.experience?.length || 0}</span>
                          <span className="stat-card-label">Experience Entries</span>
                          <span className="stat-card-sub">
                            {adminData.experience?.filter(e => e.published).length || 0} Published
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="overview-quick-links">
                      <h3>Quick Navigation</h3>
                      <div className="quick-btn-group">
                        <button onClick={() => setActiveTab('about')} className="quick-action-btn">
                          <FaUserEdit /> Edit Bio & Contact Info
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('projects');
                            setEditingItem({
                              type: 'project',
                              item: {
                                title: '',
                                description: '',
                                category: 'Web Application',
                                tech: [],
                                github: '',
                                demoUrl: '',
                                featured: false,
                                published: true
                              }
                            });
                          }} 
                          className="quick-action-btn"
                        >
                          <FaPlus /> Add New Project
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('skills');
                            setEditingItem({
                              type: 'skillCategory',
                              item: {
                                title: '',
                                icon: '🛠',
                                category: '',
                                skills: [],
                                published: true
                              }
                            });
                          }} 
                          className="quick-action-btn"
                        >
                          <FaPlus /> Add Skill Category
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('experience');
                            setEditingItem({
                              type: 'experience',
                              item: {
                                title: '',
                                company: '',
                                type: 'Full-time',
                                duration: '',
                                currentlyWorking: false,
                                responsibilities: [],
                                published: true
                              }
                            });
                          }} 
                          className="quick-action-btn"
                        >
                          <FaPlus /> Add Experience Entry
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT & PERSONAL TAB */}
                {activeTab === 'about' && (
                  <div className="admin-tab-content">
                    <div className="tab-header">
                      <h2>Personal & About Information</h2>
                      <p>Update your personal introduction, roles, bio, and contact channels.</p>
                    </div>

                    <div className="admin-form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={adminData.about?.name || ''}
                          onChange={(e) => handleAboutChange('name', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Welcome Tagline</label>
                        <input
                          type="text"
                          value={adminData.about?.welcomeTag || ''}
                          onChange={(e) => handleAboutChange('welcomeTag', e.target.value)}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Dynamic Typing Roles (one per line)</label>
                        <textarea
                          rows={4}
                          value={(adminData.about?.roles || []).join('\n')}
                          onChange={(e) => handleRolesChange(e.target.value)}
                          placeholder="e.g. AI & Data Science Engineer&#10;Full Stack Developer"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Hero Description</label>
                        <textarea
                          rows={4}
                          value={adminData.about?.heroDescription || ''}
                          onChange={(e) => handleAboutChange('heroDescription', e.target.value)}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Objectives Lead Paragraph (About section)</label>
                        <textarea
                          rows={3}
                          value={adminData.about?.objectivesLead || ''}
                          onChange={(e) => handleAboutChange('objectivesLead', e.target.value)}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Objectives Secondary Paragraph</label>
                        <textarea
                          rows={2}
                          value={adminData.about?.objectivesSecondary || ''}
                          onChange={(e) => handleAboutChange('objectivesSecondary', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={adminData.about?.location || ''}
                          onChange={(e) => handleAboutChange('location', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={adminData.about?.email || ''}
                          onChange={(e) => handleAboutChange('email', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          value={adminData.about?.phone || ''}
                          onChange={(e) => handleAboutChange('phone', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Resume File URL / Path</label>
                        <input
                          type="text"
                          value={adminData.about?.resumeUrl || ''}
                          onChange={(e) => handleAboutChange('resumeUrl', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>GitHub Profile URL</label>
                        <input
                          type="url"
                          value={adminData.about?.github || ''}
                          onChange={(e) => handleAboutChange('github', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={adminData.about?.linkedin || ''}
                          onChange={(e) => handleAboutChange('linkedin', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="admin-subheading">
                      <h3>Education Details</h3>
                    </div>
                    <div className="admin-form-grid">
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          value={adminData.about?.education?.degree || ''}
                          onChange={(e) => handleEducationChange('degree', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Institution</label>
                        <input
                          type="text"
                          value={adminData.about?.education?.institution || ''}
                          onChange={(e) => handleEducationChange('institution', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>CGPA</label>
                        <input
                          type="text"
                          value={adminData.about?.education?.cgpa || ''}
                          onChange={(e) => handleEducationChange('cgpa', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Expected Completion</label>
                        <input
                          type="text"
                          value={adminData.about?.education?.expected || ''}
                          onChange={(e) => handleEducationChange('expected', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="admin-subheading">
                      <h3>Stats Counters</h3>
                    </div>
                    <div className="stats-edit-grid">
                      {(adminData.about?.stats || []).map((stat) => (
                        <div key={stat.id} className="stat-edit-item">
                          <input
                            type="text"
                            className="stat-val-input"
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                            placeholder="Value (e.g. 1000+)"
                          />
                          <input
                            type="text"
                            className="stat-lbl-input"
                            value={stat.label}
                            onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                            placeholder="Label (e.g. Problems Solved)"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="admin-action-bar">
                      <button className="btn-admin-action save-btn" onClick={() => handleSaveAll()}>
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SKILLS TAB */}
                {activeTab === 'skills' && (
                  <div className="admin-tab-content">
                    <div className="tab-header flex-between">
                      <div>
                        <h2>Skills Management</h2>
                        <p>Manage skill categories, technical chips, and visibility.</p>
                      </div>
                      <button 
                        className="btn-admin-action add-btn"
                        onClick={() => setEditingItem({
                          type: 'skillCategory',
                          item: {
                            title: '',
                            icon: '⚡',
                            category: 'Technologies',
                            skills: [],
                            published: true
                          }
                        })}
                      >
                        <FaPlus /> Add Category
                      </button>
                    </div>

                    <div className="admin-cards-list">
                      {(adminData.skills || []).map((cat) => (
                        <div key={cat.id} className={`admin-item-card ${!cat.published ? 'draft' : ''}`}>
                          <div className="card-top-row">
                            <div className="card-title-group">
                              <span className="category-icon-badge">{cat.icon}</span>
                              <div>
                                <h4>{cat.title}</h4>
                                <span className="category-sub">{cat.category}</span>
                              </div>
                            </div>
                            <div className="card-controls">
                              <button 
                                className={`control-btn ${cat.published ? 'published' : 'unpublished'}`}
                                onClick={() => toggleSkillPublish(cat.id)}
                                title={cat.published ? 'Published (Click to hide)' : 'Draft (Click to publish)'}
                              >
                                {cat.published ? <FaEye /> : <FaEyeSlash />}
                                <span>{cat.published ? 'Live' : 'Hidden'}</span>
                              </button>
                              <button 
                                className="control-btn edit"
                                onClick={() => setEditingItem({ type: 'skillCategory', item: { ...cat } })}
                                title="Edit category"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="control-btn delete"
                                onClick={() => setConfirmDelete({ type: 'skillCategory', id: cat.id, title: cat.title })}
                                title="Delete category"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          <div className="skill-chips-preview">
                            {(cat.skills || []).map((skill, idx) => (
                              <span key={idx} className="admin-skill-chip">{skill}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="admin-action-bar">
                      <button className="btn-admin-action save-btn" onClick={() => handleSaveAll()}>
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="admin-tab-content">
                    <div className="tab-header flex-between">
                      <div>
                        <h2>Projects Management</h2>
                        <p>Add, edit, feature, or publish projects on your portfolio.</p>
                      </div>
                      <button 
                        className="btn-admin-action add-btn"
                        onClick={() => setEditingItem({
                          type: 'project',
                          item: {
                            title: '',
                            description: '',
                            category: 'Web Application',
                            tech: [],
                            github: '',
                            demoUrl: '',
                            featured: false,
                            published: true
                          }
                        })}
                      >
                        <FaPlus /> Add New Project
                      </button>
                    </div>

                    <div className="admin-cards-list">
                      {(adminData.projects || []).map((project, index) => (
                        <div key={project.id} className={`admin-item-card ${!project.published ? 'draft' : ''}`}>
                          <div className="card-top-row">
                            <div>
                              <span className="item-order-badge">#{index + 1}</span>
                              <span className="category-pill">{project.category}</span>
                              <h4 className="project-card-title">{project.title}</h4>
                            </div>
                            <div className="card-controls">
                              <button 
                                className={`control-btn ${project.featured ? 'featured' : ''}`}
                                onClick={() => toggleProjectFeatured(project.id)}
                                title="Toggle Featured badge"
                              >
                                <FaStar />
                                <span>{project.featured ? 'Featured' : 'Standard'}</span>
                              </button>
                              <button 
                                className={`control-btn ${project.published ? 'published' : 'unpublished'}`}
                                onClick={() => toggleProjectPublish(project.id)}
                                title={project.published ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                              >
                                {project.published ? <FaEye /> : <FaEyeSlash />}
                                <span>{project.published ? 'Live' : 'Draft'}</span>
                              </button>
                              <button 
                                className="control-btn edit"
                                onClick={() => setEditingItem({ type: 'project', item: { ...project } })}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="control-btn delete"
                                onClick={() => setConfirmDelete({ type: 'project', id: project.id, title: project.title })}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          <p className="project-desc-preview">{project.description}</p>

                          <div className="project-meta-row">
                            <div className="tech-chips-row">
                              {(project.tech || []).map((t, idx) => (
                                <span key={idx} className="admin-tech-chip">{t}</span>
                              ))}
                            </div>
                            <div className="project-links-row">
                              {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="link-chip">
                                  GitHub <FaExternalLinkAlt />
                                </a>
                              )}
                              {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="link-chip">
                                  Demo <FaExternalLinkAlt />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="admin-action-bar">
                      <button className="btn-admin-action save-btn" onClick={() => handleSaveAll()}>
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. EXPERIENCE TAB */}
                {activeTab === 'experience' && (
                  <div className="admin-tab-content">
                    <div className="tab-header flex-between">
                      <div>
                        <h2>Experience Management</h2>
                        <p>Manage internships, freelance work, and employment history.</p>
                      </div>
                      <button 
                        className="btn-admin-action add-btn"
                        onClick={() => setEditingItem({
                          type: 'experience',
                          item: {
                            title: '',
                            company: '',
                            duration: '',
                            type: 'Internship',
                            currentlyWorking: false,
                            responsibilities: [],
                            published: true
                          }
                        })}
                      >
                        <FaPlus /> Add Experience
                      </button>
                    </div>

                    <div className="admin-cards-list">
                      {(adminData.experience || []).map((exp, index) => (
                        <div key={exp.id} className={`admin-item-card ${!exp.published ? 'draft' : ''}`}>
                          <div className="card-top-row">
                            <div>
                              <span className="item-order-badge">#{index + 1}</span>
                              <span className="category-pill">{exp.type}</span>
                              <h4 className="project-card-title">{exp.title}</h4>
                              <p className="exp-company-sub">
                                {exp.company ? `${exp.company} • ` : ''}{exp.duration}
                              </p>
                            </div>
                            <div className="card-controls">
                              <button 
                                className={`control-btn ${exp.published ? 'published' : 'unpublished'}`}
                                onClick={() => toggleExpPublish(exp.id)}
                              >
                                {exp.published ? <FaEye /> : <FaEyeSlash />}
                                <span>{exp.published ? 'Live' : 'Draft'}</span>
                              </button>
                              <button 
                                className="control-btn edit"
                                onClick={() => setEditingItem({ type: 'experience', item: { ...exp } })}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="control-btn delete"
                                onClick={() => setConfirmDelete({ type: 'experience', id: exp.id, title: exp.title })}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          <ul className="exp-resp-list">
                            {(exp.responsibilities || []).map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="admin-action-bar">
                      <button className="btn-admin-action save-btn" onClick={() => handleSaveAll()}>
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. PIN & SECURITY TAB */}
                {activeTab === 'security' && (
                  <div className="admin-tab-content">
                    <div className="tab-header">
                      <h2>Admin PIN & Security Settings</h2>
                      <p>Update your 4-digit administrator passcode for portfolio access.</p>
                    </div>

                    <div className="security-form-card">
                      <form onSubmit={handleChangePin} className="pin-change-form">
                        <div className="form-group">
                          <label>New 4-Digit PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={pinForm.newPin}
                            onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, '') })}
                            placeholder="Enter 4 digits"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Confirm New 4-Digit PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={pinForm.confirmPin}
                            onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, '') })}
                            placeholder="Re-enter 4 digits"
                            required
                          />
                        </div>

                        {pinError && (
                          <div className="pin-error-alert">{pinError}</div>
                        )}
                        {pinSuccess && (
                          <div className="pin-success-alert">{pinSuccess}</div>
                        )}

                        <button type="submit" className="btn-admin-action save-btn">
                          <FaKey /> Update Administrator PIN
                        </button>
                      </form>

                      <div className="security-notes">
                        <h4>Security Notice</h4>
                        <ul>
                          <li>The PIN is securely hashed using PBKDF2 with a cryptographic salt on the server.</li>
                          <li>Brute force protection locks access after 5 consecutive failed attempts.</li>
                          <li>Admin session tokens are kept in memory only and expire after inactivity.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </main>
        </div>
      </div>

      {/* MODAL: EDIT/ADD ITEM */}
      {editingItem && (
        <div className="admin-submodal-overlay" onClick={() => setEditingItem(null)}>
          <div className="admin-submodal-card" onClick={(e) => e.stopPropagation()}>
            <div className="submodal-header">
              <h3>
                {editingItem.item.id ? 'Edit' : 'Add'}{' '}
                {editingItem.type === 'project' && 'Project'}
                {editingItem.type === 'skillCategory' && 'Skill Category'}
                {editingItem.type === 'experience' && 'Experience'}
              </h3>
              <button className="submodal-close" onClick={() => setEditingItem(null)}>
                <FaTimes />
              </button>
            </div>

            {/* PROJECT FORM */}
            {editingItem.type === 'project' && (
              <ProjectForm 
                project={editingItem.item} 
                onSave={saveProject} 
                onCancel={() => setEditingItem(null)} 
              />
            )}

            {/* SKILL CATEGORY FORM */}
            {editingItem.type === 'skillCategory' && (
              <SkillCategoryForm 
                category={editingItem.item} 
                onSave={saveSkillCategory} 
                onCancel={() => setEditingItem(null)} 
              />
            )}

            {/* EXPERIENCE FORM */}
            {editingItem.type === 'experience' && (
              <ExperienceForm 
                experience={editingItem.item} 
                onSave={saveExperience} 
                onCancel={() => setEditingItem(null)} 
              />
            )}
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="admin-submodal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-submodal-card delete-confirm" onClick={(e) => e.stopPropagation()}>
            <FaExclamationTriangle className="delete-warn-icon" />
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to permanently delete <strong>"{confirmDelete.title}"</strong>?
            </p>
            <div className="submodal-actions">
              <button 
                className="btn-admin-action cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-admin-action delete-btn"
                onClick={() => {
                  if (confirmDelete.type === 'project') deleteProject(confirmDelete.id);
                  if (confirmDelete.type === 'skillCategory') deleteSkillCategory(confirmDelete.id);
                  if (confirmDelete.type === 'experience') deleteExperience(confirmDelete.id);
                }}
              >
                <FaTrash /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PROJECT FORM COMPONENT
const ProjectForm = ({ project, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: project.title || '',
    category: project.category || 'Web Application',
    description: project.description || '',
    detailedDescription: project.detailedDescription || project.description || '',
    techText: (project.tech || []).join(', '),
    github: project.github || '',
    demoUrl: project.demoUrl || '',
    featured: Boolean(project.featured),
    published: project.published !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = form.techText.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      ...project,
      title: form.title,
      category: form.category,
      description: form.description,
      detailedDescription: form.detailedDescription,
      tech: techArray,
      github: form.github,
      demoUrl: form.demoUrl,
      featured: form.featured,
      published: form.published
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-sub">
      <div className="form-group">
        <label>Project Title *</label>
        <input 
          type="text" 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <input 
          type="text" 
          value={form.category} 
          onChange={(e) => setForm({ ...form, category: e.target.value })} 
          placeholder="e.g. Machine Learning, Web Application"
        />
      </div>

      <div className="form-group full-width">
        <label>Description</label>
        <textarea 
          rows={3} 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
          required
        />
      </div>

      <div className="form-group full-width">
        <label>Technologies / Key Features (comma separated)</label>
        <input 
          type="text" 
          value={form.techText} 
          onChange={(e) => setForm({ ...form, techText: e.target.value })} 
          placeholder="e.g. React, Node.js, TensorFlow, Responsive UI"
        />
      </div>

      <div className="form-group">
        <label>GitHub Repository URL</label>
        <input 
          type="url" 
          value={form.github} 
          onChange={(e) => setForm({ ...form, github: e.target.value })} 
          placeholder="https://github.com/..."
        />
      </div>

      <div className="form-group">
        <label>Live Demo URL (Optional)</label>
        <input 
          type="url" 
          value={form.demoUrl} 
          onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} 
          placeholder="https://..."
        />
      </div>

      <div className="form-checkboxes full-width">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={form.featured} 
            onChange={(e) => setForm({ ...form, featured: e.target.checked })} 
          />
          Featured Project
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={form.published} 
            onChange={(e) => setForm({ ...form, published: e.target.checked })} 
          />
          Published (Visible publicly)
        </label>
      </div>

      <div className="submodal-actions">
        <button type="button" className="btn-admin-action cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-admin-action save-btn">
          Save Project
        </button>
      </div>
    </form>
  );
};

// SKILL CATEGORY FORM COMPONENT
const SkillCategoryForm = ({ category, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: category.title || '',
    icon: category.icon || '🛠',
    category: category.category || 'General',
    skillsText: (category.skills || []).join(', '),
    published: category.published !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = form.skillsText.split(',').map(s => s.trim()).filter(Boolean);
    onSave({
      ...category,
      title: form.title,
      icon: form.icon,
      category: form.category,
      skills: skillsArray,
      published: form.published
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-sub">
      <div className="form-group">
        <label>Section Title *</label>
        <input 
          type="text" 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          placeholder="e.g. Programming, Web, Database"
          required 
        />
      </div>

      <div className="form-group">
        <label>Icon / Symbol</label>
        <input 
          type="text" 
          value={form.icon} 
          onChange={(e) => setForm({ ...form, icon: e.target.value })} 
          placeholder="e.g. { }, < />, ⚡, 🛠"
        />
      </div>

      <div className="form-group full-width">
        <label>Category Label</label>
        <input 
          type="text" 
          value={form.category} 
          onChange={(e) => setForm({ ...form, category: e.target.value })} 
          placeholder="e.g. Programming Languages"
        />
      </div>

      <div className="form-group full-width">
        <label>Skills / Technologies (comma separated) *</label>
        <textarea 
          rows={3}
          value={form.skillsText} 
          onChange={(e) => setForm({ ...form, skillsText: e.target.value })} 
          placeholder="e.g. Python, Java, C++, C"
          required
        />
      </div>

      <div className="form-checkboxes full-width">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={form.published} 
            onChange={(e) => setForm({ ...form, published: e.target.checked })} 
          />
          Published (Visible publicly)
        </label>
      </div>

      <div className="submodal-actions">
        <button type="button" className="btn-admin-action cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-admin-action save-btn">
          Save Category
        </button>
      </div>
    </form>
  );
};

// EXPERIENCE FORM COMPONENT
const ExperienceForm = ({ experience, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: experience.title || '',
    company: experience.company || '',
    duration: experience.duration || '',
    type: experience.type || 'Full-time',
    currentlyWorking: Boolean(experience.currentlyWorking),
    responsibilitiesText: (experience.responsibilities || []).join('\n'),
    published: experience.published !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const respArray = form.responsibilitiesText.split('\n').map(r => r.trim()).filter(Boolean);
    onSave({
      ...experience,
      title: form.title,
      company: form.company,
      duration: form.duration,
      type: form.type,
      currentlyWorking: form.currentlyWorking,
      responsibilities: respArray,
      published: form.published
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-sub">
      <div className="form-group">
        <label>Role / Position Title *</label>
        <input 
          type="text" 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          placeholder="e.g. Software Development Intern"
          required 
        />
      </div>

      <div className="form-group">
        <label>Company / Organization</label>
        <input 
          type="text" 
          value={form.company} 
          onChange={(e) => setForm({ ...form, company: e.target.value })} 
          placeholder="e.g. Arumexa"
        />
      </div>

      <div className="form-group">
        <label>Duration / Dates</label>
        <input 
          type="text" 
          value={form.duration} 
          onChange={(e) => setForm({ ...form, duration: e.target.value })} 
          placeholder="e.g. 2–3 Months or May 2024 - Aug 2024"
        />
      </div>

      <div className="form-group">
        <label>Employment Type</label>
        <select 
          value={form.type} 
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div className="form-group full-width">
        <label>Key Responsibilities & Achievements (one per line)</label>
        <textarea 
          rows={5}
          value={form.responsibilitiesText} 
          onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })} 
          placeholder="Developed and optimized applications...&#10;Focused on problem-solving..."
        />
      </div>

      <div className="form-checkboxes full-width">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={form.currentlyWorking} 
            onChange={(e) => setForm({ ...form, currentlyWorking: e.target.checked })} 
          />
          Currently working in this role
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={form.published} 
            onChange={(e) => setForm({ ...form, published: e.target.checked })} 
          />
          Published (Visible publicly)
        </label>
      </div>

      <div className="submodal-actions">
        <button type="button" className="btn-admin-action cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-admin-action save-btn">
          Save Experience
        </button>
      </div>
    </form>
  );
};

export default AdminDashboard;
