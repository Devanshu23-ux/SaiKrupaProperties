"use client";

/* The Three.js scene API is imperative by design (camera, scene, controls). */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { motionAllowed, webglSupported } from "@/lib/browser";
import { yevaliTerrain, type Plot, type Pt, type SiteLayout } from "@/lib/plots";

/* ------------------------------------------------------------------ *
 * 3D site model, drawn from the same traced polygons as the 2D plan.
 * Shivare is flat (no contours were supplied). Yevali follows a plane
 * fitted to the spot levels on the contour sheet, at an exaggerated
 * vertical scale; the figure says so.
 * ------------------------------------------------------------------ */

const EXAGGERATION = 2.4;
const PLOT_HEIGHT = 1.3;

const COLORS = {
  plot: new THREE.Color("#8dc9a5"),
  plotDim: new THREE.Color("#e1f0e7"),
  hover: new THREE.Color("#e6c76e"),
  selected: new THREE.Color("#cf6f66"),
};

type Elevation = (x: number, z: number) => number;

function makeElevation(layout: SiteLayout): Elevation {
  if (layout.slug !== "yevali") return () => 0;
  const raw = yevaliTerrain();
  const { minX, maxX, minZ, maxZ } = layout.bounds;
  const mid = raw((minX + maxX) / 2, (minZ + maxZ) / 2);
  return (x, z) => (raw(x, z) - mid) * EXAGGERATION;
}

/** Shape in plan (x, z) -> geometry lying on the terrain, thickness upwards. */
function drape(geometry: THREE.BufferGeometry, elev: Elevation, lift = 0) {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getY(i);
    const t = pos.getZ(i);
    pos.setXYZ(i, x, elev(x, z) + lift + t, z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

const toShape = (pts: Pt[]) => new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));

function flatGeometry(pts: Pt[], elev: Elevation, lift: number) {
  return drape(new THREE.ShapeGeometry(toShape(pts)), elev, lift);
}

function solidGeometry(pts: Pt[], elev: Elevation, depth: number, lift = 0) {
  return drape(new THREE.ExtrudeGeometry(toShape(pts), { depth, bevelEnabled: false }), elev, lift);
}

/* ------------------------------ textures ------------------------------ */

function makeNumberTexture(text: string, accent: string) {
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = accent;
  ctx.stroke();
  ctx.fillStyle = "#2b3445";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${text.length > 2 ? 46 : 58}px 'Poppins','Segoe UI',Arial,sans-serif`;
  ctx.fillText(text, S / 2, S / 2 + 3);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeTagTexture(text: string, fg: string, bg: string) {
  const W = 512;
  const H = 96;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(4, 4, W - 8, H - 8, 40);
  } else {
    // Safari before 16: draw the rounded ends by hand.
    const r = 40;
    const x0 = 4, y0 = 4, x1 = W - 4, y1 = H - 4;
    ctx.moveTo(x0 + r, y0);
    ctx.arcTo(x1, y0, x1, y1, r);
    ctx.arcTo(x1, y1, x0, y1, r);
    ctx.arcTo(x0, y1, x0, y0, r);
    ctx.arcTo(x0, y0, x1, y0, r);
    ctx.closePath();
  }
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 44px 'Poppins','Segoe UI',Arial,sans-serif";
  ctx.fillText(text, W / 2, H / 2 + 3);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeWaterTexture() {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#9fd2dc";
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 3;
  for (let y = 18; y < S; y += 32) {
    ctx.beginPath();
    for (let x = 0; x <= S; x += 8) {
      const yy = y + Math.sin((x / S) * Math.PI * 4 + y) * 5;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  return tex;
}

function makeGardenTexture() {
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#cfe6d6";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#8dbf9c";
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    ctx.arc((i * 53) % S, (i * 97) % S, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 10);
  return tex;
}

/* ------------------------------ pieces ------------------------------ */

function PlotMesh({
  plot,
  elev,
  index,
  state,
  dim,
  onHover,
  onSelect,
  play,
}: {
  plot: Plot;
  elev: Elevation;
  index: number;
  state: "idle" | "hover" | "selected";
  dim: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  play: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const geometry = useMemo(() => solidGeometry(plot.points, elev, PLOT_HEIGHT, 0.04), [plot, elev]);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.plot.clone(), roughness: 0.5, metalness: 0.04, side: THREE.DoubleSide }),
    [],
  );
  const labelTex = useMemo(() => makeNumberTexture(plot.no, "#8dc9a5"), [plot.no]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      labelTex.dispose();
    },
    [geometry, material, labelTex],
  );

  const topY = elev(plot.centroid[0], plot.centroid[1]) + PLOT_HEIGHT + 0.04;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    clock.current += dt;

    const delay = index * 0.03;
    const grow = play ? Math.min(1, Math.max(0, (clock.current - delay) / 0.7)) : 1;
    const eased = 1 - (1 - grow) ** 3;
    const lift = state === "selected" ? 1.6 : state === "hover" ? 0.9 : 0;
    g.scale.y += (Math.max(0.001, eased) - g.scale.y) * Math.min(1, dt * 14);
    g.position.y += (lift - g.position.y) * Math.min(1, dt * 12);

    const target =
      state === "selected" ? COLORS.selected : state === "hover" ? COLORS.hover : dim ? COLORS.plotDim : COLORS.plot;
    material.color.lerp(target, Math.min(1, dt * 10));
  });

  return (
    <>
      <group ref={group}>
        <mesh
          geometry={geometry}
          material={material}
          castShadow
          receiveShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(plot.id);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plot.id);
          }}
        />
      </group>
      <sprite
        position={[plot.centroid[0], topY + (state === "idle" ? 3.2 : 4.6), plot.centroid[1]]}
        scale={[plot.no.length > 2 ? 11 : 9, plot.no.length > 2 ? 11 : 9, 1]}
        renderOrder={5}
      >
        <spriteMaterial map={labelTex} transparent depthWrite={false} toneMapped={false} opacity={dim ? 0.4 : 1} />
      </sprite>
    </>
  );
}

function Tag({ text, fg, bg, position, width }: { text: string; fg: string; bg: string; position: [number, number, number]; width: number }) {
  const tex = useMemo(() => makeTagTexture(text, fg, bg), [text, fg, bg]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <sprite position={position} scale={[width, width * (96 / 512), 1]} renderOrder={6}>
      <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function Scene({
  layout,
  selected,
  hovered,
  filter,
  onHover,
  onSelectPlot,
  onSelectArea,
  toHighway,
  labels,
  play,
}: {
  layout: SiteLayout;
  selected: string | null;
  hovered: string | null;
  filter: number | null;
  onHover: (id: string | null) => void;
  onSelectPlot: (id: string) => void;
  onSelectArea: (kind: "amenity" | "garden" | "river") => void;
  toHighway: string;
  labels: { amenity: string; garden: string; river: string };
  play: boolean;
}) {
  const elev = useMemo(() => makeElevation(layout), [layout]);

  const geo = useMemo(() => {
    const g: Record<string, THREE.BufferGeometry | THREE.BufferGeometry[]> = {};
    if (layout.boundary) g.boundary = solidGeometry(layout.boundary, elev, 0.25, -0.2);
    if (layout.garden) g.garden = flatGeometry(layout.garden, elev, 0.12);
    if (layout.river) g.river = flatGeometry(layout.river, elev, -0.1);
    if (layout.amenity) g.amenity = solidGeometry(layout.amenity.points, elev, 0.7, 0.1);
    g.roads = layout.roads.map((r) => solidGeometry(r, elev, 0.2, 0.0));
    return g;
  }, [layout, elev]);

  const textures = useMemo(() => ({ water: makeWaterTexture(), garden: makeGardenTexture() }), []);
  useEffect(
    () => () => {
      textures.water.dispose();
      textures.garden.dispose();
    },
    [textures],
  );
  useEffect(
    () => () => {
      for (const v of Object.values(geo)) (Array.isArray(v) ? v : [v]).forEach((x) => x.dispose());
    },
    [geo],
  );

  useFrame((_, delta) => {
    textures.water.offset.x += delta * 0.02;
    textures.water.offset.y += delta * 0.012;
  });

  const { minX, maxX, minZ, maxZ } = layout.bounds;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const span = Math.max(maxX - minX, maxZ - minZ);
  const groundY = Math.min(elev(minX, maxZ), elev(maxX, minZ), elev(minX, minZ), elev(maxX, maxZ)) - 1.2;

  return (
    <group>
      {/* Base slab */}
      <mesh position={[cx, groundY, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[span * 1.15, 64]} />
        <meshStandardMaterial color="#eef1ef" roughness={1} />
      </mesh>

      {geo.boundary && (
        <mesh geometry={geo.boundary as THREE.BufferGeometry} receiveShadow>
          <meshStandardMaterial color="#e2e7ee" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}

      {(geo.roads as THREE.BufferGeometry[]).map((g, i) => (
        <mesh key={i} geometry={g} receiveShadow>
          <meshStandardMaterial color="#e2e7ee" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {geo.river && (
        <mesh geometry={geo.river as THREE.BufferGeometry}>
          <meshStandardMaterial map={textures.water} roughness={0.12} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}
      {geo.river && layout.river && (
        <Tag
          text={labels.river}
          fg="#ffffff"
          bg="#3d7f8d"
          width={34}
          position={[
            layout.river.reduce((s, p) => s + p[0], 0) / layout.river.length,
            groundY + 8,
            layout.river.reduce((s, p) => s + p[1], 0) / layout.river.length,
          ]}
        />
      )}

      {geo.garden && layout.garden && (
        <>
          <mesh
            geometry={geo.garden as THREE.BufferGeometry}
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onSelectArea("garden");
            }}
          >
            <meshStandardMaterial map={textures.garden} roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
          <Tag
            text={labels.garden}
            fg="#ffffff"
            bg="#3f7a55"
            width={26}
            position={[
              layout.garden.reduce((s, p) => s + p[0], 0) / layout.garden.length,
              elev(layout.garden[0][0], layout.garden[0][1]) + 8,
              layout.garden.reduce((s, p) => s + p[1], 0) / layout.garden.length,
            ]}
          />
        </>
      )}

      {geo.amenity && layout.amenity && (
        <>
          <mesh
            geometry={geo.amenity as THREE.BufferGeometry}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onSelectArea("amenity");
            }}
          >
            <meshStandardMaterial color={selected === "amenity" ? "#cf6f66" : "#a9b8cf"} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <Tag
            text={labels.amenity}
            fg="#ffffff"
            bg="#6f93b5"
            width={30}
            position={[layout.amenity.centroid[0], elev(layout.amenity.centroid[0], layout.amenity.centroid[1]) + 8, layout.amenity.centroid[1]]}
          />
        </>
      )}

      {layout.plots.map((p, i) => (
        <PlotMesh
          key={p.id}
          plot={p}
          elev={elev}
          index={i}
          state={selected === p.id ? "selected" : hovered === p.id ? "hover" : "idle"}
          dim={filter !== null && (layout.slug === "shivare" ? p.statedAre : p.areaSqft) !== filter}
          onHover={onHover}
          onSelect={onSelectPlot}
          play={play}
        />
      ))}

      {layout.slug === "shivare" && layout.highwayEnd && (
        <>
          <mesh position={[layout.highwayEnd[0], 0.2, layout.highwayEnd[1]]} receiveShadow castShadow>
            <boxGeometry args={[20, 0.4, 20]} />
            <meshStandardMaterial color="#8a93a6" roughness={0.8} />
          </mesh>
          <Tag text="NH-48" fg="#2b3445" bg="#e6c76e" width={22} position={[layout.highwayEnd[0], 9, layout.highwayEnd[1]]} />
          <Tag text={toHighway} fg="#ffffff" bg="#9a6428" width={50} position={[layout.highwayEnd[0], 16, layout.highwayEnd[1] + 4]} />
        </>
      )}
    </group>
  );
}

/* ------------------------------ rig ------------------------------ */

interface RigApi {
  zoom: (factor: number) => void;
  reset: () => void;
}

function Rig({ layout, api }: { layout: SiteLayout; api: React.RefObject<RigApi | null> }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const controls = useRef<OrbitControls | null>(null);

  const { minX, maxX, minZ, maxZ } = layout.bounds;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const span = Math.max(maxX - minX, maxZ - minZ);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.12;
    pmrem.dispose();
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const home = () => {
      camera.position.set(cx, span * 1.0, cz + span * 0.9);
      camera.lookAt(cx, 0, cz);
    };
    home();
    const orbit = new OrbitControls(camera, gl.domElement);
    orbit.target.set(cx, 0, cz);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.08;
    orbit.enableZoom = false;
    orbit.enablePan = true;
    orbit.screenSpacePanning = false;
    orbit.rotateSpeed = 0.6;
    orbit.minPolarAngle = 0.1;
    orbit.maxPolarAngle = Math.PI * 0.46;
    // Phones: vertical swipes scroll the page, horizontal drags rotate; two
    // fingers pan. Desktop keeps full control.
    gl.domElement.style.touchAction = window.matchMedia("(pointer: coarse)").matches ? "pan-y" : "none";
    orbit.update();
    controls.current = orbit;

    api.current = {
      zoom: (factor) => {
        const offset = camera.position.clone().sub(orbit.target);
        offset.multiplyScalar(factor);
        const len = offset.length();
        if (len < span * 0.25 || len > span * 2.6) return;
        camera.position.copy(orbit.target).add(offset);
        orbit.update();
      },
      reset: () => {
        orbit.target.set(cx, 0, cz);
        home();
        orbit.update();
      },
    };

    return () => {
      api.current = null;
      orbit.dispose();
      controls.current = null;
    };
  }, [camera, gl, cx, cz, span, api]);

  useFrame(() => controls.current?.update());
  return null;
}

/* ------------------------------ component ------------------------------ */

export interface Site3DProps {
  layout: SiteLayout;
  selected: string | null;
  hovered: string | null;
  filter: number | null;
  onHover: (id: string | null) => void;
  onSelectPlot: (id: string) => void;
  onSelectArea: (kind: "amenity" | "garden" | "river") => void;
  note: string;
  toHighway: string;
  notToScale: string;
  labels: { amenity: string; garden: string; river: string };
}

export function Site3D(props: Site3DProps) {
  const { layout, note, notToScale } = props;
  const [supported] = useState(webglSupported);
  const [motionOk] = useState(motionAllowed);
  const [ready, setReady] = useState(false);
  const api = useRef<RigApi | null>(null);

  useEffect(() => {
    const go = () => setReady(true);
    if (document.fonts?.load) {
      document.fonts.load("800 40px Poppins").then(go).catch(go);
      window.setTimeout(go, 1000);
    } else go();
  }, []);

  const { minX, maxX, minZ, maxZ } = layout.bounds;
  const span = Math.max(maxX - minX, maxZ - minZ);

  if (!supported)
    return <div className="grid h-full place-items-center px-8 text-center text-sm font-semibold text-muted">{note}</div>;

  return (
    <div className="relative h-full w-full min-w-0 overflow-hidden">
      {ready && (
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.8]}
          camera={{ fov: 34, near: 1, far: span * 8 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NoToneMapping;
          }}
          onPointerMissed={() => props.onHover(null)}
        >
          <ambientLight intensity={0.5} />
          <hemisphereLight args={["#ffffff", "#e6ebf2", 0.55]} />
          <directionalLight
            position={[span * 0.5, span * 0.9, span * 0.4]}
            intensity={1.5}
            color="#fff4e0"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={1}
            shadow-camera-far={span * 3}
            shadow-camera-left={-span * 0.8}
            shadow-camera-right={span * 0.8}
            shadow-camera-top={span * 0.8}
            shadow-camera-bottom={-span * 0.8}
            shadow-bias={-0.0004}
            shadow-normalBias={0.05}
          />
          <directionalLight position={[-span * 0.5, span * 0.3, -span * 0.3]} intensity={0.6} color="#f3d6d1" />
          <Rig layout={layout} api={api} />
          <Scene
            layout={layout}
            selected={props.selected}
            hovered={props.hovered}
            filter={props.filter}
            onHover={props.onHover}
            onSelectPlot={props.onSelectPlot}
            onSelectArea={props.onSelectArea}
            toHighway={props.toHighway}
            labels={props.labels}
            play={motionOk}
          />
        </Canvas>
      )}

      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-card">
        <button type="button" onClick={() => api.current?.zoom(0.8)} aria-label="Zoom in" className="grid h-10 w-10 place-items-center text-xl font-bold text-ink hover:bg-violet-soft">+</button>
        <button type="button" onClick={() => api.current?.zoom(1.25)} aria-label="Zoom out" className="grid h-10 w-10 place-items-center border-y border-line text-xl font-bold text-ink hover:bg-violet-soft">−</button>
        <button type="button" onClick={() => api.current?.reset()} aria-label="Reset" className="grid h-10 w-10 place-items-center text-sm font-bold text-ink hover:bg-violet-soft">⟲</button>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-2 px-4 text-center text-[11px] font-semibold text-muted">
        {note}
        {layout.slug === "shivare" ? ` · ${notToScale}` : ""}
      </p>
    </div>
  );
}
