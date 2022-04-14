import { useRef, useEffect } from 'react'
import { WebGL1Renderer, PerspectiveCamera, Scene, Color, TextureLoader, MeshBasicMaterial, BoxBufferGeometry, Mesh } from 'three'
import tigerImg from '@/assets/tiger.jpeg'
import img3 from '@/assets/3.jpeg'
import img4 from '@/assets/4.jpeg'

const ExploreTexture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current })
    const camera = new PerspectiveCamera(40, 2, 0.1, 2000)
    camera.position.set(0, 0, 40)

    const scene = new Scene()
    scene.background = new Color(0xcccccc)
    
    const textureLoader = new TextureLoader()

    const imgList = [img3, img4, tigerImg]
    const materialPool: MeshBasicMaterial[] = []
    imgList.forEach((item) => {
      materialPool.push(new MeshBasicMaterial({ 
        map: textureLoader.load(
          item, 
          (texture) => {
            console.log('texture', texture)
          },
          (process) => {
            console.log('process', process)
          },
          (error) => {
            console.log('texture error', error)
          }
        ) 
      }))
    })

    // const material = new MeshBasicMaterial({
    //   map: textureLoader.load(tigerImg)
    // })

    const boxGeometry = new BoxBufferGeometry(8, 8, 8)
    const box = new Mesh(boxGeometry, materialPool)
    scene.add(box)

    const render = (time: number) => {
      time = time * 0.001
      box.rotation.x = time
      box.rotation.y = time
      renderer.render(scene, camera)
      window.requestAnimationFrame(render)
    }
    window.requestAnimationFrame(render)

    const onResize = () => {
      const canvas = renderer.domElement
      camera.aspect = (canvas.clientWidth / canvas.clientHeight)
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])

  return <canvas ref={ canvasRef } className="full-screen"></canvas>
}

export default ExploreTexture