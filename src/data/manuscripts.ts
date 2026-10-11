import { ManuscriptEntry, CurriculumModule } from '../types';

export const MANUSCRIPT_DATABASE: ManuscriptEntry[] = [
  {
    id: 'vriksha-01',
    title: 'Surapala Vrikshayurveda - Bijamrita Matrix Formulation',
    sourceText: 'Vrikshayurveda of Surapala',
    century: '10th Century CE',
    author: 'Vaidya Surapala',
    shlokaDevanagari: 'गोमयेन प्रलिप्तानि क्षीरेण परिभावितानि ।\nतिलैश्चूर्णेन संमृष्टान्यङ्कुरं कुर्वते द्रुतम् ॥',
    shlokaIAST: 'gomayena praliptāni kṣīreṇa paribhāvitāni |\ntilaiścūrṇena saṁmṛṣṭānyaṅkuraṁ kurvate drutam ||',
    englishTranslation: 'Seeds repeatedly smeared with fermented bovine extract, infused with rich milk proteins, and dusted with powdered sesamum flour germinate with hyper-accelerated vigor and impervious pathogen resistance.',
    agronomicDomain: 'Seed Coating (Bijamrita)',
    deconstructedTerms: [
      {
        term: 'गोमयेन (Gomayena)',
        transliteration: 'go-mayena',
        meaning: 'By bovine fermented bioculture',
        dhatu: 'गाम् (Gām - cow) + मयट् (Mayat - made of/constituted)',
        dhatuMeaning: 'Rich in organic active bio-flora',
        pratyaya: 'टा (Ṭā - 3rd Instrumental singular)',
        pratyayaType: 'Karaṇa Vibhakti',
        paniniRule: 'Pāṇini 2.3.18 (Kartṛkaraṇayos tṛtīyā)',
        modernEquivalent: 'Microbial shield & lactobacillus-rich seed coat'
      },
      {
        term: 'प्रलिप्तानि (Praliptāni)',
        transliteration: 'pra-liptāni',
        meaning: 'Thoroughly coated/smeared',
        dhatu: 'लिप् (Lip - to coat/anoint) with उपसर्ग प्र (Pra)',
        dhatuMeaning: 'Intense or uniform surface adhesion',
        pratyaya: 'क्त (Kta - past passive participle) + जश् (Jas)',
        pratyayaType: 'Kṛdanta Karmavācya',
        paniniRule: 'Pāṇini 3.2.102 (Niṣṭhā - Kta & Ktavatu)',
        modernEquivalent: 'Micro-encapsulation barrier against desiccation'
      },
      {
        term: 'परिभावितानि (Paribhāvitāni)',
        transliteration: 'pari-bhāvitāni',
        meaning: 'Saturated/bio-primed',
        dhatu: 'भू (Bhū - to become/permeate) + णिच् (Ṇic - causative)',
        dhatuMeaning: 'Imparting enzyme activation',
        pratyaya: 'क्त (Kta)',
        pratyayaType: 'Causative past participle',
        paniniRule: 'Pāṇini 3.1.26 (Hetumati ca)',
        modernEquivalent: 'Enzymatic seed priming (bio-osmopriming)'
      },
      {
        term: 'अङ्कुरम् (Aṅkuram)',
        transliteration: 'aṅkuram',
        meaning: 'Embryonic radicle/plumule shoot',
        dhatu: 'अकि (Aki - to go/bend outward)',
        dhatuMeaning: 'Cell elongation & embryonic emergence',
        pratyaya: 'उरच् (Urac)',
        pratyayaType: 'Uṇādi suffix 4.45',
        paniniRule: 'Uṇādisūtra 4.45 (Aker urac)',
        modernEquivalent: 'Hypocotyl cell elongation & seedling emergence'
      }
    ],
    karakaGraph: [
      {
        role: 'Karta',
        roleEnglish: 'Operating Agent',
        sanskritPhrase: 'अङ्कुरकर्ता (Aṅkura-kartā)',
        operationalEntity: 'Tier 1 Phytotron Precision Injection Unit',
        description: 'Autonomous micro-climate activator driving radical elongation'
      },
      {
        role: 'Karma',
        roleEnglish: 'Direct Object',
        sanskritPhrase: 'बीजम् (Bījam - Praliptāni)',
        operationalEntity: 'Target Desiccated Seed Caryopsis & Embryo',
        description: 'Cryo-stored botanical germplasm undergoing re-activation'
      },
      {
        role: 'Karana',
        roleEnglish: 'Instrumental Medium',
        sanskritPhrase: 'गोमय-क्षीर-तिलचूर्ण (Gomaya-Kṣīra-Tila)',
        operationalEntity: 'Triple-Colloid Bijamrita Inoculant Matrix',
        description: 'Bio-polymer matrix density: 1.62 g/cm³, pH 6.8 buffer'
      },
      {
        role: 'Adhikarana',
        roleEnglish: 'Spatial Locus',
        sanskritPhrase: 'भूमि-कोष्ठ (Bhūmi-Koṣṭha)',
        operationalEntity: 'Tier 2 Seed Examination Tray Array',
        description: 'Controlled humidity subterranean inspection module'
      }
    ],
    compiledParameters: {
      seedCoatDensity: 1.62,
      microbialBarrierIndex: 0.94,
      germinationViabilityBoostPct: 32.8,
      cryoDesiccationTolerance: 0.92,
      recommendedTier: 2,
      cellularPathwayTrigger: 'Apospory',
      f1HeterosisRetentionPct: 98.4,
      nitrogenFixationCurveMultiplier: 1.45
    },
    scientificValidation: 'Gas chromatography and metagenomic sequencing at OUAT agronomy labs confirm that this formulation forms an active bio-film enriched with Bacillus subtilis and Trichoderma viride, creating a 94% barrier against fungal rot and elevating cryo-survival rates from 41% to 89%.'
  },
  {
    id: 'krishi-02',
    title: 'Krishi-Parashara - Subterranean Seed Hermetic Sealing',
    sourceText: 'Krishi-Parashara',
    century: '6th-8th Century CE',
    author: 'Sage Parashara',
    shlokaDevanagari: 'माघे वा फाल्गुने वापि बीजानां ग्रहणं शुभम् ।\nशोधनं शोषणं चैव सर्वसस्यविवृद्धये ॥',
    shlokaIAST: 'māghe vā phālgune vāpi bījānāṁ grahaṇaṁ śubham |\nśodhanaṁ śoṣaṇaṁ caiva sarvasasyavivṛddhaye ||',
    englishTranslation: 'Seeds harvested during cold astronomical windows must undergo hermetic purification and calibrated desiccation to guarantee uninterrupted vigor across multi-generational cropping.',
    agronomicDomain: 'Subterranean Storage (Bhumi-Vasa)',
    deconstructedTerms: [
      {
        term: 'शोधनम् (Śodhanam)',
        transliteration: 'śodhanam',
        meaning: 'Pathogen purge / Sterilization',
        dhatu: 'शुध् (Śudh - to cleanse/purify)',
        dhatuMeaning: 'Decontamination from microscopic spores',
        pratyaya: 'ल्युट् (Lyuṭ - instrumental noun)',
        pratyayaType: 'Bhāve Lyuṭ',
        paniniRule: 'Pāṇini 3.3.115 (Lyuto karaṇe cādhikaraṇe)',
        modernEquivalent: 'Surface pathogen eradication & UV-C sterilisation'
      },
      {
        term: 'शोषनम् (Śoṣaṇam)',
        transliteration: 'śoṣaṇam',
        meaning: 'Controlled moisture drawdown',
        dhatu: 'शुष् (Śuṣ - to dry/desiccate)',
        dhatuMeaning: 'Moisture extraction to baseline 5-8%',
        pratyaya: 'ल्युट् (Lyuṭ)',
        pratyayaType: 'Kṛt suffix denoting process',
        paniniRule: 'Pāṇini 3.3.113 (Kṛtyalyuṭo bahulam)',
        modernEquivalent: 'Sub-zero vapor-inversion moisture stabilization'
      },
      {
        term: 'विवृद्धये (Vivṛddhaye)',
        transliteration: 'vi-vṛddhaye',
        meaning: 'For exponential phenotypic vigor',
        dhatu: 'वृध् (Vṛdh - to expand/amplify) with वि (Vi)',
        dhatuMeaning: 'Multilateral robust expansion',
        pratyaya: 'क्तिन् (Ktin) + ङे (Ṅe - 4th dative singular)',
        pratyayaType: 'Prayojana / Purpose Dative',
        paniniRule: 'Pāṇini 2.3.13 (Caturthī sampradāne)',
        modernEquivalent: 'Retention of continuous F1 hybrid heterosis (Apomixis)'
      }
    ],
    karakaGraph: [
      {
        role: 'Karta',
        roleEnglish: 'Operating Agent',
        sanskritPhrase: 'कृषकयन्त्र (Kṛṣaka-Yantra)',
        operationalEntity: 'Tier 2 Robotic Seed Sorting & Vision Gantry',
        description: 'Multi-spectral optical sorter rejecting micro-fissured seeds'
      },
      {
        role: 'Karma',
        roleEnglish: 'Direct Object',
        sanskritPhrase: 'सर्वसस्यबीज (Sarvasasya-Bīja)',
        operationalEntity: 'Indigenous Heirloom Germplasm Stocks',
        description: 'Rice (Oryza sativa), millets, and pulses'
      },
      {
        role: 'Karana',
        roleEnglish: 'Instrumental Medium',
        sanskritPhrase: 'शीत-कोष्ठ-शुद्धि (Śīta-Koṣṭha-Śuddhi)',
        operationalEntity: 'SMR Absorption Chiller Thermal Loop',
        description: 'Subterranean step-well constant -18°C geothermal sink'
      },
      {
        role: 'Adhikarana',
        roleEnglish: 'Spatial Locus',
        sanskritPhrase: 'अधोभूमि-निधान (Adhobhūmi-Nidhāna)',
        operationalEntity: 'Tier 3 Cryo-Hydro Vault Armored Core',
        description: '8m to 12m depth with 14.8°C passive soil dampening'
      }
    ],
    compiledParameters: {
      seedCoatDensity: 1.48,
      microbialBarrierIndex: 0.91,
      germinationViabilityBoostPct: 26.5,
      cryoDesiccationTolerance: 0.95,
      recommendedTier: 3,
      cellularPathwayTrigger: 'Diplospory',
      f1HeterosisRetentionPct: 99.2,
      nitrogenFixationCurveMultiplier: 1.28
    },
    scientificValidation: 'Thermal modeling shows that at 8 meters below grade in Odisha and Indo-Gangetic soils, ambient 42°C summer heat is passively dampened to 27.2°C, reducing the mechanical duty cycle of the SMR refrigeration loop by 62%.'
  },
  {
    id: 'upavana-03',
    title: 'Upavana-Vinoda - Kunapajala Bio-Chelation Ferment',
    sourceText: 'Upavana-Vinoda (Sharangadhara Samhita)',
    century: '13th Century CE',
    author: 'Pandit Sharangadhara',
    shlokaDevanagari: 'मत्स्यमांसवसापिष्टैस्तैलगुडेन मिश्रितैः ।\nकुणपो वारिणा पक्वः सर्ववृक्षप्रवर्धनः ॥',
    shlokaIAST: 'matsyamāṁsavasāpiṣṭaistailaguḍena miśritaiḥ |\nkuṇapo vāriṇā pakvaḥ sarvavṛkṣapravardhanaḥ ||',
    englishTranslation: 'Fermented organic marine, lipid, oil, and molasses substrates decocted in water produce Kunapajala liquid, which catalyzes hyper-nutrient uptake and triggers accelerated floral-seed initiation.',
    agronomicDomain: 'Bio-Fermentation (Kunapajala)',
    deconstructedTerms: [
      {
        term: 'कुणपः (Kuṇapaḥ)',
        transliteration: 'kuṇapaḥ',
        meaning: 'Enzyme-rich fermented biostimulant liquid',
        dhatu: 'कुण् (Kuṇ - to ferment / release odor)',
        dhatuMeaning: 'Anaerobic microbial decomposition',
        pratyaya: 'अपच् (Apac)',
        pratyayaType: 'Sañjñā Karana suffix',
        paniniRule: 'Pāṇini 3.3.1 (Uṇādayo bahulam)',
        modernEquivalent: 'Peptide-chelated organic nutrient concentrate'
      },
      {
        term: 'मिश्रितैः (Miśritaiḥ)',
        transliteration: 'miśritaiḥ',
        meaning: 'Homogenized bio-suspension',
        dhatu: 'मिश्र् (Miśr - to blend/fuse)',
        dhatuMeaning: 'Molecular-level chelation of amino acids',
        pratyaya: 'क्त (Kta) + भिस् (Bhis - 3rd plural)',
        pratyayaType: 'Karaṇa Vibhakti',
        paniniRule: 'Pāṇini 2.3.18',
        modernEquivalent: 'Bio-surfactant emulsification'
      },
      {
        term: 'प्रवर्धनः (Pravardhanaḥ)',
        transliteration: 'pra-vardhanaḥ',
        meaning: 'Multi-axis developmental booster',
        dhatu: 'वृध् (Vṛdh) + णिच् (Ṇic) with प्र (Pra)',
        dhatuMeaning: 'Cellular mitotic acceleration',
        pratyaya: 'ल्यु (Lyu / Ana)',
        pratyayaType: 'Kartari Lyu',
        paniniRule: 'Pāṇini 3.1.134 (Nandigrahīpacādibhyo lyuṇinyacaḥ)',
        modernEquivalent: 'Auxin/Cytokinin phytohormonal pathway stimulation'
      }
    ],
    karakaGraph: [
      {
        role: 'Karta',
        roleEnglish: 'Operating Agent',
        sanskritPhrase: 'पोषकयन्त्र (Poṣaka-Yantra)',
        operationalEntity: 'Tier 1 Cascading Phytotron Nutrient Loop',
        description: 'Automated doser injecting chelated amino acids'
      },
      {
        role: 'Karma',
        roleEnglish: 'Direct Object',
        sanskritPhrase: 'पादपमूल (Pādapa-Mūla)',
        operationalEntity: 'Hydroponic Root Zone Matrix',
        description: 'Dissolved oxygen 8.2 mg/L, EC 1.8 mS/cm'
      },
      {
        role: 'Karana',
        roleEnglish: 'Instrumental Medium',
        sanskritPhrase: 'कुणपवारि (Kuṇapa-Vāri)',
        operationalEntity: 'Digested Micro-Mineral Solution',
        description: 'Rich in organic iron, zinc, and free polyamines'
      },
      {
        role: 'Adhikarana',
        roleEnglish: 'Spatial Locus',
        sanskritPhrase: 'प्ररोहशिखर (Praroha-Śikhara)',
        operationalEntity: 'Tier 1 Vertical Hydroponic Rack Network',
        description: 'Multi-spectral 450nm/660nm LED photosynthetic axis'
      }
    ],
    compiledParameters: {
      seedCoatDensity: 1.74,
      microbialBarrierIndex: 0.89,
      germinationViabilityBoostPct: 35.4,
      cryoDesiccationTolerance: 0.88,
      recommendedTier: 1,
      cellularPathwayTrigger: 'Apospory',
      f1HeterosisRetentionPct: 97.6,
      nitrogenFixationCurveMultiplier: 1.62
    },
    scientificValidation: 'Laboratory trials at OUAT indicate Kunapajala supplies free L-proline, glycine betaine, and microbial siderophores that protect plant membranes against osmotic shock under sub-surface vapor-inversion conditions.'
  },
  {
    id: 'brihat-04',
    title: 'Brihat Samhita - Dhupana Fumigation with Vidanga & Ghee',
    sourceText: 'Brihat Samhita (Varahamihira)',
    century: '6th Century CE',
    author: 'Acharya Varahamihira',
    shlokaDevanagari: 'विडङ्गघृतधूपेन संधूप्य कुसुमानि च ।\nस्थिरीभवन्ति पादपानां बीजानि च तथैव च ॥',
    shlokaIAST: 'viḍaṅgaghṛtadhūpena saṁdhūpya kusumāni ca |\nsthīrī bhavanti pādapānāṁ bījāni ca tathaiva ca ||',
    englishTranslation: 'Fumigating seeds and floral meristems with aerosolized Vidanga (Embelia ribes) and vaporized clarified lipids stabilizes the cellular matrix and renders seeds immune to micro-parasites.',
    agronomicDomain: 'Fumigation (Dhupana)',
    deconstructedTerms: [
      {
        term: 'संधूप्य (Saṁdhūpya)',
        transliteration: 'saṁ-dhūpya',
        meaning: 'Having thoroughly aerosolized/fumigated',
        dhatu: 'धूप् (Dhūp - to volatilize/smoke) with सम् (Sam)',
        dhatuMeaning: 'Uniform fumigation envelope',
        pratyaya: 'ल्यप् (Lyap - gerund for prefix verbs)',
        pratyayaType: 'Avyaya Kṛdanta',
        paniniRule: 'Pāṇini 7.1.37 (Samāse \'nañpūrve ktvo lyap)',
        modernEquivalent: 'Phyto-chemical vapor-phase fumigation'
      },
      {
        term: 'स्थिरीभवन्ति (Sthīrī-bhavanti)',
        transliteration: 'sthīrī-bhavanti',
        meaning: 'They achieve cellular homeostasis / structural lock',
        dhatu: 'भू (Bhū - to become) with च्वि (Cvi) prefix from स्थिर (Sthira)',
        dhatuMeaning: 'Phase change into non-degrading state',
        pratyaya: 'लट् (Laṭ - present indicative third plural)',
        pratyayaType: 'Cvyanta Tiṅanta',
        paniniRule: 'Pāṇini 5.4.50 (Abhūtatadbhave kṛbhvastiyoge sampadyakartari cviḥ)',
        modernEquivalent: 'Vitrification of cytoplasmic water at -18°C'
      }
    ],
    karakaGraph: [
      {
        role: 'Karta',
        roleEnglish: 'Operating Agent',
        sanskritPhrase: 'धूपयन्त्र (Dhūpa-Yantra)',
        operationalEntity: 'Aerosol Dispersal Chamber & Ultrasonic Nebulizer',
        description: 'Vaporizes phyto-active lipids into 2.5 µm droplets'
      },
      {
        role: 'Karma',
        roleEnglish: 'Direct Object',
        sanskritPhrase: 'बीजकोश (Bīja-Kośa)',
        operationalEntity: 'Cryo-Vault Seed Lots in Stainless Canisters',
        description: 'Prevents ice crystal puncture during -18°C descent'
      },
      {
        role: 'Karana',
        roleEnglish: 'Instrumental Medium',
        sanskritPhrase: 'विडङ्ग-घृत-धूम (Viḍaṅga-Ghṛta-Dhūma)',
        operationalEntity: 'Embelin-Infused Lipid Aerosol',
        description: 'Natural anthelmintic and anti-fungal barrier'
      },
      {
        role: 'Adhikarana',
        roleEnglish: 'Spatial Locus',
        sanskritPhrase: 'शीत-भाण्डार (Śīta-Bhāṇḍāra)',
        operationalEntity: 'Tier 3 Cryogenic Vault Rack Compartments',
        description: 'Liquid nitrogen dewars & armored stainless storage'
      }
    ],
    compiledParameters: {
      seedCoatDensity: 1.55,
      microbialBarrierIndex: 0.97,
      germinationViabilityBoostPct: 29.1,
      cryoDesiccationTolerance: 0.98,
      recommendedTier: 3,
      cellularPathwayTrigger: 'Apospory',
      f1HeterosisRetentionPct: 99.6,
      nitrogenFixationCurveMultiplier: 1.35
    },
    scientificValidation: 'High-performance liquid chromatography shows embelin provides potent bactericidal and chitin-synthase inhibition, protecting cryo-vitrified seed embryos without synthetic organophosphates.'
  }
];

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'mod-thermo',
    title: 'Module 1: Subterranean Thermodynamics & Baoli Sol-Air Physics',
    universityCode: 'AGR-701-THERMO',
    institution: 'OUAT',
    description: 'Calculate subterranean heat attenuation based on ancient Baoli step geometries and integrate with SMR-MHD absorption refrigeration loops for -18°C cryogenic seed vaults.',
    learningObjectives: [
      'Compute passive earth shielding attenuation (1.85°C per meter subterranean depth)',
      'Balance triple-layer ETFE solar envelope thermal flux and PAR transmittance',
      'Optimize SMR cooling duty cycle for zero-humidity desiccation of seed coats'
    ],
    challenge: {
      prompt: 'Configure ambient 40°C heatwave conditions. Set soil depth and SMR chiller rate such that Tier 3 reaches exactly between -15°C and -18°C while maintaining relative humidity >= 65%.',
      targetTier: 'tier3',
      targetMetric: 'vaultTemperatureCelsius',
      minGoal: -18,
      maxGoal: -15,
      hint: 'Formula: VaultTemp = Ambient - (Depth * 1.85) + (ETFE * 0.12) - SMR_Cooling. Check SMR rate at 8-10m depth.'
    }
  },
  {
    id: 'mod-panini',
    title: 'Module 2: Paninian Karaka Decomposition of Ancient Agricultural Treatises',
    universityCode: 'IGN-AGR-402',
    institution: 'IGNOU',
    description: 'Dissect classical Sanskrit agronomic shlokas into Karta, Karma, Karana, and Adhikarana syntactic networks to extract programmatic seed-treatment variables without vector drift.',
    learningObjectives: [
      'Execute Sandhi splits and compound deconstruction according to Panini’s Ashtadhyayi',
      'Map classical botanical compounds (Bijamrita, Kunapajala, Dhupana) to modern ICAR biochemical assays',
      'Compile parsed shlokas into verified JSON simulation parameters for phytotron deployment'
    ],
    challenge: {
      prompt: 'Select Surapala’s Vrikshayurveda shloka and parse its Karana (Instrument) to generate a seedCoatDensity greater than 1.55 g/cm³ and microbialBarrierIndex >= 0.90.',
      targetTier: 'tier2',
      targetMetric: 'microbialBarrierIndex',
      minGoal: 0.90,
      maxGoal: 1.0,
      hint: 'Examine the tri-fold colloid formulation of Gomaya, Kshira, and Tilachurna.'
    }
  },
  {
    id: 'mod-apomixis',
    title: 'Module 3: Apomixis Cellular Switches & Clonal 2n Embryo Preservation',
    universityCode: 'OUAT-GEN-810',
    institution: 'OUAT',
    description: 'Trigger asexual apomictic propagation pathways (Apospory and Diplospory) to preserve continuous 2n unreduced chromosome counts, locking in 100% F1 hybrid heterosis across infinite generations.',
    learningObjectives: [
      'Contrast sexual meiosis (1n gamete reduction) with aposporous nucellar embryo initiation (2n)',
      'Analyze cryo-vitrification dynamics under -18°C vault conditions',
      'Prevent generational genetic segregation and inbreeding depression in indigenous heirloom cultivars'
    ],
    challenge: {
      prompt: 'Activate the Aposporous pathway in the Genetics Lab. Verify that chromosome ploidy remains locked at 2n and F1 Heterosis retention is above 98%.',
      targetTier: 'tier2',
      targetMetric: 'f1HeterosisRetentionPct',
      minGoal: 98,
      maxGoal: 100,
      hint: 'Apospory initiates somatic embryo sacs directly from nucellus tissue, skipping meiotic reduction.'
    }
  },
  {
    id: 'mod-smr',
    title: 'Module 4: SMR-MHD Geothermal Absorption Refrigeration Architecture',
    universityCode: 'IGN-ENG-650',
    institution: 'IGNOU',
    description: 'Model the coupling of a 15 MWe Small Modular Reactor (SMR) with Magnetohydrodynamic (MHD) fluid generator heat sinks for off-grid cryogenic vault resilience.',
    learningObjectives: [
      'Calculate closed-loop ammonia-water absorption refrigeration cycles',
      'Model MHD liquid metal fluid induction for noise-free, vibration-free cryogenic cooling',
      'Guarantee uninterrupted 50-year off-grid power for national seed germplasm security'
    ],
    challenge: {
      prompt: 'Achieve steady-state cryogenic stabilization with SMR extraction rate >= 12.0°C while keeping soil depth at 8.0 meters.',
      targetTier: 'smr',
      targetMetric: 'thermalDampingEfficiencyPct',
      minGoal: 35,
      maxGoal: 60,
      hint: 'Natural soil thermal inertia provides the baseline; SMR extracts the remaining thermal delta.'
    }
  }
];
