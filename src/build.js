const archiver = require('archiver')
const fs = require('fs-extra')
const path = require('path')
const pathConfig = require('./paths.json')

const build = async () => {
  const srcPath = path.resolve(__dirname, pathConfig.sourceDir)
  const destPath = path.resolve(__dirname, pathConfig.artifactsDir)
  const destFolder = path.join(destPath, 'Shut Up')

  await fs.copy(srcPath, destFolder, {
    overwrite: true,
    preserveTimestamps: true,
    // Remove dotfiles
    filter: path => {
      const keepPath = path.split('/').filter(item => /^\./.test(item)).length === 0
      if (!keepPath) {
        console.log(`Filtering path: ${path}`)
      }
      return keepPath
    }
  })

  const output = fs.createWriteStream(path.join(destPath, 'Shut Up.zip'))
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', () => {
    console.log(`Compressed payload is ${archive.pointer()} bytes.`)
    fs.remove(destFolder)
  })

  archive.on('error', err => {
    throw err
  })

  const globBase = 'Shut Up/**/*'
  const globWd = destPath

  archive.pipe(output)
  archive.glob(globBase, { cwd: globWd })
  archive.finalize()
}

build()
