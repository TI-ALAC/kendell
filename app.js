const API_URL = "https://alacapipollamundialista.alacoohperu.pe/api/public/partidos?id=107";
const POLL_INTERVAL_MS = 15000;

const tiempoEl = document.getElementById("tiempo");
const banderaLocalEl = document.getElementById("bandera-local");
const banderaVisitanteEl = document.getElementById("bandera-visitante");
const golesLocalEl = document.getElementById("goles-local");
const golesVisitanteEl = document.getElementById("goles-visitante");

const TIEMPO_POR_CODIGO = {
  NS: "PRIMER TIEMPO",
  "1H": "PRIMER TIEMPO",
  ET: "PRIMER TIEMPO",
  HT: "DESCANSO",
  "2H": "SEGUNDO TIEMPO",
  FT: "FINAL",
  AET: "FINAL",
  PEN: "FINAL",
};

function obtenerTextoTiempo(partido) {
  const codigo = partido?.tiempo?.codigo;
  if (codigo && TIEMPO_POR_CODIGO[codigo]) {
    return TIEMPO_POR_CODIGO[codigo];
  }

  const textoApi = partido?.tiempo?.texto;
  if (textoApi) {
    const normalizado = textoApi.toLowerCase();
    if (normalizado.includes("descanso") || normalizado.includes("medio")) {
      return "DESCANSO";
    }
    if (normalizado.includes("segundo")) {
      return "SEGUNDO TIEMPO";
    }
    if (normalizado.includes("primer") || normalizado.includes("1")) {
      return "PRIMER TIEMPO";
    }
  }

  return "PRIMER TIEMPO";
}

function obtenerGoles(valor) {
  return valor === null || valor === undefined || valor === "" ? "0" : String(valor);
}

function actualizarMarcador(partido) {
  banderaLocalEl.src = partido.local.bandera_url;
  banderaLocalEl.alt = partido.local.nombre;

  banderaVisitanteEl.src = partido.visitante.bandera_url;
  banderaVisitanteEl.alt = partido.visitante.nombre;

  golesLocalEl.textContent = obtenerGoles(partido.marcador?.local);
  golesVisitanteEl.textContent = obtenerGoles(partido.marcador?.visitante);

  tiempoEl.textContent = obtenerTextoTiempo(partido);
}

async function cargarPartido() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Error al consultar el API (${response.status})`);
  }

  const data = await response.json();
  const partido = data.partidos?.[0];

  if (!partido) {
    throw new Error("No se encontró información del partido");
  }

  actualizarMarcador(partido);
}

async function iniciar() {
  try {
    await cargarPartido();
  } catch (error) {
    console.error("No se pudo cargar el marcador:", error);
  }

  setInterval(async () => {
    try {
      await cargarPartido();
    } catch (error) {
      console.error("Error al actualizar el marcador:", error);
    }
  }, POLL_INTERVAL_MS);
}

iniciar();
