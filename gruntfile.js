module.exports = function gruntConfig(grunt) {
  require('load-grunt-tasks')(grunt);

  const files = ['gruntfile.js', 'index.js', 'test/**/*.js', 'lib/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'es5/metamatic.js': 'lib/metamatic.js',
        },
      },
    },

    eslint: {
      target: files,
    },

    mochaTest: {
      src: ['test/**/*-test.js'],
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
