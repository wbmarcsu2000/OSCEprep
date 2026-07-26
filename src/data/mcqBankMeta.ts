/**
 * Bank metadata that is known WITHOUT loading a bank's questions.
 *
 * The three question banks are 4.07 MB, 2.49 MB and 1.25 MB of generated
 * source. They used to be statically imported by `mcqBank.ts`, which put all
 * ~3,500 questions in the entry chunk: an IM student downloaded the Family
 * Medicine and OB/GYN banks before the app painted. `mcqBank.ts` now loads each
 * one on demand, so the small facts every surface needs up front — how many
 * questions there are, and which systems to offer in the filter — have to live
 * apart from the data.
 *
 * These lists are duplicated from the data on purpose (importing the real
 * constants would defeat the split, since they are declared inside the giant
 * modules). `src/data/__tests__/mcqBankMeta.test.ts` loads the real banks and
 * asserts every count and system list matches, so drift fails the build rather
 * than silently shipping a wrong filter list.
 */

export interface McqBankMeta {
  /** Question count, for "N questions" labels and progress denominators. */
  total: number;
  /** Systems that have at least one question, in display order. */
  systems: string[];
}

export const MCQ_BANK_META: Record<"im" | "fm" | "ob", McqBankMeta> = {
  im: {
    total: 1119,
    systems: [
      "Cardiology",
      "Pulmonology",
      "Gastroenterology",
      "Nephrology",
      "Infectious Diseases",
      "Neurology",
      "Endocrinology",
      "Hematology / Oncology",
      "Musculoskeletal",
      "Dermatology",
      "Rheumatology",
      "Biostatistics",
      "General & Preventive",
      "Mental Disorders",
      "Reproductive Health",
      "Allergy & Immunology",
    ],
  },
  fm: {
    total: 1860,
    systems: [
      "Cardiology",
      "Pulmonology",
      "Renal & GU",
      "Gastroenterology",
      "Heme/Onc",
      "Repro & OB-GYN",
      "Dermatology",
      "Neurology",
      "Psychiatry",
      "Ophthalmology",
      "MSK & Sports Med",
      "Immunizations & Allergy",
      "Endocrinology",
      "Health Maintenance & Prevention",
    ],
  },
  ob: {
    total: 536,
    systems: [
      "Prenatal Care & Normal Pregnancy",
      "Early Pregnancy Complications",
      "Medical Complications of Pregnancy",
      "Labor & Delivery",
      "Postpartum",
      "Newborn & Neonatal",
      "Menstrual Disorders",
      "Reproductive Endocrinology & Infertility",
      "Contraception",
      "Menopause",
      "Benign Gynecology",
      "Gynecologic Oncology",
      "Breast Disorders",
      "Gynecologic Infections & STIs",
      "Cervical Dysplasia & Screening",
      "Sexual Health & Assault",
      "Pharmacology",
      "Ethics & Social Sciences",
    ],
  },
};
