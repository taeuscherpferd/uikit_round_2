import { Box } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import { Container, Root } from '@react-three/uikit'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useState } from 'react'
import { Vector3 } from 'three'
import './App.css'
import { LocomotionWrapper } from './LocomotionWrapper'

const store = createXRStore()

function App() {
  const [leftSquareColor, setLeftSquareColor] = useState('green')
  const [rightSquareColor, setRightSquareColor] = useState('blue')
  return (
    <>
      <div className='nonVrStuff'>
        <button onClick={() => { store.enterVR() }}>{"Enter VR"}</button>
        <Canvas>
          <color attach="background" args={['lightblue']} />
          {/* THIS MESSES WITH THE CAMERA HARD CORE! */}
          {/* <OrbitControls /> */}
          <Suspense fallback={null}>
            <XR store={store}>
              <Physics debug>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <LocomotionWrapper />

                <group position={[0, 2, -4]}>
                  <Root backgroundColor={"#9900ff"} sizeX={2} sizeY={1} flexDirection={'row'} >
                    <Container onClick={() => setLeftSquareColor((p) => p === "green" ? "red" : "green" ) } flexGrow={1} margin={8} backgroundColor={leftSquareColor} />
                    <Container onClick={() => setRightSquareColor((p) => p === "blue" ? "orange" : "blue" ) } flexGrow={1} margin={8} backgroundColor={rightSquareColor} />
                  </Root>
                </group>

                <RigidBody colliders="cuboid" type='fixed'>
                  <Box position={new Vector3(0, 0, 0)} scale={new Vector3(20, .5, 20)}>
                    <meshBasicMaterial color={"#9eeb34"} />
                  </Box>
                </RigidBody>
              </Physics>
            </XR>
          </Suspense>
        </Canvas>
      </div >
    </>
  )
}

export default App
