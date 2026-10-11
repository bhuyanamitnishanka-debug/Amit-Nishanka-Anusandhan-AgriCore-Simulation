import { TierData } from '../types';

export const FACILITY_TIERS: TierData[] = [
  {
    id: 'dome',
    name: 'Greenhouse Dome & ETFE Matrix',
    sanskritName: 'सौर-मण्डप (Saura-Maṇḍapa)',
    depthMeters: 0, // Above ground (+12m peak)
    temperatureCelsius: 28.5,
    relativeHumidityPercent: 55,
    primaryFunction: 'Solar-tracking canopy capturing optimal Photosynthetically Active Radiation (PAR) while deflecting excess infrared wavelengths to preserve subterranean cool core.',
    systems: [
      'Triple-Layer ETFE Fluoropolymer Matrix with pneumatically pressurized air cushions',
      'Multi-Spectrum Selective UV-A/UV-B and Far-Red Nanoparticle Filters',
      'Automated Azimuth & Elevation Solar Vector Heliostat Tracking System',
      'Atmospheric Condensation Harvesting & Sol-Air Boundary Heat Shield'
    ],
    equipment: [
      'ETFE Micro-Cushion Pressure Regulators (0.25 bar)',
      'Dual-Axis Pyranometers measuring PAR flux (400-700nm)',
      'Automated Louver Desuperheaters',
      'Overhead Fogging Micro-Nozzles (5 µm mist)'
    ]
  },
  {
    id: 'tier1',
    name: 'Tier 1: Hydroponic Nursery & Phytotron Core',
    sanskritName: 'प्ररोह-कोष्ठ (Praroha-Koṣṭha)',
    depthMeters: 3.5,
    temperatureCelsius: 22.0,
    relativeHumidityPercent: 68,
    primaryFunction: 'Aeroponic and nutrient film technique (NFT) cultivation axis for rapid phenotypic validation and clonal seedling acceleration.',
    systems: [
      'Cascading Closed-Loop Nutrient Film Distribution Tubes',
      'Dynamic Variable-Spectrum LED Arrays (Hyper-Red 660nm, Deep-Blue 450nm, Far-Red 730nm)',
      'Ultrasonic Aeroponic Root Atomization Modules',
      'CO₂ Enrichment Injector maintaining 1200 ppm ambient'
    ],
    equipment: [
      'Digital pH (5.8 - 6.2) and EC (1.8 - 2.4 mS/cm) Dosing Pumps',
      'Dissolved Oxygen Nanobubble Generators (12 ppm DO)',
      'Automated Seedling Transfer Carousels',
      'Phytotron Environmental Telemetry Probes'
    ]
  },
  {
    id: 'tier2',
    name: 'Tier 2: Automated Seed Examination & Simulation Pod',
    sanskritName: 'अनुसन्धान-पीठ (Anusandhāna-Pīṭha)',
    depthMeters: 6.0,
    temperatureCelsius: 16.5,
    relativeHumidityPercent: 72,
    primaryFunction: 'Multi-spectral robotic seed quality sorting, 2-person immersive simulation pod, holographic translation of ancient Bharatiya manuscripts, and Apomixis cellular validation.',
    systems: [
      'Agastya-Nagarjuna Sanskrit Paninian NLP Shloka Execution Engine',
      'High-Speed Computer Vision Seed Morphometry & X-Ray CT Embryo Scanners',
      'Dual-Operator Immersive Holographic Simulation Pod',
      'Cellular Apomixis & Chromosome Ploidy Fluorescence Cytometry Station'
    ],
    equipment: [
      '6-Axis Seed Sorting Delta Robotic Arms with Vacuum Grippers',
      'Volumetric Holographic Laser Projector with Sanskrit Glyph Emitters',
      'NIR Hyperspectral Cameras (900 - 1700nm) detecting seed oil/protein ratios',
      'Dual-seat Researcher Telemetry Helmets and Biometric HUDs'
    ]
  },
  {
    id: 'tier3',
    name: 'Tier 3: Cryo-Hydro Cold Storage Vault',
    sanskritName: 'शीत-निधान-गर्भगृह (Śīta-Nidhāna-Garbhagṛha)',
    depthMeters: 9.5,
    temperatureCelsius: -18.0,
    relativeHumidityPercent: 42,
    primaryFunction: 'Long-term hermetic germplasm cryo-preservation of indigenous heirloom seeds at -18°C, isolated by heavy subterranean earth dampening and armored blast doors.',
    systems: [
      'Dual Hermetic Armored Stainless Steel Cryo-Doors with Thermal Break Gaskets',
      'Frost-Sheathed Containment Rack Modules with Anodized Titanium Cassettes',
      'Liquid Nitrogen Backup Dewars (-196°C) for Ultra-Cold Cryo-Vitrification',
      'Argon Inert Gas Blanket & Vapor-Inversion Humidity Balancing Axis'
    ],
    equipment: [
      'Sub-Zero Cryo-Dewars with Telemetric Liquid Level Monitors',
      'Rotary Air-to-Air Energy Recovery Ventilators',
      'Seed Canister Pneumatic Retrieval Tracks',
      'Cryogenic Hermetic Pressure Equalization Valves'
    ]
  },
  {
    id: 'smr',
    name: 'SMR-MHD Geothermal Sump & Absorption Chiller',
    sanskritName: 'भूगर्भ-ऊर्जा-केन्द्र (Bhūgarbha-Ūrjā-Kendra)',
    depthMeters: 14.0,
    temperatureCelsius: 8.0,
    relativeHumidityPercent: 80,
    primaryFunction: 'Base-level geothermal sump housing the Small Modular Reactor (SMR) coupled with a Magnetohydrodynamic (MHD) fluid generator and absorption chiller heat sink.',
    systems: [
      '15 MWe Lead-Bismuth Eutectic Cooled Small Modular Reactor Core',
      'Magnetohydrodynamic (MHD) Liquid-Metal Direct Heat-to-Power Generator',
      'Ammonia-Water (NH₃-H₂O) Closed-Loop Absorption Refrigeration Heat Exchanger',
      'Deep Geothermal Constant-Temperature Sump Heat Dissipation Field'
    ],
    equipment: [
      'MHD Electromagnetic Induction Pumps (No moving parts, vibration-free)',
      'Subterranean Titanium Heat Exchange Geothermal Coils',
      'Hermetic Supercritical CO₂ Secondary Brayton Turbines',
      'SMR Redundant Neutron Flux Safety Sensors'
    ]
  }
];
