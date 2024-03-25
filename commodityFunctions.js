const shared = require('./common-extras');
const { productList, productDetailsList } = require('./commodity-list');
const {
  getField
}=shared;
const stockTreshold =2;
const suppliedContent = (content,report)=> {
  
  content.t_rs_cha_name = getField(report , 'cha_name') ?  getField(report , 'cha_name') :'' ;
  content.t_rs_rdts = getField(report , 's_malaria.rdts_supplied') ?  getField(report , 's_malaria.rdts_supplied') :0 ;
  content.t_rs_act_6 = getField(report , 's_malaria.act_6_supplied') ?  getField(report , 's_malaria.act_6_supplied') :0 ;
  content.t_rs_act_12 = getField(report , 's_malaria.act_12_supplied') ?  getField(report , 's_malaria.act_12_supplied') :0 ;
  content.t_rs_act_18 = getField(report , 's_malaria.act_18_supplied') ?  getField(report , 's_malaria.act_18_supplied') :0 ;
  content.t_rs_act_24 = getField(report , 's_malaria.act_24_supplied') ?  getField(report , 's_malaria.act_24_supplied') :0 ;
  content.t_rs_dt_250 = getField(report , 's_child_health.dt_250_supplied') ?  getField(report , 's_child_health.dt_250_supplied') :0 ;
  content.t_rs_ors_zinc = getField(report , 's_child_health.ors_zinc_supplied') ?  getField(report , 's_child_health.ors_zinc_supplied') :0 ;
  content.t_rs_ors_sachets = getField(report , 's_child_health.ors_sachets_supplied') ?  getField(report , 's_child_health.ors_sachets_supplied') :0 ;
  content.t_rs_zinc_sulphate = getField(report , 's_child_health.zinc_sulphate_supplied') ?  getField(report , 's_child_health.zinc_sulphate_supplied') :0 ;
  content.t_rs_albendazole = getField(report , 's_child_health.albendazole_supplied') ?  getField(report , 's_child_health.albendazole_supplied') :0 ;
  content.t_rs_tetra_eye = getField(report , 's_child_health.tetra_eye_supplied') ?  getField(report , 's_child_health.tetra_eye_supplied') :0 ;
  content.t_rs_paracetamol_120 = getField(report , 's_child_health.paracetamol_120_supplied') ?  getField(report , 's_child_health.paracetamol_120_supplied') :0 ;
  content.t_rs_mebendazole = getField(report , 's_reproductive.mebendazole_supplied') ?  getField(report , 's_reproductive.mebendazole_supplied') :0 ;
  content.t_rs_coc = getField(report , 's_reproductive.coc_supplied') ?  getField(report , 's_reproductive.coc_supplied') :0 ;
  content.t_rs_prog = getField(report , 's_reproductive.prog_supplied') ?  getField(report , 's_reproductive.prog_supplied') :0 ;
  content.t_rs_depo_im = getField(report , 's_reproductive.depo_im_supplied') ?  getField(report , 's_reproductive.depo_im_supplied') :0 ;
  content.t_rs_depo_sc = getField(report , 's_reproductive.depo_sc_supplied') ?  getField(report , 's_reproductive.depo_sc_supplied') :0 ;
  content.t_rs_preg_strip = getField(report , 's_reproductive.preg_strip_supplied') ?  getField(report , 's_reproductive.preg_strip_supplied') :0 ;
  content.t_rs_chlorine = getField(report , 's_wash.chlorine_supplied') ?  getField(report , 's_wash.chlorine_supplied') :0 ;
  content.t_rs_gluc_strips	 = getField(report , 's_ncds.gluc_strips_supplied') ?  getField(report , 's_ncds.gluc_strips_supplied') :0 ;
  content.t_rs_paracetamol_500 = getField(report , 's_others.paracetamol_500_supplied') ?  getField(report , 's_others.paracetamol_500_supplied') :0 ;
  content.t_rs_bandages = getField(report , 's_non_pharma.bandages_supplied') ?  getField(report , 's_non_pharma.bandages_supplied') :0 ;
  content.t_rs_povi = getField(report , 's_non_pharma.povi_supplied') ?  getField(report , 's_non_pharma.povi_supplied') :0 ;
  content.t_rs_strap = getField(report , 's_non_pharma.strap_supplied') ?  getField(report , 's_non_pharma.strap_supplied') :0 ;
  content.t_rs_gloves = getField(report , 's_non_pharma.gloves_supplied') ?  getField(report , 's_non_pharma.gloves_supplied') :0 ;
  content.t_rs_envelopes = getField(report , 's_non_pharma.envelopes_supplied') ?  getField(report , 's_non_pharma.envelopes_supplied') :0 ;
  content.t_rs_glucometer = getField(report , 's_equipment.glucometer_supplied') ?  getField(report , 's_equipment.glucometer_supplied') :0 ;
  content.t_rs_backpack = getField(report , 's_equipment.backpack_supplied') ?  getField(report , 's_equipment.backpack_supplied') :0 ;
  content.t_rs_badge = getField(report , 's_equipment.badge_supplied') ?  getField(report , 's_equipment.badge_supplied') :0 ;
  content.t_rs_flashlight = getField(report , 's_equipment.flashlight_supplied') ?  getField(report , 's_equipment.flashlight_supplied') :0 ;
  content.t_rs_salter = getField(report , 's_equipment.salter_supplied') ?  getField(report , 's_equipment.salter_supplied') :0 ;
  content.t_rs_color_salter = getField(report , 's_equipment.color_salter_supplied') ?  getField(report , 's_equipment.color_salter_supplied') :0 ;
  content.t_rs_weighing_scale = getField(report , 's_equipment.weighing_scale_supplied') ?  getField(report , 's_equipment.weighing_scale_supplied') :0 ;
  content.t_rs_first_aid = getField(report , 's_equipment.first_aid_supplied') ?  getField(report , 's_equipment.first_aid_supplied') :0 ;
  content.t_rs_bp = getField(report , 's_equipment.bp_supplied') ?  getField(report , 's_equipment.bp_supplied') :0 ;
  content.t_rs_thermometer = getField(report , 's_equipment.thermometer_supplied') ?  getField(report , 's_equipment.thermometer_supplied') :0 ;
  content.t_rs_resp_timer = getField(report , 's_equipment.resp_timer_supplied') ?  getField(report , 's_equipment.resp_timer_supplied') :0 ;
  content.t_rs_muac_tape_adults = getField(report , 's_equipment.muac_tape_adults_supplied') ?  getField(report , 's_equipment.muac_tape_adults_supplied') :0 ;
  content.t_rs_muac_tape_children = getField(report , 's_equipment.muac_tape_children_supplied') ?  getField(report , 's_equipment.muac_tape_children_supplied') :0 ;
  content.t_rs_family_muac_tape = getField(report , 's_equipment.family_muac_tape_supplied') ?  getField(report , 's_equipment.family_muac_tape_supplied') :0 ;
  content.t_rs_moh_514 = getField(report , 's_equipment.moh_514_supplied') ?  getField(report , 's_equipment.moh_514_supplied') :0 ;
  content.t_rs_moh_521 = getField(report , 's_equipment.moh_521_supplied') ?  getField(report , 's_equipment.moh_521_supplied') :0 ;
  content.t_rs_moh_100 = getField(report , 's_equipment.moh_100_supplied') ?  getField(report , 's_equipment.moh_100_supplied') :0 ;
  content.t_rs_comm_daily_register = getField(report , 's_equipment.comm_daily_register_supplied') ?  getField(report , 's_equipment.comm_daily_register_supplied') :0 ;
  content.t_rs_phone = getField(report , 's_equipment.phone_supplied') ?  getField(report , 's_equipment.phone_supplied') :0 ;
  content.t_rs_safety_box = getField(report , 's_equipment.safety_box_supplied') ?  getField(report , 's_equipment.safety_box_supplied') :0 ;
  content.t_rs_others = getField(report , 's_equipment.others_supplied') ?  getField(report , 's_equipment.others_supplied') :0 ;
      
  return content;

};
const stockOutContent = (content,report)=> {
  content.t_wos_chv_name = getField(report , 'chv_name') || '' ;
  content.t_wos_rdts = getField(report , 'wos_rdts') || '0';
  content.t_wos_act_6 = getField(report , 'wos_act_6') || '0';
  content.t_wos_act_12 = getField(report , 'wos_act_12') || '0';
  content.t_wos_act_18 = getField(report , 'wos_act_18') || '0';
  content.t_wos_act_24 = getField(report , 'wos_act_24') || '0';
  content.t_wos_dt_250 = getField(report , 'wos_dt_250') || '0';
  content.t_wos_ors_zinc = getField(report , 'wos_ors_zinc') || '0';
  content.t_wos_ors_sachets = getField(report , 'wos_ors_sachets') || '0';
  content.t_wos_zinc_sulphate = getField(report , 'wos_zinc_sulphate') || '0';
  content.t_wos_albendazole = getField(report , 'wos_albendazole') || '0';
  content.t_wos_tetra_eye = getField(report , 'wos_tetra_eye') || '0';
  content.t_wos_paracetamol_120 = getField(report , 'wos_paracetamol_120') || '0';
  content.t_wos_mebendazole = getField(report , 'wos_mebendazole') || '0';
  content.t_wos_coc = getField(report , 'wos_coc') || '0';
  content.t_wos_prog = getField(report , 'wos_prog') || '0';
  content.t_wos_depo_im = getField(report , 'wos_depo_im') || '0';
  content.t_wos_depo_sc = getField(report , 'wos_depo_sc') || '0';
  content.t_wos_preg_strip = getField(report , 'wos_preg_strip') || '0';
  content.t_wos_chlorine = getField(report , 'wos_chlorine') || '0';
  content.t_wos_gluc_strips	 = getField(report , 'wos_gluc_strips') || '0';
  content.t_wos_paracetamol_500 = getField(report , 'wos_paracetamol_500') || '0';
  content.t_wos_bandages = getField(report , 'wos_bandages') || '0';
  content.t_wos_povi = getField(report , 'wos_povi') || '0';
  content.t_wos_strap = getField(report , 'wos_strap') || '0';
  content.t_wos_gloves = getField(report , 'wos_gloves') || '0';
  content.t_wos_envelopes = getField(report , 'wos_envelopes') || '0';
  content.t_wos_glucometer = getField(report , 'wos_glucometer') || '0';
  content.t_wos_backpack = getField(report , 'wos_backpack') || '0';
  content.t_wos_badge = getField(report , 'wos_badge') || '0';
  content.t_wos_flashlight = getField(report , 'wos_flashlight') || '0';
  content.t_wos_salter = getField(report , 'wos_salter') || '0';
  content.t_wos_color_salter = getField(report , 'wos_color_salter') || '0';
  content.t_wos_weighing_scale = getField(report , 'wos_weighing_scale') || '0';
  content.t_wos_first_aid = getField(report , 'wos_first_aid') || '0';
  content.t_wos_bp = getField(report , 'wos_bp') || '0';
  content.t_wos_thermometer = getField(report , 'wos_thermometer') || '0';
  content.t_wos_resp_timer = getField(report , 'wos_resp_timer') || '0';
  content.t_wos_muac_tape_adults = getField(report , 'wos_muac_tape_adults') || '0';
  content.t_wos_muac_tape_children = getField(report , 'wos_muac_tape_children') || '0';
  content.t_wos_family_muac_tape = getField(report , 'wos_family_muac_tape') || '0';
  content.t_wos_moh_514 = getField(report , 'wos_moh_514') || '0';
  content.t_wos_moh_521 = getField(report , 'wos_moh_521') || '0';
  content.t_wos_moh_100 = getField(report , 'wos_moh_100') || '0';
  content.t_wos_comm_daily_register = getField(report , 'wos_comm_daily_register') || '0';
  content.t_wos_phone = getField(report , 'wos_phone') || '0';
  content.t_wos_safety_box = getField(report , 'wos_safety_box') || '0';
  content.t_wos_others = getField(report , 'wos_others') || '0';

  content.t_soh_rdts = getField(report , 'rdts_count_final') || '0';
  content.t_soh_act_6 = getField(report , 'act_6_count_final') || '0';
  content.t_soh_act_12 = getField(report , 'act_12_count_final') || '0';
  content.t_soh_act_18 = getField(report , 'act_18_count_final') || '0';
  content.t_soh_act_24 = getField(report , 'act_24_count_final') || '0';
  content.t_soh_dt_250 = getField(report , 'dt_250_count_final') || '0';
  content.t_soh_ors_zinc = getField(report , 'ors_zinc_count_final') || '0';
  content.t_soh_ors_sachets = getField(report , 'ors_sachets_count_final') || '0';
  content.t_soh_zinc_sulphate = getField(report , 'zinc_sulphate_count_final') || '0';
  content.t_soh_albendazole = getField(report , 'albendazole_count_final') || '0';
  content.t_soh_tetra_eye = getField(report , 'tetra_eye_count_final') || '0';
  content.t_soh_paracetamol_120 = getField(report , 'paracetamol_120_count_final') || '0';
  content.t_soh_mebendazole = getField(report , 'mebendazole_count_final') || '0';
  content.t_soh_coc = getField(report , 'coc_count_final') || '0';
  content.t_soh_prog = getField(report , 'prog_count_final') || '0';
  content.t_soh_depo_im = getField(report , 'depo_im_count_final') || '0';
  content.t_soh_depo_sc = getField(report , 'depo_sc_count_final') || '0';
  content.t_soh_preg_strip = getField(report , 'preg_strip_count_final') || '0';
  content.t_soh_chlorine = getField(report , 'chlorine_count_final') || '0';
  content.t_soh_gluc_strips	 = getField(report , 'gluc_strips_count_final') || '0';
  content.t_soh_paracetamol_500 = getField(report , 'paracetamol_500_count_final') || '0';
  content.t_soh_bandages = getField(report , 'bandages_count_final') || '0';
  content.t_soh_povi = getField(report , 'povi_count_final') || '0';
  content.t_soh_strap = getField(report , 'strap_count_final') || '0';
  content.t_soh_gloves = getField(report , 'gloves_count_final') || '0';
  content.t_soh_envelopes = getField(report , 'envelopes_count_final') || '0';
  content.t_soh_glucometer = getField(report , 'glucometer_count_final') || '0';
  content.t_soh_backpack = getField(report , 'backpack_count_final') || '0';
  content.t_soh_badge = getField(report , 'badge_count_final') || '0';
  content.t_soh_flashlight = getField(report , 'flashlight_count_final') || '0';
  content.t_soh_salter = getField(report , 'salter_count_final') || '0';
  content.t_soh_color_salter = getField(report , 'color_salter_count_final') || '0';
  content.t_soh_weighing_scale = getField(report , 'weighing_scale_count_final') || '0';
  content.t_soh_first_aid = getField(report , 'first_aid_count_final') || '0';
  content.t_soh_bp = getField(report , 'bp_count_final') || '0';
  content.t_soh_thermometer = getField(report , 'thermometer_count_final') || '0';
  content.t_soh_resp_timer = getField(report , 'resp_timer_count_final') || '0';
  content.t_soh_muac_tape_adults = getField(report , 'muac_tape_adults_count_final') || '0';
  content.t_soh_muac_tape_children = getField(report , 'muac_tape_children_count_final') || '0';
  content.t_soh_family_muac_tape = getField(report , 'family_muac_tape_count_final') || '0';
  content.t_soh_moh_514 = getField(report , 'moh_514_count_final') || '0';
  content.t_soh_moh_521 = getField(report , 'moh_521_count_final') || '0';
  content.t_soh_moh_100 = getField(report , 'moh_100_count_final') || '0';
  content.t_soh_comm_daily_register = getField(report , 'comm_daily_register_count_final') || '0';
  content.t_soh_phone = getField(report , 'phone_count_final') || '0';
  content.t_soh_safety_box = getField(report , 'safety_box_count_final') || '0';
  content.t_soh_others = getField(report , 'others_count_final') || '0';
      
  return content;

};
const discrepancyContent = (content, report) => {
  //d_ represent stock from discrepancy form itself. t_ is the items in the task that generated the form. 
  content.d_rs_chv_name = getField(report, 'chv_name') || '';
  content.d_rs_chv_area_uuid = getField(report,'chv_area_uuid') || ''; 
  content.d_rs_rdts =  getField(report, 's_malaria.rdts_quantity_received') || -1;
  content.d_rs_act_6 =  getField(report, 's_malaria.act_6_quantity_received') || -1;
  content.d_rs_act_12 =  getField(report, 's_malaria.act_12_quantity_received') || -1;
  content.d_rs_act_18 =  getField(report, 's_malaria.act_18_quantity_received') || -1;
  content.d_rs_act_24 =  getField(report, 's_malaria.act_24_quantity_received') || -1;
  content.d_rs_dt_250 =  getField(report, 's_child_health.dt_250_quantity_received') || -1;
  content.d_rs_ors_zinc =  getField(report, 's_child_health.ors_zinc_quantity_received') || -1;
  content.d_rs_ors_sachets =  getField(report, 's_child_health.ors_sachets_quantity_received') || -1;
  content.d_rs_zinc_sulphate =  getField(report, 's_child_health.zinc_sulphate_quantity_received') || -1;
  content.d_rs_albendazole =  getField(report, 's_child_health.albendazole_quantity_received') || -1;
  content.d_rs_tetra_eye =  getField(report, 's_child_health.tetra_eye_quantity_received') || -1;
  content.d_rs_paracetamol_120 =  getField(report, 's_child_health.paracetamol_120_quantity_received') || -1;
  content.d_rs_mebendazole =  getField(report, 's_reproductive.mebendazole_quantity_received') || -1;
  content.d_rs_coc =  getField(report, 's_reproductive.coc_quantity_received') || -1;
  content.d_rs_prog =  getField(report, 's_reproductive.prog_quantity_received') || -1;
  content.d_rs_depo_im =  getField(report, 's_reproductive.depo_im_quantity_received') || -1;
  content.d_rs_depo_sc =  getField(report, 's_reproductive.depo_sc_quantity_received') || -1;
  content.d_rs_preg_strip =  getField(report, 's_reproductive.preg_strip_quantity_received') || -1;
  content.d_rs_chlorine =  getField(report, 's_wash.chlorine_quantity_received') || -1;
  content.d_rs_gluc_strips =  getField(report, 's_ncds.gluc_strips_quantity_received') || -1;
  content.d_rs_paracetamol_500 =  getField(report, 's_others.paracetamol_500_quantity_received') || -1;
  content.d_rs_bandages =  getField(report, 's_non_pharma.bandages_quantity_received') || -1;
  content.d_rs_povi =  getField(report, 's_non_pharma.povi_quantity_received') || -1;
  content.d_rs_strap =  getField(report, 's_non_pharma.strap_quantity_received') || -1;
  content.d_rs_gloves =  getField(report, 's_non_pharma.gloves_quantity_received') || -1;
  content.d_rs_envelopes =  getField(report, 's_non_pharma.envelopes_quantity_received') || -1;
  content.d_rs_glucometer =  getField(report, 's_equipment.glucometer_quantity_received') || -1;
  content.d_rs_backpack =  getField(report, 's_equipment.backpack_quantity_received') || -1;
  content.d_rs_badge =  getField(report, 's_equipment.badge_quantity_received') || -1;
  content.d_rs_flashlight =  getField(report, 's_equipment.flashlight_quantity_received') || -1;
  content.d_rs_salter =  getField(report, 's_equipment.salter_quantity_received') || -1;
  content.d_rs_color_salter =  getField(report, 's_equipment.color_salter_quantity_received') || -1;
  content.d_rs_weighing_scale =  getField(report, 's_equipment.weighing_scale_quantity_received') || -1;
  content.d_rs_first_aid =  getField(report, 's_equipment.first_aid_quantity_received') || -1;
  content.d_rs_bp =  getField(report, 's_equipment.bp_quantity_received') || -1;
  content.d_rs_thermometer =  getField(report, 's_equipment.thermometer_quantity_received') || -1;
  content.d_rs_resp_timer =  getField(report, 's_equipment.resp_timer_quantity_received') || -1;
  content.d_rs_muac_tape_adults =  getField(report, 's_equipment.muac_tape_adults_quantity_received') || -1;
  content.d_rs_muac_tape_children =  getField(report, 's_equipment.muac_tape_children_quantity_received') || -1;
  content.d_rs_family_muac_tape =  getField(report, 's_equipment.family_muac_tape_quantity_received') || -1;
  content.d_rs_moh_514 =  getField(report, 's_equipment.moh_514_quantity_received') || -1;
  content.d_rs_moh_521 =  getField(report, 's_equipment.moh_521_quantity_received') || -1;
  content.d_rs_moh_100 =  getField(report, 's_equipment.moh_100_quantity_received') || -1;
  content.d_rs_comm_daily_register =  getField(report, 's_equipment.comm_daily_register_quantity_received') || -1;
  content.d_rs_phone =  getField(report, 's_equipment.phone_quantity_received') || -1;
  content.d_rs_safety_box =  getField(report, 's_equipment.safety_box_quantity_received') || -1;
  content.d_rs_others =  getField(report, 's_equipment.others_quantity_received') || -1;

  content.t_rs_rdts =  getField(report , 'rs_rdts') || 0 ;
  content.t_rs_act_6 =  getField(report , 'rs_act_6') || 0 ;
  content.t_rs_act_12 =  getField(report , 'rs_act_12') || 0 ;
  content.t_rs_act_18 =  getField(report , 'rs_act_18') || 0 ;
  content.t_rs_act_24 =  getField(report , 'rs_act_24') || 0 ;
  content.t_rs_dt_250 =  getField(report , 'rs_dt_250') || 0 ;
  content.t_rs_ors_zinc =  getField(report , 'rs_ors_zinc') || 0 ;
  content.t_rs_ors_sachets =  getField(report , 'rs_ors_sachets') || 0 ;
  content.t_rs_zinc_sulphate =  getField(report , 'rs_zinc_sulphate') || 0 ;
  content.t_rs_albendazole =  getField(report , 'rs_albendazole') || 0 ;
  content.t_rs_tetra_eye =  getField(report , 'rs_tetra_eye') || 0 ;
  content.t_rs_paracetamol_120 =  getField(report , 'rs_paracetamol_120') || 0 ;
  content.t_rs_mebendazole =  getField(report , 'rs_mebendazole') || 0 ;
  content.t_rs_coc =  getField(report , 'rs_coc') || 0 ;
  content.t_rs_prog =  getField(report , 'rs_prog') || 0 ;
  content.t_rs_depo_im =  getField(report , 'rs_depo_im') || 0 ;
  content.t_rs_depo_sc =  getField(report , 'rs_depo_sc') || 0 ;
  content.t_rs_preg_strip =  getField(report , 'rs_preg_strip') || 0 ;
  content.t_rs_chlorine =  getField(report , 'rs_chlorine') || 0 ;
  content.t_rs_gluc_strips	 =  getField(report,'rs_gluc_strips') || 0 ;
  content.t_rs_paracetamol_500 =  getField(report , 'rs_paracetamol_500') || 0 ;
  content.t_rs_bandages =  getField(report , 'rs_bandages') || 0 ;
  content.t_rs_povi =  getField(report , 'rs_povi') || 0 ;
  content.t_rs_strap =  getField(report , 'rs_strap') || 0 ;
  content.t_rs_gloves =  getField(report , 'rs_gloves') || 0 ;
  content.t_rs_envelopes =  getField(report , 'rs_envelopes') || 0 ;
  content.t_rs_glucometer =  getField(report , 'rs_glucometer') || 0 ;
  content.t_rs_backpack =  getField(report , 'rs_backpack') || 0 ;
  content.t_rs_badge =  getField(report , 'rs_badge') || 0 ;
  content.t_rs_flashlight =  getField(report , 'rs_flashlight') || 0 ;
  content.t_rs_salter =  getField(report , 'rs_salter') || 0 ;
  content.t_rs_color_salter =  getField(report , 'rs_color_salter') || 0 ;
  content.t_rs_weighing_scale =  getField(report , 'rs_weighing_scale') || 0 ;
  content.t_rs_first_aid =  getField(report , 'rs_first_aid') || 0 ;
  content.t_rs_bp =  getField(report , 'rs_bp') || 0 ;
  content.t_rs_thermometer =  getField(report , 'rs_thermometer') || 0 ;
  content.t_rs_resp_timer =  getField(report , 'rs_resp_timer') || 0 ;
  content.t_rs_muac_tape_adults =  getField(report , 'rs_muac_tape_adults') || 0 ;
  content.t_rs_muac_tape_children =  getField(report , 'rs_muac_tape_children') || 0 ;
  content.t_rs_family_muac_tape =  getField(report , 'rs_family_muac_tape') || 0 ;
  content.t_rs_moh_514 =  getField(report , 'rs_moh_514') || 0 ;
  content.t_rs_moh_521 =  getField(report , 'rs_moh_521') || 0 ;
  content.t_rs_moh_100 =  getField(report , 'rs_moh_100') || 0 ;
  content.t_rs_comm_daily_register =  getField(report , 'rs_comm_daily_register') || 0 ;
  content.t_rs_phone =  getField(report , 'rs_phone') || 0 ;
  content.t_rs_safety_box =  getField(report , 'rs_safety_box') || 0 ;
  content.t_rs_others =  getField(report , 'rs_others') || 0 ;
  return content;

};
const returnedContent = (content, report) => {
  content.t_returned_chv_name = getField(report , 'chv_name') ?  getField(report , 'chv_name') :'' ;

  const t_excess_return_rdts = parseInt(getField(report , 's_malaria.rdts_excess_return')) ?  parseInt(getField(report , 's_malaria.rdts_excess_return')) :0 ;
  const t_excess_return_act_6 = parseInt(getField(report , 's_malaria.act_6_excess_return')) ?  parseInt(getField(report , 's_malaria.act_6_excess_return')) :0 ;
  const t_excess_return_act_12 = parseInt(getField(report , 's_malaria.act_12_excess_return')) ?  parseInt(getField(report , 's_malaria.act_12_excess_return')) :0 ;
  const t_excess_return_act_18 = parseInt(getField(report , 's_malaria.act_18_excess_return')) ?  parseInt(getField(report , 's_malaria.act_18_excess_return')) :0 ;
  const t_excess_return_act_24 = parseInt(getField(report , 's_malaria.act_24_excess_return')) ?  parseInt(getField(report , 's_malaria.act_24_excess_return')) :0 ;
  const t_excess_return_dt_250 = parseInt(getField(report , 's_child_health.dt_250_excess_return')) ?  parseInt(getField(report , 's_child_health.dt_250_excess_return')) :0 ;
  const t_excess_return_ors_zinc = parseInt(getField(report , 's_child_health.ors_zinc_excess_return')) ?  parseInt(getField(report , 's_child_health.ors_zinc_excess_return')) :0 ;
  const t_excess_return_ors_sachets = parseInt(getField(report , 's_child_health.ors_sachets_excess_return')) ?  parseInt(getField(report , 's_child_health.ors_sachets_excess_return')) :0 ;
  const t_excess_return_zinc_sulphate = parseInt(getField(report , 's_child_health.zinc_sulphate_excess_return')) ?  parseInt(getField(report , 's_child_health.zinc_sulphate_excess_return')) :0 ;
  const t_excess_return_albendazole = parseInt(getField(report , 's_child_health.albendazole_excess_return')) ?  parseInt(getField(report , 's_child_health.albendazole_excess_return')) :0 ;
  const t_excess_return_tetra_eye = parseInt(getField(report , 's_child_health.tetra_eye_excess_return')) ?  parseInt(getField(report , 's_child_health.tetra_eye_excess_return')) :0 ;
  const t_excess_return_paracetamol_120 = parseInt(getField(report , 's_child_health.paracetamol_120_excess_return')) ?  parseInt(getField(report , 's_child_health.paracetamol_120_excess_return')) :0 ;
  const t_excess_return_mebendazole = parseInt(getField(report , 's_reproductive.mebendazole_excess_return')) ?  parseInt(getField(report , 's_reproductive.mebendazole_excess_return')) :0 ;
  const t_excess_return_coc = parseInt(getField(report , 's_reproductive.coc_excess_return')) ?  parseInt(getField(report , 's_reproductive.coc_excess_return')) :0 ;
  const t_excess_return_prog = parseInt(getField(report , 's_reproductive.prog_excess_return')) ?  parseInt(getField(report , 's_reproductive.prog_excess_return')) :0 ;
  const t_excess_return_depo_im = parseInt(getField(report , 's_reproductive.depo_im_excess_return')) ?  parseInt(getField(report , 's_reproductive.depo_im_excess_return')) :0 ;
  const t_excess_return_depo_sc = parseInt(getField(report , 's_reproductive.depo_sc_excess_return')) ?  parseInt(getField(report , 's_reproductive.depo_sc_excess_return')) :0 ;
  const t_excess_return_preg_strip = parseInt(getField(report , 's_reproductive.preg_strip_excess_return')) ?  parseInt(getField(report , 's_reproductive.preg_strip_excess_return')) :0 ;
  const t_excess_return_chlorine = parseInt(getField(report , 's_wash.chlorine_excess_return')) ?  parseInt(getField(report , 's_wash.chlorine_excess_return')) :0 ;
  const t_excess_return_gluc_strips	 = parseInt(getField(report , 's_ncds.gluc_strips_excess_return')) ?  parseInt(getField(report , 's_ncds.gluc_strips_excess_return')) :0 ;
  const t_excess_return_paracetamol_500 = parseInt(getField(report , 's_others.paracetamol_500_excess_return')) ?  parseInt(getField(report , 's_others.paracetamol_500_excess_return')) :0 ;
  const t_excess_return_bandages = parseInt(getField(report , 's_non_pharma.bandages_excess_return')) ?  parseInt(getField(report , 's_non_pharma.bandages_excess_return')) :0 ;
  const t_excess_return_povi = parseInt(getField(report , 's_non_pharma.povi_excess_return')) ?  parseInt(getField(report , 's_non_pharma.povi_excess_return')) :0 ;
  const t_excess_return_strap = parseInt(getField(report , 's_non_pharma.strap_excess_return')) ?  parseInt(getField(report , 's_non_pharma.strap_excess_return')) :0 ;
  const t_excess_return_gloves = parseInt(getField(report , 's_non_pharma.gloves_excess_return')) ?  parseInt(getField(report , 's_non_pharma.gloves_excess_return')) :0 ;
  const t_excess_return_envelopes = parseInt(getField(report , 's_non_pharma.envelopes_excess_return')) ?  parseInt(getField(report , 's_non_pharma.envelopes_excess_return')) :0 ;
  const t_excess_return_glucometer = parseInt(getField(report , 's_equipment.glucometer_excess_return')) ?  parseInt(getField(report , 's_equipment.glucometer_excess_return')) :0 ;
  const t_excess_return_backpack = parseInt(getField(report , 's_equipment.backpack_excess_return')) ?  parseInt(getField(report , 's_equipment.backpack_excess_return')) :0 ;
  const t_excess_return_badge = parseInt(getField(report , 's_equipment.badge_excess_return')) ?  parseInt(getField(report , 's_equipment.badge_excess_return')) :0 ;
  const t_excess_return_flashlight = parseInt(getField(report , 's_equipment.flashlight_excess_return')) ?  parseInt(getField(report , 's_equipment.flashlight_excess_return')) :0 ;
  const t_excess_return_salter = parseInt(getField(report , 's_equipment.salter_excess_return')) ?  parseInt(getField(report , 's_equipment.salter_excess_return')) :0 ;
  const t_excess_return_color_salter = parseInt(getField(report , 's_equipment.color_salter_excess_return')) ?  parseInt(getField(report , 's_equipment.color_salter_excess_return')) :0 ;
  const t_excess_return_weighing_scale = parseInt(getField(report , 's_equipment.weighing_scale_excess_return')) ?  parseInt(getField(report , 's_equipment.weighing_scale_excess_return')) :0 ;
  const t_excess_return_first_aid = parseInt(getField(report , 's_equipment.first_aid_excess_return')) ?  parseInt(getField(report , 's_equipment.first_aid_excess_return')) :0 ;
  const t_excess_return_bp = parseInt(getField(report , 's_equipment.bp_excess_return')) ?  parseInt(getField(report , 's_equipment.bp_excess_return')) :0 ;
  const t_excess_return_thermometer = parseInt(getField(report , 's_equipment.thermometer_excess_return')) ?  parseInt(getField(report , 's_equipment.thermometer_excess_return')) :0 ;
  const t_excess_return_resp_timer = parseInt(getField(report , 's_equipment.resp_timer_excess_return')) ?  parseInt(getField(report , 's_equipment.resp_timer_excess_return')) :0 ;
  const t_excess_return_muac_tape_adults = parseInt(getField(report , 's_equipment.muac_tape_adults_excess_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_adults_excess_return')) :0 ;
  const t_excess_return_muac_tape_children = parseInt(getField(report , 's_equipment.muac_tape_children_excess_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_children_excess_return')) :0 ;
  const t_excess_return_family_muac_tape = parseInt(getField(report , 's_equipment.family_muac_tape_excess_return')) ?  parseInt(getField(report , 's_equipment.family_muac_tape_excess_return')) :0 ;
  const t_excess_return_moh_514 = parseInt(getField(report , 's_equipment.moh_514_excess_return')) ?  parseInt(getField(report , 's_equipment.moh_514_excess_return')) :0 ;
  const t_excess_return_moh_521 = parseInt(getField(report , 's_equipment.moh_521_excess_return')) ?  parseInt(getField(report , 's_equipment.moh_521_excess_return')) :0 ;
  const t_excess_return_moh_100 = parseInt(getField(report , 's_equipment.moh_100_excess_return')) ?  parseInt(getField(report , 's_equipment.moh_100_excess_return')) :0 ;
  const t_excess_return_comm_daily_register = parseInt(getField(report , 's_equipment.comm_daily_register_excess_return')) ?  parseInt(getField(report , 's_equipment.comm_daily_register_excess_return')) :0 ;
  const t_excess_return_phone = parseInt(getField(report , 's_equipment.phone_excess_return')) ?  parseInt(getField(report , 's_equipment.phone_excess_return')) :0 ;
  const t_excess_return_safety_box = parseInt(getField(report , 's_equipment.safety_box_excess_return')) ?  parseInt(getField(report , 's_equipment.safety_box_excess_return')) :0 ;
  const t_excess_return_others = parseInt(getField(report , 's_equipment.others_excess_return')) ?  parseInt(getField(report , 's_equipment.others_excess_return')) :0 ;
  const t_excess_to_return_rdts = (getField(report , 's_malaria.rdts_excess_to_return')) ?  (getField(report , 's_malaria.rdts_excess_to_return')) :0 ;
  const t_excess_to_return_act_6 = parseInt(getField(report , 's_malaria.act_6_excess_to_return')) ?  parseInt(getField(report , 's_malaria.act_6_excess_to_return')) :0 ;
  const t_excess_to_return_act_12 = parseInt(getField(report , 's_malaria.act_12_excess_to_return')) ?  parseInt(getField(report , 's_malaria.act_12_excess_to_return')) :0 ;
  const t_excess_to_return_act_18 = parseInt(getField(report , 's_malaria.act_18_excess_to_return')) ?  parseInt(getField(report , 's_malaria.act_18_excess_to_return')) :0 ;
  const t_excess_to_return_act_24 = parseInt(getField(report , 's_malaria.act_24_excess_to_return')) ?  parseInt(getField(report , 's_malaria.act_24_excess_to_return')) :0 ;
  const t_excess_to_return_dt_250 = parseInt(getField(report , 's_child_health.dt_250_excess_to_return')) ?  parseInt(getField(report , 's_child_health.dt_250_excess_to_return')) :0 ;
  const t_excess_to_return_ors_zinc = parseInt(getField(report , 's_child_health.ors_zinc_excess_to_return')) ?  parseInt(getField(report , 's_child_health.ors_zinc_excess_to_return')) :0 ;
  const t_excess_to_return_ors_sachets = parseInt(getField(report , 's_child_health.ors_sachets_excess_to_return')) ?  parseInt(getField(report , 's_child_health.ors_sachets_excess_to_return')) :0 ;
  const t_excess_to_return_zinc_sulphate = parseInt(getField(report , 's_child_health.zinc_sulphate_excess_to_return')) ?  parseInt(getField(report , 's_child_health.zinc_sulphate_excess_to_return')) :0 ;
  const t_excess_to_return_albendazole = parseInt(getField(report , 's_child_health.albendazole_excess_to_return')) ?  parseInt(getField(report , 's_child_health.albendazole_excess_to_return')) :0 ;
  const t_excess_to_return_tetra_eye = parseInt(getField(report , 's_child_health.tetra_eye_excess_to_return')) ?  parseInt(getField(report , 's_child_health.tetra_eye_excess_to_return')) :0 ;
  const t_excess_to_return_paracetamol_120 = parseInt(getField(report , 's_child_health.paracetamol_120_excess_to_return')) ?  parseInt(getField(report , 's_child_health.paracetamol_120_excess_to_return')) :0 ;
  const t_excess_to_return_mebendazole = parseInt(getField(report , 's_reproductive.mebendazole_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.mebendazole_excess_to_return')) :0 ;
  const t_excess_to_return_coc = parseInt(getField(report , 's_reproductive.coc_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.coc_excess_to_return')) :0 ;
  const t_excess_to_return_prog = parseInt(getField(report , 's_reproductive.prog_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.prog_excess_to_return')) :0 ;
  const t_excess_to_return_depo_im = parseInt(getField(report , 's_reproductive.depo_im_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.depo_im_excess_to_return')) :0 ;
  const t_excess_to_return_depo_sc = parseInt(getField(report , 's_reproductive.depo_sc_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.depo_sc_excess_to_return')) :0 ;
  const t_excess_to_return_preg_strip = parseInt(getField(report , 's_reproductive.preg_strip_excess_to_return')) ?  parseInt(getField(report , 's_reproductive.preg_strip_excess_to_return')) :0 ;
  const t_excess_to_return_chlorine = parseInt(getField(report , 's_wash.chlorine_excess_to_return')) ?  parseInt(getField(report , 's_wash.chlorine_excess_to_return')) :0 ;
  const t_excess_to_return_gluc_strips	 = parseInt(getField(report , 's_ncds.gluc_strips_excess_to_return')) ?  parseInt(getField(report , 's_ncds.gluc_strips_excess_to_return')) :0 ;
  const t_excess_to_return_paracetamol_500 = parseInt(getField(report , 's_others.paracetamol_500_excess_to_return')) ?  parseInt(getField(report , 's_others.paracetamol_500_excess_to_return')) :0 ;
  const t_excess_to_return_bandages = parseInt(getField(report , 's_non_pharma.bandages_excess_to_return')) ?  parseInt(getField(report , 's_non_pharma.bandages_excess_to_return')) :0 ;
  const t_excess_to_return_povi = parseInt(getField(report , 's_non_pharma.povi_excess_to_return')) ?  parseInt(getField(report , 's_non_pharma.povi_excess_to_return')) :0 ;
  const t_excess_to_return_strap = parseInt(getField(report , 's_non_pharma.strap_excess_to_return')) ?  parseInt(getField(report , 's_non_pharma.strap_excess_to_return')) :0 ;
  const t_excess_to_return_gloves = parseInt(getField(report , 's_non_pharma.gloves_excess_to_return')) ?  parseInt(getField(report , 's_non_pharma.gloves_excess_to_return')) :0 ;
  const t_excess_to_return_envelopes = parseInt(getField(report , 's_non_pharma.envelopes_excess_to_return')) ?  parseInt(getField(report , 's_non_pharma.envelopes_excess_to_return')) :0 ;
  const t_excess_to_return_glucometer = parseInt(getField(report , 's_equipment.glucometer_excess_to_return')) ?  parseInt(getField(report , 's_equipment.glucometer_excess_to_return')) :0 ;
  const t_excess_to_return_backpack = parseInt(getField(report , 's_equipment.backpack_excess_to_return')) ?  parseInt(getField(report , 's_equipment.backpack_excess_to_return')) :0 ;
  const t_excess_to_return_badge = parseInt(getField(report , 's_equipment.badge_excess_to_return')) ?  parseInt(getField(report , 's_equipment.badge_excess_to_return')) :0 ;
  const t_excess_to_return_flashlight = parseInt(getField(report , 's_equipment.flashlight_excess_to_return')) ?  parseInt(getField(report , 's_equipment.flashlight_excess_to_return')) :0 ;
  const t_excess_to_return_salter = parseInt(getField(report , 's_equipment.salter_excess_to_return')) ?  parseInt(getField(report , 's_equipment.salter_excess_to_return')) :0 ;
  const t_excess_to_return_color_salter = parseInt(getField(report , 's_equipment.color_salter_excess_to_return')) ?  parseInt(getField(report , 's_equipment.color_salter_excess_to_return')) :0 ;
  const t_excess_to_return_weighing_scale = parseInt(getField(report , 's_equipment.weighing_scale_excess_to_return')) ?  parseInt(getField(report , 's_equipment.weighing_scale_excess_to_return')) :0 ;
  const t_excess_to_return_first_aid = parseInt(getField(report , 's_equipment.first_aid_excess_to_return')) ?  parseInt(getField(report , 's_equipment.first_aid_excess_to_return')) :0 ;
  const t_excess_to_return_bp = parseInt(getField(report , 's_equipment.bp_excess_to_return')) ?  parseInt(getField(report , 's_equipment.bp_excess_to_return')) :0 ;
  const t_excess_to_return_thermometer = parseInt(getField(report , 's_equipment.thermometer_excess_to_return')) ?  parseInt(getField(report , 's_equipment.thermometer_excess_to_return')) :0 ;
  const t_excess_to_return_resp_timer = parseInt(getField(report , 's_equipment.resp_timer_excess_to_return')) ?  parseInt(getField(report , 's_equipment.resp_timer_excess_to_return')) :0 ;
  const t_excess_to_return_muac_tape_adults = parseInt(getField(report , 's_equipment.muac_tape_adults_excess_to_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_adults_excess_to_return')) :0 ;
  const t_excess_to_return_muac_tape_children = parseInt(getField(report , 's_equipment.muac_tape_children_excess_to_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_children_excess_to_return')) :0 ;
  const t_excess_to_return_family_muac_tape = parseInt(getField(report , 's_equipment.family_muac_tape_excess_to_return')) ?  parseInt(getField(report , 's_equipment.family_muac_tape_excess_to_return')) :0 ;
  const t_excess_to_return_moh_514 = parseInt(getField(report , 's_equipment.moh_514_excess_to_return')) ?  parseInt(getField(report , 's_equipment.moh_514_excess_to_return')) :0 ;
  const t_excess_to_return_moh_521 = parseInt(getField(report , 's_equipment.moh_521_excess_to_return')) ?  parseInt(getField(report , 's_equipment.moh_521_excess_to_return')) :0 ;
  const t_excess_to_return_moh_100 = parseInt(getField(report , 's_equipment.moh_100_excess_to_return')) ?  parseInt(getField(report , 's_equipment.moh_100_excess_to_return')) :0 ;
  const t_excess_to_return_comm_daily_register = parseInt(getField(report , 's_equipment.comm_daily_register_excess_to_return')) ?  parseInt(getField(report , 's_equipment.comm_daily_register_excess_to_return')) :0 ;
  const t_excess_to_return_phone = parseInt(getField(report , 's_equipment.phone_excess_to_return')) ?  parseInt(getField(report , 's_equipment.phone_excess_to_return')) :0 ;
  const t_excess_to_return_safety_box = parseInt(getField(report , 's_equipment.safety_box_excess_to_return')) ?  parseInt(getField(report , 's_equipment.safety_box_excess_to_return')) :0 ;
  const t_excess_to_return_others = parseInt(getField(report , 's_equipment.others_excess_to_return')) ?  parseInt(getField(report , 's_equipment.others_excess_to_return')) :0 ;
  const t_damaged_or_expired_return_rdts = parseInt(getField(report , 's_malaria.rdts_damaged_or_expired_return')) ?  parseInt(getField(report , 's_malaria.rdts_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_act_6 = parseInt(getField(report , 's_malaria.act_6_damaged_or_expired_return')) ?  parseInt(getField(report , 's_malaria.act_6_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_act_12 = parseInt(getField(report , 's_malaria.act_12_damaged_or_expired_return')) ?  parseInt(getField(report , 's_malaria.act_12_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_act_18 = parseInt(getField(report , 's_malaria.act_18_damaged_or_expired_return')) ?  parseInt(getField(report , 's_malaria.act_18_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_act_24 = parseInt(getField(report , 's_malaria.act_24_damaged_or_expired_return')) ?  parseInt(getField(report , 's_malaria.act_24_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_dt_250 = parseInt(getField(report , 's_child_health.dt_250_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.dt_250_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_ors_zinc = parseInt(getField(report , 's_child_health.ors_zinc_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.ors_zinc_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_ors_sachets = parseInt(getField(report , 's_child_health.ors_sachets_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.ors_sachets_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_zinc_sulphate = parseInt(getField(report , 's_child_health.zinc_sulphate_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.zinc_sulphate_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_albendazole = parseInt(getField(report , 's_child_health.albendazole_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.albendazole_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_tetra_eye = parseInt(getField(report , 's_child_health.tetra_eye_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.tetra_eye_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_paracetamol_120 = parseInt(getField(report , 's_child_health.paracetamol_120_damaged_or_expired_return')) ?  parseInt(getField(report , 's_child_health.paracetamol_120_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_mebendazole = parseInt(getField(report , 's_reproductive.mebendazole_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.mebendazole_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_coc = parseInt(getField(report , 's_reproductive.coc_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.coc_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_prog = parseInt(getField(report , 's_reproductive.prog_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.prog_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_depo_im = parseInt(getField(report , 's_reproductive.depo_im_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.depo_im_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_depo_sc = parseInt(getField(report , 's_reproductive.depo_sc_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.depo_sc_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_preg_strip = parseInt(getField(report , 's_reproductive.preg_strip_damaged_or_expired_return')) ?  parseInt(getField(report , 's_reproductive.preg_strip_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_chlorine = parseInt(getField(report , 's_wash.chlorine_damaged_or_expired_return')) ?  parseInt(getField(report , 's_wash.chlorine_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_gluc_strips	 = parseInt(getField(report , 's_ncds.gluc_strips_damaged_or_expired_return')) ?  parseInt(getField(report , 's_ncds.gluc_strips_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_paracetamol_500 = parseInt(getField(report , 's_others.paracetamol_500_damaged_or_expired_return')) ?  parseInt(getField(report , 's_others.paracetamol_500_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_bandages = parseInt(getField(report , 's_non_pharma.bandages_damaged_or_expired_return')) ?  parseInt(getField(report , 's_non_pharma.bandages_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_povi = parseInt(getField(report , 's_non_pharma.povi_damaged_or_expired_return')) ?  parseInt(getField(report , 's_non_pharma.povi_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_strap = parseInt(getField(report , 's_non_pharma.strap_damaged_or_expired_return')) ?  parseInt(getField(report , 's_non_pharma.strap_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_gloves = parseInt(getField(report , 's_non_pharma.gloves_damaged_or_expired_return')) ?  parseInt(getField(report , 's_non_pharma.gloves_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_envelopes = parseInt(getField(report , 's_non_pharma.envelopes_damaged_or_expired_return')) ?  parseInt(getField(report , 's_non_pharma.envelopes_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_glucometer = parseInt(getField(report , 's_equipment.glucometer_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.glucometer_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_backpack = parseInt(getField(report , 's_equipment.backpack_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.backpack_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_badge = parseInt(getField(report , 's_equipment.badge_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.badge_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_flashlight = parseInt(getField(report , 's_equipment.flashlight_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.flashlight_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_salter = parseInt(getField(report , 's_equipment.salter_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.salter_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_color_salter = parseInt(getField(report , 's_equipment.color_salter_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.color_salter_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_weighing_scale = parseInt(getField(report , 's_equipment.weighing_scale_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.weighing_scale_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_first_aid = parseInt(getField(report , 's_equipment.first_aid_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.first_aid_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_bp = parseInt(getField(report , 's_equipment.bp_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.bp_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_thermometer = parseInt(getField(report , 's_equipment.thermometer_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.thermometer_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_resp_timer = parseInt(getField(report , 's_equipment.resp_timer_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.resp_timer_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_muac_tape_adults = parseInt(getField(report , 's_equipment.muac_tape_adults_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_adults_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_muac_tape_children = parseInt(getField(report , 's_equipment.muac_tape_children_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.muac_tape_children_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_family_muac_tape = parseInt(getField(report , 's_equipment.family_muac_tape_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.family_muac_tape_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_moh_514 = parseInt(getField(report , 's_equipment.moh_514_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.moh_514_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_moh_521 = parseInt(getField(report , 's_equipment.moh_521_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.moh_521_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_moh_100 = parseInt(getField(report , 's_equipment.moh_100_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.moh_100_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_comm_daily_register = parseInt(getField(report , 's_equipment.comm_daily_register_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.comm_daily_register_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_phone = parseInt(getField(report , 's_equipment.phone_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.phone_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_safety_box = parseInt(getField(report , 's_equipment.safety_box_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.safety_box_damaged_or_expired_return')) :0 ;
  const t_damaged_or_expired_return_others = parseInt(getField(report , 's_equipment.others_damaged_or_expired_return')) ?  parseInt(getField(report , 's_equipment.others_damaged_or_expired_return')) :0 ;
  
  content.t_returned_rdts= t_excess_return_rdts + t_excess_to_return_rdts  +t_damaged_or_expired_return_rdts ;
  content.t_returned_act_6= t_excess_return_act_6 + t_excess_to_return_act_6  +t_damaged_or_expired_return_act_6 ;
  content.t_returned_act_12= t_excess_return_act_12 + t_excess_to_return_act_12  +t_damaged_or_expired_return_act_12 ;
  content.t_returned_act_18= t_excess_return_act_18 + t_excess_to_return_act_18  +t_damaged_or_expired_return_act_18 ;
  content.t_returned_act_24= t_excess_return_act_24 + t_excess_to_return_act_24  +t_damaged_or_expired_return_act_24 ;
  content.t_returned_dt_250= t_excess_return_dt_250 + t_excess_to_return_dt_250  +t_damaged_or_expired_return_dt_250 ;
  content.t_returned_ors_zinc= t_excess_return_ors_zinc + t_excess_to_return_ors_zinc  +t_damaged_or_expired_return_ors_zinc ;
  content.t_returned_ors_sachets= t_excess_return_ors_sachets + t_excess_to_return_ors_sachets  +t_damaged_or_expired_return_ors_sachets ;
  content.t_returned_zinc_sulphate= t_excess_return_zinc_sulphate + t_excess_to_return_zinc_sulphate  +t_damaged_or_expired_return_zinc_sulphate ;
  content.t_returned_albendazole= t_excess_return_albendazole + t_excess_to_return_albendazole  +t_damaged_or_expired_return_albendazole ;
  content.t_returned_tetra_eye= t_excess_return_tetra_eye + t_excess_to_return_tetra_eye  +t_damaged_or_expired_return_tetra_eye ;
  content.t_returned_paracetamol_120= t_excess_return_paracetamol_120 + t_excess_to_return_paracetamol_120  +t_damaged_or_expired_return_paracetamol_120 ;
  content.t_returned_mebendazole= t_excess_return_mebendazole + t_excess_to_return_mebendazole  +t_damaged_or_expired_return_mebendazole ;
  content.t_returned_coc= t_excess_return_coc + t_excess_to_return_coc  +t_damaged_or_expired_return_coc ;
  content.t_returned_prog= t_excess_return_prog + t_excess_to_return_prog  +t_damaged_or_expired_return_prog ;
  content.t_returned_depo_im= t_excess_return_depo_im + t_excess_to_return_depo_im  +t_damaged_or_expired_return_depo_im ;
  content.t_returned_depo_sc= t_excess_return_depo_sc + t_excess_to_return_depo_sc  +t_damaged_or_expired_return_depo_sc ;
  content.t_returned_preg_strip= t_excess_return_preg_strip + t_excess_to_return_preg_strip  +t_damaged_or_expired_return_preg_strip ;
  content.t_returned_chlorine= t_excess_return_chlorine + t_excess_to_return_chlorine  +t_damaged_or_expired_return_chlorine ;
  content.t_returned_gluc_strips= t_excess_return_gluc_strips + t_excess_to_return_gluc_strips  +t_damaged_or_expired_return_gluc_strips ;
  content.t_returned_paracetamol_500= t_excess_return_paracetamol_500 + t_excess_to_return_paracetamol_500  +t_damaged_or_expired_return_paracetamol_500 ;
  content.t_returned_bandages= t_excess_return_bandages + t_excess_to_return_bandages  +t_damaged_or_expired_return_bandages ;
  content.t_returned_povi= t_excess_return_povi + t_excess_to_return_povi  +t_damaged_or_expired_return_povi ;
  content.t_returned_strap= t_excess_return_strap + t_excess_to_return_strap  +t_damaged_or_expired_return_strap ;
  content.t_returned_gloves= t_excess_return_gloves + t_excess_to_return_gloves  +t_damaged_or_expired_return_gloves ;
  content.t_returned_envelopes= t_excess_return_envelopes + t_excess_to_return_envelopes  +t_damaged_or_expired_return_envelopes ;
  content.t_returned_glucometer= t_excess_return_glucometer + t_excess_to_return_glucometer  +t_damaged_or_expired_return_glucometer ;
  content.t_returned_backpack= t_excess_return_backpack + t_excess_to_return_backpack  +t_damaged_or_expired_return_backpack ;
  content.t_returned_badge= t_excess_return_badge + t_excess_to_return_badge  +t_damaged_or_expired_return_badge ;
  content.t_returned_flashlight= t_excess_return_flashlight + t_excess_to_return_flashlight  +t_damaged_or_expired_return_flashlight ;
  content.t_returned_salter= t_excess_return_salter + t_excess_to_return_salter  +t_damaged_or_expired_return_salter ;
  content.t_returned_color_salter= t_excess_return_color_salter + t_excess_to_return_color_salter  +t_damaged_or_expired_return_color_salter ;
  content.t_returned_weighing_scale= t_excess_return_weighing_scale + t_excess_to_return_weighing_scale  +t_damaged_or_expired_return_weighing_scale ;
  content.t_returned_first_aid= t_excess_return_first_aid + t_excess_to_return_first_aid  +t_damaged_or_expired_return_first_aid ;
  content.t_returned_bp= t_excess_return_bp + t_excess_to_return_bp  +t_damaged_or_expired_return_bp ;
  content.t_returned_thermometer= t_excess_return_thermometer + t_excess_to_return_thermometer  +t_damaged_or_expired_return_thermometer ;
  content.t_returned_resp_timer= t_excess_return_resp_timer + t_excess_to_return_resp_timer  +t_damaged_or_expired_return_resp_timer ;
  content.t_returned_muac_tape_adults= t_excess_return_muac_tape_adults + t_excess_to_return_muac_tape_adults  +t_damaged_or_expired_return_muac_tape_adults ;
  content.t_returned_muac_tape_children= t_excess_return_muac_tape_children + t_excess_to_return_muac_tape_children  +t_damaged_or_expired_return_muac_tape_children ;
  content.t_returned_family_muac_tape= t_excess_return_family_muac_tape + t_excess_to_return_family_muac_tape  +t_damaged_or_expired_return_family_muac_tape ;
  content.t_returned_moh_514= t_excess_return_moh_514 + t_excess_to_return_moh_514  +t_damaged_or_expired_return_moh_514 ;
  content.t_returned_moh_521= t_excess_return_moh_521 + t_excess_to_return_moh_521  +t_damaged_or_expired_return_moh_521 ;
  content.t_returned_moh_100= t_excess_return_moh_100 + t_excess_to_return_moh_100  +t_damaged_or_expired_return_moh_100 ;
  content.t_returned_comm_daily_register= t_excess_return_comm_daily_register + t_excess_to_return_comm_daily_register  +t_damaged_or_expired_return_comm_daily_register ;
  content.t_returned_phone= t_excess_return_phone + t_excess_to_return_phone  +t_damaged_or_expired_return_phone ;
  content.t_returned_safety_box= t_excess_return_safety_box + t_excess_to_return_safety_box  +t_damaged_or_expired_return_safety_box ;
  content.t_returned_others= t_excess_return_others + t_excess_to_return_others  +t_damaged_or_expired_return_others ;

  content.t_returned_reason_rdts = getField(report , 's_malaria.rdts_reason_return') ;
  content.t_returned_reason_act_6 = getField(report , 's_malaria.act_6_reason_return') ;
  content.t_returned_reason_act_12 = getField(report , 's_malaria.act_12_reason_return') ;
  content.t_returned_reason_act_18 = getField(report , 's_malaria.act_18_reason_return') ;
  content.t_returned_reason_act_24 = getField(report , 's_malaria.act_24_reason_return') ;
  content.t_returned_reason_dt_250 = getField(report , 's_child_health.dt_250_reason_return') ;
  content.t_returned_reason_ors_zinc = getField(report , 's_child_health.ors_zinc_reason_return') ;
  content.t_returned_reason_ors_sachets = getField(report , 's_child_health.ors_sachets_reason_return') ;
  content.t_returned_reason_zinc_sulphate = getField(report , 's_child_health.zinc_sulphate_reason_return') ;
  content.t_returned_reason_albendazole = getField(report , 's_child_health.albendazole_reason_return') ;
  content.t_returned_reason_tetra_eye = getField(report , 's_child_health.tetra_eye_reason_return') ;
  content.t_returned_reason_paracetamol_120 = getField(report , 's_child_health.paracetamol_120_reason_return') ;
  content.t_returned_reason_mebendazole = getField(report , 's_reproductive.mebendazole_reason_return') ;
  content.t_returned_reason_coc = getField(report , 's_reproductive.coc_reason_return') ;
  content.t_returned_reason_prog = getField(report , 's_reproductive.prog_reason_return') ;
  content.t_returned_reason_depo_im = getField(report , 's_reproductive.depo_im_reason_return') ;
  content.t_returned_reason_depo_sc = getField(report , 's_reproductive.depo_sc_reason_return') ;
  content.t_returned_reason_preg_strip = getField(report , 's_reproductive.preg_strip_reason_return') ;
  content.t_returned_reason_chlorine = getField(report , 's_wash.chlorine_reason_return') ;
  content.t_returned_reason_gluc_strips	 = getField(report , 's_ncds.gluc_strips_reason_return') ;
  content.t_returned_reason_paracetamol_500 = getField(report , 's_others.paracetamol_500_reason_return') ;
  content.t_returned_reason_bandages = getField(report , 's_non_pharma.bandages_reason_return') ;
  content.t_returned_reason_povi = getField(report , 's_non_pharma.povi_reason_return') ;
  content.t_returned_reason_strap = getField(report , 's_non_pharma.strap_reason_return') ;
  content.t_returned_reason_gloves = getField(report , 's_non_pharma.gloves_reason_return') ;
  content.t_returned_reason_envelopes = getField(report , 's_non_pharma.envelopes_reason_return') ;
  content.t_returned_reason_glucometer = getField(report , 's_equipment.glucometer_reason_return') ;
  content.t_returned_reason_backpack = getField(report , 's_equipment.backpack_reason_return') ;
  content.t_returned_reason_badge = getField(report , 's_equipment.badge_reason_return') ;
  content.t_returned_reason_flashlight = getField(report , 's_equipment.flashlight_reason_return') ;
  content.t_returned_reason_salter = getField(report , 's_equipment.salter_reason_return') ;
  content.t_returned_reason_color_salter = getField(report , 's_equipment.color_salter_reason_return') ;
  content.t_returned_reason_weighing_scale = getField(report , 's_equipment.weighing_scale_reason_return') ;
  content.t_returned_reason_first_aid = getField(report , 's_equipment.first_aid_reason_return') ;
  content.t_returned_reason_bp = getField(report , 's_equipment.bp_reason_return') ;
  content.t_returned_reason_thermometer = getField(report , 's_equipment.thermometer_reason_return') ;
  content.t_returned_reason_resp_timer = getField(report , 's_equipment.resp_timer_reason_return') ;
  content.t_returned_reason_muac_tape_adults = getField(report , 's_equipment.muac_tape_adults_reason_return') ;
  content.t_returned_reason_muac_tape_children = getField(report , 's_equipment.muac_tape_children_reason_return') ;
  content.t_returned_reason_family_muac_tape = getField(report , 's_equipment.family_muac_tape_reason_return') ;
  content.t_returned_reason_moh_514 = getField(report , 's_equipment.moh_514_reason_return') ;
  content.t_returned_reason_moh_521 = getField(report , 's_equipment.moh_521_reason_return') ;
  content.t_returned_reason_moh_100 = getField(report , 's_equipment.moh_100_reason_return') ;
  content.t_returned_reason_comm_daily_register = getField(report , 's_equipment.comm_daily_register_reason_return') ;
  content.t_returned_reason_phone = getField(report , 's_equipment.phone_reason_return') ;
  content.t_returned_reason_safety_box = getField(report , 's_equipment.safety_box_reason_return') ;
  content.t_returned_reason_others = getField(report , 's_equipment.others_reason_return') ;

  return content;

};
const hasStockOut = (report) => {
  if(report.form === shared.Services.COMMODITES_COUNT)
  {
    return productList.some((currentItem) => {
    // Get the group name and field name for the current product
      const fieldName = `wos_${currentItem}`;
      // Get the value of the received field for the current product in the current report
      const fieldValue = getFieldValue(report, fieldName, false);
      // Check if the received field value is 'no' (indicating a discrepancy)
      return fieldValue <= stockTreshold;
    });
   
  }
  return false;
};

const hasDiscrepancy = (report) => {
  if(report.form === shared.Services.COMMODITES_RECEIVED)
  {
    return productList.some((currentItem) => {
    // Get the group name and field name for the current product
      const groupName = getProductGroup(currentItem, productDetailsList);
      const fieldName = `${groupName}.${currentItem}_received`;
      // Get the value of the received field for the current product in the current report
      const fieldValue = getFieldValue(report, fieldName, false);
      // Check if the received field value is 'no' (indicating a discrepancy)
      return fieldValue !== undefined && fieldValue === 'no';
    });
   
  }
  return false;
};

const getFieldValue = (report, fieldName,intOnly =true)=> {
  const fieldValue = Utils.getField(report, fieldName);
  const value = parseFloat(fieldValue);
  if(intOnly === true)
  {
    if (!Number.isNaN(value) && fieldValue !== undefined) {
      return value;
    }
    return 0;
  }
  else {return fieldValue;}
};

/**
 * Get the group which a commodity is defined under in the workflow.
 * @param {string} productName - The commodity name.
 * @returns The group which commodity is defined under in the workflow.
 */
const getProductGroup = (productName) => {
  const productDetail = productDetailsList[productName];
  const productSection = productDetail ? productDetail.section : null;
  return productSection ? `s_${productSection}` : 's_';
};
module.exports = {
  suppliedContent,
  discrepancyContent,
  returnedContent,
  hasDiscrepancy,
  hasStockOut,
  stockOutContent
}; 
