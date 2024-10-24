import { Sphere } from "@react-three/drei"
import { BallCollider, CollisionPayload, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useState } from "react"

interface GrabberProps {
  sphereRadius: number
  rigidBodyRef?: React.RefObject<RapierRigidBody>
  color: string
  handedness: XRHandedness
}

export const Grabber = (props: GrabberProps) => {
  const { handedness, rigidBodyRef, color, sphereRadius } = props
  const [statefulColor, setStatefulColor] = useState(color)

  const onIntersection = (collision: CollisionPayload) => {
    if (collision.other.colliderObject?.name !== "Grabable") return
    console.log("intersection", collision)
    setStatefulColor("#FFFF00")
  }

  const onExit = (collision: CollisionPayload) => {
    if (collision.other.colliderObject?.name !== "Grabable") return
    setStatefulColor(color)
  }

  return (
    <RigidBody ref={rigidBodyRef} position={[0, 0, 0]} type='kinematicPosition' gravityScale={0} sensor colliders={false} >
      <Sphere args={[sphereRadius]}>
        <meshBasicMaterial color={statefulColor} />
      </Sphere>
      <BallCollider args={[sphereRadius]} name={handedness === "left" ? "GrabberL" : "GrabberR"} sensor onIntersectionEnter={onIntersection} onIntersectionExit={onExit} />
    </RigidBody>
  )
}
