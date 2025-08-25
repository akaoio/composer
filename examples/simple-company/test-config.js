module.exports = {
  sources: {
    companyData: {
      pattern: 'data/company.yaml',
      parser: 'yaml',
      transform: (data) => {
        // Flatten teams and members for easy access
        const members = []
        
        data.teams.forEach(team => {
          team.members.forEach(member => {
            // Get teammates (excluding self)
            const teammates = team.members
              .filter(m => m.id !== member.id)
              .map(m => ({ name: m.name, role: m.role }))
            
            members.push({
              ...member,
              team_id: team.id,
              team_name: team.name,
              team_mission: team.mission,
              company_name: data.company.name,
              company_mission: data.company.mission,
              company_vision: data.company.vision,
              company_domain: data.company.domain,
              value_1: data.company.values[0],
              value_2: data.company.values[1],
              value_3: data.company.values[2],
              value_4: data.company.values[3],
              policy_hours: data.company.policies.hours,
              policy_review: data.company.policies.review,
              policy_testing: data.company.policies.testing,
              teammates: teammates,
              timestamp: new Date().toISOString()
            })
          })
        })
        
        return { ...data, members }
      }
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: {
        pattern: 'output/{{team_id}}-{{id}}.md',
        forEach: 'sources.companyData.members'
      },
      template: 'simple-template.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.'
  }
}