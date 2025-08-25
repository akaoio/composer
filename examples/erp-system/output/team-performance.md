# Team Performance Report
*Reporting Period: *

## Executive Summary

### Team Overview
- **Total Team Members**: 
- **Active Members**: {{#filter agents status="active"}}{{/filter}}
- **Team Composition**:
  - Human: {{#filter agents type="human"}}{{/filter}}
  - AI Agents: {{#filter agents type="ai-agent"}}{{/filter}}
  - Hybrid: {{#filter agents type="hybrid"}}{{/filter}}
  - Human-Assisted AI: {{#filter agents type="human-assisted-ai"}}{{/filter}}

### Performance Highlights
- **Tasks Completed This Sprint**:  points
- **Average Team Utilization**: {{#average metrics.team_utilization}}{{/average}}%
- **Sprint Velocity**:  planned →  delivered

## Individual Performance

### Top Performers


## Department Performance

### Engineering Department
| Member | Role | Tasks | Utilization | Performance |
|--------|------|-------|-------------|-------------|


### Research Department
| Member | Role | Focus Area | Publications | Patents |
|--------|------|------------|--------------|---------|


### Sales Department
| Member | Role | Pipeline | Deals Closed | Quota |
|--------|------|----------|--------------|-------|


### Operations Department
| Member | Role | Workflows | Decisions/Hr | Uptime |
|--------|------|-----------|--------------|--------|


## Workload Distribution

### Current Sprint Tasks
| Assignee | Tasks Assigned | Story Points | Status |
|----------|----------------|--------------|--------|


### Project Involvement
| Team Member | Projects | Role in Project |
|-------------|----------|-----------------|


## AI Agent Performance

### AI Agent Metrics
| Agent | Model | Uptime | Response Time | Tasks | Accuracy |
|-------|-------|--------|---------------|-------|----------|


### AI Learning & Adaptation


## Collaboration Analysis

### Cross-Team Collaboration


### Task Dependencies & Handoffs
- Tasks with dependencies: {{#filter tasks dependencies}}{{/filter}}
- Cross-team handoffs this sprint: Estimated 15-20
- Average handoff time: < 2 hours

## Performance Trends

### Sprint-over-Sprint Comparison
| Metric | Previous Sprint | Current Sprint | Change |
|--------|----------------|----------------|--------|
| Velocity | 165 points |  points | 📉 {{#subtract sprint.completed 165}}{{/subtract}} |
| Completion Rate | 92% | {{#percentage sprint.completed sprint.committed}}{{/percentage}}% | 📉 |
| Blocked Tasks | 2 | {{#filter tasks blockers}}{{/filter}} | 📉 Better |

### Individual Growth


## Capacity Planning

### Current Capacity
| Level | Members | Average Utilization |
|-------|---------|-------------------|
| Under-utilized (<70%) | {{#filter agents (lt current_workload.capacity 70)}}{{/filter}} | Can take more work |
| Optimal (70-85%) | {{#filter agents (and (gte current_workload.capacity 70) (lte current_workload.capacity 85))}}{{/filter}} | Well balanced |
| Over-utilized (>85%) | {{#filter agents (gt current_workload.capacity 85)}}{{/filter}} | Risk of burnout |

### Recommendations
1. **Load Balancing**: Redistribute tasks from over-utilized members
2. **Skill Development**: Cross-train team members on critical skills
3. **AI Agent Optimization**: Fine-tune AI agents based on learning logs
4. **Process Improvement**: Reduce handoff times between teams

## Team Health Indicators

### Overall Team Health
- **Morale**: Good (estimated)
- **Collaboration**: Excellent - High cross-team engagement
- **Innovation**: {{#sum agents performance.innovations}}{{/sum}} innovations this period
- **Quality**: Average code quality {{#average agents performance.code_quality}}{{/average}}%

### Risk Areas


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
*Report generated at *