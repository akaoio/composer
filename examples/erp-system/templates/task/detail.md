# Task: {{title}}

## Task Information
- **Task ID**: `{{id}}`
- **Project**: {{project_id}}
- **Type**: {{type}}
- **Status**: **{{status}}**
- **Priority**: {{priority}}
- **Story Points**: {{story_points}}

## Timeline
- **Created**: {{created_at}}
- **Last Updated**: {{updated_at}}
{{#if due_date}}- **Due Date**: {{due_date}}{{/if}}
{{#if completed_at}}- **Completed**: {{completed_at}}{{/if}}

## Assignment
### Assignees
{{#each assignees}}
- {{this}}
{{/each}}

### Reviewers
{{#each reviewers}}
- {{this}}
{{/each}}

## Progress Tracking
- **Current Progress**: {{progress}}%
{{#if time_tracking}}
### Time Tracking
- **Original Estimate**: {{time_tracking.estimated}} hours
- **Time Logged**: {{time_tracking.logged}} hours
- **Remaining**: {{time_tracking.remaining}} hours
- **Efficiency**: {{#if (lte time_tracking.logged time_tracking.estimated)}}✅ On track{{else}}⚠️ Over estimate{{/if}}
{{/if}}

{{#if blockers}}
## ⚠️ BLOCKERS
{{#each blockers}}
### Blocker {{@index}}
- **Waiting For**: {{this.waiting_for}}
- **Blocked Since**: {{this.blocked_since}}
- **Impact**: High - This task cannot proceed until resolved
{{/each}}
{{/if}}

{{#if dependencies}}
## Dependencies
This task depends on:
{{#each dependencies}}
- {{this}}
{{/each}}
{{/if}}

{{#if subtasks}}
## Subtasks
| Subtask | Title | Status | Assignee |
|---------|-------|--------|----------|
{{#each subtasks}}
| {{this.id}} | {{this.title}} | {{this.status}} | {{this.assignee}} |
{{/each}}

### Subtask Progress
- Total Subtasks: {{subtasks.length}}
- Completed: {{#filter subtasks status="completed"}}{{length}}{{/filter}}
- In Progress: {{#filter subtasks status="in_progress"}}{{length}}{{/filter}}
- Not Started: {{#filter subtasks status="not_started"}}{{length}}{{/filter}}
{{/if}}

{{#if acceptance_criteria}}
## Acceptance Criteria
{{#each acceptance_criteria}}
- [ ] **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if deliverables}}
## Deliverables
{{#each deliverables}}
- {{#if (eq this true)}}✅{{else if (eq this "completed")}}✅{{else if (eq this "in_review")}}🔄{{else}}⏳{{/if}} **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if stages}}
## Implementation Stages
| Stage | Status |
|-------|--------|
{{#each stages}}
| {{@key}} | {{this}} |
{{/each}}
{{/if}}

{{#if security_review}}
## Security Review
- **Status**: {{security_review.status}}
- **Scheduled**: {{security_review.scheduled}}
{{/if}}

{{#if compliance}}
## Compliance Requirements
{{#each compliance}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if demo_details}}
## Demo Information
- **Customer**: {{demo_details.customer}}
- **Date**: {{demo_details.date}}
- **Duration**: {{demo_details.duration}}
- **Expected Attendees**: {{demo_details.attendees}}

### Preparation Checklist
{{#each preparation}}
- {{#if (eq this "completed")}}✅{{else if (eq this "in_progress")}}🔄{{else}}⏳{{/if}} **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if comments}}
## Activity Log
{{#each comments}}
### {{this.timestamp}} - {{this.author}}
> {{this.text}}

{{/each}}
{{/if}}

{{#if labels}}
## Labels
{{#each labels}}
`{{this}}` {{/each}}
{{/if}}

## Task Health

### Status Indicators
- **Schedule**: {{#if due_date}}{{#if (isPastDue due_date)}}🔴 Overdue{{else if (isDueSoon due_date)}}⚠️ Due Soon{{else}}✅ On Schedule{{/if}}{{else}}📅 No deadline{{/if}}
- **Progress**: {{#if (gte progress 75)}}✅ Good Progress{{else if (gte progress 25)}}⚠️ In Progress{{else}}🔴 Just Started{{/if}}
- **Blockers**: {{#if blockers}}🔴 Blocked{{else}}✅ Clear{{/if}}
- **Dependencies**: {{#if dependencies}}⚠️ Has Dependencies{{else}}✅ Independent{{/if}}

### Risk Level
{{#if blockers}}
**HIGH RISK** - Task is blocked and cannot proceed
{{else if (and due_date (isPastDue due_date))}}
**HIGH RISK** - Task is overdue
{{else if (lt progress 25)}}
**MEDIUM RISK** - Limited progress made
{{else}}
**LOW RISK** - Task progressing normally
{{/if}}

## Next Actions
1. {{#if blockers}}Resolve blockers immediately{{else}}Continue implementation{{/if}}
2. {{#if (lt progress 50)}}Accelerate development effort{{else}}Maintain current pace{{/if}}
3. {{#if reviewers}}Prepare for code review{{else}}Identify reviewers{{/if}}
4. {{#if due_date}}Monitor deadline closely{{else}}Set target completion date{{/if}}

---
*Task details generated at {{generated_at}}*