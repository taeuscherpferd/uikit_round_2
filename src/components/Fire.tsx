import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fire from "../assets/Models/fire.glb"

interface FireProps {
}


export const Fire = (props: FireProps) => {
  // const { nodes, materials } = useGLTF(fire) as ObjectMap

  const model = useLoader(GLTFLoader, fire)
  console.log(model);


  return (
    <group dispose={null}>
      {/* <mesh
        geometry={(nodes.Cube as any).geometry}
        material={materials.Material}
      /> */}
      <primitive scale={.5} position={[1,.3,0]} object={model.scene} />
    </group>
  )
}