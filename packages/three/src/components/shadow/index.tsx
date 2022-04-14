import { useEffect, useRef } from "react"
import { BoxBufferGeometry, CameraHelper, Color, DirectionalLight, DirectionalLightHelper, DoubleSide, HemisphereLight, Material, MathUtils, Mesh, MeshBasicMaterial, MeshPhongMaterial, NearestFilter, Object3D, PerspectiveCamera, PlaneBufferGeometry, RepeatWrapping, Scene, SphereBufferGeometry, TextureLoader, WebGL1Renderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface SphereShadowBase {
  base: Object3D
  sphereMesh: Mesh
  shadowMesh: Mesh
  y: number
}

const ExploreShadow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current })
    renderer.physicallyCorrectLights = true

    const camera = new PerspectiveCamera(45, 2, 0.1, 2000)
    camera.position.set(0, 10, 20)

    const scene = new Scene()
    scene.background = new Color('#ffffff')
    
    const hemisphereLight = new HemisphereLight(0xB1E1FF, 0xB97A20, 2)
    scene.add(hemisphereLight)

    const directionalLight = new DirectionalLight(0xFFFFFF, 1)
    directionalLight.position.set(0, 10, 5)
    directionalLight.target.position.set(-5, 0, 0)
    scene.add(directionalLight)
    scene.add(directionalLight.target)

    const planeSize = 40
    const loader = new TextureLoader()
    const texture = loader.load(require('@/assets/checker.png'))
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(planeSize / 2, planeSize / 2)

    const planeMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide })
    planeMaterial.color.setRGB(1.5, 1.5, 1.5)
    const planeGeometry = new PlaneBufferGeometry(planeSize, planeSize)
    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = Math.PI * -0.5
    scene.add(plane)

    const shadowTexture = loader.load(require('@/assets/shadow.png'))
    const baseList:SphereShadowBase[] = []
    const sphereRadius = 1
    const sphereGeometry = new SphereBufferGeometry(sphereRadius, 32, 16)
    const shadowSize = 1
    const shadowGeometry = new PlaneBufferGeometry(shadowSize, shadowSize)

    const numSphere = 15

    for(let i = 0; i < numSphere; i ++) {
      const base = new Object3D()
      scene.add(base)

      const shadowMaterial = new MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false
      })

      const shadowSize = sphereRadius * 4
      const shadow = new Mesh(shadowGeometry, shadowMaterial)
      shadow.position.y = 0.001
      shadow.rotation.x = Math.PI * -0.5
      shadow.scale.set(shadowSize, shadowSize, shadowSize)
      base.add(shadow)

      const sphereMaterial = new MeshPhongMaterial()
      sphereMaterial.color.setHSL(i / numSphere, 1, 0.75)
      const sphere = new Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(0, sphereRadius + 2, 0)
      base.add(sphere)

      baseList.push({
        base,
        sphereMesh: sphere,
        shadowMesh: shadow,
        y: sphere.position.y
      })
    }

    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 5, 0)
    controls.update()

    const render = (time: number) => {
      time *= 0.001
      baseList.forEach((item, index) => {
        const { base, sphereMesh, shadowMesh, y } = item
        const u = index / baseList.length
        const speed = time * 0.2
        const angle = speed + u * Math.PI * 2 * (index % 1 ? 1 : -1)
        const radius = Math.sin(speed - index) * 10
        base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
        const yOff = Math.abs(Math.sin(time * 2 + index))
        sphereMesh.position.y = y + MathUtils.lerp(-2, 2, yOff);
        (shadowMesh.material as Material).opacity = MathUtils.lerp(1, 0.25, yOff)
      })
      renderer.render(scene, camera)
      window.requestAnimationFrame(render)
    }
    window.requestAnimationFrame(render)

    const onResize = () => {
      if (canvasRef.current === null) {
        return
      }
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight, false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
  return <canvas ref={ canvasRef }></canvas>
}

const ExploreShadow2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current })
    renderer.shadowMap.enabled = true
    renderer.physicallyCorrectLights = true

    const scene = new Scene()
    scene.background = new Color(0x333333)

    const camera = new PerspectiveCamera()
    camera.position.set(0, 10, 20)
    scene.add(camera)

    const helperCamera = new PerspectiveCamera(42, 2, 5, 100)
    helperCamera.position.set(20, 10, 20)
    scene.add(helperCamera)

    const cameraHelper = new CameraHelper(helperCamera)
    scene.add(cameraHelper)

    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 5, 0)
    controls.update()

    const light = new DirectionalLight(0xFFFFFF, 1)
    light.castShadow = true
    light.position.set(0, 10, 0)
    light.target.position.set(-4, 0, -4)
    scene.add(light)
    scene.add(light.target)

    const hemisphereLight = new HemisphereLight(0xFFFFFF, 0x000000, 2)
    scene.add(hemisphereLight)

    const shadowCamera = light.shadow.camera
    shadowCamera.left = -10
    shadowCamera.right = 10
    shadowCamera.top = 10
    shadowCamera.bottom = -10
    shadowCamera.updateProjectionMatrix()

    const lightHelper = new DirectionalLightHelper(light)
    scene.add(lightHelper)

    const shadowHelper = new CameraHelper(shadowCamera)
    scene.add(shadowHelper)

    const planeSize = 40

    const loader = new TextureLoader()
    const texture = loader.load(require('@/assets/checker.png'))
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.magFilter = NearestFilter
    texture.repeat.set(planeSize / 2, planeSize / 2)

    const planeGeometry = new PlaneBufferGeometry(planeSize, planeSize)
    const planeMaterial = new MeshPhongMaterial({
      map: texture,
      side: DoubleSide
    })
    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = Math.PI * -0.5
    scene.add(plane)

    const boxMaterial = new MeshPhongMaterial({
      color: 0x88AACC
    })
    const boxGeometry = new BoxBufferGeometry(4, 4, 4)
    const box = new Mesh(boxGeometry, boxMaterial)

    box.castShadow = true
    box.receiveShadow = true
    box.position.set(5, 3, 0)
    scene.add(box)

    const sphereGeometry = new SphereBufferGeometry(3, 32, 16)
    const sphere = new Mesh(sphereGeometry, boxMaterial)
    sphere.castShadow = true
    sphere.receiveShadow = true
    sphere.position.set(-4, 5, 0)
    scene.add(sphere)

    const render = () => {
      cameraHelper.update()
      lightHelper.update()
      shadowHelper.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(render)
    }
    window.requestAnimationFrame(render)

    const onResize = () => {
      if (canvasRef.current === null) {
        return
      }
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
  return <canvas ref={ canvasRef }></canvas>
}

export { ExploreShadow, ExploreShadow2 }