import { useRef, useEffect } from 'react'
import { WebGL1Renderer, PerspectiveCamera, Scene, Color, AxesHelper, Material } from 'three'
import { solarSet, earthOribit, moonOribit, spotLight } from './helper'

const nodeList = [solarSet, earthOribit, moonOribit]

const ExploreScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<WebGL1Renderer | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const sceneRef = useRef<Scene | null>(null)

  useEffect(() => {
    console.log('scene')
    // create render
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current as HTMLCanvasElement })
    rendererRef.current = renderer

    // create camera
    const camera = new PerspectiveCamera(45, 2, 0.1, 2000)
    camera.position.set(0, 50, 0)
    camera.up.set(0, 0, 1)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // create scene
    const scene = new Scene()
    scene.background = new Color(0x111111)
    sceneRef.current = scene

    scene.add(solarSet)
    scene.add(spotLight)

    const render = (time: number) => {
      time = time * 0.001
      nodeList.forEach(node => {
        const axes = new AxesHelper()
        const material = axes.material as Material
        material.depthTest = false
        axes.renderOrder = 1
        node.add(axes)
        node.rotation.x = time
      })
      renderer.render(scene, camera)
      window.requestAnimationFrame(render)
    }
    window.requestAnimationFrame(render)

    const onResize = () => {
      const canvas = renderer.domElement
      camera.updateProjectionMatrix()
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [cameraRef])

  return <canvas ref={ canvasRef } className="full-screen"></canvas>
}

export default ExploreScene