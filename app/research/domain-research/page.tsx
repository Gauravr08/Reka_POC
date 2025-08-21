'use client';
import { useState } from 'react';
import { Lightbulb, Plus, Settings, Brain, TrendingUp, Beaker } from 'lucide-react';

const researchAgents = [
  {
    id: 1,
    name: 'Medical Research Agent',
    domain: 'Healthcare',
    description: 'Specialized in medical literature, clinical trials, and pharmaceutical research',
    icon: '🏥',
    status: 'active',
    queries: 247,
    accuracy: 94
  },
  {
    id: 2,
    name: 'Financial Markets Agent',
    domain: 'Finance',
    description: 'Expert in market analysis, economic indicators, and investment research',
    icon: '📊',
    status: 'active',
    queries: 189,
    accuracy: 91
  },
  {
    id: 3,
    name: 'Tech Innovation Agent',
    domain: 'Technology',
    description: 'Focuses on emerging technologies, patents, and industry developments',
    icon: '🚀',
    status: 'training',
    queries: 76,
    accuracy: 87
  }
];

const domainTemplates = [
  {
    name: 'Legal Research',
    icon: '⚖️',
    description: 'Case law, regulations, and legal precedents',
    fields: ['Case Analysis', 'Regulatory Compliance', 'Legal Precedents']
  },
  {
    name: 'Scientific Research',
    icon: '🔬',
    description: 'Academic papers, peer reviews, and research methodologies',
    fields: ['Literature Review', 'Methodology Analysis', 'Citation Tracking']
  },
  {
    name: 'Market Intelligence',
    icon: '📈',
    description: 'Competitive analysis, market trends, and consumer insights',
    fields: ['Competitor Analysis', 'Market Sizing', 'Trend Forecasting']
  }
];

export default function DomainResearch() {
  const [activeTab, setActiveTab] = useState<'agents' | 'create'>('agents');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Domain Specialized Research</h1>
        <p className="text-zinc-400">
          Builds custom research agents tailored to specific industries or knowledge domains.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-1 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'agents'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain size={16} />
              <span>Research Agents</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus size={16} />
              <span>Create Agent</span>
            </div>
          </button>
        </div>
      </div>

      {/* Research Agents Tab */}
      {activeTab === 'agents' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Active Research Agents</h3>
            <button 
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors"
            >
              <Plus size={16} />
              <span>Create New Agent</span>
            </button>
          </div>

          <div className="grid gap-6">
            {researchAgents.map((agent) => (
              <div key={agent.id} className="bg-surface/50 border border-zinc-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{agent.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
                      <p className="text-sm text-accent">{agent.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {agent.status}
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-zinc-300 mb-4">{agent.description}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-surface/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{agent.queries}</div>
                    <div className="text-xs text-zinc-400">Total Queries</div>
                  </div>
                  <div className="text-center p-3 bg-surface/30 rounded-lg">
                    <div className="text-lg font-semibold text-green-400">{agent.accuracy}%</div>
                    <div className="text-xs text-zinc-400">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-surface/30 rounded-lg">
                    <div className="text-lg font-semibold text-accent">Live</div>
                    <div className="text-xs text-zinc-400">Status</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors font-medium">
                    Start Research
                  </button>
                  <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Agent Tab */}
      {activeTab === 'create' && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Create Custom Research Agent</h3>

          {/* Domain Templates */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-white mb-4">Choose a Domain Template</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {domainTemplates.map((template) => (
                <div
                  key={template.name}
                  onClick={() => setSelectedTemplate(template.name)}
                  className={`p-6 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.name
                      ? 'border-accent bg-accent/5'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-3xl mb-3">{template.icon}</div>
                  <h5 className="font-semibold text-white mb-2">{template.name}</h5>
                  <p className="text-sm text-zinc-400 mb-4">{template.description}</p>
                  <div className="space-y-1">
                    {template.fields.map((field) => (
                      <div key={field} className="text-xs text-accent">• {field}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          {selectedTemplate && (
            <div className="bg-surface/30 border border-zinc-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-4">Configure Your Agent</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Agent Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Legal Research Assistant"
                    className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Specialization</label>
                  <textarea
                    placeholder="Describe the specific domain or expertise this agent should focus on..."
                    rows={3}
                    className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Data Sources</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="accent-accent" defaultChecked />
                      <span className="text-sm text-zinc-300">Academic databases</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="accent-accent" defaultChecked />
                      <span className="text-sm text-zinc-300">Industry reports</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="accent-accent" />
                      <span className="text-sm text-zinc-300">Government databases</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="accent-accent" />
                      <span className="text-sm text-zinc-300">News sources</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors font-medium">
                    Create & Train Agent
                  </button>
                  <button className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
