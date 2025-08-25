module.exports = {
  sources: {
    agentData: {
      pattern: 'data/agents.yaml',
      parser: 'yaml',
      transform: (data) => {
        // Flatten company and department info into each agent
        const agents = data.agents.map(agent => {
          const dept = data.departments.find(d => d.name === agent.department)
          return {
            ...agent,
            company_name: data.company.name,
            company_mission: data.company.mission,
            company_vision: data.company.vision,
            company_model: data.company.model,
            company_orchestrator: data.company.orchestrator,
            department_mission: dept?.mission || '',
            department_color: agent.department_color || dept?.color || 'gray'
          }
        })
        return { ...data, agents }
      }
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: {
        pattern: 'output/agents/{{id}}.md',
        forEach: 'sources.agentData.agents'
      },
      template: 'templates/agent.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.'
  }
}