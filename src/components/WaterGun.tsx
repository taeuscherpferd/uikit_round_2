import { useGLTF } from "@react-three/drei";
import { Vector3, useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { Euler } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
// import { Grabable, GrabableProps } from "../WebVrGameDevFramework/Grabable/Grabable";

interface WaterGunProps {
  position: Vector3
  rotation?: Euler
  scale?: Vector3
  // grabableProps?: GrabableProps
}

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const snapToRotation: Euler = new Euler(Math.PI + Math.PI / 8, Math.PI * 2, Math.PI * 1.5)

export const WaterGun: React.FC<WaterGunProps> = (WaterGunProps) => {
  const { scene } = useThree()
  // const { grabableProps } = WaterGunProps
  const [spheres, setSpheres] = useState<JSX.Element[]>([]);

  const { nodes, materials } = useGLTF(import.meta.env.VITE_PUBLIC_URL + "/Assets/Models/WaterGun.glb") as unknown as GLTFResult;

  const spawnSphere = () => {
    // const bullet = new Bullet(new OgVector3(0, 2, 0), new OgVector3(0, 0, 0))
    // scene.add(bullet.mesh)
  };

  /* TODO: Make Grabable components respect left and right grabs when calling trigger functions */
  const grabFunctions = {
    i_OnLTriggerDown: () => {
      console.log("LTriggerDown")
    },
    i_OnRTriggerDown: () => {
      console.log("RTriggerDown")
      spawnSphere();
    },
  }

  return (
    // <Grabable colliderOptions={{ colliders: 'cuboid' }} position={WaterGunProps.position} snapToRotation={snapToRotation} oculusGamePadFunctions={grabFunctions}>
      <group scale={WaterGunProps.scale} rotation={WaterGunProps.rotation} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cube as any).geometry}
          material={materials.Material}
        />
      </group>
    // </Grabable >
  );
}

useGLTF.preload("/WaterGun.gltf");
