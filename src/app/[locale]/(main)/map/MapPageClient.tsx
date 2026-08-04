"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { isUnauthorizedError } from "@/apis/http";
import { markVisitedCafe, unmarkVisitedCafe } from "@/apis/visited";
import { useRouter } from "@/i18n/navigation";
import { cafeHref, cafePoint, statusLabel, type CafeCollection, type Point } from "./helpers";
import { MapPanel } from "./MapPanel";
import { useVisitedMapData } from "./useVisitedMapData";

type MapboxModule = typeof import("mapbox-gl").default;

export default function MapPageClient({
  locale,
  cafes,
  initialVisitedIds,
}: {
  locale: string;
  cafes: Cafe[];
  initialVisitedIds: string[];
}) {
  const t = useTranslations("map");
  const router = useRouter();
  const redirectToLogin = useCallback(() => {
    saveAuthReturnUrl();
    router.push("/login");
  }, [router]);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxRef = useRef<MapboxModule | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const {
    cafes: mapCafes,
    visitedIds,
    setVisitedIds,
  } = useVisitedMapData({
    initialCafes: cafes,
    initialVisitedIds,
    locale,
    onUnauthorized: redirectToLogin,
  });
  const visibleCafes = useMemo(
    () => mapCafes.filter((cafe) => cafePoint(cafe, visitedIds.has(cafe.id))),
    [mapCafes, visitedIds],
  );
  const selectedCafe = visibleCafes.find((cafe) => cafe.id === selectedId) ?? null;
  const data = useMemo<CafeCollection>(
    () => ({
      type: "FeatureCollection",
      features: visibleCafes.flatMap((cafe) => cafePoint(cafe, visitedIds.has(cafe.id)) ?? []),
    }),
    [visibleCafes, visitedIds],
  );
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const toggleVisited = useCallback(
    async (cafe: Cafe) => {
      const token = await getCurrentAccessToken();
      if (!token) {
        saveAuthReturnUrl();
        router.push("/login");
        return;
      }
      const nextVisited = !visitedIds.has(cafe.id);
      setBusyId(cafe.id);
      setVisitedIds(
        (current) =>
          new Set(
            nextVisited ? [...current, cafe.id] : [...current].filter((id) => id !== cafe.id),
          ),
      );
      try {
        if (nextVisited) await markVisitedCafe(cafe.id, token);
        else await unmarkVisitedCafe(cafe.id, token);
      } catch (error) {
        setVisitedIds(
          (current) =>
            new Set(
              nextVisited ? [...current].filter((id) => id !== cafe.id) : [...current, cafe.id],
            ),
        );
        if (isUnauthorizedError(error)) router.push("/login");
      } finally {
        setBusyId(null);
      }
    },
    [router, setVisitedIds, visitedIds],
  );

  useEffect(() => {
    if (!token || !boxRef.current || mapRef.current) return;
    let frame = 0;
    let map: mapboxgl.Map | null = null;
    let disposed = false;
    const syncSize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map?.resize());
    };

    (async () => {
      const mapbox = (await import("mapbox-gl")).default;
      if (disposed || !boxRef.current || mapRef.current) return;
      mapboxRef.current = mapbox;
      mapbox.accessToken = token;
      const nextMap = new mapbox.Map({
        container: boxRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [106.7009, 10.7769],
        zoom: 11,
        cooperativeGestures: true,
      });
      map = nextMap;
      mapRef.current = map;
      nextMap.addControl(new mapbox.NavigationControl({ showCompass: false }), "top-right");
      nextMap.once("idle", syncSize);
      nextMap.on("load", () => {
        nextMap.addSource("cafes", {
          type: "geojson",
          data: dataRef.current,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 48,
        });
        nextMap.addLayer({
          id: "clusters",
          type: "circle",
          source: "cafes",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#7a4a16",
            "circle-radius": ["step", ["get", "point_count"], 18, 12, 24, 40, 31],
            "circle-stroke-color": "#fff4df",
            "circle-stroke-width": 3,
          },
        });
        nextMap.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "cafes",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
          paint: { "text-color": "#fff7e8" },
        });
        nextMap.addLayer({
          id: "cafes",
          type: "circle",
          source: "cafes",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["case", ["get", "visited"], "#f4b35d", "#8f8170"],
            "circle-radius": ["case", ["get", "visited"], 9, 7],
            "circle-stroke-color": "#fff7e8",
            "circle-stroke-width": 2,
          },
        });
        nextMap.on("click", "clusters", (event) => {
          const feature = nextMap.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0];
          const source = nextMap.getSource("cafes") as mapboxgl.GeoJSONSource;
          source.getClusterExpansionZoom(feature.properties?.cluster_id, (error, zoom) => {
            if (!error && zoom != null)
              nextMap.easeTo({ center: (feature.geometry as Point).coordinates, zoom });
          });
        });
        nextMap.on("click", "cafes", (event) => {
          const feature = event.features?.[0];
          const id = feature?.properties?.id;
          if (typeof id === "string") setSelectedId(id);
        });
        nextMap.on("click", (event) => {
          const features = nextMap.queryRenderedFeatures(event.point, {
            layers: ["clusters", "cafes"],
          });
          if (features.length === 0) setSelectedId(null);
        });
        for (const layer of ["clusters", "cafes"]) {
          nextMap.on("mouseenter", layer, () => (nextMap.getCanvas().style.cursor = "pointer"));
          nextMap.on("mouseleave", layer, () => (nextMap.getCanvas().style.cursor = ""));
        }
      });
      window.visualViewport?.addEventListener("resize", syncSize);
      window.visualViewport?.addEventListener("scroll", syncSize);
      window.addEventListener("orientationchange", syncSize);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.visualViewport?.removeEventListener("resize", syncSize);
      window.visualViewport?.removeEventListener("scroll", syncSize);
      window.removeEventListener("orientationchange", syncSize);
      popupRef.current?.remove();
      map?.remove();
      mapRef.current = null;
      mapboxRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const source = mapRef.current?.getSource("cafes") as mapboxgl.GeoJSONSource | undefined;
    source?.setData(data);
  }, [data]);

  useEffect(() => {
    if (!selectedCafe || !mapRef.current || !mapboxRef.current) {
      popupRef.current?.remove();
      popupRef.current = null;
      return;
    }
    const point = cafePoint(selectedCafe, visitedIds.has(selectedCafe.id));
    if (!point) return;
    const el = document.createElement("div");
    el.className = "w-[230px] overflow-hidden rounded-2xl bg-[#fffaf2] text-[#2c1a0e] shadow-xl";
    el.innerHTML = `<img src="${selectedCafe.coverImage ?? selectedCafe.images[0] ?? "/image/logo-96.png"}" alt="" class="h-24 w-full object-cover"><div class="p-3"><p class="font-black">${selectedCafe.name}</p><p class="mt-1 text-xs text-[#8c6d4f]">${selectedCafe.district ?? ""} · ${statusLabel(selectedCafe, t)}</p><div class="mt-3 flex gap-2"><button data-visit class="min-h-9 flex-1 rounded-full bg-[#875200] px-3 text-xs font-black text-white">${visitedIds.has(selectedCafe.id) ? t("unmark") : t("mark")}</button><a class="inline-flex min-h-9 items-center rounded-full border border-[#e6dacd] px-3 text-xs font-black" href="${cafeHref(locale, selectedCafe)}">${t("detail")}</a></div></div>`;
    el.querySelector("[data-visit]")?.addEventListener(
      "click",
      () => void toggleVisited(selectedCafe),
    );
    popupRef.current?.remove();
    popupRef.current = new mapboxRef.current.Popup({
      offset: 18,
      closeButton: false,
      closeOnClick: false,
      className: "cafe-map-popup",
    })
      .setLngLat(point.geometry.coordinates as [number, number])
      .setDOMContent(el)
      .addTo(mapRef.current);
    mapRef.current.easeTo({
      center: point.geometry.coordinates as [number, number],
      zoom: Math.max(mapRef.current.getZoom(), 13),
    });
  }, [locale, selectedCafe, t, toggleVisited, visitedIds]);

  if (!token) {
    return (
      <main className="grid min-h-[100svh] place-items-center px-4 pt-20 text-center text-[#2c1a0e]">
        {t("missingToken")}
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#fdf6ec] pt-[70px] md:pt-[76px]">
      <div className="grid h-[calc(100svh-70px)] md:h-[calc(100svh-76px)] md:grid-cols-[360px_1fr]">
        <aside className="z-10 hidden overflow-y-auto border-r border-[#e8d8c0] bg-[#fff7e8]/96 p-4 shadow-[14px_0_40px_rgba(82,52,25,0.08)] md:block">
          <MapPanel
            cafes={visibleCafes}
            visitedIds={visitedIds}
            selectedId={selectedCafe?.id}
            busyId={busyId}
            t={t}
            onSelect={setSelectedId}
            onToggle={toggleVisited}
          />
        </aside>
        <div ref={boxRef} className="min-h-0 w-full" />
      </div>
      <section className="fixed right-3 bottom-[92px] left-3 z-20 max-h-[38svh] overflow-y-auto rounded-2xl border border-[#e8d8c0] bg-[#fffaf2]/96 p-3 shadow-2xl backdrop-blur md:hidden">
        <MapPanel
          cafes={visibleCafes}
          visitedIds={visitedIds}
          selectedId={selectedCafe?.id}
          busyId={busyId}
          t={t}
          onSelect={setSelectedId}
          onToggle={toggleVisited}
          compact
        />
      </section>
    </main>
  );
}
