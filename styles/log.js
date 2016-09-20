const boxen = require('boxen')
const chalk = require('chalk')
const gzip = require('gzip-size')
const prettyBytes = require('pretty-bytes')

exports.log = (context, msgs) => {
  if (Array.isArray(msgs)){
    console.log(boxen(
      chalk.green.bold(context)
      + ':\n'
      + msgs.filter(msg => !(/^node_modules/.test(msg)))
      .map(msg => chalk.yellow.bold(msg))
      .join('\n')
      + (msgs.filter(msg => (/^node_modules/.test(msg))).length
      ? '\n\n' + chalk.green.bold('NODE MODULES') + ':'
      : '')
      + (msgs
        .filter(msg => (/^node_modules/.test(msg)))
        .map(msg => msg.replace(/^node_modules\//, ''))
        .map(msg => '\n' + chalk.yellow.bold(msg))
        .join('')
      ),
      { padding: 1 }
    ))
  }
}

exports.size = results => {
  const msgs = []

  for (const key in results){
    const size = Buffer.byteLength(results[key])
    const min = gzip.sync(results[key])

    msgs.push(
      chalk.green.bold(key)
      + ': '
      + chalk.yellow.bold(prettyBytes(size))
      + ', '
      + chalk.green.bold(key + ' gzip')
      + ': '
      + chalk.yellow.bold(prettyBytes(min))
    )
  }

  console.log(boxen(msgs.join('\n'), { padding: 1 }))
}
