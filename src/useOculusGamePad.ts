import { useFrame, useThree } from "@react-three/fiber";
import { useXRControllerState } from "@react-three/xr";
import { useRef } from "react";

export interface OculusGamePadFunctions {
  i_OnLTriggerDown?: () => void,
  i_OnLTriggerUp?: () => void,
  i_OnLSqueezeDown?: () => void,
  i_OnLSqueezeUp?: () => void,
  i_OnLStickDown?: () => void,
  i_OnLStickUp?: () => void,
  i_OnXDown?: () => void,
  i_OnXUp?: () => void,
  i_OnYDown?: () => void,
  i_OnYUp?: () => void,
  i_OnLStick?: (x: number, y: number) => void,
  i_OnRTriggerDown?: () => void,
  i_OnRTriggerUp?: () => void,
  i_OnRSqueezeDown?: () => void,
  i_OnRSqueezeUp?: () => void,
  i_OnRStickDown?: () => void,
  i_OnRStickUp?: () => void,
  i_OnADown?: () => void,
  i_OnAUp?: () => void,
  i_OnBDown?: () => void,
  i_OnBUp?: () => void,
  i_OnRStick?: (x: number, y: number) => void
}

export const useOculusGamePad = (subs: OculusGamePadFunctions) => {
  const { i_OnLTriggerDown, i_OnLTriggerUp, i_OnLSqueezeDown, i_OnLSqueezeUp, i_OnLStickDown, i_OnLStickUp, i_OnXDown, i_OnXUp, i_OnYDown, i_OnYUp, i_OnLStick, i_OnRTriggerDown, i_OnRTriggerUp, i_OnRSqueezeDown, i_OnRSqueezeUp, i_OnRStickDown, i_OnRStickUp, i_OnADown, i_OnAUp, i_OnBDown, i_OnBUp, i_OnRStick, } = subs;
  const { gl } = useThree()
  const session = gl.xr.getSession()
  const r_Gamepad = useXRControllerState("right")
  const l_Gamepad = useXRControllerState("left")
  const inputSources = [r_Gamepad, l_Gamepad]
  const controllerState = useRef<OculusQuest2ControllerState | null>({ bButton: false, aButton: false, rStickPress: false, rTrigger: false, rSqueeze: false, rXAxis: 0, rYAxis: 0, yButton: false, xButton: false, lStickPress: false, lTrigger: false, lSqueeze: false, lXAxis: 0, lYAxis: 0, })

  let leftJoyStick: readonly number[]
  let rightJoyStick: readonly number[]

  if (l_Gamepad) {
    leftJoyStick = [l_Gamepad.gamepad.axes?.xAxis ?? 0, l_Gamepad.gamepad.axes?.yAxis ?? 0]
  }

  if (r_Gamepad) {
    rightJoyStick = [r_Gamepad.gamepad.axes?.xAxis ?? 0, r_Gamepad.gamepad.axes?.yAxis ?? 0]
  }

  useFrame(() => {
    if (!leftJoyStick || !rightJoyStick) return

    if (session) {

      for (let i = 0; i < inputSources.length; i++) {
        const source = inputSources[i]?.inputSource
        if (!source) continue
        const data = {
          handedness: i === 0 ? "right" : "left",
          buttons: source.gamepad?.buttons.map((b) => b.value) ?? [],
          axes: source.gamepad?.axes.slice(0),
        }

        if (data.handedness === "left") {
          if (controllerState.current?.lTrigger && data.buttons[0] === 0) {
            onLTriggerUp()
          }
          else if (!controllerState.current?.lTrigger && data.buttons[0] !== 0) {
            onLTriggerDown()
          }

          if (controllerState.current?.lSqueeze && data.buttons[1] === 0) {
            onLSqueezeUp()
          }
          else if (!controllerState.current?.lSqueeze && data.buttons[1] !== 0) {
            onLSqueezeDown()
          }

          if (controllerState.current?.lStickPress && data.buttons[3] === 0) {
            onLStickUp()
          }
          else if (!controllerState.current?.lStickPress && data.buttons[3] !== 0) {
            onLStickDown()
          }

          if (controllerState.current?.xButton && data.buttons[4] === 0) {
            onXUp()
          }
          else if (!controllerState.current?.xButton && data.buttons[4] !== 0) {
            onXDown()
          }

          if (controllerState.current?.yButton && data.buttons[5] === 0) {
            onYUp()
          }
          else if (!controllerState.current?.yButton && data.buttons[5] !== 0) {
            onYDown()
          }

          controllerState.current = {
            bButton: controllerState.current?.bButton ?? false,
            aButton: controllerState.current?.aButton ?? false,
            rStickPress: controllerState.current?.rStickPress ?? false,
            rTrigger: controllerState.current?.rTrigger ?? false,
            rSqueeze: controllerState.current?.rSqueeze ?? false,
            rXAxis: controllerState.current?.rXAxis ?? 0,
            rYAxis: controllerState.current?.rYAxis ?? 0,
            yButton: data.buttons[5] === 1,
            xButton: data.buttons[4] === 1,
            lStickPress: data.buttons[3] === 1,
            lTrigger: data.buttons[0] !== 0,
            lSqueeze: data.buttons[1] !== 0,
            lXAxis: leftJoyStick[2],
            lYAxis: leftJoyStick[3],
          }
        }
        else {
          if (controllerState.current?.rTrigger && data.buttons[0] === 0) {
            onRTriggerUp()
          }
          else if (!controllerState.current?.rTrigger && data.buttons[0] !== 0) {
            onRTriggerDown()
          }

          if (controllerState.current?.rSqueeze && data.buttons[1] === 0) {
            onRSqueezeUp()
          }
          else if (!controllerState.current?.rSqueeze && data.buttons[1] !== 0) {
            onRSqueezeDown()
          }

          if (controllerState.current?.rStickPress && data.buttons[3] === 0) {
            onRStickUp()
          }
          else if (!controllerState.current?.rStickPress && data.buttons[3] !== 0) {
            onRStickDown()
          }

          if (controllerState.current?.aButton && data.buttons[4] === 0) {
            onAUp()
          }
          else if (!controllerState.current?.aButton && data.buttons[4] !== 0) {
            onADown()
          }

          if (controllerState.current?.bButton && data.buttons[5] === 0) {
            onBUp()
          }
          else if (!controllerState.current?.bButton && data.buttons[5] !== 0) {
            onBDown()
          }

          controllerState.current = {
            bButton: data.buttons[5] === 1,
            aButton: data.buttons[4] === 1,
            rStickPress: data.buttons[3] === 1,
            rTrigger: data.buttons[0] !== 0,
            rSqueeze: data.buttons[1] !== 0,
            rXAxis: rightJoyStick[2],
            rYAxis: rightJoyStick[3],
            yButton: controllerState.current?.yButton ?? false,
            xButton: controllerState.current?.xButton ?? false,
            lStickPress: controllerState.current?.lStickPress ?? false,
            lTrigger: controllerState.current?.lTrigger ?? false,
            lSqueeze: controllerState.current?.lSqueeze ?? false,
            lXAxis: controllerState.current?.lXAxis ?? 0,
            lYAxis: controllerState.current?.lYAxis ?? 0,
          }
        }

      }
    }

    if (leftJoyStick[2] !== 0) {
      onLStick(leftJoyStick[2], leftJoyStick[3])
    }

    if (leftJoyStick[3] !== 0) {
      onLStick(leftJoyStick[2], leftJoyStick[3])
    }

    if (rightJoyStick[2] !== 0) {
      onRStick(rightJoyStick[2], rightJoyStick[3])
    }

    if (rightJoyStick[3] !== 0) {
      onRStick(rightJoyStick[2], rightJoyStick[3])
    }

  })

  const onLTriggerDown = () => {
    i_OnLTriggerDown && i_OnLTriggerDown();
  }
  const onLTriggerUp = () => {
    i_OnLTriggerUp && i_OnLTriggerUp()
  }
  const onLSqueezeDown = () => {
    i_OnLSqueezeDown && i_OnLSqueezeDown()
  }
  const onLSqueezeUp = () => {
    i_OnLSqueezeUp && i_OnLSqueezeUp()
  }
  const onLStickDown = () => {
    i_OnLStickDown && i_OnLStickDown()
  }
  const onLStickUp = () => {
    i_OnLStickUp && i_OnLStickUp()
  }
  const onXDown = () => {
    i_OnXDown && i_OnXDown()
  }
  const onXUp = () => {
    i_OnXUp && i_OnXUp()
  }
  const onYDown = () => {
    i_OnYDown && i_OnYDown()
  }
  const onYUp = () => {
    i_OnYUp && i_OnYUp()
  }
  const onLStick = (i_X: number, i_Y: number) => {
    i_OnLStick && i_OnLStick(i_X, i_Y)
  }

  const onRTriggerDown = () => {
    i_OnRTriggerDown && i_OnRTriggerDown()
  }
  const onRTriggerUp = () => {
    i_OnRTriggerUp && i_OnRTriggerUp()
  }
  const onRSqueezeDown = () => {
    i_OnRSqueezeDown && i_OnRSqueezeDown()
  }
  const onRSqueezeUp = () => {
    i_OnRSqueezeUp && i_OnRSqueezeUp()
  }
  const onRStickDown = () => {
    i_OnRStickDown && i_OnRStickDown()
  }
  const onRStickUp = () => {
    i_OnRStickUp && i_OnRStickUp()
  }
  const onADown = () => {
    i_OnADown && i_OnADown()
  }
  const onAUp = () => {
    i_OnAUp && i_OnAUp()
  }
  const onBDown = () => {
    i_OnBDown && i_OnBDown()
  }
  const onBUp = () => {
    i_OnBUp && i_OnBUp()
  }
  const onRStick = (i_X: number, i_Y: number) => {
    i_OnRStick && i_OnRStick(i_X, i_Y)
  }
}

interface OculusQuest2ControllerState {
  bButton: boolean,
  aButton: boolean,
  rStickPress: boolean,
  rTrigger: boolean,
  rSqueeze: boolean,

  rXAxis: number,
  rYAxis: number,

  yButton: boolean,
  xButton: boolean,
  lStickPress: boolean,
  lTrigger: boolean,
  lSqueeze: boolean,

  lXAxis: number,
  lYAxis: number,
}
