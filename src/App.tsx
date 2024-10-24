import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { createXRStore, XR } from '@react-three/xr'
import { Suspense, useState } from 'react'
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
                <WaterGun position={[2, 2, 0]} scale={.2} />

                <Floor />
              </Physics>
            </XR>
          </Suspense>
        </Canvas>
      </div >
    </>
  )
}

export default App
