import { useState } from 'react'

const API_SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    subsections: []
  },
  {
    id: 'quickstart', 
    title: 'Quickstart',
    subsections: []
  },
  {
    id: 'articles',
    title: 'Articles',
    subsections: [
      { id: 'list-articles', title: 'List articles' },
      { id: 'get-article', title: 'Retrieve article' }
    ]
  },
  {
    id: 'narratives',
    title: 'Narratives',
    subsections: [
      { id: 'list-narratives', title: 'List narratives' }
    ]
  },
  {
    id: 'bias-analysis',
    title: 'Bias analysis',
    subsections: []
  }
]

function CodeBlock({ code, language = 'javascript' }: { code: string; language?: string }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-sm text-gray-400">{language}</span>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-300 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ResponseBlock({ response }: { response: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mt-4">
      <pre className="text-gray-300 text-sm overflow-x-auto">
        <code>{response}</code>
      </pre>
    </div>
  )
}

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="openai-heading text-4xl text-white mb-4">Bias detection</h1>
              <p className="openai-body text-lg text-gray-400 leading-relaxed">
                Learn how to detect and analyze media bias in news articles.
              </p>
            </div>
            
            <div>
              <p className="openai-body text-gray-300 leading-relaxed mb-4">
                With the Bias Lab API, you can analyze news articles for multiple dimensions of bias including ideological stance, factual grounding, framing choices, emotional tone, and source transparency. The API provides structured bias scores and highlighted phrases to make bias detection transparent and actionable.
              </p>
              
              <p className="openai-body text-gray-300 leading-relaxed">
                Here's a simple example using the <span className="text-blue-400">Articles</span> API.
              </p>
            </div>

            <CodeBlock 
              code={`import fetch from 'node-fetch';

const response = await fetch('https://api.biaslab.com/articles', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const articles = await response.json();
console.log(articles);`}
            />

            <div>
              <p className="openai-body text-gray-300 leading-relaxed">
                An array of articles with bias scores is returned. In this simple example, we have just retrieved all articles which looks like this:
              </p>
            </div>

            <ResponseBlock 
              response={`[
  {
    "id": "a1",
    "title": "Committee Releases Preliminary Findings Amid Debate",
    "source": "Civic Daily",
    "date": "2024-11-03T09:00:00",
    "bias": {
      "ideological_stance": 0.45,
      "factual_grounding": 0.82,
      "framing_choices": 0.61,
      "emotional_tone": 0.35,
      "source_transparency": 0.90
    }
  }
]`}
            />
          </div>
        )

      case 'quickstart':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="openai-heading text-4xl text-white mb-4">Quickstart</h1>
              <p className="openai-body text-lg text-gray-400 leading-relaxed">
                Get up and running with the Bias Lab API in minutes.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="openai-heading text-2xl text-white mb-3">Make your first API request</h2>
                <p className="openai-body text-gray-300 leading-relaxed mb-4">
                  Start by making a simple request to retrieve all articles with their bias scores.
                </p>
                
                <CodeBlock 
                  code={`curl https://api.biaslab.com/articles \\
  -H "Content-Type: application/json"`}
                  language="bash"
                />
              </div>

              <div>
                <h2 className="openai-heading text-2xl text-white mb-3">Analyze a specific article</h2>
                <p className="openai-body text-gray-300 leading-relaxed mb-4">
                  Get detailed bias analysis including highlighted phrases for a specific article.
                </p>
                
                <CodeBlock 
                  code={`curl https://api.biaslab.com/articles/a1 \\
  -H "Content-Type: application/json"`}
                  language="bash"
                />
              </div>
            </div>
          </div>
        )

      case 'list-articles':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="openai-heading text-4xl text-white mb-4">List articles</h1>
              <p className="openai-body text-lg text-gray-400 leading-relaxed">
                Returns a list of articles with their bias scores.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">GET</code>
              <span className="text-white ml-3">https://api.biaslab.com/articles</span>
            </div>

            <div>
              <h3 className="openai-heading text-xl text-white mb-3">Response</h3>
              <ResponseBlock 
                response={`[
  {
    "id": "a1",
    "title": "Committee Releases Preliminary Findings Amid Debate",
    "source": "Civic Daily", 
    "date": "2024-11-03T09:00:00",
    "bias": {
      "ideological_stance": 0.45,
      "factual_grounding": 0.82,
      "framing_choices": 0.61,
      "emotional_tone": 0.35,
      "source_transparency": 0.90
    }
  }
]`}
              />
            </div>
          </div>
        )

      case 'get-article':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="openai-heading text-4xl text-white mb-4">Retrieve article</h1>
              <p className="openai-body text-lg text-gray-400 leading-relaxed">
                Retrieves detailed analysis for a specific article including highlighted bias phrases.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">GET</code>
              <span className="text-white ml-3">https://api.biaslab.com/articles/{'{id}'}</span>
            </div>

            <div>
              <h3 className="openai-heading text-xl text-white mb-3">Path parameters</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <code className="text-blue-400">id</code>
                  <div>
                    <p className="text-white">string</p>
                    <p className="text-gray-400 text-sm">The ID of the article to retrieve.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="openai-heading text-xl text-white mb-3">Example request</h3>
              <CodeBlock 
                code={`curl https://api.biaslab.com/articles/a1 \\
  -H "Content-Type: application/json"`}
                language="bash"
              />
            </div>

            <div>
              <h3 className="openai-heading text-xl text-white mb-3">Response</h3>
              <ResponseBlock 
                response={`{
  "id": "a1",
  "title": "Committee Releases Preliminary Findings Amid Debate",
  "source": "Civic Daily",
  "date": "2024-11-03T09:00:00",
  "content": "The committee released its preliminary findings...",
  "bias": {
    "ideological_stance": 0.45,
    "factual_grounding": 0.82,
    "framing_choices": 0.61,
    "emotional_tone": 0.35,
    "source_transparency": 0.90
  },
  "highlights": [
    {
      "start": 15,
      "end": 25,
      "dimension": "factual_grounding",
      "note": "Reference to official findings"
    }
  ],
  "primary_sources": [
    {
      "title": "Committee Report",
      "url": "https://example.org/report"
    }
  ]
}`}
              />
            </div>
          </div>
        )

      case 'list-narratives':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="openai-heading text-4xl text-white mb-4">List narratives</h1>
              <p className="openai-body text-lg text-gray-400 leading-relaxed">
                Returns narrative clusters showing how different outlets frame the same stories.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">GET</code>
              <span className="text-white ml-3">https://api.biaslab.com/narratives</span>
            </div>

            <div>
              <h3 className="openai-heading text-xl text-white mb-3">Response</h3>
              <ResponseBlock 
                response={`[
  {
    "id": "n1",
    "title": "Tech Regulation and Digital Policy Reform",
    "description": "Coverage ranges from industry defense to consumer advocacy...",
    "divergence_index": 0.72,
    "top_articles": [
      {
        "id": "a6",
        "title": "Tech Giants Face New Regulatory Scrutiny"
      }
    ]
  }
]`}
              />
            </div>
          </div>
        )

      default:
        return <div>Content not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen">
          <div className="p-6">
            <h2 className="openai-heading text-white text-lg mb-6">Get started</h2>
            
            <nav className="space-y-1">
              {API_SECTIONS.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    {section.title}
                  </button>
                  
                  {section.subsections.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSection(subsection.id)}
                          className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                            activeSection === subsection.id
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-8 p-6 border-t border-gray-800">
            <h3 className="openai-heading text-white text-sm mb-4">Core concepts</h3>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('bias-analysis')}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeSection === 'bias-analysis'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                Bias analysis
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-12">
            {renderContent()}
          </div>

          {/* Right Sidebar */}
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 w-64">
              <h4 className="openai-heading text-white text-sm mb-3">Bias detection and analysis</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">Text input and output</li>
                <li className="text-gray-400">Bias scoring</li>
                <li className="text-gray-400">Phrase highlighting</li>
                <li className="text-gray-400">Source transparency</li>
                <li className="text-gray-400">Narrative clustering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}