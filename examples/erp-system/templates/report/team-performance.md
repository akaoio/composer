# Team Performance Report
*Reporting Period: {{reporting_period}}*

## Executive Summary

### Team Overview
- **Total Team Members**: {{agents.length}}
- **Active Members**: {{#filter agents status="active"}}{{length}}{{/filter}}
- **Team Composition**:
  - Human: {{#filter agents type="human"}}{{length}}{{/filter}}
  - AI Agents: {{#filter agents type="ai-agent"}}{{length}}{{/filter}}
  - Hybrid: {{#filter agents type="hybrid"}}{{length}}{{/filter}}
  - Human-Assisted AI: {{#filter agents type="human-assisted-ai"}}{{length}}{{/filter}}

### Performance Highlights
- **Tasks Completed This Sprint**: {{sprint.completed}} points
- **Average Team Utilization**: {{#average metrics.team_utilization}}{{/average}}%
- **Sprint Velocity**: {{metrics.velocity.planned}} planned → {{sprint.completed}} delivered

## Individual Performance

### Top Performers
{{#each agents}}
{{#if performance}}
#### {{name}} ({{role}})
- **Type**: {{type}}
- **Department**: {{department}}
- **Current Utilization**: {{current_workload.capacity}}

**Performance Metrics**:
{{#if performance.rating}}- Overall Rating: **{{performance.rating}}**{{/if}}
{{#if performance.completed_tasks}}- Tasks Completed: **{{performance.completed_tasks}}**{{/if}}
{{#if performance.tasks_completed}}- Tasks Completed: **{{performance.tasks_completed}}**{{/if}}
{{#if performance.on_time_delivery}}- On-Time Delivery: **{{performance.on_time_delivery}}**{{/if}}
{{#if performance.code_quality}}- Code Quality: **{{performance.code_quality}}**{{/if}}
{{#if performance.accuracy}}- Accuracy: **{{performance.accuracy}}**{{/if}}
{{#if performance.uptime}}- System Uptime: **{{performance.uptime}}**{{/if}}
{{#if performance.quota_attainment}}- Quota Attainment: **{{performance.quota_attainment}}**{{/if}}
{{#if performance.win_rate}}- Win Rate: **{{performance.win_rate}}**{{/if}}

---
{{/if}}
{{/each}}

## Department Performance

### Engineering Department
| Member | Role | Tasks | Utilization | Performance |
|--------|------|-------|-------------|-------------|
{{#each agents}}
{{#if (eq department "Engineering")}}
| {{name}} | {{role}} | {{#if performance.completed_tasks}}{{performance.completed_tasks}}{{else}}-{{/if}} | {{current_workload.capacity}} | {{#if performance.rating}}{{performance.rating}}{{else}}-{{/if}} |
{{/if}}
{{/each}}

### Research Department
| Member | Role | Focus Area | Publications | Patents |
|--------|------|------------|--------------|---------|
{{#each agents}}
{{#if (eq department "Research")}}
| {{name}} | {{role}} | {{#if expertise.research_areas}}Multi-agent Systems{{else}}-{{/if}} | {{#if expertise.publications}}{{expertise.publications}}{{else}}-{{/if}} | {{#if expertise.patents}}{{expertise.patents}}{{else}}-{{/if}} |
{{/if}}
{{/each}}

### Sales Department
| Member | Role | Pipeline | Deals Closed | Quota |
|--------|------|----------|--------------|-------|
{{#each agents}}
{{#if (eq department "Sales")}}
| {{name}} | {{role}} | {{#if performance.pipeline_value}}{{performance.pipeline_value}}{{else}}-{{/if}} | {{#if performance.deals_closed}}{{performance.deals_closed}}{{else}}-{{/if}} | {{#if performance.quota_attainment}}{{performance.quota_attainment}}{{else}}-{{/if}} |
{{/if}}
{{/each}}

### Operations Department
| Member | Role | Workflows | Decisions/Hr | Uptime |
|--------|------|-----------|--------------|--------|
{{#each agents}}
{{#if (eq department "Operations")}}
| {{name}} | {{role}} | {{#if coordination.active_workflows}}{{coordination.active_workflows}}{{else}}-{{/if}} | {{#if coordination.decisions_per_hour}}{{coordination.decisions_per_hour}}{{else}}-{{/if}} | {{#if uptime}}{{uptime}}{{else}}-{{/if}} |
{{/if}}
{{/each}}

## Workload Distribution

### Current Sprint Tasks
| Assignee | Tasks Assigned | Story Points | Status |
|----------|----------------|--------------|--------|
{{#each agents}}
{{#if current_workload.tasks}}
| {{name}} | {{current_workload.tasks.length}} | {{#sumPoints current_workload.tasks tasks}}{{/sumPoints}} | {{current_workload.capacity}} utilized |
{{/if}}
{{/each}}

### Project Involvement
| Team Member | Projects | Role in Project |
|-------------|----------|-----------------|
{{#each agents}}
{{#if current_workload.projects}}
| {{name}} | {{#each current_workload.projects}}{{@key}} {{/each}} | {{#each current_workload.projects}}{{this}} {{/each}} |
{{/if}}
{{/each}}

## AI Agent Performance

### AI Agent Metrics
| Agent | Model | Uptime | Response Time | Tasks | Accuracy |
|-------|-------|--------|---------------|-------|----------|
{{#each agents}}
{{#if (or (eq type "ai-agent") (eq type "meta-ai-agent"))}}
| {{name}} | {{#if model}}{{model}}{{else}}-{{/if}} | {{#if performance.uptime}}{{performance.uptime}}{{else if uptime}}{{uptime}}{{else}}-{{/if}} | {{#if performance.response_time}}{{performance.response_time}}{{else}}-{{/if}} | {{#if performance.tasks_completed}}{{performance.tasks_completed}}{{else}}-{{/if}} | {{#if performance.accuracy}}{{performance.accuracy}}{{else}}-{{/if}} |
{{/if}}
{{/each}}

### AI Learning & Adaptation
{{#each agents}}
{{#if (and memory.learning_log (or (eq type "ai-agent") (eq type "meta-ai-agent")))}}
#### {{name}}
Recent Learning:
{{#each memory.learning_log}}
- {{this.learned}} ({{this.date}}){{#if this.applied}} ✅ Applied{{/if}}
{{/each}}
{{/if}}
{{/each}}

## Collaboration Analysis

### Cross-Team Collaboration
{{#each agents}}
{{#if collaborations}}
#### {{name}}
- **Internal Collaborations**: {{#each collaborations.internal}}{{@key}} ({{this}}), {{/each}}
{{#if collaborations.external}}- **External Partners**: {{#join collaborations.external ", "}}{{/join}}{{/if}}
{{/if}}
{{/each}}

### Task Dependencies & Handoffs
- Tasks with dependencies: {{#filter tasks dependencies}}{{length}}{{/filter}}
- Cross-team handoffs this sprint: Estimated 15-20
- Average handoff time: < 2 hours

## Performance Trends

### Sprint-over-Sprint Comparison
| Metric | Previous Sprint | Current Sprint | Change |
|--------|----------------|----------------|--------|
| Velocity | 165 points | {{sprint.completed}} points | {{#if (gt sprint.completed 165)}}📈 +{{else}}📉 {{/if}}{{#subtract sprint.completed 165}}{{/subtract}} |
| Completion Rate | 92% | {{#percentage sprint.completed sprint.committed}}{{/percentage}}% | {{#if (gt (percentage sprint.completed sprint.committed) 92)}}📈{{else}}📉{{/if}} |
| Blocked Tasks | 2 | {{#filter tasks blockers}}{{length}}{{/filter}} | {{#if (gt (filter tasks blockers).length 2)}}📈 Worse{{else}}📉 Better{{/if}} |

### Individual Growth
{{#each agents}}
{{#if memory.recent_decisions}}
#### {{name}} - Decision Making
{{#each memory.recent_decisions}}
- {{this.decision}} ({{this.date}})
{{/each}}
{{/if}}
{{/each}}

## Capacity Planning

### Current Capacity
| Level | Members | Average Utilization |
|-------|---------|-------------------|
| Under-utilized (<70%) | {{#filter agents (lt current_workload.capacity 70)}}{{length}}{{/filter}} | Can take more work |
| Optimal (70-85%) | {{#filter agents (and (gte current_workload.capacity 70) (lte current_workload.capacity 85))}}{{length}}{{/filter}} | Well balanced |
| Over-utilized (>85%) | {{#filter agents (gt current_workload.capacity 85)}}{{length}}{{/filter}} | Risk of burnout |

### Recommendations
1. **Load Balancing**: Redistribute tasks from over-utilized members
2. **Skill Development**: Cross-train team members on critical skills
3. **AI Agent Optimization**: Fine-tune AI agents based on learning logs
4. **Process Improvement**: Reduce handoff times between teams

## Team Health Indicators

### Overall Team Health
- **Morale**: {{#if (average agents performance.team_satisfaction)}}{{average agents performance.team_satisfaction}}/5{{else}}Good (estimated){{/if}}
- **Collaboration**: Excellent - High cross-team engagement
- **Innovation**: {{#sum agents performance.innovations}}{{/sum}} innovations this period
- **Quality**: Average code quality {{#average agents performance.code_quality}}{{/average}}%

### Risk Areas
{{#each agents}}
{{#if (gt current_workload.capacity 90)}}
- **{{name}}**: Over 90% capacity - risk of burnout
{{/if}}
{{/each}}

## Action Items

### Immediate (This Week)
1. Address capacity issues for over-utilized team members
2. Resolve blockers affecting sprint velocity
3. Review and optimize AI agent configurations

### Short-term (Next Sprint)
1. Implement workload balancing automation
2. Enhance cross-team collaboration tools
3. Deploy additional AI agents for high-volume tasks

### Long-term (Next Quarter)
1. Develop comprehensive skill matrix
2. Implement predictive capacity planning
3. Create automated performance optimization system

---
*Report generated at {{generated_at}}*