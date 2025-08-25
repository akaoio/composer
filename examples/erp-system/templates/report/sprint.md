# Sprint Report: {{sprint.name}}

## Sprint Overview
- **Sprint ID**: `{{sprint.id}}`
- **Duration**: {{sprint.start_date}} to {{sprint.end_date}}
- **Status**: {{#if (isSprintComplete sprint.end_date)}}Completed{{else}}In Progress{{/if}}

## Capacity & Commitment

### Sprint Metrics
| Metric | Value | Status |
|--------|-------|--------|
| Total Capacity | {{sprint.capacity}} points | - |
| Committed | {{sprint.committed}} points | {{#if (lte sprint.committed sprint.capacity)}}✅{{else}}⚠️ Over-committed{{/if}} |
| Completed | {{sprint.completed}} points | {{sprint.completed}}/{{sprint.committed}} ({{#percentage sprint.completed sprint.committed}}{{/percentage}}%) |
| In Progress | {{metrics.velocity.in_progress}} points | - |
| Blocked | {{metrics.velocity.blocked}} points | {{#if metrics.velocity.blocked}}🚫 Needs attention{{else}}✅{{/if}} |

### Velocity Trend
```
Planned:    {{sprint.committed}} points
Completed:  {{sprint.completed}} points
Velocity:   {{#if (gt sprint.completed 0)}}{{sprint.completed}} points/sprint{{else}}Not yet measurable{{/if}}
```

## Task Breakdown

### By Priority
| Priority | Points | Percentage |
|----------|--------|------------|
| Critical | {{metrics.by_priority.critical}} | {{#percentage metrics.by_priority.critical sprint.committed}}{{/percentage}}% |
| High | {{metrics.by_priority.high}} | {{#percentage metrics.by_priority.high sprint.committed}}{{/percentage}}% |
| Medium | {{metrics.by_priority.medium}} | {{#percentage metrics.by_priority.medium sprint.committed}}{{/percentage}}% |
| Low | {{metrics.by_priority.low}} | {{#percentage metrics.by_priority.low sprint.committed}}{{/percentage}}% |

### By Type
| Type | Points | Count |
|------|--------|-------|
| Feature | {{metrics.by_type.feature}} | {{#count tasks type="feature"}}{{/count}} tasks |
| Optimization | {{metrics.by_type.optimization}} | {{#count tasks type="optimization"}}{{/count}} tasks |
| Infrastructure | {{metrics.by_type.infrastructure}} | {{#count tasks type="infrastructure"}}{{/count}} tasks |
| Design | {{metrics.by_type.design}} | {{#count tasks type="design"}}{{/count}} tasks |
| Analysis | {{metrics.by_type.analysis}} | {{#count tasks type="analysis"}}{{/count}} tasks |

## Task Details

### Critical Priority Tasks
{{#each tasks}}
{{#if (eq this.priority "critical")}}
#### {{this.title}} (`{{this.id}}`)
- **Status**: {{this.status}}
- **Assignees**: {{#join this.assignees ", "}}{{/join}}
- **Points**: {{this.story_points}}
- **Progress**: {{this.progress}}
{{#if this.blockers}}- **⚠️ BLOCKED**: {{#each this.blockers}}{{this.waiting_for}} (since {{this.blocked_since}}){{/each}}{{/if}}

{{/if}}
{{/each}}

### High Priority Tasks
{{#each tasks}}
{{#if (eq this.priority "high")}}
#### {{this.title}} (`{{this.id}}`)
- **Status**: {{this.status}}
- **Assignees**: {{#join this.assignees ", "}}{{/join}}
- **Points**: {{this.story_points}}
- **Progress**: {{this.progress}}
{{#if this.blockers}}- **⚠️ BLOCKED**: {{#each this.blockers}}{{this.waiting_for}}{{/each}}{{/if}}

{{/if}}
{{/each}}

### Other Tasks
{{#each tasks}}
{{#if (and (ne this.priority "critical") (ne this.priority "high"))}}
- **{{this.id}}**: {{this.title}} ({{this.status}}, {{this.story_points}} points)
{{/if}}
{{/each}}

## Team Performance

### Utilization by Team Member
| Team Member | Utilization | Tasks | Points |
|-------------|-------------|-------|--------|
{{#each metrics.team_utilization}}
| {{@key}} | {{this}}% | {{#countTasksForMember @key tasks}}{{/countTasksForMember}} | {{#pointsForMember @key tasks}}{{/pointsForMember}} |
{{/each}}

### Time Tracking Summary
{{#each tasks}}
{{#if this.time_tracking}}
- **{{this.id}}**: {{this.time_tracking.logged}}h / {{this.time_tracking.estimated}}h ({{this.time_tracking.remaining}}h remaining)
{{/if}}
{{/each}}

## Blockers & Impediments

### Current Blockers
{{#each tasks}}
{{#if this.blockers}}
- **{{this.id}} - {{this.title}}**:
  {{#each this.blockers}}
  - Waiting for: {{this.waiting_for}}
  - Blocked since: {{this.blocked_since}}
  {{/each}}
{{/if}}
{{/each}}

### Dependencies at Risk
{{#each tasks}}
{{#if this.dependencies}}
- **{{this.id}}** depends on: {{#join this.dependencies ", "}}{{/join}}
{{/if}}
{{/each}}

## Completed Items

### Successfully Delivered
{{#each tasks}}
{{#if (eq this.status "completed")}}
✅ **{{this.id}}**: {{this.title}}
   - Completed: {{this.completed_at}}
   - Delivered by: {{#join this.assignees ", "}}{{/join}}
   {{#if this.deliverables}}
   - Deliverables:
     {{#each this.deliverables}}
     - {{@key}}: {{this}}
     {{/each}}
   {{/if}}
{{/if}}
{{/each}}

## Sprint Health Indicators

### Overall Health
- **Velocity**: {{#if (gte sprint.completed sprint.committed)}}✅ On Track{{else if (gte sprint.completed (multiply sprint.committed 0.7))}}⚠️ Below Target{{else}}🔴 Significantly Behind{{/if}}
- **Blockers**: {{#if metrics.velocity.blocked}}🔴 {{metrics.velocity.blocked}} points blocked{{else}}✅ No blockers{{/if}}
- **Team Capacity**: {{#if (averageUtilization metrics.team_utilization)}}{{#if (gt (averageUtilization metrics.team_utilization) 90)}}⚠️ Over-utilized{{else}}✅ Healthy{{/if}}{{/if}}
- **Progress Rate**: {{#percentage sprint.completed sprint.committed}}{{/percentage}}% of commitment

### Risk Assessment
{{#if (lt sprint.completed (multiply sprint.committed 0.5))}}
⚠️ **HIGH RISK**: Sprint is significantly behind schedule
- Only {{#percentage sprint.completed sprint.committed}}{{/percentage}}% complete
- {{metrics.velocity.blocked}} points blocked
- Immediate escalation recommended
{{else if (lt sprint.completed (multiply sprint.committed 0.7))}}
⚠️ **MEDIUM RISK**: Sprint progress below expectations
- {{#percentage sprint.completed sprint.committed}}{{/percentage}}% complete
- Monitor closely and consider scope adjustment
{{else}}
✅ **LOW RISK**: Sprint progressing well
- {{#percentage sprint.completed sprint.committed}}{{/percentage}}% complete
- Team delivering as expected
{{/if}}

## Recommendations

### Immediate Actions
1. {{#if metrics.velocity.blocked}}Resolve blockers for {{metrics.velocity.blocked}} points of work{{else}}Continue current momentum{{/if}}
2. {{#if (gt metrics.team_utilization.average 85)}}Consider load balancing across team{{else}}Maintain current assignments{{/if}}
3. Focus on completing critical priority items first

### For Next Sprint
1. {{#if (lt sprint.completed sprint.committed)}}Reduce commitment to match actual velocity{{else}}Consider increasing commitment slightly{{/if}}
2. Address any recurring blockers or dependencies
3. Review and update estimation accuracy

## Sprint Retrospective Notes

### What Went Well
- Team collaboration and communication
- Quick resolution of technical challenges
- Progress on critical path items

### Areas for Improvement
- Dependency management between tasks
- Time estimation accuracy
- Blocker prevention strategies

### Action Items
1. Implement better dependency tracking
2. Review estimation process with team
3. Create blocker prevention checklist

---
*Report generated at {{generated_at}}*