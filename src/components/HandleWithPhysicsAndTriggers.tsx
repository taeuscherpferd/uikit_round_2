import { HandleStore } from "@pmndrs/handle"
import { useFrame } from "@react-three/fiber"
import { Handle } from "@react-three/handle"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import React, { useRef } from "react"
import { Mesh, Vector3 } from "three"

interface HandleWithPhysicsAndTriggersProps {
  childRef?: React.RefObject<Mesh>
  children?: React.ReactNode
  position?: Vector3 | [number, number, number]
}

const childPosHelper = new Vector3()

export const HandleWithPhysicsAndTriggers = (props: HandleWithPhysicsAndTriggersProps) => {
  const { children, childRef, position } = props
  const [isBeingInteractedWith, setIsBeingInteractedWith] = React.useState(false)
  const handleRef = useRef<HandleStore<unknown>>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const boxRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!handleRef.current) return
    if (!rigidBodyRef.current) return
    if (!childRef?.current) return
    if (!handleRef.current.getState()) {
      setIsBeingInteractedWith((x) => {
        if (x) {
          console.log("not being interacted with")
          // if (childRef.current?.position) rigidBodyRef.current?.setTranslation(childRef.current.position, true)
          // childRef.current?.position.copy(rigidBodyRef.current?.translation() ?? new Vector3())
        }
        return false
      })
      return
    }

    setIsBeingInteractedWith(true)
    console.log("wat")

    handleRef.current.getState()?.current.position

    const handlePos = handleRef.current.getState()?.current.position
    childRef.current.getWorldPosition(childPosHelper)
    console.log(handlePos)
    if (!handlePos) return
    rigidBodyRef.current.setNextKinematicTranslation(childPosHelper)
    boxRef?.current?.position.copy(childPosHelper)
  })

  return (
    <>
      <Handle ref={handleRef}>
        <RigidBody position={position} ref={rigidBodyRef} type={isBeingInteractedWith ? 'kinematicPosition' : 'dynamic'}  >
          {children}
        </RigidBody>
      </Handle>

      {/* <Box ref={boxRef} args={[1, 1, 1]}>
        <meshBasicMaterial color={"#FF0000"} />
      </Box> */}
    </>
  )
}