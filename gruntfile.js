module.exports = function gruntConfig(grunt) {
  require('load-grunt-tasks')(grunt);

  var files = ['gruntfile.js', 'index.js', 'test/**/*.js', 'lib/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'lib/metamatic.js': 'src/metamatic.js',
          'test/test.spec.js': 'src/test.spec.js',
        },
      },
    },

    eslint: {
      target: files,
    },

    mochaTest: {
      src: ['test/**/*.js'],
      options: {
        reporter: 'spec',
        require: ['babel/register', 'should'],
      },
    },

    watch: {
      scripts: {
        files: files,
        tasks: ['eslint'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.registerTask('default', ['babel']);
  grunt.registerTask('test', ['eslint', 'mochaTest', 'babel']);
};
