import { Box } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useState } from 'react'
import './App.css'
import { Player } from './Player/Player'
import { Floor } from './components/Floor'
import { OrbitControlsWrapper } from './components/OrbitControlsWrapper'
import { PhysicsHandleWithTriggers } from './components/PhysicsHandleWithTriggers'
import { UIKitTestButtons } from './components/UIKitTestButtons'
import { WaterGun } from './components/WaterGun'

let store = createXRStore()

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
              {/*TODO: Implement a ControllerInteractionsComponent here that will fire off events for when different controller states are triggered. Then subscribe to those events in an Interactable Component */}
              <OrbitControlsWrapper />
              <ambientLight intensity={.5} />
              <Physics debug>
                <Player />
                <UIKitTestButtons
                  setLeftSquareColor={setLeftSquareColor}
                  setRightSquareColor={setRightSquareColor}
                  leftSquareColor={leftSquareColor}
                  rightSquareColor={rightSquareColor}
                />
                <PhysicsHandleWithTriggers position={[-2, 5, 0]}>
                  <WaterGun scale={.1} />
                </PhysicsHandleWithTriggers>
                <PhysicsHandleWithTriggers position={[2, 5, 0]}>
                  <Box>
                    <meshBasicMaterial color={leftSquareColor} />
                  </Box>
                </PhysicsHandleWithTriggers>
                <Floor />
              </Physics>
            </XR>
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}

export default App
