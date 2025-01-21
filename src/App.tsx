import { HandleStore } from '@pmndrs/handle'
import { Canvas } from '@react-three/fiber'
import { Handle, HandleOptions } from '@react-three/handle'
import { Physics, RigidBody } from '@react-three/rapier'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useRef, useState } from 'react'
import { Object3D } from 'three'
import './App.css'
import { Player } from './Player/Player'
import { Floor } from './components/Floor'
import { OrbitControlsWrapper } from './components/OrbitControlsWrapper'
import { UIKitTestButtons } from './components/UIKitTestButtons'
import { WaterGun } from './components/WaterGun'

const store = createXRStore()

function App() {
  const [leftSquareColor, setLeftSquareColor] = useState('green')
  const [rightSquareColor, setRightSquareColor] = useState('blue')

  const handleRef = useRef<HandleStore<unknown>>(null)
  const getHandleOptions = () => {
    const handleOptions: HandleOptions<Object3D> = {
    }
    return handleOptions
  }

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

                <Handle ref={handleRef}>
                  <RigidBody>
                    <WaterGun position={[0, 2, 0]} scale={.1} />
                  </RigidBody>
                </Handle>
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
