import { Box } from '@react-three/drei'
import { RigidBody, interactionGroups } from '@react-three/rapier'
import { Vector3 } from 'three'

interface FloorProps {
}

export const Floor = (props: FloorProps) => {
  return (
    <RigidBody colliders="cuboid" type='fixed' collisionGroups={interactionGroups([0, 1], [0])}>
      <Box position={new Vector3(0, 0, 0)} scale={new Vector3(20, .5, 20)}>
        <meshBasicMaterial color={"#9eeb34"} />
      </Box>
    </RigidBody>
  )
}