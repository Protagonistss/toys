import { SphereBufferGeometry, MeshPhongMaterial, Mesh, Object3D, SpotLight } from 'three'

// sphere
const sphere = new SphereBufferGeometry(1, 6, 6)

// sun
const sunMaterial = new MeshPhongMaterial({ emissive: 0xFFFF00 })
const sun = new Mesh(sphere, sunMaterial)

// earth
const earthMaterial = new MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 })
const earth = new Mesh(sphere, earthMaterial)

// moon
const moonMaterial = new MeshPhongMaterial({ color: 0x88888888, emissive: 0x22222222,  })
const moon = new Mesh(sphere, moonMaterial)
moon.scale.set(0.5, 0.5, 0.5)

const moonOribit = new Object3D()
moonOribit.position.x = 2
moonOribit.add(moon)

const earthOribit = new Object3D()
earthOribit.position.x = 10
earthOribit.add(earth)
earthOribit.add(moonOribit)

const solarSet = new Object3D()
solarSet.add(sun)
solarSet.add(earthOribit)

const spotLight = new SpotLight(0xFFFFFF, 3)

export { sphere, spotLight, moonOribit, earthOribit, solarSet }