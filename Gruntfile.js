module.exports = function(grunt) {

  grunt.initConfig({
    bwr: grunt.file.readJSON('bower.json'),

		meta: {
			banner: "/* <%= bwr.name %> v<%= bwr.version %> - https://github.com/Leimi/drawingboard.js\n" +
			"* Copyright (c) <%= grunt.template.today('yyyy') %> Jeffrey Gensler\n" +
			'* Licensed MIT */\n'
		},

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        globals: {
          angular: true
        }
      }
    },

		concat: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
  			src: ['src/**/*.js'],
  			dest: 'tmp/concat.angular-drawingboard.js'
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>',
				report: 'gzip'
			},
			dist: {
			  files: {
				  'dist/angular-drawingboard.min.js': ['tmp/concat.angular-drawingboard.js']
			  }
			}
		},

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};