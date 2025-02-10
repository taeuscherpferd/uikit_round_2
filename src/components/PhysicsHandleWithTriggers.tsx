import { HandleState } from "@pmndrs/handle"
import { Handle } from "@react-three/handle"
import { interactionGroups, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { ReactNode, RefObject, useMemo, useRef } from "react"
import { Group, Object3D } from "three"

interface PhysicsHandleWithTriggersProps {
  position?: [number, number, number]
  children?: ReactNode
}

export function PhysicsHandleWithTriggers({ children, position }: PhysicsHandleWithTriggersProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const groupRef = useRef<Group>(null)
  const isBeingGrabbed = useRef(false)
  const targetRef = useMemo(() => new Proxy<RefObject<Object3D>>({ current: null }, { get: () => groupRef.current?.parent }), [])

  const onGrab = (state: HandleState<unknown>) => {
    const rigidBody = rigidBodyRef.current
    if (rigidBody == null) return

    for (let i = 0; i < rigidBody.numColliders(); i++) {
      const collider = rigidBody.collider(i)
      collider.setCollisionGroups(interactionGroups([2], [0, 2]))
    }

  }

  const onRelease = (state: HandleState<unknown>) => {
    const rigidBody = rigidBodyRef.current
    if (rigidBody == null) return

    rigidBody.setBodyType(0, true)

    console.log('Constantly being called?')
    for (let i = 0; i < rigidBody.numColliders(); i++) {
      const collider = rigidBody.collider(i)
      collider.setCollisionGroups(interactionGroups([2]))
    }
    if (state.delta != null) {
      const deltaTime = state.delta.time
      const deltaPosition = state.delta.position.clone().divideScalar(deltaTime)
      rigidBody.setLinvel(deltaPosition, true)
      const deltaRotation = state.delta.rotation.clone()
      deltaRotation.x /= deltaTime
      deltaRotation.y /= deltaTime
      deltaRotation.z /= deltaTime
      rigidBody.setAngvel(deltaRotation, true)
    }
  }

  return (
    <RigidBody ref={rigidBodyRef} type="dynamic" position={position} collisionGroups={interactionGroups([2])}>
      <group ref={groupRef}>
        <Handle
          multitouch={false}
          handleRef={groupRef}
          scale={false}
          targetRef={targetRef}
          apply={(state) => {
            const rigidBody = rigidBodyRef.current
            if (rigidBody == null) {
              return
            }
            rigidBody.wakeUp()

            if (state.last) {
              onRelease(state)
            } else {

              if (isBeingGrabbed.current === false) {
                isBeingGrabbed.current = true
                onGrab(state)
              }

              rigidBody.setBodyType(2, true)
              rigidBody.setRotation(state.current.quaternion, true)
              rigidBody.setTranslation(state.current.position, true)
            }
          }}
        >
          {children}
        </Handle>
      </group>
    </RigidBody>
  )
}