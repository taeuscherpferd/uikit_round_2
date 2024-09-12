import { Box } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { interactionGroups, Physics, RigidBody } from '@react-three/rapier'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useState } from 'react'
import { Vector3 } from 'three'
import './App.css'
import { Player } from './Player/Player'
import { OrbitControlsWrapper } from './components/OrbitControlsWrapper'
import { UIKitTestButtons } from './components/UIKitTestButtons'

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
          <Suspense fallback={null}>
            <XR store={store}>
              <OrbitControlsWrapper />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Physics debug>
                <Player />

                <UIKitTestButtons
                  setLeftSquareColor={setLeftSquareColor}
                  setRightSquareColor={setRightSquareColor}
                  leftSquareColor={leftSquareColor}
                  rightSquareColor={rightSquareColor}
                />

                <RigidBody colliders="cuboid" type='fixed' collisionGroups={interactionGroups([0, 1], [0])}>
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
