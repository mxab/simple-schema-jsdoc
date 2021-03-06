Package.describe({
  name: 'mxab:simple-schema-jsdoc',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: 'generates a json schema type',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mxab/simple-schema-jsdoc.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.5');
  api.use("aldeed:simple-schema@1.3.1", ["client", "server"]);
  api.addFiles('simple-schema-jsdoc.js');
});

