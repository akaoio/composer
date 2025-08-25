# Project Dashboard: {{name}}

## Project Overview
- **Project ID**: `{{id}}`
- **Code**: `{{code}}`
- **Status**: **{{status}}**
- **Priority**: {{priority}}
- **Duration**: {{start_date}} → {{end_date}}

## Budget & Resources

### Financial Status
- **Allocated Budget**: {{budget.allocated}}
- **Spent to Date**: {{budget.spent}}
- **Remaining**: {{budget.remaining}}
- **Monthly Burn Rate**: {{budget.burn_rate}}
- **Projected Runway**: {{#if budget.burn_rate}}~{{budget.remaining}}/{{budget.burn_rate}} months{{/if}}

### Team Composition
- **Project Lead**: {{team.lead}}
- **Team Members**: 
{{#each team.members}}
  - {{this}}
{{/each}}
- **Reviewers**:
{{#each team.reviewers}}
  - {{this}}
{{/each}}

## Milestones & Progress

### Milestone Timeline
{{#each milestones}}
#### {{this.name}}
- **Status**: `{{this.status}}`
{{#if this.completion_date}}- **Completed**: {{this.completion_date}}{{/if}}
{{#if this.target_date}}- **Target Date**: {{this.target_date}}{{/if}}
{{#if this.progress}}- **Progress**: {{this.progress}}{{/if}}

{{/each}}

### Progress Summary
```
Total Milestones: {{milestones.length}}
Completed: {{#filter milestones status="completed"}}{{length}}{{/filter}}
In Progress: {{#filter milestones status="in_progress"}}{{length}}{{/filter}}
Planned: {{#filter milestones status="planned"}}{{length}}{{/filter}}
```

{{#if deliverables}}
## Key Deliverables
{{#each deliverables}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if risks}}
## Risk Assessment

| Risk Type | Description | Impact | Probability | Mitigation |
|-----------|-------------|--------|-------------|------------|
{{#each risks}}
| {{this.type}} | {{this.description}} | {{this.impact}} | {{this.probability}} | {{this.mitigation}} |
{{/each}}
{{/if}}

{{#if metrics}}
## Performance Metrics

### Development Metrics
{{#if metrics.velocity}}- **Sprint Velocity**: {{metrics.velocity}}{{/if}}
{{#if metrics.quality}}- **Code Quality**: {{metrics.quality}}{{/if}}
{{#if metrics.satisfaction}}- **Team Satisfaction**: {{metrics.satisfaction}}{{/if}}

### Business Metrics
{{#if metrics.pipeline_value}}- **Pipeline Value**: {{metrics.pipeline_value}}{{/if}}
{{#if metrics.conversion_rate}}- **Conversion Rate**: {{metrics.conversion_rate}}{{/if}}
{{#if metrics.sales_cycle}}- **Sales Cycle**: {{metrics.sales_cycle}}{{/if}}
{{/if}}

{{#if research_areas}}
## Research Focus Areas

{{#each research_areas}}
### {{@key}}
- **Focus**: {{this.focus}}
- **Progress**: {{this.progress}}
{{/each}}

### Research Output
{{#if publications}}
- **Publications**: {{publications.planned}} planned, {{publications.submitted}} submitted, {{publications.accepted}} accepted
{{/if}}
{{#if patents}}
- **Patents**: {{patents.filed}} filed, {{patents.pending}} pending, {{patents.granted}} granted
{{/if}}
{{/if}}

{{#if objectives}}
## Infrastructure Objectives

{{#each objectives}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if phases}}
## Implementation Phases

| Phase | Duration | Status |
|-------|----------|--------|
{{#each phases}}
| {{this.name}} | {{this.duration}} | {{this.status}} |
{{/each}}
{{/if}}

## Status Summary

### Current Sprint Integration
This project has the following tasks in the current sprint:
{{#each ../tasks}}
{{#if (eq this.project_id ../id)}}
- **{{this.id}}**: {{this.title}} ({{this.status}}, {{this.story_points}} points)
{{/if}}
{{/each}}

### Health Indicators
- **Schedule**: {{#if (isOnSchedule end_date)}}✅ On Track{{else}}⚠️ At Risk{{/if}}
- **Budget**: {{#if (isUnderBudget budget)}}✅ Within Budget{{else}}⚠️ Over Budget{{/if}}
- **Quality**: {{#if metrics.quality}}{{#if (gte metrics.quality 95)}}✅ High{{else}}⚠️ Needs Attention{{/if}}{{else}}📊 Not Measured{{/if}}
- **Team Morale**: {{#if metrics.satisfaction}}{{#if (gte metrics.satisfaction 4)}}✅ Good{{else}}⚠️ Needs Attention{{/if}}{{else}}📊 Not Measured{{/if}}

## Next Steps

### Immediate Actions
1. Complete current sprint tasks
2. Review and update milestones
3. Address any blocking issues
4. Prepare for upcoming reviews

### Upcoming Deadlines
{{#each milestones}}
{{#if this.target_date}}
{{#unless this.completion_date}}
- **{{this.target_date}}**: {{this.name}}
{{/unless}}
{{/if}}
{{/each}}

---
*Dashboard generated at {{generated_at}}*