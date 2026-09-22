"use client";

/* Local licensed assets are intentionally rendered without Next image transforms. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { publicPath } from "@/lib/paths";
import styles from "./local-vr-viewer.module.css";

type ViewerMode = "exterior" | "interior";
type InteriorScene = "driver" | "rear" | "trunk";

const EXTERIOR_FRAME_COUNT = 36;
const INTERIOR_SCENES: { id: InteriorScene; label: string }[] = [
  { id: "driver", label: "Место водителя" },
  { id: "rear", label: "Задний ряд" },
  { id: "trunk", label: "Багажник" },
];

const START_VIEW: Record<InteriorScene, { lon: number; lat: number }> = {
  driver: { lon: 90, lat: -8 },
  rear: { lon: 90, lat: -12 },
  trunk: { lon: 90, lat: -28 },
};

const exteriorFrame = (frame: number) =>
  publicPath(`/vr/77944/exterior/${String(frame).padStart(2, "0")}.png`);

function ExteriorViewer() {
  const [frame, setFrame] = useState(0);
  const drag = useRef({ active: false, x: 0, frame: 0 });

  useEffect(() => {
    for (let index = 0; index < EXTERIOR_FRAME_COUNT; index += 1) {
      const image = new Image();
      image.src = exteriorFrame(index);
    }
  }, []);

  const rotate = (difference: number) => {
    setFrame(
      (current) =>
        (current + difference + EXTERIOR_FRAME_COUNT) % EXTERIOR_FRAME_COUNT,
    );
  };

  return (
    <div
      className={styles.exterior}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { active: true, x: event.clientX, frame };
      }}
      onPointerMove={(event) => {
        if (!drag.current.active) return;
        const difference = Math.round((drag.current.x - event.clientX) / 11);
        setFrame(
          (drag.current.frame + difference + EXTERIOR_FRAME_COUNT * 2) %
            EXTERIOR_FRAME_COUNT,
        );
      }}
      onPointerUp={(event) => {
        drag.current.active = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
    >
      <img
        src={exteriorFrame(frame)}
        alt={`Geely Cowboy, ракурс ${frame + 1} из ${EXTERIOR_FRAME_COUNT}`}
        draggable={false}
      />
      <div className={styles.hint}>
        <span>↔</span>
        Тяните мышью или пальцем
      </div>
      <div className={styles.frameCounter}>
        {String(frame + 1).padStart(2, "0")} / {EXTERIOR_FRAME_COUNT}
      </div>
      <div className={styles.rotateControls}>
        <button type="button" onClick={() => rotate(-1)} aria-label="Повернуть влево">
          ←
        </button>
        <button type="button" onClick={() => rotate(1)} aria-label="Повернуть вправо">
          →
        </button>
      </div>
    </div>
  );
}

function InteriorViewer({ scene }: { scene: InteriorScene }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setLoading(true);
    setFailed(false);

    const scene3d = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      setLoading(false);
      render();
    };
    manager.onError = () => {
      setFailed(true);
      setLoading(false);
    };

    const cubeTexture = new THREE.CubeTextureLoader(manager)
      .setPath(publicPath(`/vr/77944/interior/${scene}/`))
      .load(
        ["right.jpg", "left.jpg", "up.jpg", "down.jpg", "front.jpg", "back.jpg"].map(
          (face) => `${face}?v=3`,
        ),
      )
    cubeTexture.colorSpace = THREE.SRGBColorSpace;
    scene3d.background = cubeTexture;

    const view = { ...START_VIEW[scene] };
    const pointer = { active: false, x: 0, y: 0, lon: 0, lat: 0 };

    function render() {
      const phi = THREE.MathUtils.degToRad(90 - view.lat);
      const theta = THREE.MathUtils.degToRad(view.lon);
      camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );
      renderer.render(scene3d, camera);
    }

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      render();
    };

    const canvas = renderer.domElement;
    const pointerDown = (event: PointerEvent) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.lon = view.lon;
      pointer.lat = view.lat;
      canvas.setPointerCapture(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      if (!pointer.active) return;
      view.lon = pointer.lon + (pointer.x - event.clientX) * 0.13;
      view.lat = Math.max(
        -55,
        Math.min(55, pointer.lat + (event.clientY - pointer.y) * 0.13),
      );
      render();
    };
    const pointerUp = (event: PointerEvent) => {
      pointer.active = false;
      canvas.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov = Math.max(42, Math.min(88, camera.fov + event.deltaY * 0.03));
      camera.updateProjectionMatrix();
      render();
    };

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("wheel", wheel, { passive: false });
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("wheel", wheel);
      cubeTexture.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [scene]);

  return (
    <div className={styles.interior} ref={mountRef}>
      {loading && <div className={styles.loading}>Загружаем панораму…</div>}
      {failed && (
        <div className={styles.loading}>Не удалось загрузить эту сцену</div>
      )}
      <div className={styles.hint}>
        <span>↔</span>
        Осмотритесь внутри · колесо меняет масштаб
      </div>
    </div>
  );
}

export function LocalVrViewer({ mode }: { mode: ViewerMode }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [interiorScene, setInteriorScene] = useState<InteriorScene>("driver");

  return (
    <div className={styles.viewer} ref={viewerRef}>
      <div className={styles.toolbar}>
        <div>
          <span className={styles.liveDot} />
          VR 360° · {mode === "exterior" ? "Экстерьер" : "Салон"}
        </div>
        <button
          type="button"
          onClick={() => void viewerRef.current?.requestFullscreen()}
        >
          На весь экран
        </button>
      </div>
      {mode === "interior" && (
        <div className={styles.sceneTabs} role="tablist" aria-label="Сцены салона">
          {INTERIOR_SCENES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={interiorScene === item.id}
              className={interiorScene === item.id ? styles.activeScene : ""}
              onClick={() => setInteriorScene(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {mode === "exterior" ? (
        <ExteriorViewer />
      ) : (
        <InteriorViewer scene={interiorScene} />
      )}
      <div className={styles.attribution}>
        Интерфейс на русском · материалы показа локальные
      </div>
    </div>
  );
}
