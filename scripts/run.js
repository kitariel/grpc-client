const { spawn, execSync } = require('child_process')
const package = require('../package.json')
const { 
  name, 
  version, 
  docker_repository = 'registry.dnamicro.com'
} = package

const {
  NODE_ENV = 'development'
} = process.env

const template_name = 'machine'

if( name === template_name && NODE_ENV !== 'development') {
  throw( new Error(`Package Name must be updated.`))
} 

const docker_binary = execSync('which docker')

if( !eval(docker_binary) ) {
  throw( new Error(`Docker is not installed.`))
}

const docker_image_name = `${docker_repository}/${name}:${NODE_ENV}-${version}`

try {
  execSync(`docker rm -f ${name}`)
} catch ( e ) {
  //
}

const builder = spawn( 'docker', [
  'run',
  '-t',
  '--rm',
  `--network=host`,
  `--volume=${process.cwd()}/src:/var/app/src`,
  `--name=${name}`,
  docker_image_name
] )

builder.stdout.on('data', ( data ) => { console.log( data.toString().replace(/\n/, '') )} )
builder.stderr.on('data', ( data ) => { console.error( data.toString().replace(/\n/, ''))}  )


