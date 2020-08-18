const dreadedDuo = [
    [
        // Section 1 - Right Hand
        ['EFB', 'URP'],   // 1
        ['UFB', 'ERP'],   // 2
        ['EPG', 'UBL'],   // 3
        ['UPG', 'EBL'],   // 4
        ['UPG', 'EBLS'],  // 5
        ['EBL', 'UGT'],   // 6
        ['UBL', 'BGT'],   // 7
    ],
    [
        // Section 2 - Left Hand
        ['PRO', 'WHA'],  // 1
        ['PRA', 'WHO'],  // 2
        ['TWO', 'KPO'],  // 3
        ['TWA', 'KPA'],  // 4
        ['TWO', 'KPA'],  // 5
        ['TWA', 'KPO'],  // 6
        ['PRO', 'WHO'],  // 7
        ['PRA', 'WHA'],  // 8
    ],
    [
        // Section 3  - Right Hand
        ['UG', 'ELS'],     // 1
        ['EG', 'ULS'],     // 2
        ['EL', 'USH'],     // 3
        ['UL', 'ESH'],     // 4
        ['ELS', 'UND'],    // 5
        ['ULS', 'END'],    // 6
        ['UF', 'ESHD'],    // 7
        ['EF', 'USHD'],    // 8
        ['UF', 'EPD'],     // 9
        ['EF', 'UPD'],     // 10
        ['ULS', 'ECH'],    // 11
        ['ELS', 'UCH'],    // 12
        ['UK', 'EPD'],     // 13
        ['URPD', 'EFGS'],  // 14
        ['ERPD', 'UFGS'],  // 15
        ['UND', 'ELS'],    // 16
        ['END', 'ULS'],    // 17
        ['ED', 'UCHD'],    // 18
        ['UN', 'ECH'],     // 19
        ['URLS', 'ESHD'],  // 20
        ['ERLS', 'USHD'],  // 21
        ['UFGS', 'END'],   // 22
        ['EFGS', 'UND'],   // 23
        ['UFS', 'EPD'],    // 24
    ],
    [
        // Section 4 - Left Hand
        ['STPHA', 'SPWO'],  // 1
        ['STPHO', 'SPWA'],  // 2
        ['JO', 'SPWA'],     // 3
        ['JA', 'SPWO'],     // 4
        ['JA', 'SPWO'],     // 5
        ['DWRA', 'KBLO'],   // 5
        ['THO', 'SPWRA'],   // 6
        ['THA', 'SPWRO'],   // 7
        ['TWRO', 'SPWA'],   // 8
        ['SPWO', 'TWRA'],   // 9
        ['TWRO', 'KBLA'],   // 10
    ],
    [
        // Section 5  - Right Hand
        ['URJ', 'EBS'],  // 1
        ['URT', 'ELS'],  // 2
        ['URS', 'ELS'],  // 3
        ['ULS', 'ELT'],  // 4
        ['UPT', 'ELD'],  // 5
        ['ULD', 'EPT'],  // 6
        ['EPS', 'UPD'],  // 7
        ['UPG', 'ENT'],  // 8
        ['EGS', 'UND'],  // 9
        ['URGS', 'UFD'],  // 10
        ['URS', 'ECH'],  // 11
        ['ERS', 'UCH'],  // 12
        ['URLS', 'ECHD'],  // 13
        ['ERLS', 'UCHD'],  // 14
        ['UPG', 'END'],  // 15
        ['UPGS', 'ENDS'],  // 16
        ['EPG', 'UNT'],  // 17
        ['URGS', 'UFD'],  // 18
    ],
    [
        // Section 6
        ['TWRO', 'KPLA'],  // 1
        ['TWRA', 'RPLO'],  // 2
        ['STPHO', 'KPLA'],  // 3
        ['STPHA', 'KPLO'],  // 4
        ['KPA', 'TWRO'],  // 5
        ['KPO', 'TWRA'],  // 6
        ['JO', 'KPLA'],  // 7
        ['JA', 'KPLO'],  // 8
    ],
    [
        // Section 7
        ['EKT', 'UFTS'],  // 1
        ['UKT', 'EFTS'],  // 2
        ['EKT', 'UFDS'],  // 3
        ['UKT', 'EFDS'],  // 4
        ['UKT', 'IFTS'],  // 5
        ['IKT', 'UFTS'],  // 6
        ['EKD', 'INLS'],  // 7
        ['UND', 'IFTS'],  // 8
        ['IND', 'UFTS'],  // 9
        ['EKT', 'UFDS'],  // 10
    ],
    [
        // Section 8
        ['PLA', 'DWO'],  // 1
        ['PLO', 'DWA'],  // 2
        ['PRA', 'SWO'],  // 3
        ['PRO', 'SWA'],  // 4
        ['BLO', 'SHA'],  // 5
        ['BLA', 'SHO'],  // 6
        ['SNA', 'BRA'],  // 7
        ['SNO', 'BRA'],  // 8
        ['SWA', 'THO'],  // 9
        ['SWO', 'THA'],  // 10
        ['DRA', 'TWO'],  // 11
        ['DRO', 'TWA'],  // 12
        ['THRO', 'KPA'],  // 13
        ['TRO', 'SWA'],  // 14
        ['TRA', 'SWO'],  // 15
        ['STRO', 'KLA'],  // 16
        ['SRA', 'KLO'],  // 17
        ['KRA', 'SMO'],  // 18
        ['KRO', 'SMA'],  // 19
        ['VA', 'GLO'],  // 20
        ['VO', 'GLA'],  // 21
        ['STA', 'KPO'],  // 22
        ['STO', 'KPA'],  // 23
        ['SPA', 'DO'],  // 24
    ],
    [
        // Section 9
        ['IGT', 'ILS'],  // 1
        ['IGT', 'ULS'],  // 2
        ['UGT', 'ULS'],  // 3
        ['EGT', 'ULS'],  // 4
        ['UGT', 'ILS'],  // 5
        ['EGT', 'ILS'],  // 6
    ],
    [
        // Section 10
        ['JA', 'FLA'],  // 1
        ['JA', 'FLO'],  // 2
        ['SHAO', 'DO'],  // 3
        ['STO', 'SKA'],  // 4
        ['STA', 'SKO'],  // 5
        ['SHO', 'DAO'],  // 6
    ],
    [
        // Section 11
        ['EFMDZ', 'EFMZ'],  // 1
        ['EKT', 'EKS'],  // 2
        ['EKTS', 'ERS'],  // 3
        ['EFPTS', 'EFPS'],  // 4
        ['EFPD', 'EFPZ'],  // 5
        ['EFPDZ', 'EFPZ'],  // 6
        ['EFMD', 'EFMZ'],  // 7
        ['EKTS', 'EKS'],  // 8
        ['EKT', 'EKTS'],  // 9
        ['EFPT', 'EFPS'],  // 10
        ['EFPDZ', 'EFPD'],  // 11
        ['EFMDZ', 'EFMD'],  // 12
    ],
    [
        // Section 12
        ['KHA', 'DWO'],  // 1
        ['KHO', 'DWA'],  // 2
        ['SMO', 'DWA'],  // 3
        ['SMA', 'DWO'],  // 4
        ['CHA', 'FWO'],  // 5
        ['KMO', 'STRA'],  // 6
        ['KMA', 'STRO'],  // 7
        ['JA', 'DPO'],  // 8
        ['JO', 'DPA'],  // 9
        ['KPO', 'FWA'],  // 10
    ],
    [
        // Section 13
        ['EKD', 'UFR'],  // 1
        ['UKD', 'EFR'],  // 2
        ['UND', 'IFR'],  // 3
        ['UBGS', 'IFL'],  // 4
        ['URT', 'EFL'],  // 6
        ['ERT', 'UFL'],  // 7
        ['URS', 'EFN'],  // 8
        ['UFN', 'ERS'],  // 9
        ['UM', 'EFD'],  // 10
        ['EFD', 'UNS'],  // 11
        ['ILT', 'EKD'],  // 12
        ['URG', 'EMS'],  // 13
        ['URG', 'EMT'],  // 14
        ['EMD', 'USH'],  // 15
        ['UFRT', 'EFLS'],  // 16
        ['UFLD', 'ENTS'],  // 17
        ['URPD', 'EFTS'],  // 18
        ['ULDS', 'ERPS'],  // 19
        ['UFT', 'ERDS'],  // 20
    ],
    [
        // Section 14
        ['FRO', 'SKA'],  // 1
        ['FRA', 'SKO'],  // 2
        ['PRO', 'SKHA'],  // 3
        ['FLA', 'SKWO'],  // 4
        ['FLO', 'SKWA'],  // 5
        ['SLA', 'KWO'],  // 6
        ['SLO', 'KWA'],  // 7
        ['THRA', 'KPO'],  // 8
        ['SPO', 'DA'],  // 9
        ['TWO', 'SKRA'],  // 10
        ['PRA', 'SKHO'],  // 11
        ['TWA', 'SKRO'],  // 12
        ['SPRA', 'KHO'],  // 13
        ['SPRA', 'KHA'],  // 14
        ['SPLA', 'DO'],  // 15
        ['SPLO', 'DA'],  // 16
    ],
    [
        // Section 15
        ['ERBGS', 'UFN'],  // 1
        ['URBGS', 'EFT'],  // 2
        ['UMTS', 'EFRB'],  // 3
        ['UFRB', 'EMTS'],  // 4
        ['ULS', 'EFRB'],  // 5
        ['UFRB', 'ELS'],  // 6
        ['EFD', 'UFN'],  // 7
        ['ERBGS', 'UFRP'],  // 8
        ['URBGS', 'EFRP'],  // 9
        ['UFPLT', 'ILS'],  // 10
        ['UFPLT', 'EFRB'],  // 11
        ['EFPLT', 'EFRB'],  // 12
        ['UFRB', 'BGT'],  // 13
        ['UFD', 'EFN'],  // 14
    ],
    [
        // Section 16
        ['TWRO', 'SPLA'],  // 1
        ['TWRS', 'SPLO'],  // 2
        ['TWRA', 'DMO'],  // 3
        ['TWRO', 'DMO'],  // 4
        ['JA', 'DMO'],  // 5
        ['JO', 'DMA'],  // 6
        ['SWRO', 'DMA'],  // 7
        ['SWRA', 'DMO'],  // 8
    ],
    [
        // Section 17
        ['EFD', 'URM'],  // 1
        ['UPT', 'ESH'],  // 2
        ['UFPLT', 'ERN'],  // 3
        ['UFGS', 'ERL'],  // 4
        ['UPT', 'EFG'],  // 5
        ['URL', 'EFPT'],  // 6
        ['URG', 'ENS'],  // 7
        ['URM', 'EBL'],  // 8
        ['UFT', 'EBD'],  // 9
        ['UFT', 'ERK'],  // 10
        ['URTS', 'INDS'],  // 11
        ['UMTS', 'ISHD'],  // 12
        ['ET', 'ULS'],  // 13
        ['EL', 'UFD'],  // 14
        ['UL', 'EFT'],  // 15
        ['UFS', 'ERPD'],  // 16
        ['URNS', 'ERLD'],  // 17
        ['EPG', 'UNT'],  // 18
        ['UR', 'EFS'],  // 19
        ['UF', 'ERS'],  // 20
    ],
    [
        // Section 18
        ['STKPO', 'THA'],  // 1
        ['STKPA', 'THO'],  // 2
        ['SHA', 'GRO'],  // 3
        ['JA', 'STKPO'],  // 4
        ['JO', 'STKPA'],  // 5
        ['PRO', 'STKA'],  // 6
        ['PRA', 'STKO'],  // 7
        ['SHO', 'GRA'],  // 8
        ['THA', 'SWRO'],  // 9
        ['THO', 'SWRA'],  // 10
        ['TWRO', 'STKPA'],  // 11
        ['TWRA', 'STKPO'],  // 12
        ['MO', 'STKA'],  // 13
        ['MA', 'STKO'],  // 14
    ],
    [
        // Section 19
        ['EFRPS', 'ERBTS'],  // 1
        ['EFRPS', 'ERBDZ'],  // 2
        ['IFRP', 'ISHD'],  // 3
        ['EFRPS', 'ERBT'],  // 4
        ['EFRPS', 'URBT'],  // 5
        ['IFRP', 'ISHT'],  // 6
        ['EFRPS', 'URBTS'],  // 7
        ['IFRP', 'USHT'],  // 8
        ['UFRPS', 'ERBTS'],  // 9
        ['UFRPS', 'ERBT'],  // 10
        ['EFRPS', 'EBLTS'],  // 11
        ['UFD', 'ENG'],  // 12
        ['UGT', 'EFRPS'],  // 13
        ['UFT', 'ENG'],  // 14
        ['EFD', 'UNG'],  // 15
        ['EFT', 'UNG'],  // 16
        ['IGT', 'UFRP'],  // 17
        ['UFRPS', 'EKTS'],  // 18
        ['UFRPS', 'EGT'],  // 19
        ['UFRPS', 'EBLTS'],  // 20
        ['EFRPS', 'UBLTS'],  // 21
        ['EFRPS', 'UKTS'],  // 22
    ],
    [
        // Section 20
        ['TWRO', 'DMA'],  // 1
        ['TWRA', 'DMO'],  // 2
        ['DMO', 'PRA'],  // 3
        ['DMA', 'PRO'],  // 4
        ['DPO', 'WHO'],  // 5
        ['DPA', 'WHO'],  // 6
        ['SWRO', 'DPA'],  // 7
        ['SWRA', 'DPO'],  // 8
    ],
    [
        // Section 21
        ['EKT', 'ENS'],  // 1
        ['UKT', 'ENS'],  // 2
        ['UMZ', 'EKD'],  // 3
        ['UKD', 'EMZ'],  // 4
        ['EKT', 'UMS'],  // 5
        ['EFS', 'UNT'],  // 6
        ['ENT', 'UPS'],  // 7
        ['UFG', 'INTS'],  // 8
        ['UFG', 'END'],  // 9
        ['UFS', 'ENT'],  // 10
        ['UNT', 'EPS'],  // 11
        ['EFD', 'INT'],  // 12
        ['EFGS', 'UND'],  // 13
        ['EFZ', 'ENT'],  // 14
        ['EFG', 'UNT'],  // 15
        ['EFD', 'UNT'],  // 16
        ['UFGS', 'ENDZ'],  // 17
        ['EFZ', 'UNT'],  // 18
        ['UFG', 'ENT'],  // 19
        ['UFD', 'INT'],  // 20
        ['UFZ', 'ENT'],  // 21
        ['UFZ', 'ENT'],  // 22
        ['EPG', 'INTS'],  // 23
        ['EFG', 'UND'],  // 24
    ],
    [
        // Section 22
        ['THO', 'KHO'],  // 1
        ['THO', 'DHO'],  // 2
        ['DHO', 'KHO'],  // 3
        ['SHAO', 'DA'],  // 4
        ['SKRO', 'FLA'],  // 5
        ['SHA', 'DAO'],  // 6
        ['SKRA', 'DLO'],  // 7
        ['THO', 'KHA'],  // 8
        ['KHO', 'SHA'],  // 9
        ['SMO', 'SHA'],  // 10
        ['SHO', 'KHA'],  // 11
        ['KHR', 'SPRO'],  // 12
        ['SHO', 'SPRA'],  // 13
        ['KMA', 'SHO'],  // 14
    ],
    [
        // Section 23
        ['URD', 'EMGS'],  // 1
        ['URBGS', 'ENGS'],  // 2
        ['EKT', 'UMGS'],  // 3
        ['EFG', 'UNLS'],  // 4
        ['UFPLT', 'ERBTS'],  // 5
        ['UFG', 'ENL'],  // 6
        ['EPG', 'ENLS'],  // 7
        ['ERD', 'UMGS'],  // 8
        ['ERBGS', 'UMGS'],  // 9
        ['URPS', 'ERBD'],  // 10
        ['UFS', 'ENL'],  // 11
        ['UFG', 'INLS'],  // 12
        ['URBTS', 'EFPLT'],  // 13
        ['EFG', 'UNL'],  // 14
    ],
    [
        // Section 24
        ['TRO', 'SPWA'],  // 1
        ['TRA', 'SPWO'],  // 2
        ['DPRO', 'SPWA'],  // 3
        ['KPRA', 'SPWO'],  // 4
        ['STRA', 'SPWO'],  // 5
        ['STRO', 'SPWA'],  // 6
        ['THA', 'SPWO'],  // 7
        ['THA', 'SPWA'],  // 8
    ],
    [
        // Section 25
        ['UBLS', 'ERNT'],  // 1
        ['URLS', 'EBLD'],  // 2
        ['EFPLT', 'URGS'],  // 3
        ['ILTS', 'ERKS'],  // 4
        ['UFS', 'EJD'],  // 5
        ['UG', 'ELD'],  // 6
        ['EG', 'ULD'],  // 7
        ['EPGS', 'UNDS'],  // 8
        ['UNDS', 'EMS'],  // 9
        ['EMD', 'URMS'],  // 10
        ['EPS', 'UJD'],  // 11
        ['UM', 'EPS'],  // 12
        ['EM', 'UPS'],  // 13
        ['EK', 'UPS'],  // 14
    ],
    [
        // Section 26
        ['TWRO', 'KPWA'],  // 1
        ['TWRA', 'KPWO'],  // 2
        ['STPHA', 'KPWO'],  // 3
        ['STPHO', 'KPWA'],  // 4
        ['JO', 'KPWA'],  // 5
        ['JA', 'KPWO'],  // 6
    ],
    [
        // Section 27
        ['ERBGS', 'EFT'],   // 1
        ['ERBGS', 'EFD'],   // 2
        ['URBGS', 'EFT'],   // 3
        ['ERBGS', 'UFT'],   // 4
        ['URBGS', 'EFD'],   // 5
        ['EFPT', 'UBLS'],   // 6
        ['EFPLD', 'UFRB'],  // 7
        ['UFPLD', 'EFRB'],  // 8
        ['EFPLT', 'URS'],   // 9
        ['UFPLT', 'ERS'],   // 10
        ['EFPLT', 'ERS'],   // 11
        ['UFPLT', 'URS'],   // 12
        ['EFPLD', 'URS'],   // 13
        ['UFPT', 'EBLS'],   // 14
        ['EFLD', 'EFRBS'],  // 15
        ['UFLD', 'UFRBS']   // 16
    ]
]
