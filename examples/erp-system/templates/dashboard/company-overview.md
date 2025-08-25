# {{company.name}} - Executive Dashboard
*Generated: {{timestamp}}*

## Company Overview
- **Founded**: {{company.founded}}
- **Industry**: {{company.industry}}
- **Employees**: {{company.employees}}
- **Revenue Target**: {{company.revenue_target}}

## Vision & Mission

### Vision Statement
> {{vision.statement}}

**Key Metrics**:
- Market Share Target: {{vision.metrics.market_share}}
- Global Presence: {{vision.metrics.countries}} countries
- Enterprise Clients: {{vision.metrics.enterprise_clients}}

### Mission
> {{mission.statement}}

## Strategic Objectives Progress

### Short-term (Q1 2025)
{{#each objectives.short_term}}
#### {{this.title}}
- **Status**: `{{this.status}}`
- **Owner**: {{this.owner}}
- **Budget**: {{this.budget}}
- **Target**: {{this.target_date}}

**KPIs**:
{{#each this.kpis}}
- {{@key}}: {{this}}
{{/each}}

---
{{/each}}

### Medium-term (2025-2026)
{{#each objectives.medium_term}}
#### {{this.title}}
- **Timeline**: {{this.target_date}}
- **Budget**: {{this.budget}}
- **Status**: {{this.status}}

---
{{/each}}

## Active Projects Summary

| Project | Status | Priority | Budget | Progress |
|---------|--------|----------|--------|----------|
{{#each projects}}
| **{{this.name}}** | {{this.status}} | {{this.priority}} | {{this.budget.allocated}} | {{#if this.milestones}}{{this.milestones.[1].progress}}{{else}}Planning{{/if}} |
{{/each}}

## Current Sprint Status

### Sprint: {{sprint.name}}
- **Duration**: {{sprint.start_date}} to {{sprint.end_date}}
- **Capacity**: {{sprint.capacity}}
- **Progress**: {{sprint.completed}}/{{sprint.committed}} points

### Task Distribution
```
Critical: {{metrics.by_priority.critical}} points
High:     {{metrics.by_priority.high}} points
Medium:   {{metrics.by_priority.medium}} points
```

## Team Performance

### Top Performers This Week
{{#each top_performers}}
1. **{{this.name}}** ({{this.role}})
   - Completed: {{this.tasks_completed}} tasks
   - Performance: {{this.rating}}
{{/each}}

### Resource Utilization
{{#each agents}}
{{#if this.current_workload}}
- **{{this.name}}**: {{this.current_workload.capacity}} utilized
{{/if}}
{{/each}}

## System Health

### AI Agent Status
- **Total Agents**: {{total_agents}}
- **Active**: {{active_agents}}
- **Average Performance**: {{average_performance}}

### Orchestrator Metrics
- **Managed Workflows**: {{orchestrator.coordination.active_workflows}}
- **Decisions/Hour**: {{orchestrator.coordination.decisions_per_hour}}
- **System Uptime**: {{orchestrator.uptime}}
- **Error Rate**: {{orchestrator.system_state.error_rate}}

## Financial Overview

### Q1 2025 Projections
- **Burn Rate**: {{financial.burn_rate}}/month
- **Runway**: {{financial.runway}} months
- **Revenue Pipeline**: {{financial.pipeline}}
- **Closed Deals**: {{financial.closed_ytd}}

## Risk Register

### High Priority Risks
{{#each risks}}
{{#if (eq this.impact "high")}}
- **{{this.description}}**
  - Impact: {{this.impact}}
  - Probability: {{this.probability}}
  - Mitigation: {{this.mitigation}}
{{/if}}
{{/each}}

## Next Steps

### This Week's Priorities
{{#each weekly_priorities}}
1. {{this}}
{{/each}}

### Upcoming Milestones
{{#each upcoming_milestones}}
- **{{this.date}}**: {{this.milestone}} ({{this.project}})
{{/each}}

---
*Dashboard powered by @akaoio/composer ERP System*