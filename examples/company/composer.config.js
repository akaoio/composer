export default {
  sources: {
    members: {
      pattern: 'data/flattened-members.json',
      parser: 'json'
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: {
        pattern: 'tmp/company-jobs/{{team_id}}-{{id}}.md',
        forEach: 'members'
      },
      format: 'markdown',
      processor: 'template-renderer',
      template: 'templates/job-description.md'
    }
  ],

  options: {
    baseDir: '/home/x/Projects/composer/examples/company'
  }
}