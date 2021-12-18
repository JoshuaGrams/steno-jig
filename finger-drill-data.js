const dreadedDuo = [
    [
        // Section 1 - Right Hand
        'EFB/URP',   // 1
        'UFB/ERP',   // 2
        'EPG/UBL',   // 3
        'UPG/EBL',   // 4
        'UPG/EBLS',  // 5
        'UBLS/EPG',  // 6
        'EBL/UGT',   // 7
        'UBL/-BGT',  // 8
    ],
    [
        // Section 2 - Left Hand
        'PRO/WHA',  // 1
        'PRA/WHO',  // 2
        'TWO/KPO',  // 3
        'TWA/KPA',  // 4
        'TWO/KPA',  // 5
        'TWA/KPO',  // 6
        'PRO/WHO',  // 7
        'PRA/WHA',  // 8
    ],
    [
        // Section 3  - Right Hand
        'UG/ELS',     // 1
        'EG/ULS',     // 2
        'EL/URB',     // 3
        'UL/ERB',     // 4
        'ELS/UPBD',    // 5
        'ULS/EPBD',    // 6
        'UF/ERBD',    // 7
        'EF/URBD',    // 8
        'UF/EPD',     // 9
        'EF/UPD',     // 10
        'ULS/EFP',    // 11
        'ELS/UFP',    // 12
        'UBG/EPD',     // 13
        'URPD/EFGS',  // 14
        'ERPD/UFGS',  // 15
        'UPBD/ELS',    // 16
        'EPBD/ULS',    // 17
        'ED/UFPD',    // 18
        'UPB/EFP',     // 19
        'URLS/ERBD',  // 20
        'ERLS/URBD',  // 21
        'UFGS/EPBD',   // 22
        'EFGS/UPBD',   // 23
        'UFS/EPD',    // 24
    ],
    [
        // Section 4 - Left Hand
        'STPHA/SPWO',  // 1
        'STPHO/SPWA',  // 2
        'SKWRO/SPWA',     // 3
        'SKWRA/SPWO',     // 4
        'TKWRA/KPWHRO',   // 5
        'THO/SPWRA',   // 6
        'THA/SPWRO',   // 7
        'TWRO/SPWA',   // 8
        'SPWO/TWRA',   // 9
        'TWRO/KPWHRA',   // 10
    ],
    [
        // Section 5  - Right Hand
        'URPBLG/EBS',  // 1
        'URT/ELS',  // 2
        'URS/ELS',  // 3
        'ULS/ELT',  // 4
        'UPT/ELD',  // 5
        'ULD/EPT',  // 6
        'EPS/UPD',  // 7
        'UPG/EPBT',  // 8
        'EGS/UPBD',  // 9
        'URGS/UFD',  // 10
        'URS/EFP',  // 11
        'ERS/UFP',  // 12
        'URLS/EFPD',  // 13
        'ERLS/UFPD',  // 14
        'UPG/EPBD',  // 15
        'UPGS/EPBDZ',  // 16
        'EPG/UPBT',  // 17
        'URGS/UFD',  // 18
    ],
    [
        // Section 6
        'TWRO/KPHRA',  // 1
        'TWRA/KPHRO',  // 2
        'STPHO/KPHRA',  // 3
        'STPHA/KPHRO',  // 4
        'KPA/TWRO',  // 5
        'KPO/TWRA',  // 6
        'SKWRO/KPHRA',  // 7
        'SKWRA/KPHRO',  // 8
    ],
    [
        // Section 7
        'EBGT/UFTS',  // 1
        'UBGT/EFTS',  // 2
        'EBGT/UFDZ',  // 3
        'UBGT/EFDZ',  // 4
        'UBGT/EUFTS',  // 5
        'EUBGT/UFTS',  // 6
        'EBGD/EUPBLS',  // 7
        'UPBD/EUFTS',  // 8
        'EUPBD/UFTS',  // 9
        'EBGT/UFDZ',  // 10
    ],
    [
        // Section 8
        'PHRA/TKWO',  // 1
        'PHRO/TKWA',  // 2
        'PRA/SWO',  // 3
        'PRO/SWA',  // 4
        'PWHRO/SHA',  // 5
        'PWHRA/SHO',  // 6
        'STPHA/PWRA',  // 7
        'STPHO/PWRA',  // 8
        'SWA/THO',  // 9
        'SWO/THA',  // 10
        'TKRA/TWO',  // 11
        'TKRO/TWA',  // 12
        'THRO/KPA',  // 13
        'TRO/SWA',  // 14
        'TRA/SWO',  // 15
        'STRO/KHRA',  // 16
        'SRA/KHRO',  // 17
        'KRA/SPHO',  // 18
        'KRO/SPHA',  // 19
        'SRA/TKPWHRO',  // 20
        'SRO/TKPWHRA',  // 21
        'STA/KPO',  // 22
        'STO/KPA',  // 23
        'SPA/TKO',  // 24
    ],
    [
        // Section 9
        'EUGT/EULS',  // 1
        'EUGT/ULS',  // 2
        'UGT/ULS',  // 3
        'EGT/ULS',  // 4
        'UGT/EULS',  // 5
        'EGT/EULS',  // 6
    ],
    [
        // Section 10
        'SKWRA/TPHRA',  // 1
        'SKWRA/TPHRO',  // 2
        'SHAO/TKO',  // 3
        'STO/SKA',  // 4
        'STA/SKO',  // 5
        'SHO/TKAO',  // 6
    ],
    [
        // Section 11
        'EFPLDZ/EFPLZ',  // 1
        'EBGT/EBGS',  // 2
        'EBGTS/ERS',  // 3
        'EFPTS/EFPS',  // 4
        'EFPD/EFPZ',  // 5
        'EFPDZ/EFPZ',  // 6
        'EFPLD/EFPLZ',  // 7
        'EBGTS/EBGS',  // 8
        'EBGT/EBGTS',  // 9
        'EFPT/EFPS',  // 10
        'EFPDZ/EFPD',  // 11
        'EFPLDZ/EFPLD',  // 12
    ],
    [
        // Section 12
        'KHA/TKWO',  // 1
        'KHO/TKWA',  // 2
        'SPHO/TKWA',  // 3
        'SPHA/TKWO',  // 4
        'KHA/TPWO',  // 5
        'KPHO/STRA',  // 6
        'KPHA/STRO',  // 7
        'SKWRA/TKPO',  // 8
        'SKWRO/TKPA',  // 9
        'KPO/TPWA',  // 10
    ],
    [
        // Section 13
        'EBGD/UFR',  // 1
        'UBGD/EFR',  // 2
        'UPBD/EUFR',  // 3
        'UBGS/EUFL',  // 4
        'URT/EFL',  // 6
        'ERT/UFL',  // 7
        'URS/EFPB',  // 8
        'UFPB/ERS',  // 9
        'UPL/EFD',  // 10
        'EFD/UPBS',  // 11
        'EULT/EBGD',  // 12
        'URG/EPLS',  // 13
        'URG/EPLT',  // 14
        'EPLD/URB',  // 15
        'UFRT/EFLS',  // 16
        'UFLD/EPBTS',  // 17
        'URPD/EFTS',  // 18
        'ULDZ/ERPS',  // 19
        'UFT/ERDZ',  // 20
    ],
    [
        // Section 14
        'TPRO/SKA',  // 1
        'TPRA/SKO',  // 2
        'PRO/SKHA',  // 3
        'TPHRA/SKWO',  // 4
        'TPHRO/SKWA',  // 5
        'SHRA/KWO',  // 6
        'SHRO/KWA',  // 7
        'THRA/KPO',  // 8
        'SPO/TKA',  // 9
        'TWO/SKRA',  // 10
        'PRA/SKHO',  // 11
        'TWA/SKRO',  // 12
        'SPRA/KHO',  // 13
        'SPRA/KHA',  // 14
        'SPHRA/TKO',  // 15
        'SPHRO/TKA',  // 16
    ],
    [
        // Section 15
        'ERBGS/UFPB',  // 1
        'URBGS/EFT',  // 2
        'UPLTS/EFRB',  // 3
        'UFRB/EPLTS',  // 4
        'ULS/EFRB',  // 5
        'UFRB/ELS',  // 6
        'EFD/UFPB',  // 7
        'ERBGS/UFRP',  // 8
        'URBGS/EFRP',  // 9
        'UFPLT/EULS',  // 10
        'UFPLT/EFRB',  // 11
        'EFPLT/EFRB',  // 12
        'UFRB/BGT',  // 13
        'UFD/EFPB',  // 14
    ],
    [
        // Section 16
        'TWRO/SPHRA',  // 1
        'TWRS/SPHRO',  // 2
        'TWRA/TKPHO',  // 3
        'TWRO/TKPHO',  // 4
        'SKWRA/TKPHO',  // 5
        'SKWRO/TKPHA',  // 6
        'SWRO/TKPHA',  // 7
        'SWRA/TKPHO',  // 8
    ],
    [
        // Section 17
        'EFD/URPL',  // 1
        'UPT/ERB',  // 2
        'UFPLT/ERPB',  // 3
        'UFGS/ERL',  // 4
        'UPT/EFG',  // 5
        'URL/EFPT',  // 6
        'URG/EPBS',  // 7
        'URPL/EBL',  // 8
        'UFT/EBD',  // 9
        'UFT/ERBG',  // 10
        'URTS/EUPBDZ',  // 11
        'UPLTS/EURBD',  // 12
        'ET/ULS',  // 13
        'EL/UFD',  // 14
        'UL/EFT',  // 15
        'UFS/ERPD',  // 16
        'URPBS/ERLD',  // 17
        'EPG/UPBT',  // 18
        'UR/EFS',  // 19
        'UF/ERS',  // 20
    ],
    [
        // Section 18
        'STKPO/THA',  // 1
        'STKPA/THO',  // 2
        'SHA/TKPWRO',  // 3
        'SKWRA/STKPO',  // 4
        'SKWRO/STKPA',  // 5
        'PRO/STKA',  // 6
        'PRA/STKO',  // 7
        'SHO/TKPWRA',  // 8
        'THA/SWRO',  // 9
        'THO/SWRA',  // 10
        'TWRO/STKPA',  // 11
        'TWRA/STKPO',  // 12
        'PHO/STKA',  // 13
        'PHA/STKO',  // 14
    ],
    [
        // Section 19
        'EFRPS/ERBTS',  // 1
        'EFRPS/ERBDZ',  // 2
        'EUFRP/EURBD',  // 3
        'EFRPS/ERBT',  // 4
        'EFRPS/URBT',  // 5
        'EUFRP/EURBT',  // 6
        'EFRPS/URBTS',  // 7
        'EUFRP/URBT',  // 8
        'UFRPS/ERBTS',  // 9
        'UFRPS/ERBT',  // 10
        'EFRPS/EBLTS',  // 11
        'UFD/EPBG',  // 12
        'UGT/EFRPS',  // 13
        'UFT/EPBG',  // 14
        'EFD/UPBG',  // 15
        'EFT/UPBG',  // 16
        'EUGT/UFRP',  // 17
        'UFRPS/EBGTS',  // 18
        'UFRPS/EGT',  // 19
        'UFRPS/EBLTS',  // 20
        'EFRPS/UBLTS',  // 21
        'EFRPS/UBGTS',  // 22
    ],
    [
        // Section 20
        'TWRO/TKPHA',  // 1
        'TWRA/TKPHO',  // 2
        'TKPHO/PRA',  // 3
        'TKPHA/PRO',  // 4
        'TKPO/WHO',  // 5
        'TKPA/WHO',  // 6
        'SWRO/TKPA',  // 7
        'SWRA/TKPO',  // 8
    ],
    [
        // Section 21
        'EBGT/EPBS',  // 1
        'UBGT/EPBS',  // 2
        'UPLZ/EBGD',  // 3
        'UBGD/EPLZ',  // 4
        'EBGT/UPLS',  // 5
        'EFS/UPBT',  // 6
        'EPBT/UPS',  // 7
        'UFG/EUPBTS',  // 8
        'UFG/EPBD',  // 9
        'UFS/EPBT',  // 10
        'UPBT/EPS',  // 11
        'EFD/EUPBT',  // 12
        'EFGS/UPBD',  // 13
        'EFZ/EPBT',  // 14
        'EFG/UPBT',  // 15
        'EFD/UPBT',  // 16
        'UFGS/EPBDZ',  // 17
        'EFZ/UPBT',  // 18
        'UFG/EPBT',  // 19
        'UFD/EUPBT',  // 20
        'UFZ/EPBT',  // 21
        'UFZ/EPBT',  // 22
        'EPG/EUPBTS',  // 23
        'EFG/UPBD',  // 24
    ],
    [
        // Section 22
        'THO/KHO',  // 1
        'THO/TKHO',  // 2
        'TKHO/KHO',  // 3
        'SHAO/TKA',  // 4
        'SKRO/TPHRA',  // 5
        'SHA/TKAO',  // 6
        'SKRA/TKHRO',  // 7
        'THO/KHA',  // 8
        'KHO/SHA',  // 9
        'SPHO/SHA',  // 10
        'SHO/KHA',  // 11
        'KHR/SPRO',  // 12
        'SHO/SPRA',  // 13
        'KPHA/SHO',  // 14
    ],
    [
        // Section 23
        'URD/EPLGS',  // 1
        'URBGS/EPBGS',  // 2
        'EBGT/UPLGS',  // 3
        'EFG/UPBLS',  // 4
        'UFPLT/ERBTS',  // 5
        'UFG/EPBL',  // 6
        'EPG/EPBLS',  // 7
        'ERD/UPLGS',  // 8
        'ERBGS/UPLGS',  // 9
        'URPS/ERBD',  // 10
        'UFS/EPBL',  // 11
        'UFG/EUPBLS',  // 12
        'URBTS/EFPLT',  // 13
        'EFG/UPBL',  // 14
    ],
    [
        // Section 24
        'TRO/SPWA',  // 1
        'TRA/SPWO',  // 2
        'TKPRO/SPWA',  // 3
        'KPRA/SPWO',  // 4
        'STRA/SPWO',  // 5
        'STRO/SPWA',  // 6
        'THA/SPWO',  // 7
        'THA/SPWA',  // 8
    ],
    [
        // Section 25
        'UBLS/ERPBT',  // 1
        'URLS/EBLD',  // 2
        'EFPLT/URGS',  // 3
        'EULTS/ERBGS',  // 4
        'UFS/EPBLGD',  // 5
        'UG/ELD',  // 6
        'EG/ULD',  // 7
        'EPGS/UPBDZ',  // 8
        'UPBDZ/EPLS',  // 9
        'EPLD/URPLS',  // 10
        'EPS/UPBLGD',  // 11
        'UPL/EPS',  // 12
        'EPL/UPS',  // 13
        'EBG/UPS',  // 14
    ],
    [
        // Section 26
        'TWRO/KPWA',  // 1
        'TWRA/KPWO',  // 2
        'STPHA/KPWO',  // 3
        'STPHO/KPWA',  // 4
        'SKWRO/KPWA',  // 5
        'SKWRA/KPWO',  // 6
    ],
    [
        // Section 27
        'ERBGS/EFT',   // 1
        'ERBGS/EFD',   // 2
        'URBGS/EFT',   // 3
        'ERBGS/UFT',   // 4
        'URBGS/EFD',   // 5
        'EFPT/UBLS',   // 6
        'EFPLD/UFRB',  // 7
        'UFPLD/EFRB',  // 8
        'EFPLT/URS',   // 9
        'UFPLT/ERS',   // 10
        'EFPLT/ERS',   // 11
        'UFPLT/URS',   // 12
        'EFPLD/URS',   // 13
        'UFPT/EBLS',   // 14
        'EFLD/EFRBS',  // 15
        'UFLD/UFRBS'   // 16
    ]
]

const SSanfordHeller = {
	"ring finger clearance": [
		'EFRPS/ERBTS',
		'EFRPS/ERBDZ',
		'EFRPS/ERBT',
		'EFRPS/URBD',
		'EFRPS/URBTS',
		'EUFRPS/EURBT',
		'UFRPS/ERBTS',
		'EUFRP/EURBT',
		'EFRPS/URBT',
		'UFRP/EURBT',
		'UFRPS/ERBT',
		'EUFRP/URBT'
	],
	"ring and middle finger clearance": [
		'ERBGS/EFT',
		'EFPLT/URS',
		'ERBGS/EFD',
		'UFPLT/ERS',
		'URBGS/EFT',
		'EFPLT/ERS',
		'ERBGS/UFT',
		'UFPLT/URS',
		'ERBGS/UFD',
		'EFPLD/URS',
		'URBGS/EFD',
		'UFPLD/ERS',
		'EFPT/UBLS',
		'UFPT/EBLS',
		'EFPLD/UFRB',
		'EFLD/EFRBS',
		'UFPLD/EFRB',
		'UFLD/UFRBS'
	]
}
