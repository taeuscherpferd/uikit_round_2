import { useFrame } from "@react-three/fiber"
import { RapierRigidBody } from "@react-three/rapier"
import { useXRInputSourceState } from "@react-three/xr"
import { useRef } from "react"
import { Vector3 } from "three"
import { Grabber } from "./Grabber"

interface PhysicsGrabHelperProps {
  grabColliderRadius?: number
}

export const PhysicsGrabHelper = (props: PhysicsGrabHelperProps) => {
  const { grabColliderRadius = .05 } = props
  const leftHandPhysicsGrabber = useRef<RapierRigidBody>(null)
  const rightHandPhysicsGrabber = useRef<RapierRigidBody>(null)

  const leftController = useXRInputSourceState("controller", "left")
  const rightController = useXRInputSourceState("controller", "right")

  useFrame(() => {
    leftHandPhysicsGrabber.current?.setNextKinematicTranslation(leftController?.object?.getWorldPosition(new Vector3()) ?? new Vector3())
    rightHandPhysicsGrabber.current?.setNextKinematicTranslation(rightController?.object?.getWorldPosition(new Vector3()) ?? new Vector3())
  })

  return (
    <>
      <Grabber rigidBodyRef={leftHandPhysicsGrabber} sphereRadius={grabColliderRadius} color={"#0000FF"} handedness={"left"} />
      <Grabber rigidBodyRef={rightHandPhysicsGrabber} sphereRadius={grabColliderRadius} color={"#00FF00"} handedness={"right"} />
    </>
  )
}