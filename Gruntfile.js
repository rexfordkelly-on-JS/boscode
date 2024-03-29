module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true,
      },
      target1: [
        'Gruntfile.js',
        './lib/**/*.js',
        './test/**/*.js'
      ]
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          bail: true,
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['./test/**/*.js']
      }
    },

  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
