import React, { useMemo, useState } from "react";
import { getSetRuntime } from "../../tft/sets/registry";
import { tier1Augments, tier2Augments, tier3Augments } from "../../utils/augments";

const runtime = getSetRuntime("set17");
const augmentNames = Array.from(new Set([...tier1Augments, ...tier2Augments, ...tier3Augments].map((a) => a.name))).sort((a, b) => a.localeCompare(b));
const today = new Date().toISOString().slice(0, 10);
let uid = 0;
const nextId = () => `id-${++uid}`;
const slugify = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const img = (asset: unknown) => typeof asset === "string" ? asset : asset && typeof asset === "object" && "src" in asset && typeof (asset as { src?: unknown }).src === "string" ? (asset as { src: string }).src : null;
const rarity = (name: string) => runtime.getChampionRarity(name) || 1;
const empty = () => ({
  title: "",
  slug: "",
  tier: "B Tier",
  author: "AKAWonder",
  date: today,
  set: "set17" as const,
  isDraft: true,
  compCode: "",
  tags: [] as string[],
  consejos: "",
  desarrollo: [{ id: nextId(), phase: "", title: "", text: "" }],
  prioridades: [{ id: nextId(), name: "", type: "item", description: "", icon: "" }],
  board: { champions: [] as Array<{ id: string; name: string; position: { row: number; col: number }; stars: number; items: string[] }> },
});

type BuilderState = ReturnType<typeof empty>;

type NoticeStatus = "idle" | "success" | "error";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const safeText = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const safeStringArray = (value: unknown) => Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
const safeStars = (value: unknown) => value === 2 || value === 3 ? value : 1;
const safePosition = (value: unknown) => {
  const row = isRecord(value) && typeof value.row === "number" ? Math.max(0, Math.min(3, Math.round(value.row))) : 0;
  const col = isRecord(value) && typeof value.col === "number" ? Math.max(0, Math.min(6, Math.round(value.col))) : 0;
  return { row, col };
};
const toBuilderState = (value: unknown): BuilderState => {
  const raw = isRecord(value) ? value : {};
  const next = empty();
  const importedBoard = isRecord(raw.board) && Array.isArray(raw.board.champions) ? raw.board.champions : [];
  const desarrollo = Array.isArray(raw.desarrollo) ? raw.desarrollo : [];
  const prioridades = Array.isArray(raw.prioridades) ? raw.prioridades : [];

  return {
    ...next,
    title: safeText(raw.title),
    slug: safeText(raw.slug) || slugify(safeText(raw.title)),
    tier: safeText(raw.tier, next.tier),
    author: safeText(raw.author, next.author),
    date: safeText(raw.date, next.date),
    set: "set17",
    isDraft: typeof raw.isDraft === "boolean" ? raw.isDraft : next.isDraft,
    compCode: safeText(raw.compCode),
    tags: safeStringArray(raw.tags),
    consejos: safeText(raw.consejos),
    desarrollo: desarrollo.length > 0
      ? desarrollo.map((entry) => {
          const row = isRecord(entry) ? entry : {};
          return {
            id: nextId(),
            phase: safeText(row.phase),
            title: safeText(row.title),
            text: safeText(row.text),
          };
        })
      : next.desarrollo,
    prioridades: prioridades.length > 0
      ? prioridades.map((entry) => {
          const row = isRecord(entry) ? entry : {};
          return {
            id: nextId(),
            name: safeText(row.name),
            type: safeText(row.type, "item"),
            description: safeText(row.description),
            icon: safeText(row.icon),
          };
        })
      : next.prioridades,
    board: {
      champions: importedBoard
        .map((entry) => {
          const champ = isRecord(entry) ? entry : {};
          return {
            id: nextId(),
            name: safeText(champ.name),
            position: safePosition(champ.position),
            stars: safeStars(champ.stars),
            items: safeStringArray(champ.items).slice(0, 3),
          };
        })
        .filter((champ) => champ.name),
    },
  };
};

export const CompositionBuilder = () => {
  const [data, setData] = useState(empty);
  const [tagText, setTagText] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<NoticeStatus>("idle");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<NoticeStatus>("idle");
  const champs = useMemo(() => [...runtime.championNames].sort((a, b) => (rarity(b) - rarity(a)) || a.localeCompare(b)), []);
  const items = useMemo(() => [...runtime.itemNames].sort((a, b) => a.localeCompare(b)), []);
  const traits = useMemo(() => [...runtime.traitNames].sort((a, b) => a.localeCompare(b)), []);
  const board = useMemo(() => Array.from({ length: 4 }, (_, row) => Array.from({ length: 7 }, (_, col) => data.board.champions.find((c) => c.position.row === row && c.position.col === col) || null)), [data.board.champions]);
  const filtered = useMemo(() => !search.trim() ? champs : champs.filter((c) => c.toLowerCase().includes(search.toLowerCase())), [champs, search]);
  const picked = data.board.champions.find((c) => c.id === selected) || null;
  const json = useMemo(() => ({ ...data, desarrollo: data.desarrollo.map(({ id, ...x }) => x), prioridades: data.prioridades.map(({ id, ...x }) => x), board: { champions: [...data.board.champions].sort((a, b) => (a.position.row - b.position.row) || (a.position.col - b.position.col)).map(({ id, ...x }) => x) } }), [data]);
  const request = useMemo(() => ({ data: { JSON: json } }), [json]);
  const patch = (p: Partial<typeof data>) => setData((d) => ({ ...d, ...p }));
  const setTitle = (value: string) => setData((d) => ({ ...d, title: value, slug: !d.slug || d.slug === slugify(d.title) ? slugify(value) : d.slug }));
  const put = (name: string, row: number, col: number) => setData((d) => {
    const existing = d.board.champions.find((c) => c.name === name);
    const occupant = d.board.champions.find((c) => c.position.row === row && c.position.col === col);
    if (existing) {
      if (occupant && occupant.id !== existing.id) return d;
      return { ...d, board: { champions: d.board.champions.map((c) => c.id === existing.id ? { ...c, position: { row, col } } : c) } };
    }
    if (occupant) return d;
    const champ = { id: nextId(), name, position: { row, col }, stars: 1, items: [] as string[] };
    setSelected(champ.id);
    return { ...d, board: { champions: [...d.board.champions, champ] } };
  });
  const move = (id: string, row: number, col: number) => setData((d) => {
    const source = d.board.champions.find((c) => c.id === id);
    const occupant = d.board.champions.find((c) => c.position.row === row && c.position.col === col);
    if (!source) return d;
    if (!occupant || occupant.id === id) return { ...d, board: { champions: d.board.champions.map((c) => c.id === id ? { ...c, position: { row, col } } : c) } };
    return { ...d, board: { champions: d.board.champions.map((c) => c.id === id ? { ...c, position: { row, col } } : c.id === occupant.id ? { ...c, position: { ...source.position } } : c) } };
  });
  const addChamp = (name: string) => setData((d) => {
    const existing = d.board.champions.find((c) => c.name === name); if (existing) { setSelected(existing.id); return d; }
    for (let row = 0; row < 4; row += 1) for (let col = 0; col < 7; col += 1) if (!d.board.champions.some((c) => c.position.row === row && c.position.col === col)) { const champ = { id: nextId(), name, position: { row, col }, stars: 1, items: [] as string[] }; setSelected(champ.id); return { ...d, board: { champions: [...d.board.champions, champ] } }; }
    return d;
  });
  const editChamp = (field: "name" | "stars" | "items", value: string | number | string[]) => selected && setData((d) => ({ ...d, board: { champions: d.board.champions.map((c) => c.id === selected ? { ...c, [field]: value } : c) } }));
  const drop = (e: React.DragEvent<HTMLButtonElement>, row: number, col: number) => {
    e.preventDefault(); const raw = e.dataTransfer.getData("text/plain"); if (!raw) return;
    const [kind, value] = raw.split(":"); if (kind === "pool") put(value, row, col); if (kind === "board") move(value, row, col);
  };
  const copy = async (value: unknown, label: string) => {
    const text = JSON.stringify(value, null, 2);
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("copy failed");
      }
      setCopyStatus("success");
      setCopyMessage(`${label} copiado al portapapeles.`);
    } catch {
      setCopyStatus("error");
      setCopyMessage(`No he podido copiar ${label}.`);
    }
  };
  const listFor = (type: string) => type === "champion" ? champs : type === "item" ? items : type === "trait" ? traits : type === "augment" ? augmentNames : [];
  const startDrag = (e: React.DragEvent<HTMLElement>, payload: string) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", payload); };
  const importJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const payload = isRecord(parsed) && isRecord(parsed.data) && "JSON" in parsed.data ? parsed.data.JSON : parsed;
      const next = toBuilderState(payload);
      setData(next);
      setSelected(next.board.champions[0]?.id || null);
      setImportStatus("success");
      setImportMessage("JSON cargado en el editor.");
      setJsonInput("");
    } catch {
      setImportStatus("error");
      setImportMessage("No he podido leer ese JSON. Pega el JSON puro o la request con data.JSON.");
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
      <div className="min-w-0 space-y-8">
        <section className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={data.title} onChange={(e) => setTitle(e.target.value)} className="border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Título" />
            <div className="flex gap-2"><input value={data.slug} onChange={(e) => patch({ slug: slugify(e.target.value) })} className="w-full border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Slug" /><button type="button" onClick={() => patch({ slug: slugify(data.title) })} className="border border-[#57534e] px-4 text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Auto</button></div>
            <select value={data.tier} onChange={(e) => patch({ tier: e.target.value })} className="border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]"><option>S Tier</option><option>A Tier</option><option>B Tier</option><option>C Tier</option></select>
            <input value={data.author} onChange={(e) => patch({ author: e.target.value })} className="border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Autor" />
            <input type="date" value={data.date} onChange={(e) => patch({ date: e.target.value })} className="border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" />
            <button type="button" onClick={() => patch({ isDraft: !data.isDraft })} className={`border px-4 py-3 text-sm ${data.isDraft ? "border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]" : "border-[#292524] bg-[#0c0a09] text-[#f5f5f4]"}`}>{data.isDraft ? "Draft" : "Publicado"}</button>
            <input value={data.compCode} onChange={(e) => patch({ compCode: e.target.value })} className="md:col-span-2 border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Comp code" />
            <div className="md:col-span-2 flex gap-2"><input value={tagText} onChange={(e) => setTagText(e.target.value)} list="tags-list" className="w-full border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Añadir tag y pulsa Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const value = tagText.trim(); if (value && !data.tags.includes(value)) { patch({ tags: [...data.tags, value] }); setTagText(""); } } }} /><button type="button" onClick={() => { const value = tagText.trim(); if (value && !data.tags.includes(value)) { patch({ tags: [...data.tags, value] }); setTagText(""); } }} className="border border-[#57534e] px-4 text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Añadir</button></div>
            <div className="md:col-span-2 flex flex-wrap gap-2">{data.tags.map((tag) => <button key={tag} type="button" onClick={() => patch({ tags: data.tags.filter((t) => t !== tag) })} className="border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-2 text-xs text-[#f5f5f4]">{tag} ×</button>)}</div>
            <textarea value={data.consejos} onChange={(e) => patch({ consejos: e.target.value })} rows={5} className="md:col-span-2 border border-[#292524] bg-[#0c0a09] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Consejos" />
          </div>
          <datalist id="tags-list">{Array.from(new Set([...champs, ...traits])).map((tag) => <option key={tag} value={tag} />)}</datalist>
        </section>

        <section className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-2xl text-[#f5f5f4]">Desarrollo</h3><button type="button" onClick={() => patch({ desarrollo: [...data.desarrollo, { id: nextId(), phase: "", title: "", text: "" }] })} className="border border-[#57534e] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Añadir fase</button></div>
          <div className="space-y-4">{data.desarrollo.map((row, i) => <div key={row.id} className="border border-[#292524] bg-[#0c0a09] p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Fase {i + 1}</span><button type="button" onClick={() => patch({ desarrollo: data.desarrollo.length === 1 ? [{ id: nextId(), phase: "", title: "", text: "" }] : data.desarrollo.filter((x) => x.id !== row.id) })} className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Eliminar</button></div><div className="grid gap-3 md:grid-cols-2"><input value={row.phase} onChange={(e) => patch({ desarrollo: data.desarrollo.map((x) => x.id === row.id ? { ...x, phase: e.target.value } : x) })} className="border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="2-1 a 2-7" /><input value={row.title} onChange={(e) => patch({ desarrollo: data.desarrollo.map((x) => x.id === row.id ? { ...x, title: e.target.value } : x) })} className="border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Título" /></div><textarea value={row.text} onChange={(e) => patch({ desarrollo: data.desarrollo.map((x) => x.id === row.id ? { ...x, text: e.target.value } : x) })} rows={4} className="mt-3 w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Texto" /></div>)}</div>
        </section>

        <section className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-2xl text-[#f5f5f4]">Prioridades</h3><button type="button" onClick={() => patch({ prioridades: [...data.prioridades, { id: nextId(), name: "", type: "item", description: "", icon: "" }] })} className="border border-[#57534e] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Añadir prioridad</button></div>
          <div className="space-y-4">{data.prioridades.map((row, i) => <div key={row.id} className="border border-[#292524] bg-[#0c0a09] p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Prioridad {i + 1}</span><button type="button" onClick={() => patch({ prioridades: data.prioridades.length === 1 ? [{ id: nextId(), name: "", type: "item", description: "", icon: "" }] : data.prioridades.filter((x) => x.id !== row.id) })} className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Eliminar</button></div><div className="grid gap-3 md:grid-cols-2"><select value={row.type} onChange={(e) => patch({ prioridades: data.prioridades.map((x) => x.id === row.id ? { ...x, type: e.target.value } : x) })} className="border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]"><option value="item">Item</option><option value="augment">Augment</option><option value="trait">Trait</option><option value="champion">Champion</option><option value="custom">Custom</option></select><><input list={`priority-${row.id}`} value={row.name} onChange={(e) => patch({ prioridades: data.prioridades.map((x) => x.id === row.id ? { ...x, name: e.target.value } : x) })} className="border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Nombre" /><datalist id={`priority-${row.id}`}>{listFor(row.type).map((entry) => <option key={entry} value={entry} />)}</datalist></></div><textarea value={row.description} onChange={(e) => patch({ prioridades: data.prioridades.map((x) => x.id === row.id ? { ...x, description: e.target.value } : x) })} rows={3} className="mt-3 w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Descripción" /><input value={row.icon} onChange={(e) => patch({ prioridades: data.prioridades.map((x) => x.id === row.id ? { ...x, icon: e.target.value } : x) })} className="mt-3 w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="URL de icono opcional" /></div>)}</div>
        </section>

        <section className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="space-y-5">
              <div className="border border-[#292524] bg-[#0c0a09] p-4">
                <div className="mx-auto flex w-fit flex-col gap-[6px]">{board.map((row, r) => <div key={r} className="flex gap-[6px]" style={r % 2 === 1 ? { transform: "translateX(34px)" } : undefined}>{row.map((cell, c) => <button key={`${r}-${c}`} type="button" draggable={Boolean(cell)} onDragStart={(e) => cell && startDrag(e, `board:${cell.id}`)} onClick={() => setSelected(cell?.id || null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, r, c)} className={`relative h-[88px] w-[76px] shrink-0 overflow-hidden border ${cell ? "border-[#d4af37]/30" : "border-dashed border-[#292524]"} bg-[#1c1917]`}>{cell ? <><div aria-label={cell.name} className="absolute inset-0 bg-center bg-no-repeat" style={{ backgroundImage: `url(${img(runtime.getChampionThumb(cell.name)) || ""})`, backgroundSize: "contain" }} /><div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0c0a09]/20" /><div className="absolute left-1 top-1 bg-black/70 px-1 py-0.5 text-[9px] text-[#d4af37]">{cell.stars}★</div><div className="absolute inset-x-1 bottom-1 truncate text-center font-serif text-[10px] uppercase text-[#f5f5f4]">{cell.name}</div></> : <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-[#57534e]">{r},{c}</div>}</button>)}</div>)}</div>
              </div>

              <div className="border border-[#292524] bg-[#0c0a09] p-4">
                {picked ? <div className="space-y-3"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Inspector</p><button type="button" onClick={() => { patch({ board: { champions: data.board.champions.filter((c) => c.id !== picked.id) } }); setSelected(null); }} className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Quitar</button></div><input list="champ-list" value={picked.name} onChange={(e) => editChamp("name", e.target.value)} className="w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" /><select value={picked.stars} onChange={(e) => editChamp("stars", Number(e.target.value))} className="w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]"><option value={1}>1 estrella</option><option value={2}>2 estrellas</option><option value={3}>3 estrellas</option></select>{[0, 1, 2].map((slot) => <input key={slot} list="item-list" value={picked.items[slot] || ""} onChange={(e) => { const next = [...picked.items]; next[slot] = e.target.value; editChamp("items", next.filter(Boolean)); }} className="w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder={`Item ${slot + 1}`} />)}</div> : <div className="border border-dashed border-[#292524] px-4 py-8 text-center text-sm text-[#a8a29e]">Selecciona una unidad del tablero para editarla.</div>}
              </div>

              <div className="flex flex-wrap gap-2">{runtime.calculateActiveTraits(data.board.champions.map((c) => c.name)).map((trait) => <button key={trait.trait.id} type="button" onClick={() => { if (!data.tags.includes(trait.trait.name)) patch({ tags: [...data.tags, trait.trait.name] }); }} className="border border-[#292524] bg-[#0c0a09] px-3 py-2 text-xs text-[#f5f5f4]">{trait.trait.name} · {trait.count}</button>)}</div>
            </div>

            <aside className="border border-[#292524] bg-[#0c0a09] p-4"><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-[#292524] bg-[#1c1917] px-4 py-3 text-sm text-[#f5f5f4]" placeholder="Buscar campeón" /><div className="mt-4 grid max-h-[720px] gap-3 overflow-y-auto pr-1">{filtered.map((name) => <div key={name} className="grid grid-cols-[54px_1fr_auto] items-center gap-3 border border-[#292524] bg-[#1c1917] p-2" draggable onDragStart={(e) => startDrag(e, `pool:${name}`)}><div className="h-[54px] w-[54px] overflow-hidden border border-[#292524] bg-[#0c0a09]">{img(runtime.getChampionThumb(name)) ? <div aria-label={name} className="h-full w-full bg-center bg-no-repeat" style={{ backgroundImage: `url(${img(runtime.getChampionThumb(name)) || ""})`, backgroundSize: "contain" }} /> : null}</div><div className="min-w-0"><p className="truncate font-serif text-lg text-[#f5f5f4]">{name}</p><p className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Coste {rarity(name)}</p></div><button type="button" onClick={() => addChamp(name)} className="border border-[#57534e] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#a8a29e]">Añadir</button></div>)}</div></aside>
          </div>
          <datalist id="champ-list">{champs.map((name) => <option key={name} value={name} />)}</datalist>
          <datalist id="item-list">{items.map((name) => <option key={name} value={name} />)}</datalist>
        </section>
      </div>

      <div className="min-w-0 space-y-8">
        <section className="sticky top-24 min-w-0 space-y-8">
          <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-serif text-2xl text-[#f5f5f4]">Importar JSON</h3><button type="button" onClick={() => importJson()} className="border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Cargar</button></div>
            <textarea value={jsonInput} onChange={(e) => { setJsonInput(e.target.value); setImportMessage(null); setImportStatus("idle"); }} rows={10} className="min-w-0 w-full resize-y border border-[#292524] bg-[#0c0a09] px-4 py-3 text-xs leading-6 text-[#d6d3d1]" placeholder='Pega aquí el JSON de la comp o la request completa {"data":{"JSON":...}}' />
            <p className="mt-3 text-sm leading-relaxed text-[#a8a29e]">Acepta tanto el JSON puro de la composición como la request REST con <span className="text-[#f5f5f4]">data.JSON</span>.</p>
            {importMessage ? <p className={`mt-3 text-sm ${importStatus === "error" ? "text-[#fca5a5]" : "text-[#d4af37]"}`}>{importMessage}</p> : null}
          </div>
          <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="font-serif text-2xl text-[#f5f5f4]">Exportación</h3><div className="flex gap-3"><button type="button" onClick={() => copy(json, "El JSON")} className="border border-[#57534e] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Copiar JSON</button><button type="button" onClick={() => copy(request, "La request")} className="border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Copiar request</button></div></div>{copyMessage ? <p className={`mb-4 text-sm ${copyStatus === "error" ? "text-[#fca5a5]" : "text-[#d4af37]"}`}>{copyMessage}</p> : null}<pre className="min-w-0 max-h-[320px] overflow-auto whitespace-pre-wrap break-all border border-[#292524] bg-[#0c0a09] p-4 text-xs leading-6 text-[#d6d3d1]">{JSON.stringify(json, null, 2)}</pre><pre className="mt-4 min-w-0 max-h-[320px] overflow-auto whitespace-pre-wrap break-all border border-[#292524] bg-[#0c0a09] p-4 text-xs leading-6 text-[#d6d3d1]">{JSON.stringify(request, null, 2)}</pre></div>
          <div className="border border-[#292524] bg-[#1c1917] p-6 md:p-8 text-sm leading-relaxed text-[#a8a29e]">La página marca <span className="text-[#f5f5f4]">noindex</span> y el payload REST sale preparado como <span className="text-[#f5f5f4]">data.JSON</span>, que encaja con el schema nuevo de Strapi. Si quieres, puedo hacer una segunda pasada para añadir validaciones, demo precargada o autocompletado más agresivo.</div>
        </section>
      </div>
    </div>
  );
};





