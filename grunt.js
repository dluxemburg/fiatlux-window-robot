module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-exec')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.initConfig({
    pkg: '<json:package.json>',
    mochaTest: {
      files: ['test/**/*.test.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    }
  })

  grunt.registerTask('test', 'mochaTest')
  grunt.registerTask('default', 'lint test')

}