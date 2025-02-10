import { Box } from '@react-three/drei'
import { RigidBody, interactionGroups } from '@react-three/rapier'
import { Vector3 } from 'three'


export const Floor = () => {
  return (
    <RigidBody colliders="cuboid" type='fixed' collisionGroups={interactionGroups([0, 1])}>
      <Box position={new Vector3(0, 0, 0)} scale={new Vector3(20, .5, 20)}>
        <meshBasicMaterial color={"#9eeb34"} />
        {/* <meshStandardMaterial color={"#9eeb34"} /> */}
      </Box>
    </RigidBody>
  )
}