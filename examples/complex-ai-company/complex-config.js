module.exports = {
  sources: {
    mainData: {
      pattern: 'data/main.yaml',
      parser: 'yaml',
      transform: (data) => {
        // Flatten the deeply nested imported data for easier access
        const agents = []
        
        // Extract agents from departments -> teams -> members
        if (data.departments && Array.isArray(data.departments)) {
          data.departments.forEach(dept => {
            if (dept.teams && Array.isArray(dept.teams)) {
              dept.teams.forEach(team => {
                if (team.members && Array.isArray(team.members)) {
                  team.members.forEach(agent => {
                    // Enrich agent with context from all levels
                    agents.push({
                      ...agent,
                      // Company context
                      company_name: data.company.company_name,
                      company_mission: data.company.company_mission,
                      company_vision: data.company.company_vision,
                      company_values: data.company.values,
                      // Financial context
                      company_revenue: data.financials.revenue.annual_target,
                      company_growth: data.financials.revenue.growth_rate,
                      // Department context
                      department_id: dept.department_id,
                      department_name: dept.department_name,
                      department_color: dept.color,
                      department_objectives: dept.objectives,
                      department_initiatives: dept.initiatives,
                      department_resources: dept.resources,
                      // Team context
                      team_id: team.team_id,
                      team_name: team.team_name,
                      team_mission: team.mission,
                      team_budget: team.budget,
                      team_performance: team.performance,
                      team_projects: team.projects,
                      team_deliverables: team.deliverables,
                      meetings: team.meetings,
                      // Global context
                      global_context: data.global_context,
                      policies: data.policies,
                      experiments: data.experiments,
                      runtime: data.runtime,
                      // Metadata
                      timestamp: new Date().toISOString()
                    })
                  })
                }
              })
            }
          })
        }
        
        console.log(`🔄 Processed ${agents.length} agents from nested imports`)
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
        pattern: 'output/agents/{{department_id}}/{{id}}.md',
        forEach: 'sources.mainData.agents'
      },
      template: 'templates/full-agent.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.',
    verbose: true
  }
}