/**
 * Migration: fetch restaurant menu from live site, parse with cheerio, build menu.json with image matching.
 * Run: node scripts/migrate-restaurant-data.cjs
 */
const fs = require("fs");
const path = require("path");
const { load: loadCheerio } = require("cheerio");

const SOURCE_URL = "https://felizcatering2.vercel.app/restaurantes";
const MENU_DIR = path.join(__dirname, "..", "public", "menu");
const OUT_FILE = path.join(__dirname, "..", "public", "data", "menu.json");

// Section label (as on site) -> slug for menu.json keys
const SECTION_SLUG_MAP = {
  Desayunos: "desayunos",
  Tostadas: "tostadas",
  Croissants: "croissants",
  Sandwiches: "sandwiches",
  Combos: "combos",
  Almuerzos: "almuerzos",
  Entrantes: "tapas",
  Ensaladas: "ensaladas",
  Pescado: "pescados",
  Carnes: "carnes",
  Complementos: "complementos",
  Arroces: "arroces",
  "Menú infantil": "menu_infantil",
  Postres: "postres",
  Bebidas: "bebidas",
};

const SECTION_NAMES = Object.keys(SECTION_SLUG_MAP);

// Optional Russian names (keep existing translations when we have them)
const RU = {
  "Tar-tar de vacuno": "Тартар из говядины",
  "Flor de alcachofa con foie y yema de huevo": "Цветок артишока с фуа-гра и желтком",
  "Tablas de pan": "Хлебная доска",
  "Tabla de Jamón Ibérico (100g)": "Тарелка хамона иберико (100 г)",
  "Calamares a la Romana": "Кальмары в кляре",
  "Ensaladilla rusa con gambas": "Оливье с креветками",
  "Patatas rústicas a la brava": "Картофель по-брабантски",
  "Gambas rojas": "Красные креветки",
  "Zamburiñas (8 uds)": "Сантилья (8 шт.)",
  Tellinas: "Тельинас",
  "Queso frito con frutos secos y salsa de frutos del bosque": "Жареный сыр с орехами и ягодным соусом",
  "Tabla de quesos con miel, mermelada y frutos secos": "Сырная тарелка с мёдом и орехами",
  "Pulpo con puré de patata y trufa negra, salsa verde": "Осьминог с пюре, трюфелем и зелёным соусом",
  "Tartar de atún, aguacate, alga y salsa": "Тартар из тунца с авокадо и водорослями",
  "Tar-tar de tomate premium, fresa, aguacate, cebolla y salsa agridulce": "Тартар из томата с клубникой и авокадо",
  "Tataki de atún rojo con salsa de soja": "Татаки из тунца с соевым соусом",
  Griega: "Греческий салат",
  "Ensalada Caprese": "Салат Капрезе",
  "Tomate Premium": "Премиум-томат",
  "Ensalada Picasso": "Салат Пикассо",
  "Ensalada Vivaldi": "Салат Вивальди",
  "Brocolini con salsa de queso": "Броколини с сырным соусом",
  "Ensalada César": "Салат Цезарь",
  "Titaina valenciana con ventresca": "Титайна по-валенсийски с вентреской",
  "Lubina a la plancha con salsa de queso y brocolini": "Сибас на гриле с сырным соусом",
  "Dorada horneada a la sal con limón": "Дорадо в соли с лимоном",
  "Rodaballo con ajo y sal negra": "Палтус с чесноком и чёрной солью",
  "Salmón al cava con naranjas": "Лосось с кавой и апельсинами",
  Zamburiñas: "Сантилья",
  "Presa ibérica con guarnición y salsa Pedro Ximenez": "Иберийская преса с соусом Pedro Ximénez",
  "Magret de pato con salsa de arándanos y pera frita": "Утиная грудка с черничным соусом",
  "Guiso de rabo de toro a la cordobesa con pimientos de padrón": "Рабо де торо по-кордовски",
  "Carrillada de ternera guisada en cama de puré de patatas": "Щёчки телятины на пюре",
  "Chuletón madurado 40 días a la parrilla sobre la piedra caliente": "Стейк на камне 40 дней выдержки",
  "Solomillo de ternera con salsa Pedro Ximenez": "Вырезка с соусом Pedro Ximénez",
  "Chuletas de cordero con mantequilla": "Бараньи отбивные с маслом",
  "Valenciana al estilo feliz": "Паэлья по-валенсийски FELIZ",
  Marisco: "Паэлья с морепродуктами",
  "Arroz negro": "Чёрный рис",
  Verdura: "Рис с овощами",
  "Fideuá a la marinera": "Фидеуа с морепродуктами",
  "Arroz meloso con bogavante": "Кремовый рис с омаром",
  "Arroz con chuletón y bacon": "Рис со стейком и беконом",
  "Fideuá de pulpo con alcachofa": "Фидеуа с осьминогом и артишоками",
  "Arroz con magret de pato y setas": "Рис с утиной грудкой и грибами",
  "Tarta de queso": "Чизкейк",
  "Tarta de zanahoria": "Морковный торт",
  "Tarta de chocolate con cerezas": "Шоколадный торт с вишней",
  "Tarta Red Velvet": "Торт ред вельвет",
  "Tabla de pan (aceite y tomate)": "Хлеб с маслом и томатом",
  "Verdura a la plancha con salsa verde": "Овощи на гриле с зелёным соусом",
  "Puré de patata": "Картофельное пюре",
  "Patatas fritas": "Картофель фри",
  "Tabla de pan (aceitunas)": "Хлеб с оливками",
  "Arroz blanco": "Рис отварной",
  Wakame: "Вакаме",
  "Nuggets de pollo con patatas y ensalada": "Наггетсы с картофелем и салатом",
  "Arroz con tomate y huevo frito": "Рис с томатом и яичницей",
  "Espaguetis con salsa boloñesa": "Спагетти болоньезе",
  "Salchicha con puré de patatas y tomate cherry": "Сосиска с пюре и черри",
};

function normalizeForFilename(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s*-\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dishNameToImageFilename(dishName, availableFiles) {
  if (!dishName || typeof dishName !== "string") return "";
  const normalized = normalizeForFilename(dishName);
  if (!normalized) return "";

  const normalizedNoExt = (f) => path.basename(f, path.extname(f));
  const normalizedFile = (f) => normalizeForFilename(normalizedNoExt(f));

  // Special cases that map to specific filenames
  if (/tar\s*tar.*vacuno|tartar.*vacuno/.test(normalized)) {
    const match = availableFiles.find((f) => /tartar\s*vacuno/.test(normalizedFile(f)));
    return match ? path.basename(match) : "tartar vacuno.png";
  }
  if (/\btitaina\b.*\bvalenciana\b/.test(normalized)) {
    const match = availableFiles.find((f) => /titaina.*valenciana/.test(normalizedFile(f)));
    return match ? path.basename(match) : "titaina valenciana.png";
  }
  if (/\bchulet[oó]n\b.*\bpie?dra\b/.test(normalized) || /piedra caliente/.test(normalized)) {
    const match = availableFiles.find((f) => /chulet[oó]n.*piedra|piedra/.test(normalizedFile(f)));
    return match ? path.basename(match) : "chuletón a la piedra.png";
  }
  if (/\barroz\b.*\bbogavante\b/.test(normalized)) {
    const match = availableFiles.find((f) => /arroz.*bogavante|bogovante/.test(normalizedFile(f)));
    return match ? path.basename(match) : "arroz bogovante.png";
  }

  // Match by normalized dish name vs filename (without extension)
  for (const file of availableFiles) {
    const base = normalizedFile(file);
    if (!base) continue;
    if (base === normalized) return path.basename(file);
    if (normalized.includes(base) || base.includes(normalized)) return path.basename(file);
  }

  // Fallback: first 3–4 significant words + .png (only if such file exists)
  const words = normalized
    .replace(/\b(de|con|y|a la|al|en|el|la|los|las)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 4);
  const candidateBase = words.join(" ");
  const candidate = candidateBase ? candidateBase + ".png" : "";
  const hasFile = availableFiles.some((f) => normalizedFile(f) === candidateBase);
  return hasFile ? candidate : "";
}

function extractMenuFromHtml(html) {
  const $ = loadCheerio(html);
  const priceRe = /(\d+[,.]\d+)\s*€|(\d+)\s*€/;
  const sectionPattern = new RegExp(
    `^(${SECTION_NAMES.map((n) => n.replace(/[úíóáé]/g, ".")).join("|")})\\+?$`,
    "i"
  );

  let currentSection = null;
  const dishes = [];

  $("body")
    .find("*")
    .addBack()
    .each(function () {
      const $el = $(this);
      const text = $el.text().trim();

      if (sectionPattern.test(text)) {
        const hasChildWithSameText = $el.children().toArray().some((c) => $(c).text().trim() === text);
        if (!hasChildWithSameText) {
          const m = text.match(sectionPattern);
          const normalizedName = SECTION_NAMES.find((n) => n.toLowerCase() === m[1].toLowerCase()) || m[1];
          currentSection = normalizedName;
        }
      }

      if ($el.is("h3")) {
        const name = text.replace(/\s+/g, " ").trim();
        if (!name || name.length > 200) return;

        let price = "";
        const parent = $el.parent();
        const parentText = parent.text();
        const priceMatch = parentText.match(priceRe);
        if (priceMatch) {
          price = priceMatch[1] ? `${priceMatch[1]} €` : `${priceMatch[2]} €`;
        } else {
          const next = $el.next();
          if (next.length) {
            const nextMatch = next.text().match(priceRe);
            if (nextMatch) price = nextMatch[1] ? `${nextMatch[1]} €` : `${nextMatch[2]} €`;
          }
        }

        const slug = currentSection ? SECTION_SLUG_MAP[currentSection] : "otros";
        dishes.push({
          slug: slug || "otros",
          name_es: name,
          price: price || "—",
        });
      }
    });

  return dishes;
}

function buildMenuJson(dishes, availableFiles) {
  const bySlug = {};
  for (const d of dishes) {
    if (!bySlug[d.slug]) bySlug[d.slug] = [];
    const image = dishNameToImageFilename(d.name_es, availableFiles);
    bySlug[d.slug].push({
      name_es: d.name_es,
      name_ru: RU[d.name_es] || d.name_es,
      description_es: "",
      description_ru: "",
      price: d.price,
      image: image || "/placeholder.svg",
    });
  }
  return bySlug;
}

async function main() {
  console.log("Fetching", SOURCE_URL, "...");
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const html = await res.text();
  console.log("Parsing HTML with cheerio...");
  const dishes = extractMenuFromHtml(html);
  console.log("Extracted", dishes.length, "dishes in", [...new Set(dishes.map((d) => d.slug))].length, "categories");

  let files = [];
  if (fs.existsSync(MENU_DIR)) {
    files = fs.readdirSync(MENU_DIR).map((f) => path.join(MENU_DIR, f));
  }
  console.log("Menu images in public/menu:", files.length);

  const menu = buildMenuJson(dishes, files);
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(menu, null, 2), "utf8");
  console.log("Written", OUT_FILE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
