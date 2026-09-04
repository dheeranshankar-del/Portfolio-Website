import React, { useState } from 'react';
import StarfieldCanvas from './components/StarfieldCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import InfoSection from './components/InfoSection';
import MissionControlModal from './components/MissionControlModal';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [aboutGlitchTrigger, setAboutGlitchTrigger] = useState(1);

  const handleOpenProjectModal = (project) => {
    if (project.hasMissionControl || project.isSpecial) {
      setIsMissionControlOpen(true);
    } else {
      setSelectedProject(project);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'about') {
      setAboutGlitchTrigger((trigger) => trigger + 1);
    }
    const targetEl = document.getElementById(`${tabId}-section`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Deep Space Starfield Canvas */}
      <StarfieldCanvas />

      {/* Floating Centered Segmented Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Assembly */}
      <main className="relative z-10 w-full mx-auto pb-24">
        
        {/* Full 100vh Hero Section */}
        <HeroSection 
          onExploreProjects={() => handleTabChange('projects')} 
        />

        {/* Projects Section with 56px Padding Top */}
        <section id="projects-section" className="projects w-full pt-[56px] scroll-mt-20">
          <ProjectsSection 
            onSelectProject={handleOpenProjectModal} 
          />
        </section>

        {/* About Section */}
        <InfoSection glitchTrigger={aboutGlitchTrigger} />

      </main>

      {/* Footer */}
      <Footer />

      {/* Standard Technical Writeup Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Arbalest Rocketry Mission Control Dashboard Modal */}
      {isMissionControlOpen && (
        <MissionControlModal
          onClose={() => setIsMissionControlOpen(false)}
        />
      )}

    </div>
  );
}
