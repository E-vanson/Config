const productList = [
  'rdts',
  'act_6',
  'act_12',
  'act_18',
  'act_24',
  'dt_250',
  'ors_zinc',
  'ors_sachets',
  'zinc_sulphate',
  'albendazole',
  'tetra_eye',
  'paracetamol_120',
  'mebendazole',
  'coc',
  'prog',
  'depo_im',
  'depo_sc',
  'preg_strip',
  'chlorine',
  'gluc_strips',
  'paracetamol_500',
  'bandages',
  'povi',
  'strap',
  'gloves',
  'envelopes',
  'glucometer',
  'backpack',
  'badge',
  'flashlight',
  'salter',
  'color_salter',
  'weighing_scale',
  'first_aid',
  'bp',
  'thermometer',
  'resp_timer',
  'muac_tape_adults',
  'muac_tape_children',
  'family_muac_tape',
  'moh_514',
  'moh_521',
  'moh_100',
  'comm_daily_register',
  'phone',
  'safety_box',
  'others'
];

const productDetailsList = {
  rdts: {
    label: 'RDTs (Malaria Test Kit)',
    units: 'Kits',
    section: 'malaria',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  act_6: {
    label: 'First Line Anti-Malarial (ACT/Coartem) 6 pack',
    units: 'Packs',
    section: 'malaria',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  act_12: {
    label: 'First Line Anti-Malarial (ACT/Coartem) 12 pack',
    units: 'Packs',
    section: 'malaria',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  act_18: {
    label: 'First Line Anti-Malarial (ACT/Coartem) 18 pack',
    units: 'Packs',
    section: 'malaria',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  act_24: {
    label: 'First Line Anti-Malarial (ACT/Coartem) 24 pack',
    units: 'Packs',
    section: 'malaria',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  dt_250: {
    label: 'Antibiotics (Amoxicillin DT 250mg ) tablets',
    units: 'Tablets',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  ors_zinc: {
    label: 'ORS + Zinc Co-pack',
    units: 'Pieces',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  ors_sachets: {
    label: 'ORS Satchets',
    units: 'Sachets',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  zinc_sulphate: {
    label: 'Zinc Sulphate 20mg Tablets',
    units: 'Tablets',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  albendazole: {
    label: 'Albendazole 400mg (Dewormers)',
    units: 'Tablets',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  tetra_eye: {
    label: 'Tetracycline Eye Ointment 1% tubes',
    units: 'Tubes',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  paracetamol_120: {
    label: 'Paracetamol 120mg/5ml suspension',
    units: 'Bottles',
    section: 'child_health',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  mebendazole: {
    label: 'Mebendazole 500mg (Dewormers) tablets',
    units: 'Tablets',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  coc: {
    label: 'Combined Oral Contraceptives',
    units: 'Cycles',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  prog: {
    label: 'Progestin Only pill',
    units: 'Cycles',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  depo_im: {
    label: 'Depo Medroxy provera injection-IM (vials)',
    units: 'Vials',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  depo_sc: {
    label: 'Depo Medroxy provera injection - SC (vials)',
    units: 'Vials',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  preg_strip: {
    label: 'Pregnancy Test Strip',
    units: 'Strips',
    section: 'reproductive',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  chlorine: {
    label: 'Chlorine',
    units: 'Tablets',
    section: 'wash',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  gluc_strips: {
    label: 'Glucometer Strips',
    units: 'Strips',
    section: 'ncds',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  paracetamol_500: {
    label: 'Paracetamol Tablets, 500mg',
    units: 'Tablets',
    section: 'others',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  bandages: {
    label: 'Bandages',
    units: 'Rolls',
    section: 'non_pharma',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  povi: {
    label: 'Povidone Iodine Solution',
    units: 'Bottles',
    section: 'non_pharma',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  strap: {
    label: 'Strapping',
    units: 'Rolls',
    section: 'non_pharma',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  gloves: {
    label: 'Gloves',
    units: 'Pairs',
    section: 'non_pharma',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  envelopes: {
    label: 'Medical Dispensing Envelopes',
    units: 'Pieces',
    section: 'non_pharma',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  glucometer: {
    label: 'Glucometer',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  backpack: {
    label: 'Backpack with logo',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  badge: {
    label: 'Badge (Name Tag)',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  flashlight: {
    label: 'Flashlight (Torch)',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  salter: {
    label: 'Salter scale',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  color_salter: {
    label: 'Color coded salter scale',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  weighing_scale: {
    label: 'Weighing scale (Bathroom)',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  first_aid: {
    label: 'First Aid Kit',
    units: 'Kits',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  bp: {
    label: 'BP Machine',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  thermometer: {
    label: 'Digital Thermometer',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  resp_timer: {
    label: 'Respiratory Timer',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  muac_tape_adults: {
    label: 'MUAC TAPE (Adults)',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  muac_tape_children: {
    label: 'MUAC TAPE (Children)',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  family_muac_tape: {
    label: 'Family MUAC tape (Children)',
    units: 'Pieces',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  moh_514: {
    label: 'Register MOH 514',
    units: 'Books',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  moh_521: {
    label: 'Register MOH 521',
    units: 'Books',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  moh_100: {
    label: 'Referral Form MOH 100',
    units: 'Forms',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  comm_daily_register: {
    label: 'Community commodity Daily Activity Register',
    units: 'Books',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  phone: {
    label: 'Mobile Phone',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  safety_box: {
    label: 'Safety box',
    units: 'Unit',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  },
  others: {
    label: 'Others',
    units: 'Units',
    section: 'equipment',
    showInCard:{ 
      chv:true,
      cha:true
    }
  }
};

module.exports = { productList, productDetailsList };
