export interface MapMarker {
  id: string
  x: number
  y: number
  name: string
  type: "house" | "shop" | "gas-station" | "repair-shop" | "job" | "other"
  description: string
  isFixed?: boolean
}

export const DEFAULT_MAP_MARKERS: MapMarker[] = [
  {
    id: "home",
    x: 40,
    y: 65,
    name: "Home (Player's House)",
    type: "house",
    description: "Your home where the Rivetta is located",
    isFixed: true,
  },
  {
    id: "teimo-shop",
    x: 18,
    y: 15,
    name: "Teimo's Shop",
    type: "shop",
    description: "General store for parts and supplies in Peräjärvi",
    isFixed: true,
  },
  {
    id: "repair-shop",
    x: 17,
    y: 17,
    name: "Fleetari's Repair Shop",
    type: "repair-shop",
    description: "Car repair and inspection in Peräjärvi",
    isFixed: true,
  },
  {
    id: "gas-station",
    x: 19,
    y: 16,
    name: "Gas Station",
    type: "gas-station",
    description: "Fuel station in Peräjärvi",
    isFixed: true,
  },
  {
    id: "perajarvi-town",
    x: 18,
    y: 16,
    name: "Peräjärvi (Town)",
    type: "other",
    description: "Main town area in upper left",
    isFixed: true,
  },
  {
    id: "jokke",
    x: 75,
    y: 25,
    name: "Jokke's House (Loppe)",
    type: "house",
    description: "Jokke at Loppe area on the right side",
    isFixed: true,
  },
  {
    id: "ventti-house",
    x: 35,
    y: 70,
    name: "Ventti's House",
    type: "house",
    description: "Ventti's place near Rykipohja",
    isFixed: true,
  },
  {
    id: "kesselinpera",
    x: 55,
    y: 50,
    name: "Kesselinperä",
    type: "other",
    description: "Kesselinperä area in the center",
    isFixed: true,
  },
  {
    id: "rykipohja",
    x: 30,
    y: 62,
    name: "Rykipohja",
    type: "other",
    description: "Rykipohja area on the left side",
    isFixed: true,
  },
  {
    id: "airstrip",
    x: 50,
    y: 88,
    name: "Airstrip",
    type: "other",
    description: "Airstrip/runway at the bottom of the map",
    isFixed: true,
  },
]
