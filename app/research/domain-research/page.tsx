'use client';
import { useState } from 'react';
import { Lightbulb, Plus, Settings, Brain, TrendingUp, Beaker, Search, FileText, Download, Copy } from 'lucide-react';

interface ResearchResult {
  research: string;
  webData: any;
  metadata: {
    domain: string;
    researchDepth: string;
    focusAreas: string[];
    excludeAreas: string[];
    hasWebData: boolean;
    timestamp: string;
    model: string;
  };
}

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
  const [activeTab, setActiveTab] = useState<'agents' | 'create' | 'research'>('agents');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchDepth, setResearchDepth] = useState('comprehensive');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartResearch = (agent: any) => {
    setSelectedAgent(agent);
    setResearchQuery(agent.domain);
    setActiveTab('research');
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) {
      setError('Please enter a research domain');
      return;
    }

    setIsResearching(true);
    setError(null);
    setResearchResult(null);

    try {
      const response = await fetch('/api/research/domain-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: researchQuery,
          researchDepth,
          focusAreas,
          excludeAreas: []
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResearchResult(data);
    } catch (error) {
      console.error('Research failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to conduct domain research');
    } finally {
      setIsResearching(false);
    }
  };

  const copyToClipboard = async () => {
    if (researchResult) {
      try {
        await navigator.clipboard.writeText(researchResult.research);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const downloadReport = () => {
    if (researchResult) {
      const element = document.createElement('a');
      const file = new Blob([researchResult.research], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `domain-research-${researchResult.metadata.domain.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

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
            onClick={() => setActiveTab('research')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'research'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span>Domain Research</span>
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

      {/* Domain Research Tab */}
      {activeTab === 'research' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Domain Research</h3>
            {selectedAgent && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedAgent.icon}</span>
                  <div>
                    <h4 className="text-white font-medium">{selectedAgent.name}</h4>
                    <p className="text-accent text-sm">Using {selectedAgent.domain} specialization</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Research Input */}
          <div className="bg-surface/50 border border-zinc-700 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Research Domain</label>
                <input
                  type="text"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder="e.g., Artificial Intelligence, Quantum Computing, Renewable Energy..."
                  className="w-full bg-surface border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
                />
                
                {/* Suggested Domains */}
                <div className="mt-3">
                  <p className="text-xs text-zinc-400 mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Intelligence', 'Quantum Computing', 'Renewable Energy', 'Biotechnology', 'FinTech', 'Cybersecurity'].map((domain) => (
                      <button
                        key={domain}
                        onClick={() => setResearchQuery(domain)}
                        className="px-3 py-1 text-xs bg-surface border border-zinc-600 text-zinc-300 rounded hover:border-accent hover:text-accent transition-colors"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Research Depth</label>
                <select
                  value={researchDepth}
                  onChange={(e) => setResearchDepth(e.target.value)}
                  className="w-full bg-surface border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none"
                >
                  <option value="overview">Overview</option>
                  <option value="comprehensive">Comprehensive</option>
                  <option value="deep-dive">Deep Dive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Focus Areas (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., market trends, technological challenges, regulatory landscape"
                  onChange={(e) => setFocusAreas(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full bg-surface border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
                />
              </div>

              <button
                onClick={handleResearch}
                disabled={isResearching || !researchQuery.trim()}
                className="w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isResearching ? 'Conducting Research...' : 'Start Domain Research'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Research Progress */}
          {isResearching && (
            <div className="mb-6 p-6 bg-surface/30 border border-zinc-700 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                <h3 className="text-lg font-medium text-white">Conducting Domain Research...</h3>
              </div>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Analyzing domain landscape</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse w-2 h-2 bg-accent rounded-full"></div>
                  <span>Gathering market intelligence</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-2 h-2 border-2 border-zinc-600 rounded-full"></div>
                  <span>Synthesizing insights</span>
                </div>
              </div>
            </div>
          )}

          {/* Research Results */}
          {researchResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Research Results</h3>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-surface/50 border border-zinc-700 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-accent" />
                    <h4 className="text-lg font-medium text-white">Domain Analysis: {researchResult.metadata.domain}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span>Depth: {researchResult.metadata.researchDepth}</span>
                    <span>•</span>
                    <span>Generated: {new Date(researchResult.metadata.timestamp).toLocaleDateString()}</span>
                    {researchResult.metadata.hasWebData && (
                      <>
                        <span>•</span>
                        <span className="text-green-400">Enhanced with web data</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {researchResult.research}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
                  <button 
                    onClick={() => handleStartResearch(agent)}
                    className="flex-1 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors font-medium"
                  >
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
