---
id: "{{id}}"
employee_name: "{{name}}"
employee_id: "{{id}}"
role: "{{role}}"
team: "{{team_name}}"
team_id: "{{team_id}}"
skills: "{{skills}}"
company: "{{company_name}}"
generated_date: "{{timestamp}}"
template_version: "1.0"
---

# Job Description: {{name}}

## Personal Information
- **Full Name**: {{name}}
- **Employee ID**: {{id}}
- **Position**: {{role}}
- **Primary Skills**: {{skills}}
- **Team**: {{team_name}}

---

## Company Overview

### 🏢 {{company_name}}

**Mission**: {{company_mission}}

**Vision**: {{company_vision}}

### Our Core Values
- {{value_1}}
- {{value_2}}
- {{value_3}}
- {{value_4}}

---

## Your Team: {{team_name}}

**Team Mission**: {{team_mission}}

### Your Teammates
{{#each teammates}}
- {{name}} - {{role}}
{{/each}}

---

## Company Policies

- **Work Hours**: {{policy_hours}}
- **Code Review**: {{policy_review}}
- **Testing**: {{policy_testing}}

---

## Your Responsibilities

As a **{{role}}** specializing in **{{skills}}**, you will:

1. **Core Work**: Contribute to {{team_mission}}
2. **Collaboration**: Work with your 5-person {{team_name}}
3. **Standards**: Follow {{company_name}} development practices
4. **Growth**: Develop expertise in {{skills}}

---

## Contact Information

- **Team**: {{team_id}}@{{company_domain}}
- **HR**: hr@{{company_domain}}
- **IT**: it@{{company_domain}}

---

*Generated on {{timestamp}} for {{name}} ({{id}})*
*Company: {{company_name}} | Team: {{team_name}}*