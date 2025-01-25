import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useRef, useState } from 'react'
import { Mesh } from 'three'
import './App.css'
import { Player } from './Player/Player'
import { Floor } from './components/Floor'
import { HandleWithPhysicsAndTriggers } from './components/HandleWithPhysicsAndTriggers'
import { OrbitControlsWrapper } from './components/OrbitControlsWrapper'
import { UIKitTestButtons } from './components/UIKitTestButtons'
import { WaterGun } from './components/WaterGun'

const store = createXRStore()

function App() {
  const [leftSquareColor, setLeftSquareColor] = useState('green')
  const [rightSquareColor, setRightSquareColor] = useState('blue')

  const WaterGunRef = useRef<Mesh>(null)

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

                <HandleWithPhysicsAndTriggers position={[0, 2, 0]} childRef={WaterGunRef}>
                  <WaterGun ref={WaterGunRef} scale={.1} />
                </HandleWithPhysicsAndTriggers>
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
