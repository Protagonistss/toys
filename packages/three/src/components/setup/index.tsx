import React, { useRef, useEffect } from 'react'
import { WebGL1Renderer, PerspectiveCamera, Scene, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight } from 'three'

const SetupThree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onResizeRef = useRef<() => void>()

  useEffect(() => {
    if (canvasRef.current) {
      // create render
      const renderer = new WebGL1Renderer({ canvas: canvasRef.current })
      // create camera
      const camera = new PerspectiveCamera(75, renderer.domElement.clientWidth/ renderer.domElement.clientHeight, 0.1, 5)
      // create scene
      const scene = new Scene()
      // create geometry
      const geometry = new BoxGeometry(1, 1, 1)
      // create material
      const material = new MeshPhongMaterial({ color: 0x44aa88 })

      const cube = new Mesh(geometry, material)
      scene.add(cube)

      // create light
      const light = new DirectionalLight(0xFFFFFF, 1)
      light.position.set(-1, 2, 4)
      scene.add(light)

      camera.position.z = 2

      const render = (time: number) => {
        time = time * 0.001
        cube.rotation.x = time
        cube.rotation.y = time
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
      }
      window.requestAnimationFrame(render)

      const onResize = () => {
        const canvas = renderer.domElement
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      }
      onResize()
      onResizeRef.current = onResize
      window.addEventListener('resize', onResize)
    }
    return () => {
      if (onResizeRef && onResizeRef.current) {
        window.removeEventListener('resize', onResizeRef.current)
      }
    }
  }, [canvasRef])

  return( <canvas className="full-screen" ref={ canvasRef } ></canvas> )
}

export default SetupThree