import { useEffect, useRef, useState } from 'react'
import { PerspectiveCamera, Scene, WebGL1Renderer, AmbientLight, AmbientLightProbe, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, PointLight, PointLightHelper, RectAreaLight, MathUtils, SpotLight, SpotLightHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import createScene, { MaterialType } from './helper'


enum LightType {
  AmbientLight = 'AmbientLight',
  AmbientLightProbe = 'AmbientLightProbe',
  DirectionalLight = 'DirectionalLight',
  HemisphereLight = 'HemisphereLight',
  HemisphereLightProbe = 'HemisphereLightProbe',
  PointLight = 'PointLight',
  RectAreaLight = 'RectAreaLight',
  SpotLight = 'SpotLight'
}

const buttonLables = [LightType.AmbientLight, LightType.AmbientLightProbe, LightType.DirectionalLight,
  LightType.HemisphereLight, LightType.HemisphereLightProbe, LightType.PointLight,
  LightType.RectAreaLight, LightType.SpotLight]

const ExploreLight = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)

  const [type, setType] = useState<LightType>(LightType.AmbientLight)

  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current })
    const camera = new PerspectiveCamera(45, 2, 0.1, 1000)
    camera.position.set(0, 10, 20)

    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 5, 0)
    controls.update()
    
    const scene = createScene()
    sceneRef.current = scene

    const render = () => {
      if (sceneRef.current) {
        renderer.render(sceneRef.current, camera)
      }
      window.requestAnimationFrame(render)
    }
    window.requestAnimationFrame(render)

    const onResize = () => {
      const canvas = canvasRef.current as HTMLCanvasElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])

  useEffect(() => {
    if (sceneRef.current === null) {
      return
    }
    sceneRef.current = null
    let newScene: Scene
    if (type === LightType.RectAreaLight) {
      newScene = createScene(MaterialType.MESH_STANDARD_MATERIAL)
    } else {
      newScene = createScene()
    }
    sceneRef.current = newScene

    switch (type) {
      case LightType.AmbientLight:
        const ambientLight = new AmbientLight(0xFFFFFF, 1)
        newScene.add(ambientLight)
        break
      case LightType.AmbientLightProbe:
        const ambientLightProbe = new AmbientLightProbe(0xFFFFFF, 1)
        newScene.add(ambientLightProbe)
        break
      case LightType.DirectionalLight:
        const directionalLight = new DirectionalLight(0xFFFFFF, 1)
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, 0, 0)
        newScene.add(directionalLight)
        newScene.add(directionalLight.target)

        const directionalLightHelper = new DirectionalLightHelper(directionalLight)
        newScene.add(directionalLightHelper)
        break
      case LightType.HemisphereLight:
        const hemisphereLight = new HemisphereLight(0xB1E1FF, 0xB97A20, 1)
        newScene.add(hemisphereLight)

        const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight,5)
        newScene.add(hemisphereLightHelper)

        break
      case LightType.HemisphereLightProbe:
        const hemisphereLightProbe = new HemisphereLightProbe(0xB1E1FF, 0xB97A20, 1)
        newScene.add(hemisphereLightProbe)
        break
      case LightType.PointLight:
        const pointLight = new PointLight(0xFFFFFF, 1)
        pointLight.position.set(0, 10, 0)
        newScene.add(pointLight)

        const pointLightHelper = new PointLightHelper(pointLight)
        newScene.add(pointLightHelper)
        break;
      case LightType.RectAreaLight:
        // RectAreaLightUniformsLib.init()
        const rectAreaLight = new RectAreaLight(0xFFFFFF, 5, 12, 4)
        rectAreaLight.position.set(0, 10, 0)
        rectAreaLight.rotation.x = MathUtils.degToRad(-90)
        newScene.add(rectAreaLight)

        const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
        newScene.add(rectAreaLightHelper)
        break
      case LightType.SpotLight:
        const spotLight = new SpotLight(0xFFFFFF, 1)
        spotLight.position.set(0, 10, 0);
        spotLight.target.position.set(-5, 0, 0)
        newScene.add(spotLight)
        newScene.add(spotLight.target)

        const spotLightHelper = new SpotLightHelper(spotLight)
        newScene.add(spotLightHelper)
        break
      default:
        console.log('not matched')
        break
    }
  }, [type])
  return (
    <div className="full-screen">
      <div className="buttons">
        {
          buttonLables.map((label, index) => {
            return <button 
              className={ label === type ? 'button-selected' : '' }
              onClick={ () => { setType(label) } }
              key={`button${index}`}
              >{label}</button>
          })
        }
      </div>
      <canvas ref={ canvasRef }></canvas>
    </div>
  )
}

export default ExploreLight