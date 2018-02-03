const CLIEngine = require('eslint').CLIEngine;

module.exports = ({ src }) => {
  const cli = new CLIEngine({
    envs: ['browser'],
    useEslintrc: true,
    rules: {
      semi: 2
    }
  });

  // cli.resolveFileGlobPatterns(['.'])
  return new Promise((resolve, reject) => {
    const report = cli.executeOnFiles([src]);

    // console.log(formatter(report.results))

    const hasErrors = report.results.some(file => {
      return file.errorCount > 0;
    });

    if (hasErrors) {
      return reject(report.results);
    }

    resolve(report.results);
  });

  // return cli.executeOnFiles(['.'])
};
