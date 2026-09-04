import React from 'react';
import { X, ExternalLink, Cpu, Layers, CheckCircle2, Zap } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl bg-slate-950/90 text-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Category & Badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold">
            {project.category}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {project.badge}
          </span>
        </div>

        {/* Project Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
          {project.title}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          {project.subtitle}
        </p>

        {/* Project Image Banner */}
        <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 border border-slate-800 shadow-inner">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Metrics Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {project.stats?.map((stat, idx) => (
            <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">{stat.label}</div>
              <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Overview & Architecture */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider mb-2">
              System Overview
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {project.writeup?.overview || project.shortDesc}
            </p>
          </div>

          {project.writeup?.architecture && (
            <div>
              <h3 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Technical Highlights
              </h3>
              <ul className="space-y-2">
                {project.writeup.architecture.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-8">
          <h3 className="text-xs font-mono text-slate-400 uppercase mb-3">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <a
            href="https://github.com/dheeranshankar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs"
          >
            <GithubIcon size={16} />
            <span>View Source on GitHub</span>
          </a>

          <button
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            <span>Close Details</span>
          </button>
        </div>

      </div>
    </div>
  );
}
