#!/usr/bin/env node
/**
 * Nightly Pikalytics snapshot for Meta Drill.
 *
 * Pulls each format's ranked list plus per-Pokémon details from
 * Pikalytics' AI-readable endpoints (see https://www.pikalytics.com/llms.txt
 * for the current list of format slugs), and writes data.json.
 *
 * Resilience rules:
 *  - If anything fails to parse, the script exits non-zero and the old
 *    data.json is left untouched (the GitHub Action simply fails loudly).
 *  - Types/stats/winrate are carried forward from the previous data.json
 *    when a fresh pull doesn't include them.
 *
 * If a regulation rotates, update slug/label below (current slugs are
 * listed at https://www.pikalytics.com/llms.txt).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../data.json", import.meta.url));
const BASE = "https://www.pikalytics.com";
const TOP_N = 50;
const DELAY_MS = 900; // be polite: ~1 request/second

const FORMATS = [
  {
    id: "champions-regmb", game: "Pokémon Champions", label: "Reg M-B (current)",
    slug: "champions", hasNatures: true, hasWinrate: true,
    source: "Pikalytics ranked battle data · Champions Reg M-B",
    noteText: "Stats shown are base-form values — Megas change stats in battle.",
  },
  {
    id: "sv-regi", game: "Scarlet & Violet", label: "Reg I (current)",
    slug: "homebsd", hasNatures: true, hasWinrate: false,
    source: "Pikalytics ranked ladder · VGC 2026 Regulation Set I", noteText: null,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "MetaDrill/1.0 (personal study tool; nightly cached pull)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Parse a ranked usage list: lines like "1. Incineroar (48.2%)" or "1) Incineroar — 48.2%" */
function parseList(text) {
  const mons = [];
  for (const line of text.split("\n")) {
    const m = line.match(
      /^\s*(\d+)[.)]\s*\[?([A-Za-z0-9 .'’%\-]+?)\]?\s*(?:\([^)%]*\))?\s*[—:–-]?\s*\(?(\d+(?:\.\d+)?)\s*%\)?/
    );
    if (m) mons.push({ rank: +m[1], name: m[2].trim(), usage: +m[3] });
  }
  return mons;
}

const TYPE_WORDS = /normal|fire|water|electric|grass|ice|fighting|poison|ground|flying|psychic|bug|rock|ghost|dragon|dark|steel|fairy/g;
const STAT_MAP = {
  hp: "hp", atk: "atk", attack: "atk", def: "def", defense: "def",
  spa: "spa", "sp. atk": "spa", "sp atk": "spa", "special attack": "spa",
  spd: "spd", "sp. def": "spd", "sp def": "spd", "special defense": "spd",
  spe: "spe", speed: "spe",
};

/** Parse a Pokémon detail page: sectioned markdown with "Name: 99.5%" style entries. */
function parseDetail(text) {
  const out = { moves: [], items: [], abilities: [], natures: [], stats: null, types: null, winrate: null };
  let section = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^#{1,4}\s*(.+)/);
    if (heading) {
      const t = heading[1].toLowerCase();
      section =
        t.includes("move") ? "moves" :
        t.includes("item") ? "items" :
        t.includes("abilit") ? "abilities" :
        t.includes("nature") ? "natures" :
        t.includes("type") ? "types" :
        (t.includes("stat") && !t.includes("usage")) ? "stats" : null;
      continue;
    }
    if (!section) {
      const wr = line.match(/win\s?rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i);
      if (wr && out.winrate == null) out.winrate = +wr[1];
      continue;
    }
    if (section === "types") {
      if (!out.types) {
        const words = line.toLowerCase().match(TYPE_WORDS);
        if (words) out.types = [...new Set(words)].slice(0, 2);
      }
    } else if (section === "stats") {
      const slash = line.match(/(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
      if (slash) {
        out.stats = { hp: +slash[1], atk: +slash[2], def: +slash[3], spa: +slash[4], spd: +slash[5], spe: +slash[6] };
        continue;
      }
      const kv = line.match(/^[-*|]?\s*(hp|atk|attack|def|defense|spa|sp\.? ?atk|special attack|spd|sp\.? ?def|special defense|spe|speed)\s*[:|]?\s*(\d+)/i);
      if (kv) {
        const key = STAT_MAP[kv[1].toLowerCase().replace(/\s+/g, " ")];
        if (key) { out.stats = out.stats || {}; out.stats[key] = +kv[2]; }
      }
    } else {
      const m = line.match(/^[-*|]?\s*([A-Za-z0-9 .'’()\-]+?)\s*[:(–—-]\s*(\d+(?:\.\d+)?)\s*%/);
      if (m && out[section].length < 8) out[section].push({ name: m[1].trim(), pct: +m[2] });
    }
  }
  return out;
}

function loadPrevious() {
  if (!existsSync(OUT)) return {};
  try {
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    const byFormat = {};
    for (const f of prev.formats || []) {
      byFormat[f.id] = Object.fromEntries((f.mons || []).map((m) => [m.name, m]));
    }
    return byFormat;
  } catch {
    return {};
  }
}

async function main() {
  const prev = loadPrevious();
  const formats = [];

  for (const fmt of FORMATS) {
    console.log(`\n== ${fmt.game} · ${fmt.label} (${fmt.slug}) ==`);
    const listText = await get(`${BASE}/ai/pokedex/${fmt.slug}`);
    const ranked = parseList(listText).slice(0, TOP_N);
    if (ranked.length < 10) {
      throw new Error(
        `Only parsed ${ranked.length} ranked entries for slug "${fmt.slug}". ` +
        `The format may have rotated or the page layout changed — check ${BASE}/llms.txt for current slugs.`
      );
    }
    console.log(`ranked list: ${ranked.length} Pokémon (leader: ${ranked[0].name} ${ranked[0].usage}%)`);

    const mons = [];
    for (const entry of ranked) {
      await sleep(DELAY_MS);
      let detail = { moves: [], items: [], abilities: [], natures: [], stats: null, types: null, winrate: null };
      try {
        detail = parseDetail(await get(`${BASE}/ai/pokedex/${fmt.slug}/${encodeURIComponent(entry.name)}`));
      } catch (err) {
        console.warn(`  ! detail fetch failed for ${entry.name}: ${err.message}`);
      }
      const old = (prev[fmt.id] || {})[entry.name] || {};
      const mon = {
        rank: entry.rank,
        name: entry.name,
        usage: entry.usage,
        types: detail.types || old.types || [],
        stats: detail.stats && Object.keys(detail.stats).length === 6 ? detail.stats : old.stats || null,
        moves: detail.moves.length ? detail.moves : old.moves || [],
        items: detail.items.length ? detail.items : old.items || [],
        abilities: detail.abilities.length ? detail.abilities : old.abilities || [],
      };
      mon.natures = detail.natures.length ? detail.natures : old.natures || [];
      const wr = detail.winrate != null ? detail.winrate : old.winrate;
      if (wr != null) mon.winrate = wr;
      if (!mon.moves.length && !mon.items.length && !mon.abilities.length) {
        console.warn(`  ! no usable detail for ${entry.name} (kept in list anyway)`);
      }
      mons.push(mon);
      console.log(`  #${mon.rank} ${mon.name} — ${mon.moves.length} moves, ${mon.items.length} items`);
    }
    formats.push({ ...fmt, mons });
  }

  const payload = {
    generated: new Date().toISOString().slice(0, 10),
    note: "Auto-refreshed nightly from Pikalytics by GitHub Action.",
    formats,
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 1));
  console.log(`\nWrote ${OUT}`);
}

main().catch((err) => {
  console.error(`\nFAILED: ${err.message}`);
  console.error("data.json was NOT modified; the site keeps serving the last good snapshot.");
  process.exit(1);
});
