const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const pathConfig = require('./paths.json')

const build = async () => {
  const destPath = path.resolve(__dirname, pathConfig.artifactsDir)
  const output = fs.createWriteStream(path.join(destPath, 'Shut Up.zip'))
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', () => {
    console.log(`Compressed payload is ${archive.pointer()} bytes.`)
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
