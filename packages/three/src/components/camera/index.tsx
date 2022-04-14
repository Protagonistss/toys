import { useEffect, useRef } from "react"
import { CameraHelper, Color, DirectionalLight, PerspectiveCamera, Scene, WebGL1Renderer } from 'three'
// import { CameraHelper, Color, DirectionalLight, Scene, WebGL1Renderer, OrthographicCamera } from 'three'
import createScene from '@/components/light/helper'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const ExploreCamera = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const leftViewRef = useRef<HTMLDivElement>(null)
  const rightViewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (canvasRef.current === null || leftViewRef.current === null || rightViewRef.current === null) {
      return
    }

    const renderer = new WebGL1Renderer({ canvas: canvasRef.current as HTMLCanvasElement })
    renderer.setScissorTest(true)

    const scene = createScene()
    scene.background = new Color(0x000000)
    sceneRef.current = scene

    const light = new DirectionalLight(0xFFFFFF, 1)
    light.position.set(0, 10, 0)
    light.target.position.set(5, 0, 0)
    scene.add(light)
    scene.add(light.target)

    const leftCamera = new PerspectiveCamera(45, 2, 5, 100)
    leftCamera.position.set(0, 10, 20)

    // const leftCamera = new OrthographicCamera(-1, 1, 1, -1, 5, 50)
    // leftCamera.zoom = 0.2

    const helper = new CameraHelper(leftCamera)
    scene.add(helper)

    const leftControls = new OrbitControls(leftCamera, leftViewRef.current)
    leftControls.target.set(0, 5, 0)
    leftControls.update()

    const rightCamera = new PerspectiveCamera(60, 2, 0.1, 200)
    rightCamera.position.set(40, 10, 30)
    rightCamera.lookAt(0, 5, 0)

    const rightControls = new OrbitControls(rightCamera, rightViewRef.current)
    rightControls.target.set(0, 5, 0)
    rightControls.update()

    const setScissorForElement = (dom: HTMLDivElement) => {
      if (canvasRef.current === null) {
        return
      }
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const divRect = dom.getBoundingClientRect()

      // calculate the size and location
      const right = Math.min(divRect.right, canvasRect.right) - canvasRect.left
      const left = Math.max(0, divRect.left - canvasRect.left)
      const bottom = Math.min(divRect.bottom, canvasRect.bottom) - canvasRect.top
      const top = Math.max(0, divRect.top - canvasRect.top)
      const width = Math.min(canvasRect.width, right - left)
      const height = Math.min(canvasRect.height, bottom - top)

      const positiveYUpBottom = canvasRect.height - bottom
      renderer.setScissor(left, positiveYUpBottom, width, height)
      renderer.setViewport(left, positiveYUpBottom, width, height)

      return width / height
    }

    const render = () => {
      if (leftCamera === null || rightCamera === null || sceneRef.current === null) {
        return
      }
      const sceneBackground = sceneRef.current.background as Color

      // left camera
      const leftAspect = setScissorForElement(leftViewRef.current as HTMLDivElement)
      leftCamera.aspect = leftAspect as number
      // leftCamera.left = -(leftAspect as number)
      // leftCamera.right = leftAspect as number
      leftCamera.updateProjectionMatrix()
      helper.update()
      helper.visible = false

      sceneBackground.set(0x000000)
      renderer.render(sceneRef.current, leftCamera)

      // right camera
      const rightAspect = setScissorForElement(rightViewRef.current as HTMLDivElement)
      rightCamera.aspect = rightAspect as number
      rightCamera.updateProjectionMatrix()
      helper.visible = true

      sceneBackground.set(0x000040)
      renderer.render(sceneRef.current, rightCamera)
      window.requestAnimationFrame(render)
    }

    window.requestAnimationFrame(render)

    const onResize = () => {
      if (canvasRef.current === null) {
        return
      }
      const width = canvasRef.current.clientWidth
      const height = canvasRef.current.clientHeight
      renderer.setSize(width, height, false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
  return (
    <div className="full-screen">
      <div className="split">
        <div ref={ leftViewRef }></div>
        <div ref={ rightViewRef }></div>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default ExploreCamera