import { Scene, TextureLoader, RepeatWrapping, NearestFilter, Material, MeshStandardMaterial, DoubleSide, MeshPhongMaterial, PlaneBufferGeometry, Mesh, BoxBufferGeometry, SphereBufferGeometry } from 'three'

export enum MaterialType {
  MESH_PHONE_MATERIAL = 'MESH_PHONE_MATERIAL',
  MESH_STANDARD_MATERIAL = 'MESH_STANDARD_MATERIAL'
}

const createScene: (type?: keyof typeof MaterialType) => Scene = (type = MaterialType.MESH_PHONE_MATERIAL) => {
  const scene = new Scene()
  const planeSize = 40

  const loader = new TextureLoader()
  const texture = loader.load(require('@/assets/tiger.jpeg').default)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.magFilter = NearestFilter
  texture.repeat.set(planeSize / 2, planeSize / 2)

  let planeMaterial: Material
  let cubeMaterial: Material
  let sphereMaterial: Material

  switch (type) {
    case MaterialType.MESH_STANDARD_MATERIAL:
      planeMaterial = new MeshStandardMaterial({
        map: texture,
        side: DoubleSide
      })
      cubeMaterial = new MeshStandardMaterial({ color: '#8AC' })
      sphereMaterial = new MeshStandardMaterial({ color: '#CA8' })
      break
    default:
      planeMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide })
      cubeMaterial = new MeshPhongMaterial({ color: '#8AC' })
      sphereMaterial = new MeshPhongMaterial({ color: '#CA8'})
      break
  
  }
  
  const planeGeometry = new PlaneBufferGeometry(planeSize, planeSize)
  const plane = new Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = Math.PI * -0.5
  scene.add(plane)

  const cubeGeometry = new BoxBufferGeometry(4, 4, 4)
  const cube = new Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(5, 2.5, 0)
  scene.add(cube)

  const sphereGeometry = new SphereBufferGeometry(3, 32, 16)
  const sphere = new Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphere)

  return scene
}

export default createScene