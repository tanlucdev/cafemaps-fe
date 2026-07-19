"use client"

import "mapbox-gl/dist/mapbox-gl.css"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Check, Coffee, ExternalLink, MapPinned } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Cafe } from "@/types/cafe"
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client"
import { isCafeOpenNow } from "@/lib/opening-hours"
import { cn } from "@/lib/utils"
import { isUnauthorizedError } from "@/apis/http"
import { markVisitedCafe, unmarkVisitedCafe } from "@/apis/visited"
import { useRouter } from "@/i18n/navigation"
import { useVisitedMapData } from "./useVisitedMapData"

type Point = { type: "Point"; coordinates: [number, number] }
type CafeFeature = {
  type: "Feature"
  geometry: Point
  properties: { id: string; name: string; visited: boolean }
}
type CafeCollection = { type: "FeatureCollection"; features: CafeFeature[] }

function cafeHref(locale: string, cafe: Cafe) {
  return `/${locale}/cafe/${cafe.slug}`
}

function cafePoint(cafe: Cafe, visited: boolean): CafeFeature | null {
  if (typeof cafe.lng !== "number" || typeof cafe.lat !== "number") return null
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [cafe.lng, cafe.lat] },
    properties: { id: cafe.id, name: cafe.name, visited },
  }
}

function statusLabel(cafe: Cafe, t: ReturnType<typeof useTranslations>) {
  return isCafeOpenNow(cafe) ? t("openNow") : t("unknownHours")
}

export default function MapPageClient({
  locale,
  cafes,
  initialVisitedIds,
}: {
  locale: string
  cafes: Cafe[]
  initialVisitedIds: string[]
}) {
  const t = useTranslations("map")
  const router = useRouter()
  const redirectToLogin = useCallback(() => {
    saveAuthReturnUrl()
    router.push("/login")
  }, [router])
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const { cafes: mapCafes, visitedIds, setVisitedIds } = useVisitedMapData({ initialCafes: cafes, initialVisitedIds, locale, onUnauthorized: redirectToLogin })
  const visibleCafes = useMemo(() => mapCafes.filter((cafe) => cafePoint(cafe, visitedIds.has(cafe.id))), [mapCafes, visitedIds])
  const selectedCafe = visibleCafes.find((cafe) => cafe.id === selectedId) ?? null
  const data = useMemo<CafeCollection>(
    () => ({
      type: "FeatureCollection",
      features: visibleCafes.flatMap((cafe) => cafePoint(cafe, visitedIds.has(cafe.id)) ?? []),
    }),
    [visibleCafes, visitedIds]
  )
  const dataRef = useRef(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const toggleVisited = useCallback(async (cafe: Cafe) => {
    const token = await getCurrentAccessToken()
    if (!token) {
      saveAuthReturnUrl()
      router.push("/login")
      return
    }
    const nextVisited = !visitedIds.has(cafe.id)
    setBusyId(cafe.id)
    setVisitedIds((current) => new Set(nextVisited ? [...current, cafe.id] : [...current].filter((id) => id !== cafe.id)))
    try {
      if (nextVisited) await markVisitedCafe(cafe.id, token)
      else await unmarkVisitedCafe(cafe.id, token)
    } catch (error) {
      setVisitedIds((current) => new Set(nextVisited ? [...current].filter((id) => id !== cafe.id) : [...current, cafe.id]))
      if (isUnauthorizedError(error)) router.push("/login")
    } finally {
      setBusyId(null)
    }
  }, [router, setVisitedIds, visitedIds])

  useEffect(() => {
    if (!token || !boxRef.current || mapRef.current) return
    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: boxRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.7009, 10.7769],
      zoom: 11,
      cooperativeGestures: true,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")
    map.on("load", () => {
      map.addSource("cafes", {
        type: "geojson",
        data: dataRef.current,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 48,
      })
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "cafes",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#7a4a16", "circle-radius": ["step", ["get", "point_count"], 18, 12, 24, 40, 31], "circle-stroke-color": "#fff4df", "circle-stroke-width": 3 },
      })
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cafes",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
        paint: { "text-color": "#fff7e8" },
      })
      map.addLayer({
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
      })
      map.on("click", "clusters", (event) => {
        const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0]
        const source = map.getSource("cafes") as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom(feature.properties?.cluster_id, (error, zoom) => {
          if (!error && zoom != null) map.easeTo({ center: (feature.geometry as Point).coordinates, zoom })
        })
      })
      map.on("click", "cafes", (event) => {
        const feature = event.features?.[0]
        const id = feature?.properties?.id
        if (typeof id === "string") setSelectedId(id)
      })
      map.on("click", (event) => {
        const features = map.queryRenderedFeatures(event.point, { layers: ["clusters", "cafes"] })
        if (features.length === 0) setSelectedId(null)
      })
      for (const layer of ["clusters", "cafes"]) {
        map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"))
        map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""))
      }
    })
    return () => {
      popupRef.current?.remove()
      map.remove()
      mapRef.current = null
    }
  }, [token])

  useEffect(() => {
    const source = mapRef.current?.getSource("cafes") as mapboxgl.GeoJSONSource | undefined
    source?.setData(data)
  }, [data])

  useEffect(() => {
    if (!selectedCafe || !mapRef.current) {
      popupRef.current?.remove()
      popupRef.current = null
      return
    }
    const point = cafePoint(selectedCafe, visitedIds.has(selectedCafe.id))
    if (!point) return
    const el = document.createElement("div")
    el.className = "w-[230px] overflow-hidden rounded-2xl bg-[#fffaf2] text-[#2c1a0e] shadow-xl"
    el.innerHTML = `<img src="${selectedCafe.coverImage ?? selectedCafe.images[0] ?? "/image/logo-96.png"}" alt="" class="h-24 w-full object-cover"><div class="p-3"><p class="font-black">${selectedCafe.name}</p><p class="mt-1 text-xs text-[#8c6d4f]">${selectedCafe.district ?? ""} · ${statusLabel(selectedCafe, t)}</p><div class="mt-3 flex gap-2"><button data-visit class="min-h-9 flex-1 rounded-full bg-[#875200] px-3 text-xs font-black text-white">${visitedIds.has(selectedCafe.id) ? t("unmark") : t("mark")}</button><a class="inline-flex min-h-9 items-center rounded-full border border-[#e6dacd] px-3 text-xs font-black" href="${cafeHref(locale, selectedCafe)}">${t("detail")}</a></div></div>`
    el.querySelector("[data-visit]")?.addEventListener("click", () => void toggleVisited(selectedCafe))
    popupRef.current?.remove()
    popupRef.current = new mapboxgl.Popup({ offset: 18, closeButton: false, closeOnClick: false, className: "cafe-map-popup" }).setLngLat(point.geometry.coordinates as [number, number]).setDOMContent(el).addTo(mapRef.current)
    mapRef.current.easeTo({ center: point.geometry.coordinates as [number, number], zoom: Math.max(mapRef.current.getZoom(), 13) })
  }, [locale, selectedCafe, t, toggleVisited, visitedIds])

  if (!token) {
    return <main className="grid min-h-[100svh] place-items-center px-4 pt-20 text-center text-[#2c1a0e]">{t("missingToken")}</main>
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#fdf6ec] pt-[70px] md:pt-[76px]">
      <div className="grid h-[calc(100svh-70px)] md:h-[calc(100svh-76px)] md:grid-cols-[360px_1fr]">
        <aside className="z-10 hidden overflow-y-auto border-r border-[#e8d8c0] bg-[#fff7e8]/96 p-4 shadow-[14px_0_40px_rgba(82,52,25,0.08)] md:block">
          <MapPanel cafes={visibleCafes} visitedIds={visitedIds} selectedId={selectedCafe?.id} busyId={busyId} t={t} onSelect={setSelectedId} onToggle={toggleVisited} />
        </aside>
        <div ref={boxRef} className="min-h-0 w-full" />
      </div>
      <section className="fixed right-3 bottom-[92px] left-3 z-20 max-h-[38svh] overflow-y-auto rounded-2xl border border-[#e8d8c0] bg-[#fffaf2]/96 p-3 shadow-2xl backdrop-blur md:hidden">
        <MapPanel cafes={visibleCafes} visitedIds={visitedIds} selectedId={selectedCafe?.id} busyId={busyId} t={t} onSelect={setSelectedId} onToggle={toggleVisited} compact />
      </section>
    </main>
  )
}

function MapPanel({
  cafes,
  visitedIds,
  selectedId,
  busyId,
  t,
  onSelect,
  onToggle,
  compact,
}: {
  cafes: Cafe[]
  visitedIds: Set<string>
  selectedId?: string
  busyId: string | null
  t: ReturnType<typeof useTranslations>
  onSelect: (id: string) => void
  onToggle: (cafe: Cafe) => void
  compact?: boolean
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.12em] text-[#a86d1e] uppercase">{t("eyebrow")}</p>
          <h1 className="text-xl font-black text-[#2c1a0e]">{t("visitedTitle", { count: visitedIds.size })}</h1>
        </div>
        <div className="rounded-full bg-[#fff0d2] px-3 py-1 text-xs font-black text-[#875200]">{cafes.length}</div>
      </div>
      {cafes.length === 0 && (
        <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-[#d9bf99] bg-white/60 px-5 py-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#fff0d2] text-[#875200]">
              <MapPinned size={22} />
            </div>
            <p className="font-black text-[#2c1a0e]">{t("emptyTitle")}</p>
            <p className="mt-1 text-sm leading-6 text-[#8c6d4f]">{t("emptySubtitle")}</p>
          </div>
        </div>
      )}
      <div className={cn("grid gap-2", compact && "grid-flow-col auto-cols-[82%] overflow-x-auto pb-1")}>
        {cafes.map((cafe) => {
          const visited = visitedIds.has(cafe.id)
          return (
            <div
              key={cafe.id}
              onClick={() => onSelect(cafe.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(cafe.id)
              }}
              className={cn("flex min-h-[92px] w-full gap-3 rounded-2xl border bg-white p-2 text-left shadow-sm transition", selectedId === cafe.id ? "border-[#c8842a]" : "border-[#ead8bf]")}
            >
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5edd8]">
                {cafe.coverImage || cafe.images[0] ? (
                  <Image src={cafe.coverImage ?? cafe.images[0]} alt="" width={76} height={76} className="h-full w-full object-cover" />
                ) : (
                  <Coffee size={22} className="text-[#875200]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-[#2c1a0e]">{cafe.name}</p>
                <p className="mt-1 truncate text-xs font-semibold text-[#8c6d4f]">{cafe.district ?? t("unknownDistrict")}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-black", visited ? "bg-[#fff0d2] text-[#875200]" : "bg-[#eee6dc] text-[#746556]")}>{visited ? <Check size={13} /> : <MapPinned size={13} />}{visited ? t("visited") : t("unvisited")}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(cafe) }} className="inline-flex h-7 items-center rounded-full bg-[#875200] px-2 text-xs font-black text-white">{busyId === cafe.id ? "..." : visited ? t("unmark") : t("mark")}</button>
                  <a onClick={(e) => e.stopPropagation()} href={`./cafe/${cafe.slug}`} className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#ead8bf] text-[#875200]"><ExternalLink size={13} /></a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
