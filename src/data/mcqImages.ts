/**
 * Curated teaching images for MCQ questions, keyed by question id.
 *
 * Every image is a real clinical/diagnostic image under an OPEN license
 * (public domain / CC0 / CC BY / CC BY-SA) sourced from Wikimedia Commons and
 * visually verified to match the condition. Attribution is shown beneath each
 * image and recorded in full in ../assets/mcq-images/CREDITS.md. Files are
 * bundled from src/assets/mcq-images and resolved through Vite so they work
 * offline on the static build.
 *
 * GENERATED FILE. To change the pilot set, re-run the image build; do not
 * hand-edit. Images render above the stem for visual-diagnosis questions.
 */

export interface McqImage {
  /** Basename of the bundled asset in ../assets/mcq-images. */
  file: string;
  /** Required alt text describing the finding (accessibility). */
  alt: string;
  /** Short attribution line shown under the image. */
  credit: string;
}

// Bundle every image in the folder and map basename -> built URL (cache-busted).
const urls = import.meta.glob("../assets/mcq-images/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBasename: Record<string, string> = {};
for (const [path, url] of Object.entries(urls)) {
  const base = path.split("/").pop();
  if (base) byBasename[base] = url;
}

/** Resolve a bundled image basename to its built URL (undefined if missing). */
export function mcqImageUrl(file: string): string | undefined {
  return byBasename[file];
}

/** Question id -> curated teaching image (shown above the stem). */
export const MCQ_IMAGES: Record<string, McqImage> = {
  "fm-dermatology-1": {
    "file": "melanoma.jpg",
    "alt": "Asymmetric pigmented skin lesion with irregular borders and color variation, characteristic of melanoma",
    "credit": "Dermanonymous — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-dermatology-93": {
    "file": "seborrheic-keratosis.jpg",
    "alt": "Waxy, stuck-on appearing pigmented plaque (seborrheic keratosis)",
    "credit": "James Heilman, MD — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-35": {
    "file": "guttate-psoriasis.jpg",
    "alt": "Numerous small drop-like scaly plaques (guttate psoriasis)",
    "credit": "Richard Keatinge — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-107": {
    "file": "measles-koplik.jpg",
    "alt": "White papules on the buccal mucosa (Koplik spots of measles)",
    "credit": "CDC — Public domain, via Wikimedia Commons"
  },
  "fm-gastroenterology-102": {
    "file": "kawasaki.jpg",
    "alt": "Bilateral conjunctival injection and cracked red lips (Kawasaki disease)",
    "credit": "Kawasaki_symptoms.jpg: Dong Soo Kim derivative work: Natr (talk) — CC BY 2.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-27": {
    "file": "diabetic-retinopathy.jpg",
    "alt": "Fundus with neovascularization, hemorrhages, and hard exudates (proliferative diabetic retinopathy)",
    "credit": "Commons contributor — Public domain, via Wikimedia Commons"
  },
  "fm-ophthalmology-12": {
    "file": "crao.jpg",
    "alt": "Pale retina with a cherry-red spot at the macula (central retinal artery occlusion)",
    "credit": "Dr. Gopal Bisht — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-129": {
    "file": "hypersegmented-neutrophil.jpg",
    "alt": "Hypersegmented neutrophil on blood smear (megaloblastic anemia)",
    "credit": "Ed Uthman from Houston, TX, USA — CC BY 2.0, via Wikimedia Commons"
  },
  "fm-dermatology-55": {
    "file": "erythema-migrans.jpg",
    "alt": "Expanding erythematous rash with central clearing (erythema migrans of Lyme disease)",
    "credit": "James Gathany — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-6": {
    "file": "actinic-keratosis.jpg",
    "alt": "Rough, scaly erythematous macule on sun-exposed skin (actinic keratosis)",
    "credit": "C.Morice, A. Acher, N. Soufir, M.Michel, F. Comoz, D. Leroy, and L.… — CC BY 4.0, via Wikimedia Commons"
  },
  "fm-dermatology-12": {
    "file": "basal-cell-carcinoma.jpg",
    "alt": "Pearly nodule with rolled borders and telangiectasias on the nose (nodular basal cell carcinoma)",
    "credit": "M. Sand, D. Sand, C. Thrandorf, V. Paech, P. Altmeyer, F. G. Bechara — CC BY 2.0, via Wikimedia Commons"
  },
  "fm-dermatology-90": {
    "file": "scabies.jpg",
    "alt": "Burrows and papules in a finger web space (scabies)",
    "credit": "Wikimedia Commons contributor — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-24": {
    "file": "dermatitis-herpetiformis.jpg",
    "alt": "Grouped excoriated vesicles and papules on an extensor surface (dermatitis herpetiformis)",
    "credit": "Weinstock, Leonard &amp; myers, trisha &amp; Steinhoff, Martin &amp… — CC BY 4.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-98": {
    "file": "impetigo.jpg",
    "alt": "Honey-colored crusting over erythematous erosions (impetigo)",
    "credit": "Evanherk at Dutch Wikipedia — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-57": {
    "file": "schistocytes.jpg",
    "alt": "Peripheral blood smear with fragmented red cells/schistocytes (microangiopathic hemolysis)",
    "credit": "Erhabor Osaro (Associate Professor) — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-63": {
    "file": "molluscum-contagiosum.jpg",
    "alt": "Dome-shaped umbilicated flesh-colored papules (molluscum contagiosum)",
    "credit": "E van Herk — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-37": {
    "file": "herpes-zoster.png",
    "alt": "Grouped vesicles on an erythematous base in a dermatomal distribution (herpes zoster)",
    "credit": "Fisle — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-39": {
    "file": "hordeolum.jpg",
    "alt": "Tender red nodule at the margin of the eyelid (hordeolum / stye)",
    "credit": "Andre Riemann — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-7": {
    "file": "contact-dermatitis.jpg",
    "alt": "Linear streaks of vesicles where an allergen (poison ivy) touched the skin (allergic contact dermatitis)",
    "credit": "Britannic124 — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-11": {
    "file": "atopic-dermatitis.jpg",
    "alt": "Dry, erythematous, excoriated eczema on the flexural forearm (atopic dermatitis)",
    "credit": "The original uploader was Eisfelder at German Wikipedia — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-87": {
    "file": "rosacea.jpg",
    "alt": "Central facial erythema with telangiectasias and papules on the nose and cheeks (rosacea)",
    "credit": "M. Sand, D. Sand, C. Thrandorf, V. Paech, P. Altmeyer, F. G. Bechara — CC BY 2.0, via Wikimedia Commons"
  },
  "fm-dermatology-78": {
    "file": "pityriasis-rosea.jpg",
    "alt": "Scattered oval scaly plaques over the trunk following skin lines (pityriasis rosea)",
    "credit": "Aceofhearts1968 — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-53": {
    "file": "lichen-planus.jpg",
    "alt": "Grouped violaceous, flat-topped papules (lichen planus)",
    "credit": "George Henry Fox — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-113": {
    "file": "vitiligo.jpg",
    "alt": "Sharply demarcated patches of complete depigmentation on the hand (vitiligo)",
    "credit": "Produnis — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-28": {
    "file": "erysipelas.jpg",
    "alt": "Bright red, sharply demarcated, raised warm plaque on the face (erysipelas)",
    "credit": "CDC/Dr. Thomas F. Sellers/Emory University — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-2": {
    "file": "acanthosis-nigricans.jpg",
    "alt": "Velvety hyperpigmented thickening of the axillary skin (acanthosis nigricans)",
    "credit": "Mark F. Brady; Prashanth Rawla — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-dermatology-96": {
    "file": "sjs-ten.jpg",
    "alt": "Dusky macules with hemorrhagic lip and mucosal erosions (Stevens-Johnson syndrome / TEN)",
    "credit": "Dr. Thomas Habif — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-33": {
    "file": "fifth-disease.png",
    "alt": "Bright confluent erythema of both cheeks (slapped-cheek rash of fifth disease)",
    "credit": "Gzzz — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-dermatology-88": {
    "file": "roseola.jpg",
    "alt": "Faint blanching pink maculopapular rash on the trunk of an infant (roseola)",
    "credit": "Emiliano Burzagli — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-107": {
    "file": "tinea-versicolor.jpg",
    "alt": "Confluent hypopigmented, finely scaly macules across the trunk (tinea versicolor)",
    "credit": "Photo Credit: Content Providers(s): Uploaded to commons by: user:Dr.sa — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-71": {
    "file": "onychomycosis.jpg",
    "alt": "Thickened, yellow, crumbling great toenails (onychomycosis)",
    "credit": "Commons contributor — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-49": {
    "file": "keratoacanthoma.jpg",
    "alt": "Dome-shaped nodule with a central keratin-filled crater (keratoacanthoma)",
    "credit": "The Armed Forces Institute of Pathology — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-44": {
    "file": "cafe-au-lait.jpg",
    "alt": "Uniform light-brown flat patch with a smooth border (café-au-lait macule)",
    "credit": "Denise Nepraunig — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-80": {
    "file": "plaque-psoriasis.jpg",
    "alt": "Well-demarcated erythematous plaques with silvery scale over the trunk (plaque psoriasis)",
    "credit": "Marnanel — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-142": {
    "file": "scarlet-fever.jpg",
    "alt": "Diffuse fine punctate erythematous sandpaper-like rash on the trunk (scarlet fever)",
    "credit": "The original uploader was Estreya at English Wikipedia — CC BY 2.5, via Wikimedia Commons"
  },
  "fm-repro-ob-gyn-123": {
    "file": "secondary-syphilis.jpg",
    "alt": "Coppery papulosquamous macules on the palms (secondary syphilis)",
    "credit": "CDC/ Robert Sumpter — Public domain, via Wikimedia Commons"
  },
  "fm-ophthalmology-11": {
    "file": "cataract.png",
    "alt": "Cloudy white opacification of the lens seen through the pupil (cataract)",
    "credit": "Rakesh Ahuja, MD — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-55": {
    "file": "pterygium.jpg",
    "alt": "Wedge-shaped fibrovascular growth extending onto the cornea (pterygium)",
    "credit": "Originally created by Jonathan Trobe, M.D., University of Michigan … — CC BY 3.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-61": {
    "file": "subconjunctival-hemorrhage.jpg",
    "alt": "Flat, bright-red patch of blood under the conjunctiva (subconjunctival hemorrhage)",
    "credit": "Daniel Flather — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-3": {
    "file": "viral-conjunctivitis.jpg",
    "alt": "Diffuse conjunctival redness with a watery eye (viral conjunctivitis)",
    "credit": "Joyhill09 — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-38": {
    "file": "hz-ophthalmicus.jpg",
    "alt": "Vesicular rash over the forehead in the V1 trigeminal distribution (herpes zoster ophthalmicus)",
    "credit": "Burntfingers — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-24": {
    "file": "corneal-abrasion.jpg",
    "alt": "Green fluorescein uptake highlighting a corneal epithelial defect (corneal abrasion)",
    "credit": "James Heilman, MD — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-heme-onc-91": {
    "file": "teardrop-cells.jpg",
    "alt": "Teardrop-shaped red cells (dacrocytes) on a blood smear (myelofibrosis)",
    "credit": "Paulo Henrique Orlandi Mourao — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-heme-onc-24": {
    "file": "smudge-cells.jpg",
    "alt": "A fragile smudge cell among small mature lymphocytes (chronic lymphocytic leukemia)",
    "credit": "Mikael Häggström, M.D — CC0, via Wikimedia Commons"
  },
  "fm-heme-onc-67": {
    "file": "basophilic-stippling.jpg",
    "alt": "Red cells with coarse blue cytoplasmic granules and arrows marking them (basophilic stippling, lead poisoning)",
    "credit": "Herbert L. Fred, MD and Hendrik A. van Dijk — CC BY 2.0, via Wikimedia Commons"
  }
};
