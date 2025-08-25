module.exports = {
  sources: [
    'data/**/*.yaml',
    'data/**/*.json',
    'state/**/*.yaml'
  ],
  
  outputs: [
    // Company Overview Dashboard
    {
      target: 'output/dashboard/company-overview.md',
      template: 'templates/dashboard/company-overview.md',
      format: 'markdown',
      context: {
        timestamp: new Date().toISOString(),
        total_agents: 5,
        active_agents: 5,
        average_performance: '95%',
        financial: {
          burn_rate: '$475K',
          runway: 24,
          pipeline: '$12M',
          closed_ytd: '$2.5M'
        },
        weekly_priorities: [
          'Complete Agent Communication Protocol implementation',
          'Prepare TechCorp Enterprise demo',
          'Finalize Q1 milestone deliverables',
          'Review and optimize database performance'
        ],
        upcoming_milestones: [
          { date: '2025-02-03', milestone: 'Agent Protocol v1.0', project: 'AAP-MVP' },
          { date: '2025-02-04', milestone: 'Customer Demo', project: 'ESP-2025' },
          { date: '2025-02-15', milestone: 'Core Framework Complete', project: 'AAP-MVP' }
        ],
        top_performers: [
          { name: 'Bob Smith', role: 'AI Agent', tasks_completed: 42, rating: '99.2%' },
          { name: 'Alice Chen', role: 'Technical Lead', tasks_completed: 18, rating: '95%' },
          { name: 'Kate Singh', role: 'Research Lead', tasks_completed: 12, rating: '92%' }
        ],
        risks: [
          {
            description: 'Complex multi-agent coordination challenges',
            impact: 'high',
            probability: 'medium',
            mitigation: 'Implementing robust testing framework'
          },
          {
            description: 'Q1 deadline pressure',
            impact: 'high',
            probability: 'high',
            mitigation: 'Additional resources allocated'
          }
        ]
      }
    },
    
    // Individual Agent Profiles
    {
      target: 'output/agents/{{id}}.md',
      template: 'templates/agent/profile.md',
      format: 'markdown',
      iterator: 'agents',
      context: {
        generated_at: new Date().toISOString()
      }
    },
    
    // Project Dashboards
    {
      target: 'output/projects/{{id}}-dashboard.md',
      template: 'templates/project/dashboard.md',
      format: 'markdown',
      iterator: 'projects',
      context: {
        generated_at: new Date().toISOString()
      }
    },
    
    // Sprint Report
    {
      target: 'output/reports/sprint-{{sprint.id}}.md',
      template: 'templates/report/sprint.md',
      format: 'markdown',
      context: {
        generated_at: new Date().toISOString()
      }
    },
    
    // Task Details
    {
      target: 'output/tasks/{{id}}.md',
      template: 'templates/task/detail.md',
      format: 'markdown',
      iterator: 'tasks',
      context: {
        generated_at: new Date().toISOString()
      }
    },
    
    // Team Performance Report
    {
      target: 'output/reports/team-performance.md',
      template: 'templates/report/team-performance.md',
      format: 'markdown',
      context: {
        reporting_period: 'Week 5, 2025',
        generated_at: new Date().toISOString()
      }
    },
    
    // System Health Report
    {
      target: 'output/reports/system-health.md',
      template: 'templates/report/system-health.md',
      format: 'markdown',
      context: {
        generated_at: new Date().toISOString(),
        orchestrator: {
          uptime: '99.99%',
          coordination: {
            active_workflows: 127,
            decisions_per_hour: 3400
          },
          system_state: {
            cpu_usage: '45%',
            memory_usage: '62%',
            error_rate: '0.02%'
          }
        }
      }
    }
  ],
  
  watch: false,
  verbose: true,
  clean: true
}