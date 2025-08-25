# Agent Profile: {{name}}

## Basic Information
- **ID**: `{{id}}`
- **Role**: {{role}}
- **Department**: {{department}}
- **Type**: {{type}}
- **Status**: {{status}}
{{#if level}}- **Level**: {{level}}{{/if}}
{{#if model}}- **AI Model**: {{model}}{{/if}}
{{#if joined_date}}- **Joined**: {{joined_date}}{{/if}}
{{#if activated_date}}- **Activated**: {{activated_date}}{{/if}}
{{#if location}}- **Location**: {{location}}{{/if}}
{{#if timezone}}- **Timezone**: {{timezone}}{{/if}}

## Current Workload

### Active Projects
{{#each current_workload.projects}}
- **{{@key}}**: {{this}}
{{/each}}

### Assigned Tasks
{{#each current_workload.tasks}}
- {{this}}
{{/each}}

### Capacity
- **Current Utilization**: {{current_workload.capacity}}
{{#if current_workload.availability}}- **Availability**: {{current_workload.availability}}{{/if}}
{{#if current_workload.parallel_tasks}}- **Parallel Tasks**: {{current_workload.parallel_tasks}}{{/if}}

## Skills & Capabilities

{{#if skills}}
### Technical Skills
{{#each skills.technical}}
- **{{@key}}**: {{this}}
{{/each}}

{{#if skills.leadership}}
### Leadership Skills
{{#each skills.leadership}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if skills.domains}}
### Domain Expertise
{{#each skills.domains}}
- {{this}}
{{/each}}
{{/if}}
{{/if}}

{{#if capabilities}}
### Programming Languages
{{#each capabilities.programming_languages}}
- **{{@key}}**: {{this}}
{{/each}}

### Frameworks
{{#each capabilities.frameworks}}
- **{{@key}}**: {{this}}
{{/each}}

### Specializations
{{#each capabilities.specializations}}
- {{this}}
{{/each}}
{{/if}}

{{#if expertise}}
### Research Areas
{{#each expertise.research_areas}}
- **{{@key}}**: {{this}}
{{/each}}

### Academic Achievements
- **Publications**: {{expertise.publications}}
- **Patents**: {{expertise.patents}}
- **Citations**: {{expertise.citations}}
{{/if}}

{{#if responsibilities}}
### Key Responsibilities
{{#each responsibilities}}
- {{this}}
{{/each}}
{{/if}}

## Performance Metrics

{{#if performance.rating}}- **Overall Rating**: {{performance.rating}}{{/if}}
{{#if performance.completed_tasks}}- **Tasks Completed**: {{performance.completed_tasks}}{{/if}}
{{#if performance.on_time_delivery}}- **On-Time Delivery**: {{performance.on_time_delivery}}{{/if}}
{{#if performance.code_quality}}- **Code Quality**: {{performance.code_quality}}{{/if}}
{{#if performance.team_satisfaction}}- **Team Satisfaction**: {{performance.team_satisfaction}}{{/if}}
{{#if performance.uptime}}- **System Uptime**: {{performance.uptime}}{{/if}}
{{#if performance.response_time}}- **Avg Response Time**: {{performance.response_time}}{{/if}}
{{#if performance.accuracy}}- **Accuracy Rate**: {{performance.accuracy}}{{/if}}
{{#if performance.innovations}}- **Innovations Created**: {{performance.innovations}}{{/if}}
{{#if performance.quota_attainment}}- **Quota Attainment**: {{performance.quota_attainment}}{{/if}}
{{#if performance.deals_closed}}- **Deals Closed**: {{performance.deals_closed}}{{/if}}
{{#if performance.pipeline_value}}- **Pipeline Value**: {{performance.pipeline_value}}{{/if}}
{{#if performance.win_rate}}- **Win Rate**: {{performance.win_rate}}{{/if}}
{{#if performance.customer_satisfaction}}- **Customer Satisfaction**: {{performance.customer_satisfaction}}{{/if}}

{{#if memory}}
## Memory & Learning

{{#if memory.recent_decisions}}
### Recent Decisions
{{#each memory.recent_decisions}}
- **{{this.date}}**: {{this.decision}}
  - *Rationale*: {{this.rationale}}
{{/each}}
{{/if}}

{{#if memory.learned_patterns}}
### Learned Patterns
{{#each memory.learned_patterns}}
- {{this.pattern}}
{{/each}}
{{/if}}

{{#if memory.preferences}}
### Work Preferences
{{#each memory.preferences}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if memory.context_window}}
### System Memory
- **Context Window**: {{memory.context_window}}
{{#if memory.persistent_storage}}
- **Storage Usage**:
{{#each memory.persistent_storage}}
  - {{@key}}: {{this}}
{{/each}}
{{/if}}
{{/if}}

{{#if memory.recent_interactions}}
### Recent Interactions
{{#each memory.recent_interactions}}
- **{{this.timestamp}}** ({{this.type}}): {{this.outcome}}
{{/each}}
{{/if}}

{{#if memory.learning_log}}
### Learning Log
{{#each memory.learning_log}}
- **{{this.date}}**: {{this.learned}} {{#if this.applied}}✓ Applied{{/if}}
{{/each}}
{{/if}}

{{#if memory.research_insights}}
### Research Insights
{{#each memory.research_insights}}
- **{{this.insight}}**
  - Validated: {{this.validated}}
  - Impact: {{this.impact}}
{{/each}}
{{/if}}

{{#if memory.successful_strategies}}
### Successful Strategies
{{#each memory.successful_strategies}}
- **{{this.strategy}}**: {{this.success_rate}} success rate
{{/each}}
{{/if}}

{{#if memory.client_preferences}}
### Client Preferences
{{#each memory.client_preferences}}
- **{{@key}}**: {{this}}
{{/each}}
{{/if}}

{{#if memory.system_patterns}}
### System Patterns
{{#each memory.system_patterns}}
- **Pattern**: {{this.pattern}}
  - **Response**: {{this.response}}
{{/each}}
{{/if}}

{{#if memory.agent_behaviors}}
### Agent Behavior Observations
{{#each memory.agent_behaviors}}
- **{{this.agent}}**: {{this.observation}}
  - **Adaptation**: {{this.adaptation}}
{{/each}}
{{/if}}
{{/if}}

{{#if collaborations}}
## Collaborations

### Internal Teams
{{#each collaborations.internal}}
- **{{@key}}**: {{this}}
{{/each}}

{{#if collaborations.external}}
### External Partners
{{#each collaborations.external}}
- {{this}}
{{/each}}
{{/if}}
{{/if}}

{{#if network}}
## Professional Network
- **Clients**: {{network.clients}}
- **Prospects**: {{network.prospects}}
- **Partners**: {{network.partners}}
- **Industry Contacts**: {{network.industry_contacts}}
{{/if}}

{{#if achievements}}
## Achievements
{{#each achievements}}
- **{{this.date}}**: {{this.achievement}}
{{/each}}
{{/if}}

{{#if coordination}}
## System Coordination (Meta-Agent)
- **Managed Agents**: {{coordination.managed_agents}}
- **Active Workflows**: {{coordination.active_workflows}}
- **Decisions/Hour**: {{coordination.decisions_per_hour}}
- **Optimization Cycles**: {{coordination.optimization_cycles}}
{{/if}}

{{#if system_state}}
## System State (Meta-Agent)
- **CPU Usage**: {{system_state.cpu_usage}}
- **Memory Usage**: {{system_state.memory_usage}}
- **Network Latency**: {{system_state.network_latency}}
- **Queue Depth**: {{system_state.queue_depth}}
- **Error Rate**: {{system_state.error_rate}}
{{/if}}

{{#if optimizations}}
## Recent Optimizations (Meta-Agent)
### Recent
{{#each optimizations.recent}}
- **{{this.type}}**: {{this.improvement}} improvement at {{this.timestamp}}
{{/each}}

### Scheduled
{{#each optimizations.scheduled}}
- **{{this.type}}**: Scheduled for {{this.scheduled_for}}
{{/each}}
{{/if}}

---
*Profile generated at {{generated_at}}*