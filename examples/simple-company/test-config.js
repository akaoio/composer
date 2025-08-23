module.exports = {
  sources: {
    memberData: {
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
        pattern: 'output/{{team_id}}-{{id}}.md',
        forEach: 'sources.memberData.members'
      },
      template: 'simple-template.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.'
  }
}