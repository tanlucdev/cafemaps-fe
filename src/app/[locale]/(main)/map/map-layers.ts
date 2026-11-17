import type mapboxgl from "mapbox-gl";
import type { CafeCollection } from "./helpers";

export function registerCafeLayers(map: mapboxgl.Map, data: CafeCollection) {
  const source = map.getSource("cafes") as mapboxgl.GeoJSONSource | undefined;
  if (source) source.setData(data);
  else {
    map.addSource("cafes", {
      type: "geojson",
      data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 48,
    });
  }
  if (!map.getLayer("clusters")) {
    map.addLayer({
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
  }
  if (!map.getLayer("cluster-count")) {
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "cafes",
      filter: ["has", "point_count"],
      layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
      paint: { "text-color": "#fff7e8" },
    });
  }
  if (!map.getLayer("cafes")) {
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
    });
  }
}
