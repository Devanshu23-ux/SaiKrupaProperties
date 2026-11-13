"use client";

/* The Three.js scene API is imperative by design (camera, scene, controls). */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { motionAllowed, webglSupported } from "@/lib/browser";

/* ------------------------------------------------------------------ *
 * The Sai Krupa Properties head-office model, generated entirely in code.
 * A stepped, glass-and-fin building with an orange cantilever, green
 * roof terraces, a lit sign and a little plotted-land lawn around it.
 * ------------------------------------------------------------------ */

interface GlassSpec {
  top: string;
  bottom: string;
  lit: string;
  cols: number;
  rows: number;
  seed: number;
}

function makeGlassTexture(spec: GlassSpec, faceW: number, faceH: number) {
  const SIZE = 256;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, spec.top);
  sky.addColorStop(1, spec.bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Diagonal reflection streaks.
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#ffffff";
  for (let i = -2; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 70, 0);
    ctx.lineTo(i * 70 + 34, 0);
    ctx.lineTo(i * 70 - 90, SIZE);
    ctx.lineTo(i * 70 - 124, SIZE);
    ctx.fill();
  }
  ctx.restore();

  const cw = SIZE / spec.cols;
  const ch = SIZE / spec.rows;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let c = 0; c <= spec.cols; c++) ctx.fillRect(c * cw - 1.5, 0, 3, SIZE);
  for (let r = 0; r <= spec.rows; r++) ctx.fillRect(0, r * ch - 1.5, SIZE, 3);

  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      const h = (r * 31 + c * 17 + spec.seed * 7) % 11;
      if (h === 0 || h === 4) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = spec.lit;
        ctx.fillRect(c * cw + 3, r * ch + 3, cw - 6, ch - 6);
        ctx.globalAlpha = 1;
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.repeat.set(Math.max(1, Math.round(faceW / 3)), Math.max(1, Math.round(faceH / 3)));
  return texture;
}

function makeSignTexture() {
  const W = 1024;
  const H = 184;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "#1d3f73");
  g.addColorStop(1, "#1f6f8f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#f58a2e";
  ctx.fillRect(0, H - 12, W, 12);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ff9a3d";
  ctx.font = "800 104px 'Poppins', 'Segoe UI', Arial, sans-serif";
  ctx.fillText("SAI KRUPA", W / 2, 62);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 46px 'Poppins', 'Segoe UI', Arial, sans-serif";
  const label = "P R O P E R T I E S";
  ctx.fillText(label, W / 2, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const GLASS_VIOLET: GlassSpec = { top: "#2f6fc4", bottom: "#4aa3d8", lit: "#ffe9a8", cols: 4, rows: 4, seed: 1 };
const GLASS_CYAN: GlassSpec = { top: "#1f9bb5", bottom: "#3b7fd0", lit: "#ffd9b8", cols: 4, rows: 4, seed: 3 };
const GLASS_BASE: GlassSpec = { top: "#4fb3da", bottom: "#3f78c8", lit: "#ffe9a8", cols: 6, rows: 2, seed: 5 };

function GlassBox({
  size,
  position,
  spec,
}: {
  size: [number, number, number];
  position: [number, number, number];
  spec: GlassSpec;
}) {
  const materials = useMemo(() => {
    const side = (w: number) =>
      new THREE.MeshStandardMaterial({
        map: makeGlassTexture(spec, w, size[1]),
        roughness: 0.22,
        metalness: 0.1,
        emissive: new THREE.Color("#1c4f9a"),
        emissiveIntensity: 0.18,
      });
    const roof = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.6 });
    // +x, -x, +y, -y, +z, -z
    return [side(size[2]), side(size[2]), roof, roof, side(size[0]), side(size[0])];
  }, [spec, size]);

  useEffect(
    () => () => {
      for (const m of materials) {
        (m.map as THREE.Texture | null)?.dispose();
        m.dispose();
      }
    },
    [materials],
  );

  return (
    <mesh position={position} material={materials} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

function Fins({ x, z, height, count, span, color }: { x: number; z: number; height: number; count: number; span: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[-span / 2 + (i * span) / (count - 1), height / 2, 0]} castShadow>
          <boxGeometry args={[0.14, height, 0.55]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ x, z, scale = 1, color }: { x: number; z: number; scale?: number; color: string }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1, 8]} />
        <meshStandardMaterial color="#8a6a50" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

function Sign() {
  const texture = useMemo(() => makeSignTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 3.75, 4.16]} castShadow>
      <boxGeometry args={[6.4, 1.15, 0.22]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.4} />
    </mesh>
  );
}

function Building() {
  return (
    <group>
      {/* Lawn and plaza */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[26, 0.24, 20]} />
        <meshStandardMaterial color="#7cc96f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 6.4]} receiveShadow>
        <boxGeometry args={[9, 0.12, 5.4]} />
        <meshStandardMaterial color="#fff3df" roughness={0.8} />
      </mesh>

      {/* Podium */}
      <GlassBox size={[13, 3, 8]} position={[0, 1.5, 0]} spec={GLASS_BASE} />
      <mesh position={[0, 3.08, 0]} castShadow>
        <boxGeometry args={[13.4, 0.2, 8.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Towers */}
      <GlassBox size={[6, 9, 5.4]} position={[-2.9, 7.7, -0.6]} spec={GLASS_VIOLET} />
      <Fins x={-2.9} z={2.28} height={12.2} count={8} span={5.4} color="#ff8a2a" />
      <GlassBox size={[4.6, 5.6, 4.6]} position={[3.4, 5.9, -1.2]} spec={GLASS_CYAN} />
      <mesh position={[3.4, 8.8, -1.2]} castShadow>
        <boxGeometry args={[4.9, 0.22, 4.9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Roof garden on the lower tower */}
      <mesh position={[3.4, 8.98, -1.2]} receiveShadow>
        <boxGeometry args={[4.2, 0.16, 4.2]} />
        <meshStandardMaterial color="#5fbf62" roughness={0.9} />
      </mesh>
      <Tree x={2.4} z={-0.6} scale={0.6} color="#ff7a45" />
      <Tree x={4.3} z={-1.9} scale={0.55} color="#ffc02e" />
      <mesh position={[-2.9, 12.35, -0.6]} castShadow>
        <boxGeometry args={[6.3, 0.3, 5.7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[-4.2, 13.7, -1.6]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 2.4, 8]} />
        <meshStandardMaterial color="#1d3f73" />
      </mesh>
      <mesh position={[-4.2, 15, -1.6]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#ff5a3d" emissive="#ff5a3d" emissiveIntensity={1.4} />
      </mesh>

      {/* Orange cantilever over the entrance */}
      <mesh position={[0.4, 3.2, 4.4]} castShadow>
        <boxGeometry args={[9, 0.45, 3.6]} />
        <meshStandardMaterial color="#ff8a2a" roughness={0.4} />
      </mesh>
      {[-3.6, 4.4].map((x) => (
        <mesh key={x} position={[x, 1.55, 5.6]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 3.1, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      <Sign />

      {/* Entrance glow */}
      <mesh position={[0.4, 1.3, 4.02]}>
        <boxGeometry args={[2.8, 2.5, 0.06]} />
        <meshStandardMaterial color="#fff1c2" emissive="#ffd978" emissiveIntensity={1} />
      </mesh>

      {/* Landscape */}
      <Tree x={-9.5} z={5.6} scale={1.1} color="#34a853" />
      <Tree x={-7.8} z={7.4} scale={0.9} color="#ff7a45" />
      <Tree x={9.4} z={6} scale={1.15} color="#ffb627" />
      <Tree x={7.7} z={7.6} scale={0.9} color="#34a853" />
      <Tree x={-10} z={-6} scale={1} color="#2f8f4e" />
      <Tree x={10} z={-6.5} scale={1.1} color="#34a853" />
      <Tree x={-5} z={-8} scale={0.8} color="#ff9a3d" />
      <Tree x={6} z={-8} scale={0.85} color="#2f8f4e" />

      {/* Little plotted-land tiles, front of the lawn */}
      {[
        ["#2f6fc4", -8.4], ["#ff7a45", -5.6], ["#ff9a3d", -2.8], ["#ffc02e", 0], ["#34a853", 2.8], ["#1f9bb5", 5.6], ["#2f6fc4", 8.4],
      ].map(([color, x], i) => (
        <mesh key={i} position={[x as number, 0.08, 9.1]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.2, 1.1]} />
          <meshStandardMaterial color={color as string} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.45;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Controls({ interactive, paused }: { interactive: boolean; paused: React.RefObject<boolean> }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.target.set(0, 5.4, 0);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.07;
    orbit.enableZoom = false;
    orbit.enablePan = false;
    orbit.enableRotate = interactive;
    orbit.minPolarAngle = Math.PI * 0.28;
    orbit.maxPolarAngle = Math.PI * 0.49;
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = 0.9;
    // OrbitControls sets touch-action:none, which traps page scroll on phones.
    // On touch screens let vertical swipes scroll the page; horizontal drags rotate.
    gl.domElement.style.touchAction = window.matchMedia("(pointer: coarse)").matches ? "pan-y" : "none";
    orbit.update();

    let timer: number | undefined;
    const onStart = () => {
      paused.current = true;
      orbit.autoRotate = false;
      if (timer) window.clearTimeout(timer);
    };
    const onEnd = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        paused.current = false;
        orbit.autoRotate = true;
      }, 2200);
    };
    orbit.addEventListener("start", onStart);
    orbit.addEventListener("end", onEnd);
    controls.current = orbit;
    return () => {
      orbit.removeEventListener("start", onStart);
      orbit.removeEventListener("end", onEnd);
      if (timer) window.clearTimeout(timer);
      orbit.dispose();
      controls.current = null;
    };
  }, [camera, gl, interactive, paused]);

  useFrame(() => controls.current?.update());
  return null;
}

/**
 * Keeps the whole building in frame at any width: the camera backs off until
 * both the width and height of the scene fit the canvas (phones are tall and narrow).
 */
function FitCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    if (!width || !height) return;
    const aspect = width / height;
    const target = new THREE.Vector3(0, 5.4, 0);
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const dist = Math.max(14 / Math.tan(hfov / 2), 13.5 / Math.tan(vfov / 2), 30);
    const dir = camera.position.clone().sub(target).normalize();
    camera.position.copy(target).addScaledVector(dir, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, width, height]);

  return null;
}

/** Rises into place on first view. */
function Rise({ play, children }: { play: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    if (!play || t.current >= 1) {
      node.position.y = 0;
      node.scale.setScalar(1);
      return;
    }
    t.current = Math.min(1, t.current + delta / 1.4);
    const e = 1 - (1 - t.current) ** 3;
    node.position.y = (1 - e) * -8;
    node.scale.setScalar(0.85 + e * 0.15);
  });
  return <group ref={group}>{children}</group>;
}

export function BuildingStage({ hint }: { hint: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [supported] = useState(webglSupported);
  const [visible, setVisible] = useState(true);
  const interactive = true;
  const [motionOk] = useState(motionAllowed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for the web font so the sign texture is drawn in Poppins.
    const go = () => setReady(true);
    if (document.fonts?.load) {
      document.fonts.load("800 100px Poppins").then(go).catch(go);
      window.setTimeout(go, 1200);
    } else go();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full min-w-0 overflow-hidden">
      {supported && ready ? (
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.8]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [27, 17, 32], fov: 32, near: 0.5, far: 300 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ cursor: "grab" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
          }}
        >
          <fog attach="fog" args={["#eef1ef", 90, 200]} />
          <ambientLight intensity={0.35} />
          <hemisphereLight args={["#ffffff", "#cfe3d2", 0.55]} />
          <directionalLight
            position={[16, 26, 14]}
            intensity={2.4}
            color="#fff1d6"
            castShadow
            shadow-mapSize-width={1536}
            shadow-mapSize-height={1536}
            shadow-camera-near={1}
            shadow-camera-far={90}
            shadow-camera-left={-24}
            shadow-camera-right={24}
            shadow-camera-top={24}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0006}
            shadow-normalBias={0.04}
          />
          <directionalLight position={[-18, 10, -8]} intensity={0.9} color="#ffe2d0" />
          <Environment />
          <FitCamera />
          <Controls interactive={interactive} paused={paused} />
          <Rise play={motionOk}>
            <Building />
          </Rise>
        </Canvas>
      ) : (
        <div className="grid h-full w-full place-items-center">
          <div className="bg-brand h-40 w-40 rounded-[2rem] opacity-80" />
        </div>
      )}
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] font-semibold tracking-wide text-muted">
        {hint}
      </p>
    </div>
  );
}
