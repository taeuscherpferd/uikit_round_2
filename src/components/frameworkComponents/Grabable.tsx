import { Vector3, useFrame } from '@react-three/fiber'
import { BallCollider, IntersectionEnterHandler, IntersectionExitHandler, RapierCollider, RapierRigidBody, RigidBody, RigidBodyOptions } from '@react-three/rapier'
import { useXR, useXRInputSourceState } from '@react-three/xr'
import { useRef, useState } from 'react'
import { Euler, Quaternion, Vector3 as V3 } from 'three'

export interface GrabableProps {
  children?: React.ReactNode
  position?: Vector3
  snapToLocation?: V3
  snapToRotation?: Euler
  colliderOptions?: RigidBodyOptions
  PhysicsOffsetLocation?: V3
  PhysicsOffsetRotation?: V3
  onGrabEffect?: () => void
  onRelease?: () => void
  oculusGamePadFunctions?: OculusGamePadFunctions
}

export const Grabable: React.FC<GrabableProps> = (props) => {
  const { children, onGrabEffect, onRelease, snapToLocation, snapToRotation, colliderOptions, position, oculusGamePadFunctions } = props
  const [canBeLGrabbed, setCanBeLGrabbed] = useState(false)
  const [canBeRGrabbed, setCanBeRGrabbed] = useState(false)
  const [isRGrabbed, setIsRGrabbed] = useState(false)
  const [isLGrabbed, setIsLGrabbed] = useState(false)
  const leftController = useXRInputSourceState("controller", "left")
  const controllers = useXR((x) => x.controllers)

  const ballColliderRef = useRef<RapierCollider>(null)
  const thisObject = useRef<RapierRigidBody>(null)

  let squeezeFunctions: OculusGamePadFunctions | undefined
  let gamePadFunctionsOverride: OculusGamePadFunctions | undefined
  if (oculusGamePadFunctions && (isRGrabbed || isLGrabbed)) {
    const { i_OnLSqueezeDown, i_OnLSqueezeUp, i_OnRSqueezeDown, i_OnRSqueezeUp, ...everythingElse } = oculusGamePadFunctions
    squeezeFunctions = { i_OnLSqueezeDown, i_OnLSqueezeUp, i_OnRSqueezeDown, i_OnRSqueezeUp }
    gamePadFunctionsOverride = everythingElse
  }

  const onGrab = (isRight: boolean) => {
    onGrabEffect && onGrabEffect()
    console.log("grabbed")
    isRight ? setIsRGrabbed(true) : setIsLGrabbed(true)
    ballColliderRef.current?.setTranslation({ x: 0, y: 0, z: 0 })
  }

  const resetGrabState = (isRight: boolean) => {
    setIsRGrabbed(false)
    setIsLGrabbed(false)
    ballColliderRef.current?.setTranslation(position as { x: number, y: number, z: number } ?? { x: 0, y: 0, z: 0 })
  }

  useFrame(() => {
    if (!isRGrabbed && !isLGrabbed) return
    const grabberPosition = isRGrabbed ? controllers.at(1)?.grip?.getWorldPosition(new V3()) : controllers.at(0)?.grip?.getWorldPosition(new V3())
    const grabberRotation = isRGrabbed ? controllers.at(1)?.grip?.getWorldQuaternion(new Quaternion()) : controllers.at(0)?.grip?.getWorldQuaternion(new Quaternion())
    if (!grabberPosition) return
    if (!grabberRotation) return
    const combinedRotation = snapToRotation ? grabberRotation.multiply(new Quaternion().setFromEuler(snapToRotation)) : grabberRotation

    thisObject.current?.setNextKinematicTranslation(grabberPosition)
    thisObject.current?.setNextKinematicRotation(combinedRotation)
  })

  useOculusGamePad({
    i_OnLSqueezeDown: () => {
      console.log("squeeze down")
      if (canBeLGrabbed) {
        onGrab(false)
        squeezeFunctions?.i_OnLSqueezeDown && squeezeFunctions.i_OnLSqueezeDown()
      }
    },
    i_OnRSqueezeDown: () => {
      console.log("squeeze down")
      if (canBeRGrabbed) {
        onGrab(true)
        squeezeFunctions?.i_OnRSqueezeDown && squeezeFunctions.i_OnRSqueezeDown()
      }
    },
    i_OnLSqueezeUp: () => {
      if (isLGrabbed) {
        onRelease && onRelease()
        resetGrabState(false)
        squeezeFunctions?.i_OnLSqueezeUp && squeezeFunctions.i_OnLSqueezeUp()
      }
    },
    i_OnRSqueezeUp: () => {
      if (isRGrabbed) {
        onRelease && onRelease()
        resetGrabState(true)
        squeezeFunctions?.i_OnRSqueezeUp && squeezeFunctions.i_OnRSqueezeUp()
      }
    },
    ...gamePadFunctionsOverride
  })

  const onSensorEnter: IntersectionEnterHandler = (e) => {
    console.log("sensor enter", e)
    if (e.other.colliderObject?.name === "GrabberL") {
      console.log("isGrabber")
      if (e.target.colliderObject?.parent) {
        console.log("has parent")
        e.target.colliderObject.parent = e.other.colliderObject
      }

      setCanBeLGrabbed(true)
    }
    else if (e.other.colliderObject?.name === "GrabberR") {
      console.log("isGrabber")
      if (e.target.colliderObject?.parent) {
        console.log("has parent")
        e.target.colliderObject.parent = e.other.colliderObject
      }

      setCanBeRGrabbed(true)
    }
  }

  const onSensorExit: IntersectionExitHandler = (e) => {
    if (e.other.colliderObject?.name === "GrabberL") {
      setCanBeLGrabbed(false)
      console.log("can't be grabbed")
    }
    if (e.other.colliderObject?.name === "GrabberR") {
      setCanBeRGrabbed(false)
      console.log("can't be grabbed")
    }
  }

  return (
    <RigidBody ref={thisObject} type={isRGrabbed || isLGrabbed ? "kinematicPosition" : 'dynamic'} position={position} {...colliderOptions}>
      {children}
      <BallCollider position={[0, 0, 0]} ref={ballColliderRef} args={[.2]} name={"Grabable"} sensor onIntersectionEnter={onSensorEnter} onIntersectionExit={onSensorExit} />
    </RigidBody>
  )
}