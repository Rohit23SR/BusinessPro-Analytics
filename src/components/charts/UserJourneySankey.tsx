import React, { useEffect, useRef, useState } from 'react'
import { Users, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react'

interface JourneyNode {
  id: number
  name: string
  category: 'entry' | 'landing' | 'engagement' | 'conversion' | 'exit'
  value: number
}

interface JourneyLink {
  source: number
  target: number
  value: number
}

interface JourneyData {
  nodes: JourneyNode[]
  links: JourneyLink[]
}

interface UserJourneySankeyProps {
  data?: JourneyData
  width?: number
  height?: number
}

const UserJourneySankey: React.FC<UserJourneySankeyProps> = (props) => {
  const data = props.data
  const width = props.width || 800
  const height = props.height || 400

  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Default sample data
  const defaultJourneyData: JourneyData = {
    nodes: [
      { id: 0, name: 'Organic Search', category: 'entry', value: 8000 },
      { id: 1, name: 'Direct', category: 'entry', value: 6000 },
      { id: 2, name: 'Social Media', category: 'entry', value: 4000 },
      { id: 3, name: 'Email', category: 'entry', value: 2000 },
      { id: 4, name: 'Homepage', category: 'landing', value: 12000 },
      { id: 5, name: 'Product Page', category: 'landing', value: 6000 },
      { id: 6, name: 'Blog', category: 'landing', value: 2000 },
      { id: 7, name: 'Browse Products', category: 'engagement', value: 9000 },
      { id: 8, name: 'View Pricing', category: 'engagement', value: 4500 },
      { id: 9, name: 'Read Content', category: 'engagement', value: 2000 },
      { id: 10, name: 'Sign Up', category: 'conversion', value: 3000 },
      { id: 11, name: 'Purchase', category: 'conversion', value: 1800 },
      { id: 12, name: 'Contact Sales', category: 'conversion', value: 1200 },
      { id: 13, name: 'Exit', category: 'exit', value: 12000 },
    ],
    links: [
      { source: 0, target: 4, value: 5000 },
      { source: 0, target: 5, value: 2500 },
      { source: 0, target: 6, value: 500 },
      { source: 1, target: 4, value: 4000 },
      { source: 1, target: 5, value: 2000 },
      { source: 2, target: 4, value: 2500 },
      { source: 2, target: 5, value: 1000 },
      { source: 2, target: 6, value: 500 },
      { source: 3, target: 4, value: 500 },
      { source: 3, target: 5, value: 500 },
      { source: 3, target: 6, value: 1000 },
      { source: 4, target: 7, value: 6000 },
      { source: 4, target: 8, value: 2000 },
      { source: 4, target: 13, value: 4000 },
      { source: 5, target: 7, value: 3000 },
      { source: 5, target: 8, value: 1500 },
      { source: 5, target: 13, value: 1500 },
      { source: 6, target: 9, value: 1000 },
      { source: 6, target: 7, value: 500 },
      { source: 6, target: 13, value: 500 },
      { source: 7, target: 10, value: 2000 },
      { source: 7, target: 11, value: 1500 },
      { source: 7, target: 13, value: 5500 },
      { source: 8, target: 10, value: 1000 },
      { source: 8, target: 11, value: 300 },
      { source: 8, target: 12, value: 800 },
      { source: 8, target: 13, value: 2400 },
      { source: 9, target: 7, value: 500 },
      { source: 9, target: 13, value: 1500 },
      { source: 12, target: 13, value: 1200 },
    ],
  }

  // Use provided data or default data
  const journeyData = data || defaultJourneyData

  // Group nodes by category
  const groupedNodes = {
    entry: journeyData.nodes.filter((n) => n.category === 'entry'),
    landing: journeyData.nodes.filter((n) => n.category === 'landing'),
    engagement: journeyData.nodes.filter((n) => n.category === 'engagement'),
    conversion: journeyData.nodes.filter((n) => n.category === 'conversion'),
    exit: journeyData.nodes.filter((n) => n.category === 'exit'),
  }

  // Color mapping
  const colors = {
    entry: '#3B82F6',
    landing: '#10B981',
    engagement: '#F59E0B',
    conversion: '#EF4444',
    exit: '#6B7280',
  }

  // Get connections for a node
  const getNodeConnections = (nodeId: number) => {
    return journeyData.links.filter((link) => link.source === nodeId || link.target === nodeId)
  }

  // Calculate key metrics
  const totalUsers = journeyData.nodes
    .filter((n) => n.category === 'entry')
    .reduce((sum, n) => sum + n.value, 0)
  const conversions = journeyData.nodes
    .filter((n) => n.category === 'conversion')
    .reduce((sum, n) => sum + n.value, 0)
  const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Journey Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="mb-1 text-lg font-bold text-gray-900">{totalUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Entry Users</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="mb-1 text-lg font-bold text-gray-900">{conversions.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Conversions</div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-red-100 p-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="mb-1 text-lg font-bold text-gray-900">{conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Conversion Rate</div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="rounded-lg border border-gray-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-gray-700">User Journey Flow</h4>

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-start space-x-8">
            {/* Entry Points */}
            <div className="flex flex-col space-y-3">
              <h5 className="mb-2 text-center text-xs font-semibold text-blue-600">ENTRY POINTS</h5>
              {groupedNodes.entry.map((node) => (
                <div
                  key={node.id}
                  className={`min-w-[140px] cursor-pointer rounded-lg border-2 border-blue-200 bg-blue-50 p-3 transition-all ${
                    selectedNode === node.id
                      ? 'bg-blue-100 ring-2 ring-blue-400'
                      : 'hover:bg-blue-100'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-sm font-semibold text-gray-800">{node.name}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {node.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">users</div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex h-full items-center justify-center pt-12">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            {/* Landing Pages */}
            <div className="flex flex-col space-y-3">
              <h5 className="mb-2 text-center text-xs font-semibold text-green-600">
                LANDING PAGES
              </h5>
              {groupedNodes.landing.map((node) => (
                <div
                  key={node.id}
                  className={`min-w-[140px] cursor-pointer rounded-lg border-2 border-green-200 bg-green-50 p-3 transition-all ${
                    selectedNode === node.id
                      ? 'bg-green-100 ring-2 ring-green-400'
                      : 'hover:bg-green-100'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-sm font-semibold text-gray-800">{node.name}</div>
                  <div className="text-lg font-bold text-green-600">
                    {node.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">users</div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex h-full items-center justify-center pt-12">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            {/* Engagement */}
            <div className="flex flex-col space-y-3">
              <h5 className="mb-2 text-center text-xs font-semibold text-yellow-600">ENGAGEMENT</h5>
              {groupedNodes.engagement.map((node) => (
                <div
                  key={node.id}
                  className={`min-w-[140px] cursor-pointer rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 transition-all ${
                    selectedNode === node.id
                      ? 'bg-yellow-100 ring-2 ring-yellow-400'
                      : 'hover:bg-yellow-100'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-sm font-semibold text-gray-800">{node.name}</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {node.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">users</div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex h-full items-center justify-center pt-12">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            {/* Conversions */}
            <div className="flex flex-col space-y-3">
              <h5 className="mb-2 text-center text-xs font-semibold text-red-600">CONVERSIONS</h5>
              {groupedNodes.conversion.map((node) => (
                <div
                  key={node.id}
                  className={`min-w-[140px] cursor-pointer rounded-lg border-2 border-red-200 bg-red-50 p-3 transition-all ${
                    selectedNode === node.id ? 'bg-red-100 ring-2 ring-red-400' : 'hover:bg-red-100'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-sm font-semibold text-gray-800">{node.name}</div>
                  <div className="text-lg font-bold text-red-600">
                    {node.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">users</div>
                </div>
              ))}
              {groupedNodes.exit.map((node) => (
                <div
                  key={node.id}
                  className={`min-w-[140px] cursor-pointer rounded-lg border-2 border-gray-200 bg-gray-50 p-3 transition-all ${
                    selectedNode === node.id
                      ? 'bg-gray-100 ring-2 ring-gray-400'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-sm font-semibold text-gray-800">{node.name}</div>
                  <div className="text-lg font-bold text-gray-600">
                    {node.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">users</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Details */}
        {selectedNode !== null && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h5 className="mb-3 text-sm font-semibold text-gray-700">
              Flow Details for: {journeyData.nodes.find((n) => n.id === selectedNode)?.name}
            </h5>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <h6 className="mb-2 font-medium text-gray-600">Incoming Flows:</h6>
                <div className="space-y-1">
                  {journeyData.links
                    .filter((link) => link.target === selectedNode)
                    .map((link, index) => {
                      const sourceNode = journeyData.nodes.find((n) => n.id === link.source)
                      return (
                        <div key={index} className="text-xs text-gray-600">
                          {sourceNode?.name}:{' '}
                          <span className="font-semibold">{link.value.toLocaleString()}</span> users
                        </div>
                      )
                    })}
                </div>
              </div>
              <div>
                <h6 className="mb-2 font-medium text-gray-600">Outgoing Flows:</h6>
                <div className="space-y-1">
                  {journeyData.links
                    .filter((link) => link.source === selectedNode)
                    .map((link, index) => {
                      const targetNode = journeyData.nodes.find((n) => n.id === link.target)
                      return (
                        <div key={index} className="text-xs text-gray-600">
                          {targetNode?.name}:{' '}
                          <span className="font-semibold">{link.value.toLocaleString()}</span> users
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Object.entries(groupedNodes).map(([category, nodes]) => {
          const totalUsers = nodes.reduce((sum, n) => sum + n.value, 0)
          const categoryColors = {
            entry: 'blue',
            landing: 'green',
            engagement: 'yellow',
            conversion: 'red',
            exit: 'gray',
          }
          const color = categoryColors[category as keyof typeof categoryColors]

          return (
            <div key={category} className="rounded-lg border border-gray-100 bg-white p-3">
              <div className={`text-xs font-semibold text-${color}-600 mb-1 uppercase`}>
                {category}
              </div>
              <div className={`text-lg font-bold text-${color}-600`}>
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {nodes.length} step{nodes.length !== 1 ? 's' : ''}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserJourneySankey
