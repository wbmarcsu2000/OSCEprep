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
    "file": "diabetic-retinopathy.png",
    "alt": "Retinal microaneurysms, dot-blot hemorrhages and exudates (diabetic retinopathy)",
    "credit": "Shaofeng Hao, Changyan Liu, Na Li, Yanrong Wu, Dongdong Li, Qingyue… — CC BY 4.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-12": {
    "file": "crao.jpg",
    "alt": "Pale retina with a cherry-red spot at the macula (central retinal artery occlusion)",
    "credit": "Dr. Gopal Bisht — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-ophthalmology-13": {
    "file": "hordeolum.jpg",
    "alt": "Focal tender erythematous eyelid-margin nodule (hordeolum/stye)",
    "credit": "Andre Riemann — Public domain, via Wikimedia Commons"
  },
  "fm-cardiology-20": {
    "file": "atrial-flutter-ecg.jpg",
    "alt": "ECG showing sawtooth flutter waves (atrial flutter)",
    "credit": "Ewingdo — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-cardiology-7": {
    "file": "pericarditis-ecg.jpg",
    "alt": "ECG with diffuse concave ST elevation and PR depression (acute pericarditis)",
    "credit": "James Heilman, MD — CC BY-SA 4.0, via Wikimedia Commons"
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
  "fm-dermatology-103": {
    "file": "tinea.jpg",
    "alt": "Annular scaly plaque with central clearing (tinea corporis)",
    "credit": "CDC/ Dr. Lucille K. Georg — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-12": {
    "file": "basal-cell-carcinoma.jpg",
    "alt": "Pearly papule with rolled borders and telangiectasias (basal cell carcinoma)",
    "credit": "Dermanonymous — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-dermatology-90": {
    "file": "scabies.jpg",
    "alt": "Burrows and papules in a finger web space (scabies)",
    "credit": "Wikimedia Commons contributor — Public domain, via Wikimedia Commons"
  },
  "fm-dermatology-24": {
    "file": "dermatitis-herpetiformis.jpg",
    "alt": "Grouped pruritic vesicles on extensor surfaces (dermatitis herpetiformis)",
    "credit": "BallenaBlanca — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-98": {
    "file": "impetigo.jpg",
    "alt": "Honey-colored crusted lesions around the mouth (impetigo)",
    "credit": "Masryyy — CC BY-SA 4.0, via Wikimedia Commons"
  },
  "fm-gastroenterology-57": {
    "file": "schistocytes.jpg",
    "alt": "Peripheral blood smear with fragmented red cells/schistocytes (microangiopathic hemolysis)",
    "credit": "Erhabor Osaro (Associate Professor) — CC BY-SA 3.0, via Wikimedia Commons"
  },
  "fm-dermatology-29": {
    "file": "erythema-multiforme.jpg",
    "alt": "Targetoid lesions with concentric rings (erythema multiforme)",
    "credit": "James Heilman, MD — CC BY-SA 3.0, via Wikimedia Commons"
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
  }
};
