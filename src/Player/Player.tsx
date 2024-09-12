import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, interactionGroups, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useXRControllerState, XROrigin } from '@react-three/xr';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { useControllerLocomotion } from '../hooks/useControllerLocomotion';

interface PlayerProps {
  position?: Vector3
}

export const Player: React.FC<PlayerProps> = (props) => {
  // const [debugPanelText, setDebugPanelText] = useState<string>('')
  const playerRigidBodyRef = useRef<RapierRigidBody>(null)
  const { rapier, world } = useRapier()
  const controllerRight = useXRControllerState('right')

  const playerMove = (inputVector: Vector3) => {
    // setDebugPanelText(`Input Vector: ${inputVector.x.toFixed(2)}, ${inputVector.y.toFixed(2)}, ${inputVector.z.toFixed(2)}`)
    if (playerRigidBodyRef.current) {
      const currentLinvel = playerRigidBodyRef.current.linvel()
      const newLinvel = { x: inputVector.x, y: currentLinvel.y, z: inputVector.z }
      playerRigidBodyRef.current.setLinvel(newLinvel, true)
    }
  }

  const positionRef = useControllerLocomotion({ translationOptions: { speed: 3, motionCallback: playerMove, disableRefTranslation: true } })

  const playerJump = () => {
    if (playerRigidBodyRef.current == null) {
      return
    }
    const ray = world.castRay(
      new rapier.Ray(playerRigidBodyRef.current.translation(), { x: 0, y: -1, z: 0 }),
      Infinity,
      false,
      undefined,
      interactionGroups([1, 0], [1]),
    )
    const grounded = ray != null && Math.abs(ray.timeOfImpact) <= 1.25

    if (grounded) {
      playerRigidBodyRef.current.setLinvel({ x: 0, y: 7.5, z: 0 }, true)
    }
  }

  useFrame(() => {
    if (controllerRight?.gamepad?.['a-button']?.state === 'pressed') {
      playerJump()
    }
  })

  return <>
    {/* <group position={[1, 2, -2]}>
      <Root >
        <Container>
          <Text>Debug: {debugPanelText}</Text>
        </Container>
      </Root>
    </group> */}

    <RigidBody
      ref={playerRigidBodyRef}
      colliders={false}
      type='dynamic'
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      canSleep={false}
      collisionGroups={interactionGroups([0], [0])}
    >
      <CapsuleCollider args={[.5, .5]} />
      <XROrigin ref={positionRef} position={[0, -1.5, 0]} />
    </RigidBody>
  </>
}