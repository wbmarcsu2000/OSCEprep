export const meta = {
  name: 'author-drill-vignettes',
  description: 'Author a concise clinical presenting vignette for every EKG/CXR reading drill',
  phases: [{ title: 'Author', detail: '10 batches of ~10 studies → presenting vignettes' }],
}

// Batches of LITFL study numbers (1..50 each modality). Agents read the catalog
// for their assigned studies and write a presenting vignette per study.
const BATCHES = []
for (const kind of ['ecg', 'cxr']) {
  for (let start = 1; start <= 50; start += 10) {
    BATCHES.push({ kind, ns: Array.from({ length: 10 }, (_, i) => start + i) })
  }
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', 'vignette'],
        properties: { n: { type: 'number' }, vignette: { type: 'string' } },
      },
    },
  },
}

function prompt(kind, ns) {
  const cat = kind === 'ecg' ? '/tmp/ecg_catalog.txt' : '/tmp/cxr_catalog.txt'
  const modality = kind === 'ecg' ? '12-lead ECG' : 'chest X-ray'
  return `Read ${cat}. For EACH of these study numbers — ${ns.join(', ')} — write a realistic
clinical PRESENTING VIGNETTE that gives the context a clinician would have when first
handed the ${modality}, BEFORE knowing the answer.

Each vignette:
- 1–2 sentences, <= 240 characters, plain clinical prose.
- Lead with age + sex + chief complaint, then 1–3 relevant history/exam/vital details
  that are CONSISTENT with that study's diagnosis (from the catalog line for that n).
- DO NOT name, abbreviate, or obviously telegraph the diagnosis — it is the answer the
  student must reach. (e.g. for "Inferior STEMI" write "58M with 40 min of crushing
  chest pain radiating to the jaw, diaphoresis and nausea" — NOT "patient with a STEMI".)
- No trailing instruction like "interpret the ECG" — the app adds that.
- Clinically accurate and plausible; vary age/sex/details across studies.
- If a catalog line is empty/sparse, infer a sensible presentation from the diagnosis label.

Return {items: [{n, vignette}, ...]} covering every requested n.`
}

phase('Author')
const results = await parallel(
  BATCHES.map((b) => () =>
    agent(prompt(b.kind, b.ns), { label: `vignettes:${b.kind}:${b.ns[0]}-${b.ns[9]}`, phase: 'Author', schema: SCHEMA })
      .then((r) => ({ kind: b.kind, items: r?.items ?? [] })),
  ),
)

const ecg = {}
const cxr = {}
for (const r of results.filter(Boolean)) {
  const target = r.kind === 'ecg' ? ecg : cxr
  for (const it of r.items) if (it && typeof it.n === 'number' && it.vignette) target[it.n] = it.vignette.trim()
}
log(`authored — ecg: ${Object.keys(ecg).length}, cxr: ${Object.keys(cxr).length}`)
return { ecg, cxr }
