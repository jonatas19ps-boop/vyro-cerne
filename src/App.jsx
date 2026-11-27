import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  Megaphone,
  Scissors,
  Wallet,
  Users,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Download,
  Upload,
  Cloud,
  CloudOff,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

// ============================================================================
// DADOS REAIS CONSOLIDADOS - VYRO STUDIOS | SERIES 001: CERNE — FREQUÊNCIA MINERAL
// 4 Refs x 6 SKUs = 50 Peças | Teto Investimento: R$ 10.401,08 | Meta Fat.: R$ 12.715,00
// ============================================================================

const STORAGE_KEY = 'vyro_cerne_management_v9';
const CLOUD_CFG_KEY = 'vyro_cerne_supabase_cfg_v1';

const INITIAL_PIECES = [
  {
    id: 'VY-01',
    code: 'VY-01',
    group: 'Ref. 01 • Essential • Cinza Mescla (#A1A1A1)',
    name: 'Camiseta Boxy Cinza Mescla',
    mineral: 'Pedra-sabão (Cachoeira do Brumado)',
    accent: '#A1A1A1',
    sizes: { P: 1, M: 3, G: 3, GG: 1, TU: 0 }, // 8 un
    fabric: 'Moletinho Mescla 210 g/m² (115.04-mc1001) + Ribana 2X1 Mescla',
    fabricWeightKg: 6.45, // 6,0000 kg MOQ + 0,4500 kg ribana
    trims: 'Gola ribana estruturada, micro-bordado e etiqueta VYRO ESSENCE',
    productionTotalCost: 543.89,
    effectiveUnitCost: 47.89,
    salePrice: 189.9,
    stageIndex: 2,
    notes: 'MOQ de 6 kg gera sobra útil de 2,78 kg (R$ 146,12) para até 14 camisetas extras.'
  },
  {
    id: 'VY-02',
    code: 'VY-02',
    group: 'Ref. 01 • Fashion • Lavanda (#9993A3)',
    name: 'Camiseta Boxy Lavanda',
    mineral: 'Ametista (Montezuma)',
    accent: '#9993A3',
    sizes: { P: 1, M: 3, G: 3, GG: 1, TU: 0 }, // 8 un
    fabric: 'Moletinho Fine Lavanda 210 g/m² (105.05cl-rx1008) + Ribana 2X1 Lavanda',
    fabricWeightKg: 3.95, // 3,5000 kg + 0,4500 kg ribana
    trims: 'Ponto fashion da cartela, gola ribana, bordado e etiqueta VYRO',
    productionTotalCost: 433.62,
    effectiveUnitCost: 51.4,
    salePrice: 189.9,
    stageIndex: 3,
    notes: 'Malha lavanda e ribana já adquiridas.'
  },
  {
    id: 'VY-03',
    code: 'VY-03',
    group: 'Ref. 01 • Essential • Preto (#0D0D0D)',
    name: 'Camiseta Boxy Preta',
    mineral: 'Hematita e Turmalina Negra',
    accent: '#52525B',
    sizes: { P: 1, M: 3, G: 3, GG: 1, TU: 0 }, // 8 un (Subtotal Camisetas = 24 un)
    fabric: 'Moletinho Fine Preto 210 g/m² (105.05ft-pr1001) + Ribana 2X1 Preta',
    fabricWeightKg: 3.95, // 3,5000 kg + 0,4500 kg ribana
    trims: 'Zero ruído gráfico, ribana estruturada e etiqueta interna',
    productionTotalCost: 440.96,
    effectiveUnitCost: 52.74,
    salePrice: 189.9,
    stageIndex: 2,
    notes: 'Base neutra de peso visual da cápsula CERNE.'
  },
  {
    id: 'VY-04',
    code: 'VY-04',
    group: 'Ref. 02 • Core • Cinza Mescla + Bordado Lavanda',
    name: 'Jorts Baggy Cinza Mescla',
    mineral: 'Pedra-sabão & Ametista',
    accent: '#9993A3',
    sizes: { P: 2, M: 5, G: 5, GG: 0, TU: 0 }, // 12 un
    fabric: 'Moletom Stretch Mescla 200 g/m² (114.55-mc1001)',
    fabricWeightKg: 8.5,
    trims: 'Cós elástico 40mm + passantes + cordão 8mm, rebites, barra a fio e bordado Lavanda',
    productionTotalCost: 1068.33,
    effectiveUnitCost: 88.45,
    salePrice: 289.9,
    stageIndex: 1,
    notes: 'Abaixo do joelho, barra a fio controlada e bordado computadorizado Lavanda.'
  },
  {
    id: 'VY-05',
    code: 'VY-05',
    group: 'Ref. 03 • Core • Oliva (#454D32) + Forro Vinho',
    name: 'Moletom Zip Oversized Oliva c/ Forro Vinho',
    mineral: 'Epidoto e Titanita (Capelinha)',
    accent: '#5E6D55',
    sizes: { P: 2, M: 3, G: 3, GG: 0, TU: 0 }, // 8 un
    fabric: 'Moletom 3 Cabos Verde 350 g/m² + Stretch Fine Vinho 360 g/m² (forro capuz) + Ribana Verde',
    fabricWeightKg: 12.5, // 8,0000 kg + 2,4000 kg ribana + 2,1000 kg forro
    trims: 'Zíper duplo 70cm #5 (Coats Opti/SBS) dividindo bolso canguru, capuz forrado Vinho',
    productionTotalCost: 1232.54,
    effectiveUnitCost: 148.62,
    salePrice: 479.9,
    stageIndex: 1,
    notes: 'Peça âncora unificada (VY-05 + VY-06 conceito).'
  },
  {
    id: 'VY-06',
    code: 'VY-06',
    group: 'Ref. 04 • Core • Vinho do Porto (#480109)',
    name: 'Gorro / Touca c/ Forro Vinho',
    mineral: 'Granada Almandina (São Tiago)',
    accent: '#72293C',
    sizes: { P: 0, M: 0, G: 0, GG: 0, TU: 6 }, // 6 un TU (Total Geral = 50 un)
    fabric: 'Stretch Fine Vinho 360 g/m² (104.03es-vm1003)',
    fabricWeightKg: 1.4, // parte dos 3,5000 kg compartilhados com forro do VY-05
    trims: 'Corpo e forro no mesmo tecido do capuz do VY-05, gomos e micro-logo off-white',
    productionTotalCost: 298.73,
    effectiveUnitCost: 48.5,
    salePrice: 139.9,
    stageIndex: 2,
    notes: '6 unidades Tamanho Único (TU), fechando exatamente o lote de 50 peças.'
  }
];

const PRODUCTION_STAGES = [
  'Ficha Técnica',
  'Compra Matéria-Prima',
  'Pilotagem',
  'Corte & Costura',
  'Bordado / Acabamento',
  'Controle Qualidade & Tag'
];

// ============================================================================
// CHECKLIST DESMEMBRADO ITEM POR ITEM (EXATAMENTE CONFORME DOCUMENTO CERNE)
// Malhas/Ribanas: R$ 2.189,14 | Facção: R$ 1.102,00 | Aviam./Bord.: R$ 726,93
// Campanha Set/Foto: R$ 3.705,00 | Eng./Log./Site: R$ 1.478,00 | Ads: R$ 1.200,00
// TOTAL GERAL ORÇADO: R$ 10.401,08
// ============================================================================
const INITIAL_CHECKLIST = [
  // --- 1. MALHAS (6 ITENS INDIVIDUAIS) ---
  {
    id: 'malha-1',
    name: 'Moletinho Fine Lavanda (Ref: 105.05cl-rx1008)',
    category: 'Tecidos',
    scope: 'VY-02 (Boxy Lavanda • 8 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '3,5000 kg',
    boughtQty: '3,0000 kg',
    amount: 203.46,
    paid: true,
    dueDate: '2026-11-20',
    notes: 'Rend. 2,50 m/kg · R$ 58,13/kg · Compra já realizada.'
  },
  {
    id: 'malha-2',
    name: 'Moletom 3 Cabos Verde Oliva (Ref: 103.06es-vd1003)',
    category: 'Tecidos',
    scope: 'VY-05 (Moletom Zip • 8 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '8,0000 kg',
    boughtQty: '0,0000 kg',
    amount: 449.2,
    paid: false,
    dueDate: '2027-02-10',
    notes: 'Rend. 1,60 m/kg · Nec. corte: 7,62 kg · Preço: R$ 56,15/kg.'
  },
  {
    id: 'malha-3',
    name: 'Stretch Fine Vinho (Ref: 104.03es-vm1003)',
    category: 'Tecidos',
    scope: 'Forro VY-05 + VY-06 Gorro (14 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '3,5000 kg',
    boughtQty: '0,0000 kg',
    amount: 251.37,
    paid: false,
    dueDate: '2027-02-10',
    notes: 'Rend. 1,63 m/kg · Nec. corte: 3,33 kg · Preço: R$ 71,82/kg.'
  },
  {
    id: 'malha-4',
    name: 'Moletinho Fine Preto (Ref: 105.05ft-pr1001)',
    category: 'Tecidos',
    scope: 'VY-03 (Boxy Preta • 8 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '3,5000 kg',
    boughtQty: '0,0000 kg',
    amount: 210.21,
    paid: false,
    dueDate: '2027-01-15',
    notes: 'Rend. 2,50 m/kg · Nec. corte: 3,35 kg · Preço: R$ 60,06/kg.'
  },
  {
    id: 'malha-5',
    name: 'Moletinho Mescla MOQ 6kg (Ref: 115.04-mc1001)',
    category: 'Tecidos',
    scope: 'VY-01 (Boxy Cinza • 8 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '6,0000 kg',
    boughtQty: '0,0000 kg',
    amount: 315.36,
    paid: false,
    dueDate: '2027-01-15',
    notes: 'Rend. 2,60 m/kg · Nec. corte: 3,22 kg · Preço: R$ 52,56/kg (sobra 2,78 kg útil).'
  },
  {
    id: 'malha-6',
    name: 'Moletom Stretch Mescla (Ref: 114.55-mc1001)',
    category: 'Tecidos',
    scope: 'VY-04 (Jorts Baggy • 12 un)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '8,5000 kg',
    boughtQty: '0,0000 kg',
    amount: 523.51,
    paid: false,
    dueDate: '2027-02-15',
    notes: 'Rend. 1,70 m/kg · Nec. corte: 8,39 kg · Preço: R$ 61,59/kg.'
  },

  // --- 2. RIBANAS (4 ITENS INDIVIDUAIS — SEM RIBANA VINHO) ---
  {
    id: 'ribana-1',
    name: 'Ribana 2X1 Lavanda (Ref: 102.64cl-rx1008)',
    category: 'Ribanas',
    scope: 'VY-02 (Gola Boxy Lavanda)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '0,4500 kg',
    boughtQty: '0,4500 kg',
    amount: 28.87,
    paid: true,
    dueDate: '2026-11-20',
    notes: 'Rend. 3,09 m/kg · R$ 64,16/kg · Compra já realizada.'
  },
  {
    id: 'ribana-2',
    name: 'Ribana 2X1 Verde Oliva (Ref: 122.06es-vd1003)',
    category: 'Ribanas',
    scope: 'VY-05 (Punho/Barra Moletom)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '2,4000 kg',
    boughtQty: '0,0000 kg',
    amount: 150.46,
    paid: false,
    dueDate: '2027-02-10',
    notes: 'Rend. 1,22 m/kg · Nec. corte: 2,12 kg · Preço: R$ 62,69/kg.'
  },
  {
    id: 'ribana-3',
    name: 'Ribana 2X1 Preta (Ref: 120.05ft-pr1001)',
    category: 'Ribanas',
    scope: 'VY-03 (Gola Boxy Preta)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '0,4500 kg',
    boughtQty: '0,0000 kg',
    amount: 29.46,
    paid: false,
    dueDate: '2027-01-15',
    notes: 'Rend. 2,47 m/kg · Nec. corte: 0,30 kg · Preço: R$ 65,47/kg.'
  },
  {
    id: 'ribana-4',
    name: 'Ribana 2X1 Mescla (Ref: 102.41-mc1001)',
    category: 'Ribanas',
    scope: 'VY-01 (Gola Boxy Cinza)',
    supplier: 'Fornecedor Malhas BH',
    targetQty: '0,4500 kg',
    boughtQty: '0,0000 kg',
    amount: 27.24,
    paid: false,
    dueDate: '2027-01-15',
    notes: 'Rend. 3,53 m/kg · Nec. corte: 0,21 kg · Preço: R$ 60,53/kg.'
  },

  // --- 3. AVIAMENTOS & BORDADOS (7 ITENS INDIVIDUAIS = R$ 726,93) ---
  {
    id: 'aviam-1',
    name: 'Zíper Duplo 70 cm #5 (Coats Opti ou SBS — alt. YKK)',
    category: 'Aviamentos',
    scope: 'VY-05 (Moletom Zip • 8 un)',
    supplier: 'Aviamentos BH',
    targetQty: '8 un (~R$ 15,00)',
    boughtQty: '0 un',
    amount: 120.0,
    paid: false,
    dueDate: '2027-02-25',
    notes: 'Zíper duplo frontal dividindo bolso canguru.'
  },
  {
    id: 'aviam-2',
    name: 'Rebites Metálicos Niquelados',
    category: 'Aviamentos',
    scope: 'VY-04 (Jorts Baggy • 12 un)',
    supplier: 'Aviamentos BH',
    targetQty: '1 pct (100 un)',
    boughtQty: '0 pct',
    amount: 13.99,
    paid: false,
    dueDate: '2027-02-25',
    notes: 'Reforço metálico nos bolsos do Jorts.'
  },
  {
    id: 'aviam-3',
    name: 'Cordão Algodão Trançado 8 mm',
    category: 'Aviamentos',
    scope: 'VY-04 (Jorts Baggy • 12 un)',
    supplier: 'Aviamentos BH',
    targetQty: '1 rolo (20 m)',
    boughtQty: '0 rolo',
    amount: 31.0,
    paid: false,
    dueDate: '2027-02-25',
    notes: 'Cordão longo de ajuste no cós do Jorts.'
  },
  {
    id: 'aviam-4',
    name: 'Elástico de Cós 40 mm Reforçado',
    category: 'Aviamentos',
    scope: 'VY-04 (Jorts Baggy • 12 un)',
    supplier: 'Aviamentos BH',
    targetQty: '1 rolo (25 m)',
    boughtQty: '0 rolo',
    amount: 53.9,
    paid: false,
    dueDate: '2027-02-25',
    notes: 'Cós elástico estruturado do Jorts Baggy.'
  },
  {
    id: 'aviam-5',
    name: 'Etiquetas (VYRO ESSENCE + Tamanho)',
    category: 'Aviamentos',
    scope: 'Todas as Peças (50 un)',
    supplier: 'Etiquetas BH',
    targetQty: '100 marca + kit tam.',
    boughtQty: '0 un',
    amount: 103.04,
    paid: false,
    dueDate: '2027-02-20',
    notes: 'Etiqueta retangular tecida + composição/tamanho.'
  },
  {
    id: 'aviam-6',
    name: 'Linhas e Fios de Overloque',
    category: 'Aviamentos',
    scope: 'Todas as Peças (50 un)',
    supplier: 'Aviamentos BH',
    targetQty: 'Lote básico',
    boughtQty: '0 lote',
    amount: 60.0,
    paid: false,
    dueDate: '2027-02-20',
    notes: 'Cones nas 5 cores da cartela CERNE.'
  },
  {
    id: 'aviam-7',
    name: 'Bordado Computadorizado + Matriz',
    category: 'Aviamentos',
    scope: 'Todas as Peças (50 un)',
    supplier: 'Bordados BH',
    targetQty: '50 un (R$ 6) + matriz',
    boughtQty: '0 un',
    amount: 345.0,
    paid: false,
    dueDate: '2027-04-15',
    notes: 'Inclui desenvolvimento de matriz + aplicação nas 50 peças.'
  },

  // --- 4. FACÇÃO / CORTE E COSTURA BH (4 BLOCOS = R$ 1.102,00) ---
  {
    id: 'faccao-1',
    name: 'Corte & Costura BH — Camisetas Boxy (24 un)',
    category: 'Produção',
    scope: 'VY-01, VY-02, VY-03 (24 un)',
    supplier: 'Facção Barro Preto / Prado / Contagem',
    targetQty: '24 un (R$ 15,00/un)',
    boughtQty: '0 un',
    amount: 360.0,
    paid: false,
    dueDate: '2027-04-10',
    notes: 'Faixa BH: R$ 12 a R$ 18/un (média R$ 15,00).'
  },
  {
    id: 'faccao-2',
    name: 'Corte & Costura BH — Jorts Baggy (12 un)',
    category: 'Produção',
    scope: 'VY-04 (12 un)',
    supplier: 'Facção Barro Preto / Prado / Contagem',
    targetQty: '12 un (R$ 27,00/un)',
    boughtQty: '0 un',
    amount: 324.0,
    paid: false,
    dueDate: '2027-04-15',
    notes: 'Faixa BH: R$ 22 a R$ 32/un (média R$ 27,00).'
  },
  {
    id: 'faccao-3',
    name: 'Corte & Costura BH — Moletom Zip Oliva (8 un)',
    category: 'Produção',
    scope: 'VY-05 (8 un)',
    supplier: 'Facção Barro Preto / Prado / Contagem',
    targetQty: '8 un (R$ 42,50/un)',
    boughtQty: '0 un',
    amount: 340.0,
    paid: false,
    dueDate: '2027-05-20',
    notes: 'Faixa BH: R$ 35 a R$ 50/un (média R$ 42,50).'
  },
  {
    id: 'faccao-4',
    name: 'Corte & Costura BH — Gorro c/ Forro Vinho (6 un)',
    category: 'Produção',
    scope: 'VY-06 (6 un)',
    supplier: 'Facção Barro Preto / Prado / Contagem',
    targetQty: '6 un (R$ 13,00/un)',
    boughtQty: '0 un',
    amount: 78.0,
    paid: false,
    dueDate: '2027-05-20',
    notes: 'Faixa BH: R$ 10 a R$ 16/un (média R$ 13,00).'
  },

  // --- 5. CAMPANHA, LOOKBOOK & HOME SET — CASA VILAS BOAS (R$ 3.705,00) ---
  {
    id: 'set-1',
    name: 'Locação Casa Vilas Boas — Nova Lima (1 diária Airbnb)',
    category: 'Set & Gravação',
    scope: 'Home Set Discroll + Lookbook',
    supplier: 'Airbnb (Anfitrião Felipe)',
    targetQty: '1 diária Julho/27',
    boughtQty: '0 diária',
    amount: 1830.0,
    paid: false,
    dueDate: '2027-06-15',
    notes: '2× Pioneer CDJ-3000 + Mixer DJM e Câmera 2 sem custo (R$ 0,00).'
  },
  {
    id: 'set-2',
    name: 'Par de Caixas Ativas 15” no chão (frete grátis Nova Lima)',
    category: 'Set & Gravação',
    scope: 'Sonorização Home Set',
    supplier: 'Mundo do Evento BH',
    targetQty: '1 diária',
    boughtQty: '0 diária',
    amount: 400.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Posicionadas diretamente no chão (sem pedestais).'
  },
  {
    id: 'set-3',
    name: 'Interface M-Audio Fast Track C400 (REC Out)',
    category: 'Set & Gravação',
    scope: 'Gravação Áudio Set',
    supplier: 'LocNow BH',
    targetQty: '1 diária',
    boughtQty: '0 diária',
    amount: 90.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Captação limpa REC Out + backup DJM-REC.'
  },
  {
    id: 'set-4',
    name: 'Kit Cabos Extras XLR / RCA / P10',
    category: 'Set & Gravação',
    scope: 'Conexão Mixer → Caixas',
    supplier: 'LocNow BH',
    targetQty: '1 kit',
    boughtQty: '0 kit',
    amount: 60.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Ligação mixer para caixas ativas no chão.'
  },
  {
    id: 'set-5',
    name: 'Sony FX30 Cinema Kit (Vídeo 4K contínuo + Fotos)',
    category: 'Set & Gravação',
    scope: 'Câmera 1 Híbrida',
    supplier: 'LocNow BH',
    targetQty: '1 diária',
    boughtQty: '0 diária',
    amount: 540.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Centralizada no tripé de frente para a mesa.'
  },
  {
    id: 'set-6',
    name: 'Lente Editorial Sony E 35mm f/1.8 OSS',
    category: 'Set & Gravação',
    scope: 'Fotos Lookbook das Peças',
    supplier: 'LocNow BH',
    targetQty: '1 diária',
    boughtQty: '0 diária',
    amount: 120.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Captação editorial na parede de vidro e muro de pedra.'
  },
  {
    id: 'set-7',
    name: 'LED Godox SL60W (R$ 120) + 2× Bastões LED RGB (R$ 80)',
    category: 'Set & Gravação',
    scope: 'Iluminação Blue Hour / Noite',
    supplier: 'LocNow BH',
    targetQty: '1 kit luz',
    boughtQty: '0 kit',
    amount: 200.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Iluminação controlada do set.'
  },
  {
    id: 'set-8',
    name: 'Cartão SanDisk 128GB (R$ 45) + 1× Tripé Câmera 1 (R$ 60)',
    category: 'Set & Gravação',
    scope: 'Mídia & Suporte FX30',
    supplier: 'LocNow BH',
    targetQty: '1 kit mídia',
    boughtQty: '0 kit',
    amount: 105.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Armazenamento 4K contínuo + tripé dedicado.'
  },
  {
    id: 'set-9',
    name: 'Técnico Setup AV BH (Freelancer 3h)',
    category: 'Set & Gravação',
    scope: 'Montagem, Foco, Luz & Áudio',
    supplier: 'Freelancer AV BH',
    targetQty: '3 horas',
    boughtQty: '0 horas',
    amount: 360.0,
    paid: false,
    dueDate: '2027-07-10',
    notes: 'Apenas montagem, ajuste de foco, luz e teste de gravação.'
  },

  // --- 6. ENGENHARIA, LOGÍSTICA & E-COMMERCE (FECHANDO TETO R$ 10.401,08) ---
  {
    id: 'eng-1',
    name: 'Modelagem, Gradação & 4 Peças-Piloto (4 Refs)',
    category: 'Engenharia & Site',
    scope: '4 Modelagens Base',
    supplier: 'Modelista BH',
    targetQty: '4 modelos + pilotos',
    boughtQty: '0 modelos',
    amount: 950.0,
    paid: false,
    dueDate: '2027-02-28',
    notes: 'Meta orçada da Etapa 1 · Engenharia.'
  },
  {
    id: 'eng-2',
    name: 'Embalagens, Tags & Frete das Malhas (36,75 kg)',
    category: 'Engenharia & Site',
    scope: 'Logística Lote 50 pçs',
    supplier: 'Transportadora / Embalagens BH',
    targetQty: '36,75 kg + 50 emb.',
    boughtQty: '0',
    amount: 200.0,
    paid: false,
    dueDate: '2027-05-30',
    notes: 'Meta orçada da Etapa 1 · Logística.'
  },
  {
    id: 'eng-3',
    name: 'Plataforma E-commerce Site (R$ 164,00/mês × 2 meses)',
    category: 'Engenharia & Site',
    scope: 'Loja Online VYRO',
    supplier: 'Plataforma E-commerce',
    targetQty: '2 meses ciclo',
    boughtQty: '0 meses',
    amount: 328.0,
    paid: false,
    dueDate: '2027-07-25',
    notes: 'Domínio próprio já está pago e ativo por +1 ano (R$ 0,00).'
  }
];

const INITIAL_CALENDAR = [
  {
    id: 'cal-1',
    month: 'Dez 2026',
    title: 'Fechamento de Fichas Técnicas & Caixa HEXA',
    avgDays: 25,
    status: 'Em andamento',
    tasks: [
      { id: 't-1', text: 'Receber pendências da coleção VYRO HEXA CLUB (R$ 2.199,00)', done: false },
      { id: 't-2', text: 'Validar grade oficial 7P · 17M · 17G · 3GG · 6TU (50 peças)', done: true }
    ]
  },
  {
    id: 'cal-2',
    month: 'Jan – Fev 2027',
    title: 'Compra das Malhas (36,75 kg), Ribanas & Modelagem',
    avgDays: 35,
    status: 'Planejado',
    tasks: [
      { id: 't-3', text: 'Comprar malhas restantes (sem Ribana Vinho) + zíper duplo Coats/SBS', done: false },
      { id: 't-4', text: 'Concluir modelagem, gradação e 4 peças-piloto (R$ 950,00)', done: false }
    ]
  },
  {
    id: 'cal-3',
    month: 'Mar – Abr 2027',
    title: '1ª Entrada: Camisetas Boxy (VY-01 a 03) + Jorts (VY-04)',
    avgDays: 45,
    status: 'Planejado',
    tasks: [
      { id: 't-5', text: 'Corte, costura e bordado computadorizado das 24 camisetas + 12 jorts', done: false },
      { id: 't-6', text: 'Revisão de barra a fio, rebites e etiquetas VYRO ESSENCE', done: false }
    ]
  },
  {
    id: 'cal-4',
    month: 'Mai – Jun 2027',
    title: '2ª Entrada: Moletom Zip (VY-05) + Gorro (VY-06) & Reserva Casa',
    avgDays: 30,
    status: 'Planejado',
    tasks: [
      { id: 't-7', text: 'Finalizar 8 moletons oliva c/ forro vinho + 6 gorros vinho', done: false },
      { id: 't-8', text: 'Confirmar reserva Casa Vilas Boas (R$ 1.830,00) e kit LocNow BH', done: false }
    ]
  },
  {
    id: 'cal-5',
    month: 'Julho 2027',
    title: 'Gravação Home Set DJ Discroll + Lookbook Casa Vilas Boas',
    avgDays: 10,
    status: 'Marco Crítico',
    tasks: [
      { id: 't-9', text: 'Gravar Set 40–60 min (2× CDJ-3000 + FX30 + Caixas no chão)', done: false },
      { id: 't-10', text: 'Fotografar lookbook das 6 peças na parede de vidro e muro de pedra', done: false }
    ]
  },
  {
    id: 'cal-6',
    month: 'Agosto 2027',
    title: 'Ativação Meta Ads (60 dias) & Lançamento Oficial CERNE',
    avgDays: 20,
    status: 'Lançamento',
    tasks: [
      { id: 't-11', text: 'Rodar Meta Ads (R$ 20/dia × 60d = R$ 1.200,00) + Set no YouTube', done: false },
      { id: 't-12', text: 'Atingir ponto de equilíbrio (43 peças) e meta de R$ 12.715,00', done: false }
    ]
  }
];

const INITIAL_ADS = [
  {
    id: 'ad-1',
    name: 'Campanha Principal Meta Ads — Drop CERNE (R$ 20/dia × 60d)',
    platform: 'Meta Ads (IG + Feed)',
    phase: 'Ciclo 1 • 60 dias (Jul–Ago/27)',
    budget: 1200.0,
    spent: 0,
    clicks: 0,
    status: 'Planejada'
  }
];

// ============================================================================
// ARRECADAÇÃO DA COLEÇÃO ANTERIOR (VYRO HEXA CLUB) — PRESERVADA INTACTA
// ============================================================================
const INITIAL_SALES = [
  { id: 's-1', customer: 'PABLIN', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Pendente financeiro' },
  { id: 's-2', customer: 'Tavin', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-3', customer: 'Sorriso', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Enviar' },
  { id: 's-4', customer: 'Batata', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-5', customer: 'Veronica', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: false, note: 'Confirmar pagamento' },
  { id: 's-6', customer: 'Henrique', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Confirmar pagamento' },
  { id: 's-7', customer: 'Lucas', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Enviar' },
  { id: 's-8', customer: 'Ana', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Enviar' },
  { id: 's-9', customer: 'Fabinho', variant: 'Verde', qty: 1, unitPrice: 0, paymentStatus: 'Cortesia', delivered: true, note: 'Cortesia / Enviar' },
  { id: 's-10', customer: 'Borja', variant: 'Verde', qty: 1, unitPrice: 0, paymentStatus: 'Cortesia', delivered: true, note: 'Cortesia / Enviar' },
  { id: 's-11', customer: 'Wallace', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Pendente financeiro' },
  { id: 's-12', customer: 'Pedrão', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-13', customer: 'Vitor Fein', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-14', customer: 'Tito', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-15', customer: 'Namorado do Hueubert', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Pendente financeiro' },
  { id: 's-16', customer: 'Hueubert', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Pendente financeiro' },
  { id: 's-17', customer: 'Anny', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Finalizado' },
  { id: 's-18', customer: 'Jonatas', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Finalizado (Sócio)' },
  { id: 's-19', customer: 'Ruan', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Finalizado' },
  { id: 's-20', customer: 'SAN', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Pendente financeiro' },
  { id: 's-21', customer: 'Marcos', variant: 'Amarela', qty: 2, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Qtd 2 — Finalizado (Sócio)' },
  { id: 's-22', customer: 'Tiane', variant: 'Verde', qty: 1, unitPrice: 219.9, paymentStatus: 'Não pago', delivered: true, note: 'Finalizado' },
  { id: 's-23', customer: 'Vitor', variant: 'Amarela', qty: 1, unitPrice: 219.9, paymentStatus: 'Pago', delivered: true, note: 'Enviar' }
];

const INITIAL_PARTNER_CONFIG = {
  discrollSetSharePct: 20,
  discrollCap: 800,
  contingencyReserve: 0 // Reserva já contemplada nos R$ 10.401,08
};

const DEFAULT_STATE = {
  pieces: INITIAL_PIECES,
  checklist: INITIAL_CHECKLIST,
  calendar: INITIAL_CALENDAR,
  ads: INITIAL_ADS,
  sales: INITIAL_SALES,
  partnerConfig: INITIAL_PARTNER_CONFIG,
  lastUpdated: new Date().toISOString()
};

// ============================================================================
// UTILITÁRIOS & SÍMBOLO OFICIAL VYRO EM 3D
// ============================================================================

const formatBRL = (val) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(val) || 0);

const getPieceTotalQty = (piece) => {
  if (!piece?.sizes) return Number(piece?.qty || 0);
  return Object.values(piece.sizes).reduce((sum, n) => sum + (Number(n) || 0), 0);
};

function VyroSymbolSvg({ className = 'w-12 h-12', mode = 'front' }) {
  const uid = useMemo(() => Math.random().toString(36).slice(2, 7), []);

  if (mode === 'depth') {
    return (
      <svg viewBox="0 0 520 260" fill="none" className={className}>
        <path
          d="M235 42 C142 82, 56 142, 62 174 C67 196, 128 190, 186 164 C144 176, 102 176, 98 158 C94 136, 152 94, 235 42 Z M285 218 C378 178, 464 118, 458 86 C453 64, 392 70, 334 96 C376 84, 418 84, 422 102 C426 124, 368 166, 285 218 Z M352 76 C264 116, 184 156, 148 186 C214 156, 294 116, 352 76 Z"
          fill="#4A4453"
          opacity="0.55"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`vyroChrome-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F4F1EA" />
          <stop offset="70%" stopColor="#C8C2D1" />
          <stop offset="100%" stopColor="#8E9C87" />
        </linearGradient>
        <linearGradient id={`vyroRim-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A89AB8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#5E6D55" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <path
        d="M235 42 C142 82, 56 142, 62 174 C67 196, 128 190, 186 164 C144 176, 102 176, 98 158 C94 136, 152 94, 235 42 Z"
        fill={`url(#vyroChrome-${uid})`}
        stroke={`url(#vyroRim-${uid})`}
        strokeWidth="1.2"
      />
      <path
        d="M174 84 C132 114, 106 144, 112 162 C117 176, 148 176, 182 165 C154 169, 134 165, 132 152 C129 136, 148 110, 174 84 Z"
        fill={`url(#vyroChrome-${uid})`}
        opacity="0.92"
      />
      <path
        d="M352 76 C264 114, 182 154, 142 186 C210 154, 292 114, 352 76 Z"
        fill={`url(#vyroChrome-${uid})`}
        stroke="#FFFFFF"
        strokeWidth="0.9"
      />
      <path
        d="M378 74 C290 116, 208 156, 168 188 C236 156, 318 116, 378 74 Z"
        fill={`url(#vyroChrome-${uid})`}
        opacity="0.88"
      />
      <path
        d="M285 218 C378 178, 464 118, 458 86 C453 64, 392 70, 334 96 C376 84, 418 84, 422 102 C426 124, 368 166, 285 218 Z"
        fill={`url(#vyroChrome-${uid})`}
        stroke={`url(#vyroRim-${uid})`}
        strokeWidth="1.2"
      />
      <path
        d="M346 176 C388 146, 414 116, 408 98 C403 84, 372 84, 338 95 C366 91, 386 95, 388 108 C391 124, 372 150, 346 176 Z"
        fill={`url(#vyroChrome-${uid})`}
        opacity="0.92"
      />
    </svg>
  );
}

function VyroEmblem3D({ className = 'w-12 h-12', interactive = false, tilt = { rx: 0, ry: 0 } }) {
  if (!interactive) {
    return <VyroSymbolSvg className={className} mode="front" />;
  }

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 120ms ease-out'
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none blur-[2px] opacity-60"
        style={{ transform: 'translateZ(-18px) translateY(8px)' }}
      >
        <VyroSymbolSvg className={className} mode="depth" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-75"
        style={{ transform: 'translateZ(-8px) translateY(3px)' }}
      >
        <VyroSymbolSvg className={className} mode="depth" />
      </div>
      <div
        className="relative"
        style={{
          transform: 'translateZ(28px)',
          filter: 'drop-shadow(0 14px 28px rgba(168,154,184,0.32))'
        }}
      >
        <VyroSymbolSvg className={className} mode="front" />
      </div>
    </div>
  );
}

function FloatingMineralCard({
  children,
  className = '',
  accent = '#A89AB8',
  onClick,
  disableTilt = false
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (disableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -1.8;
    const rotateY = ((x - centerX) / centerX) * 1.8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
      backgroundImage: `radial-gradient(380px circle at ${x}px ${y}px, ${accent}16, transparent 70%)`
    });
  };

  const handleMouseLeave = () => {
    if (disableTilt) return;
    setStyle({
      transform: 'none',
      backgroundImage: 'none'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={disableTilt ? undefined : style}
      className={`relative rounded-2xl bg-[#121513]/90 backdrop-blur-md border border-[#242926] transition-colors duration-200 hover:border-[#3A433D] shadow-[0_12px_32px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

function TopographicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 15%, rgba(94,109,85,0.15), transparent 42%), radial-gradient(circle at 82% 20%, rgba(168,154,184,0.11), transparent 40%), radial-gradient(circle at 55% 88%, rgba(114,41,60,0.13), transparent 45%), #0B0D0C'
        }}
      />
      <svg
        className="w-full h-full opacity-[0.07]"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-100 180 C 220 90, 460 320, 780 210 C 1100 100, 1280 260, 1560 190"
          stroke="#F4F1EA"
          strokeWidth="1.2"
        />
        <path
          d="M-100 250 C 240 160, 480 390, 810 280 C 1120 175, 1300 340, 1560 260"
          stroke="#A89AB8"
          strokeWidth="1"
        />
        <path
          d="M-100 340 C 270 250, 510 470, 840 360 C 1150 260, 1320 430, 1560 350"
          stroke="#5E6D55"
          strokeWidth="1.2"
        />
        <path
          d="M-100 580 C 200 480, 540 690, 890 540 C 1180 415, 1340 610, 1560 520"
          stroke="#F4F1EA"
          strokeWidth="1"
        />
        <path
          d="M-100 670 C 240 570, 580 780, 920 630 C 1210 505, 1370 700, 1560 610"
          stroke="#72293C"
          strokeWidth="1.1"
        />
        <circle cx="1040" cy="240" r="180" stroke="#F4F1EA" strokeWidth="0.7" strokeDasharray="4 6" />
        <circle cx="1040" cy="240" r="115" stroke="#5E6D55" strokeWidth="0.9" />
        <circle cx="320" cy="640" r="150" stroke="#A89AB8" strokeWidth="0.7" strokeDasharray="3 5" />
      </svg>
    </div>
  );
}

// ============================================================================
// PORTAL INICIAL 3D INTERATIVO (LOGO VYRO)
// ============================================================================

function PortalLanding({ onEnter, stats }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = (e.clientY / innerHeight) * 2 - 1;
    setTilt({
      rx: -ny * 18,
      ry: nx * 22,
      gx: (e.clientX / innerWidth) * 100,
      gy: (e.clientY / innerHeight) * 100
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 md:p-10 text-[#F4F1EA] overflow-hidden select-none z-10"
    >
      <div className="w-full max-w-6xl flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#9CA39E]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#5E6D55] animate-pulse" />
          <span>VYRO STUDIOS • BELO HORIZONTE, MG</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>SERIES 001: CERNE</span>
          <span className="text-[#525A55]">|</span>
          <span>DROP JUL / AGO 2027</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-6">
        <div
          onClick={onEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onEnter()}
          className="group relative cursor-pointer px-8 py-10 sm:px-14 sm:py-12 rounded-3xl transition-all duration-200"
        >
          <div
            className="absolute inset-0 rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(168,154,184,0.24), rgba(94,109,85,0.14) 45%, transparent 72%)`
            }}
          />
          <div className="absolute inset-1 rounded-3xl border border-[#2A302C] group-hover:border-[#A89AB8]/60 transition-colors pointer-events-none bg-[#111412]/40 backdrop-blur-sm" />

          <div className="relative z-10">
            <VyroEmblem3D
              className="w-72 sm:w-96 md:w-[440px] h-auto mx-auto"
              interactive
              tilt={tilt}
            />
          </div>

          <div className="relative z-10 mt-4 space-y-1.5">
            <p className="text-[11px] tracking-[0.36em] uppercase text-[#A89AB8]">
              FREQUÊNCIA MINERAL • 120 BPM
            </p>
            <h1 className="text-2xl sm:text-3xl font-light tracking-[0.14em] text-[#F4F1EA]">
              CERNE • CONTROLE DE COLEÇÃO
            </h1>
          </div>

          <div className="relative z-10 mt-7 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#F4F1EA] text-[#0B0D0C] text-xs font-semibold tracking-[0.16em] uppercase group-hover:bg-[#A89AB8] group-hover:text-[#0B0D0C] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
            <span>Acessar Painéis</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full">
          <div className="px-4 py-3 rounded-xl bg-[#121513]/85 border border-[#242926] text-left">
            <div className="text-[10px] uppercase tracking-wider text-[#8C948E]">Caixa HEXA Pago</div>
            <div className="text-base font-semibold text-[#8BB174] mt-0.5">{formatBRL(stats.salesPaidTotal)}</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#121513]/85 border border-[#242926] text-left">
            <div className="text-[10px] uppercase tracking-wider text-[#8C948E]">A Receber HEXA</div>
            <div className="text-base font-semibold text-[#E2B979] mt-0.5">{formatBRL(stats.salesPendingTotal)}</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#121513]/85 border border-[#242926] text-left">
            <div className="text-[10px] uppercase tracking-wider text-[#8C948E]">Teto Drop CERNE</div>
            <div className="text-base font-semibold text-[#F4F1EA] mt-0.5">{formatBRL(stats.totalProjectCost)}</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-[#121513]/85 border border-[#242926] text-left">
            <div className="text-[10px] uppercase tracking-wider text-[#8C948E]">Meta Faturamento</div>
            <div className="text-base font-semibold text-[#A89AB8] mt-0.5">{formatBRL(stats.projectedRevenueCerne)}</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#737B76]">
        <span>4 Refs × 6 SKUs • 50 Peças • Casa Vilas Boas</span>
        <span>VYRO STUDIOS • 2026–2027</span>
      </div>
    </div>
  );
}

// ============================================================================
// APLICAÇÃO PRINCIPAL
// ============================================================================

export default function App() {
  const [showPortal, setShowPortal] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [globalSearch, setGlobalSearch] = useState('');

  // Preserva os dados de arrecadação HEXA caso você já tenha editado algo na v8/v7/v6
  const [data, setData] = useState(() => {
    try {
      const savedV9 = localStorage.getItem(STORAGE_KEY);
      if (savedV9) return JSON.parse(savedV9);

      const legacyKeys = [
        'vyro_cerne_management_v8',
        'vyro_cerne_management_v7',
        'vyro_cerne_management_v6'
      ];
      for (const k of legacyKeys) {
        const legacyRaw = localStorage.getItem(k);
        if (legacyRaw) {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy.sales) && parsedLegacy.sales.length > 0) {
            return {
              ...DEFAULT_STATE,
              sales: parsedLegacy.sales
            };
          }
        }
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }
    return DEFAULT_STATE;
  });

  const [cloudCfg, setCloudCfg] = useState(() => {
    try {
      const saved = localStorage.getItem(CLOUD_CFG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { url: '', anonKey: '', connected: false };
  });

  const [cloudStatus, setCloudStatus] = useState('local');
  const [cloudMsg, setCloudMsg] = useState('');
  const [showCloudModal, setShowCloudModal] = useState(false);
  const isRemotePullRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar localStorage:', e);
    }
  }, [data]);

  useEffect(() => {
    if (!cloudCfg.connected || !cloudCfg.url || !cloudCfg.anonKey) return;
    pullFromSupabase(cloudCfg.url, cloudCfg.anonKey);
  }, []);

  useEffect(() => {
    if (!cloudCfg.connected || !cloudCfg.url || !cloudCfg.anonKey) return;
    if (isRemotePullRef.current) {
      isRemotePullRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      pushToSupabase(cloudCfg.url, cloudCfg.anonKey, data);
    }, 600);
    return () => clearTimeout(timer);
  }, [data, cloudCfg]);

  async function pullFromSupabase(url, anonKey) {
    try {
      setCloudStatus('syncing');
      const cleanUrl = url.replace(/\/$/, '');
      const res = await fetch(
        `${cleanUrl}/rest/v1/cerne_state?id=eq.principal&select=data,updated_at`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`
          }
        }
      );
      if (!res.ok) throw new Error('Falha ao ler banco Supabase');
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
        isRemotePullRef.current = true;
        setData(rows[0].data);
        setCloudStatus('synced');
        setCloudMsg('Sincronizado com a nuvem');
      } else {
        await pushToSupabase(url, anonKey, data);
      }
    } catch (err) {
      console.error(err);
      setCloudStatus('error');
      setCloudMsg('Erro de conexão com Supabase');
    }
  }

  async function pushToSupabase(url, anonKey, payload) {
    try {
      setCloudStatus('syncing');
      const cleanUrl = url.replace(/\/$/, '');
      const res = await fetch(`${cleanUrl}/rest/v1/cerne_state`, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: 'principal',
          data: { ...payload, lastUpdated: new Date().toISOString() },
          updated_at: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Falha ao gravar no Supabase');
      setCloudStatus('synced');
      setCloudMsg('Salvo na nuvem');
    } catch (err) {
      console.error(err);
      setCloudStatus('error');
      setCloudMsg('Erro ao salvar na nuvem');
    }
  }

  const handleConnectCloud = async (e) => {
    e.preventDefault();
    if (!cloudCfg.url || !cloudCfg.anonKey) return;
    const nextCfg = { ...cloudCfg, connected: true };
    setCloudCfg(nextCfg);
    localStorage.setItem(CLOUD_CFG_KEY, JSON.stringify(nextCfg));
    await pushToSupabase(nextCfg.url, nextCfg.anonKey, data);
  };

  const handleDisconnectCloud = () => {
    const nextCfg = { url: '', anonKey: '', connected: false };
    setCloudCfg(nextCfg);
    localStorage.removeItem(CLOUD_CFG_KEY);
    setCloudStatus('local');
    setCloudMsg('');
  };

  // ============================================================================
  // CÁLCULOS FINANCEIROS & EVOLUTIVOS EM TEMPO REAL
  // ============================================================================

  const stats = useMemo(() => {
    const checklistTotal = data.checklist.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const checklistPaid = data.checklist
      .filter((i) => i.paid)
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const checklistPending = checklistTotal - checklistPaid;

    // Produção das 50 Peças BH (Tecidos + Ribanas + Aviamentos + Facção = R$ 4.018,07)
    const productionCategories = ['Tecidos', 'Ribanas', 'Aviamentos', 'Produção'];
    const productionCostTotal = data.checklist
      .filter((i) => productionCategories.includes(i.category))
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const productionPaid = data.checklist
      .filter((i) => productionCategories.includes(i.category) && i.paid)
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    // Campanha Home Set + Lookbook (Casa Vilas Boas + Técnica BH = R$ 3.705,00)
    const setCostTotal = data.checklist
      .filter((i) => i.category === 'Set & Gravação')
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const setPaid = data.checklist
      .filter((i) => i.category === 'Set & Gravação' && i.paid)
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const adsBudgetTotal = data.ads.reduce((acc, ad) => acc + Number(ad.budget || 0), 0);
    const adsSpentTotal = data.ads.reduce((acc, ad) => acc + Number(ad.spent || 0), 0);

    const contingency = Number(data.partnerConfig.contingencyReserve || 0);
    const totalProjectCost = checklistTotal + adsBudgetTotal + contingency;
    const totalAlreadyPaid = checklistPaid + adsSpentTotal;
    const remainingToPay = Math.max(0, totalProjectCost - totalAlreadyPaid);

    // Caixa HEXA CLUB (intacto)
    const salesPaidTotal = data.sales
      .filter((s) => s.paymentStatus === 'Pago')
      .reduce((acc, s) => acc + Number(s.qty || 1) * Number(s.unitPrice || 0), 0);

    const salesPendingTotal = data.sales
      .filter((s) => s.paymentStatus === 'Não pago')
      .reduce((acc, s) => acc + Number(s.qty || 1) * Number(s.unitPrice || 0), 0);

    const salesPaidQty = data.sales
      .filter((s) => s.paymentStatus === 'Pago')
      .reduce((acc, s) => acc + Number(s.qty || 1), 0);

    const salesPendingQty = data.sales
      .filter((s) => s.paymentStatus === 'Não pago')
      .reduce((acc, s) => acc + Number(s.qty || 1), 0);

    const salesCourtesyQty = data.sales
      .filter((s) => s.paymentStatus === 'Cortesia')
      .reduce((acc, s) => acc + Number(s.qty || 1), 0);

    // Rateio Sócios
    const discrollRaw = setCostTotal * (Number(data.partnerConfig.discrollSetSharePct || 0) / 100);
    const discrollCap = Number(data.partnerConfig.discrollCap || 0);
    const discrollShare = discrollCap > 0 ? Math.min(discrollRaw, discrollCap) : discrollRaw;

    const netNeedAfterCash = Math.max(0, totalProjectCost - salesPaidTotal - discrollShare);
    const netNeedIfAllPaid = Math.max(
      0,
      totalProjectCost - (salesPaidTotal + salesPendingTotal) - discrollShare
    );

    const jonatasShare = netNeedAfterCash / 2;
    const marcosShare = netNeedAfterCash / 2;

    const totalPiecesQty = data.pieces.reduce((acc, p) => acc + getPieceTotalQty(p), 0);
    const projectedRevenueCerne = data.pieces.reduce(
      (acc, p) => acc + getPieceTotalQty(p) * Number(p.salePrice || 0),
      0
    );

    const paidItemsRatio =
      data.checklist.length > 0
        ? data.checklist.filter((i) => i.paid).length / data.checklist.length
        : 0;
    const piecesStageRatio =
      data.pieces.length > 0
        ? data.pieces.reduce((acc, p) => acc + p.stageIndex / (PRODUCTION_STAGES.length - 1), 0) /
          data.pieces.length
        : 0;
    const allTasks = data.calendar.flatMap((c) => c.tasks);
    const calendarRatio =
      allTasks.length > 0 ? allTasks.filter((t) => t.done).length / allTasks.length : 0;

    const overallProgress = Math.round(
      (paidItemsRatio * 0.4 + piecesStageRatio * 0.35 + calendarRatio * 0.25) * 100
    );

    return {
      checklistTotal,
      checklistPaid,
      checklistPending,
      productionCostTotal,
      productionPaid,
      setCostTotal,
      setPaid,
      adsBudgetTotal,
      adsSpentTotal,
      contingency,
      totalProjectCost,
      totalAlreadyPaid,
      remainingToPay,
      salesPaidTotal,
      salesPendingTotal,
      salesPaidQty,
      salesPendingQty,
      salesCourtesyQty,
      discrollShare,
      jonatasShare,
      marcosShare,
      netNeedAfterCash,
      netNeedIfAllPaid,
      totalPiecesQty,
      projectedRevenueCerne,
      overallProgress
    };
  }, [data]);

  // ============================================================================
  // HANDLERS DE EDIÇÃO RÁPIDA
  // ============================================================================

  const toggleChecklistPaid = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id
          ? {
              ...item,
              paid: !item.paid,
              boughtQty: !item.paid ? item.targetQty || item.boughtQty : item.boughtQty
            }
          : item
      )
    }));
  };

  const updateChecklistField = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addChecklistItem = (newItem) => {
    setData((prev) => ({
      ...prev,
      checklist: [
        {
          id: `chk-${Date.now()}`,
          paid: false,
          dueDate: new Date().toISOString().slice(0, 10),
          notes: 'Novo item cadastrado',
          ...newItem
        },
        ...prev.checklist
      ]
    }));
  };

  const deleteChecklistItem = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== id)
    }));
  };

  const cycleSaleStatus = (id) => {
    const order = ['Pago', 'Não pago', 'Cortesia'];
    setData((prev) => ({
      ...prev,
      sales: prev.sales.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = order[(order.indexOf(s.paymentStatus) + 1) % order.length];
        return {
          ...s,
          paymentStatus: nextStatus,
          unitPrice: nextStatus === 'Cortesia' ? 0 : s.unitPrice || 219.9
        };
      })
    }));
  };

  const toggleSaleDelivered = (id) => {
    setData((prev) => ({
      ...prev,
      sales: prev.sales.map((s) => (s.id === id ? { ...s, delivered: !s.delivered } : s))
    }));
  };

  const addSaleRecord = (sale) => {
    setData((prev) => ({
      ...prev,
      sales: [
        {
          id: `s-${Date.now()}`,
          delivered: false,
          ...sale
        },
        ...prev.sales
      ]
    }));
  };

  const deleteSaleRecord = (id) => {
    setData((prev) => ({
      ...prev,
      sales: prev.sales.filter((s) => s.id !== id)
    }));
  };

  const updatePieceStage = (id, stageIndex) => {
    setData((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...p, stageIndex } : p))
    }));
  };

  const updatePieceField = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    }));
  };

  const updatePieceSize = (id, sizeKey, qtyVal) => {
    setData((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) =>
        p.id === id
          ? {
              ...p,
              sizes: {
                ...(p.sizes || { P: 0, M: 0, G: 0, GG: 0, TU: 0 }),
                [sizeKey]: Math.max(0, Number(qtyVal) || 0)
              }
            }
          : p
      )
    }));
  };

  const toggleCalendarTask = (blockId, taskId) => {
    setData((prev) => ({
      ...prev,
      calendar: prev.calendar.map((block) =>
        block.id === blockId
          ? {
              ...block,
              tasks: block.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
            }
          : block
      )
    }));
  };

  const addCalendarTask = (blockId, text) => {
    if (!text.trim()) return;
    setData((prev) => ({
      ...prev,
      calendar: prev.calendar.map((block) =>
        block.id === blockId
          ? {
              ...block,
              tasks: [...block.tasks, { id: `t-${Date.now()}`, text: text.trim(), done: false }]
            }
          : block
      )
    }));
  };

  const updateCalendarDays = (blockId, avgDays) => {
    setData((prev) => ({
      ...prev,
      calendar: prev.calendar.map((b) =>
        b.id === blockId ? { ...b, avgDays: Number(avgDays) || 0 } : b
      )
    }));
  };

  const updateAdField = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      ads: prev.ads.map((ad) => (ad.id === id ? { ...ad, [field]: value } : ad))
    }));
  };

  const addAdCampaign = (campaign) => {
    setData((prev) => ({
      ...prev,
      ads: [{ id: `ad-${Date.now()}`, spent: 0, clicks: 0, status: 'Planejada', ...campaign }, ...prev.ads]
    }));
  };

  const deleteAdCampaign = (id) => {
    setData((prev) => ({
      ...prev,
      ads: prev.ads.filter((a) => a.id !== id)
    }));
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VYRO-CERNE-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.pieces && parsed.checklist) {
          setData(parsed);
        }
      } catch (err) {
        console.error('Arquivo inválido', err);
      }
    };
    reader.readAsText(file);
  };

  if (showPortal) {
    return (
      <div className="min-h-screen bg-[#0B0D0C] relative">
        <TopographicBackground />
        <PortalLanding onEnter={() => setShowPortal(false)} stats={stats} />
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Evolução & Painel', icon: LayoutDashboard },
    { id: 'checklist', label: 'Item por Item', icon: CheckSquare, badge: `${data.checklist.filter((i) => i.paid).length}/${data.checklist.length}` },
    { id: 'pieces', label: '4 Peças & Grade', icon: Scissors, badge: `${stats.totalPiecesQty} pçs` },
    { id: 'sales', label: 'Vendas & Caixa', icon: Wallet, badge: formatBRL(stats.salesPaidTotal) },
    { id: 'partners', label: 'Aporte Sócios', icon: Users },
    { id: 'calendar', label: 'Calendário & Prazos', icon: CalendarIcon },
    { id: 'ads', label: 'Tráfego Pago', icon: Megaphone }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D0C] text-[#F4F1EA] flex flex-col lg:flex-row relative selection:bg-[#A89AB8] selection:text-[#0B0D0C]">
      <TopographicBackground />

      {/* SIDEBAR FIXA MINERAL */}
      <aside className="w-full lg:w-72 lg:fixed lg:inset-y-0 lg:left-0 bg-[#0F1210]/90 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-[#212623] z-30 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-[#1E2320]">
            <button
              onClick={() => setShowPortal(true)}
              title="Voltar ao Portal 3D VYRO"
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#161A18] border border-[#2A302C] flex items-center justify-center group-hover:border-[#A89AB8] transition-colors p-1">
                <VyroEmblem3D className="w-full h-auto" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.14em] text-[#F4F1EA]">
                  VYRO STUDIOS
                </div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[#A89AB8]">
                  SERIES 001 • CERNE
                </div>
              </div>
            </button>
          </div>

          <div className="mt-4 relative">
            <Search className="w-3.5 h-3.5 text-[#757E78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Filtrar item, código, peça ou cliente..."
              className="w-full bg-[#151917] border border-[#242926] rounded-xl pl-8 pr-3 py-2 text-xs text-[#F4F1EA] placeholder-[#6B736E] focus:outline-none focus:border-[#A89AB8]"
            />
          </div>

          <nav className="mt-5 space-y-1">
            <div className="px-2.5 pb-1.5 text-[10px] uppercase tracking-[0.2em] text-[#6B736E]">
              Gestão da Coleção
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#1B201D] text-[#F4F1EA] border border-[#323A35] shadow-sm'
                      : 'text-[#97A09A] hover:text-[#F4F1EA] hover:bg-[#141816]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? 'text-[#A89AB8]' : 'text-[#6B736E]'
                      }`}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        active
                          ? 'bg-[#A89AB8]/20 text-[#D8CEE3]'
                          : 'bg-[#171B19] text-[#8A928D]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1E2320] space-y-2.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#171C19] to-[#121513] border border-[#262C28]">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#A89AB8]">
              <span>Metas Ciclo 1</span>
              <span>60 dias</span>
            </div>
            <div className="mt-1 text-xs font-medium text-[#F4F1EA]">
              Break-even: <span className="text-[#8BB174]">43 peças</span>
            </div>
            <div className="text-[11px] text-[#8E9690]">
              Reestoque: <span className="text-[#F4F1EA]">35 peças vendidas</span>
            </div>
          </div>

          <button
            onClick={() => setShowCloudModal(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#151917] hover:bg-[#1B201D] border border-[#252B27] text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              {cloudCfg.connected ? (
                <Cloud className="w-3.5 h-3.5 text-[#8BB174]" />
              ) : (
                <CloudOff className="w-3.5 h-3.5 text-[#A89AB8]" />
              )}
              <span>{cloudCfg.connected ? 'Nuvem Conectada' : 'Conectar Nuvem'}</span>
            </span>
            <span className="text-[10px] text-[#7D8580]">Supabase</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#141816] hover:bg-[#1B201D] border border-[#232825] text-[11px] text-[#B8C0BB]"
            >
              <Download className="w-3 h-3" />
              <span>Exportar</span>
            </button>
            <label className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#141816] hover:bg-[#1B201D] border border-[#232825] text-[11px] text-[#B8C0BB] cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Importar</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 lg:pl-72 relative z-10">
        <header className="sticky top-0 z-20 bg-[#0B0D0C]/80 backdrop-blur-md border-b border-[#1D221F] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8E9690]">
              <span>Frequência Mineral</span>
              <span>•</span>
              <span className="text-[#A89AB8]">4 Refs × 6 SKUs ({stats.totalPiecesQty} un)</span>
            </div>
            <h2 className="text-lg font-medium text-[#F4F1EA]">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {cloudMsg && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151917] border border-[#262C28] text-[11px] text-[#9EA7A1]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    cloudStatus === 'synced'
                      ? 'bg-[#8BB174]'
                      : cloudStatus === 'error'
                      ? 'bg-[#C96A7B]'
                      : 'bg-[#A89AB8] animate-pulse'
                  }`}
                />
                {cloudMsg}
              </span>
            )}
            <button
              onClick={() => setShowCloudModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#161A18] hover:bg-[#1E2320] border border-[#2A302C] text-xs font-medium text-[#F4F1EA] flex items-center gap-2"
            >
              <Cloud className="w-3.5 h-3.5 text-[#A89AB8]" />
              <span>Nuvem / Sincronizar</span>
            </button>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {activeTab === 'overview' && (
            <>
              <FloatingMineralCard accent="#5E6D55" className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#A89AB8]">
                      Visão Executiva • Series 001: CERNE
                    </span>
                    <h3 className="text-xl font-medium text-[#F4F1EA] mt-1">
                      Evolução Consolidada até o Drop (Julho / Agosto 2027)
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-[#F4F1EA]">
                      {stats.overallProgress}%
                    </div>
                    <div className="text-[11px] text-[#8E9690]">Progresso ponderado</div>
                  </div>
                </div>
                <div className="mt-4 w-full h-3 rounded-full bg-[#1A1F1C] overflow-hidden p-0.5 border border-[#272D29]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.overallProgress}%`,
                      background: 'linear-gradient(90deg, #5E6D55 0%, #A89AB8 55%, #72293C 100%)'
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0E110F] border border-[#1F2421]">
                    <span className="text-[#88918B] block text-[11px]">Produção BH (50 Peças)</span>
                    <span className="font-semibold text-[#F4F1EA] mt-0.5 block">
                      {formatBRL(stats.productionPaid)} / {formatBRL(stats.productionCostTotal)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E110F] border border-[#1F2421]">
                    <span className="text-[#88918B] block text-[11px]">Home Set + Lookbook</span>
                    <span className="font-semibold text-[#A89AB8] mt-0.5 block">
                      {formatBRL(stats.setPaid)} / {formatBRL(stats.setCostTotal)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E110F] border border-[#1F2421]">
                    <span className="text-[#88918B] block text-[11px]">Caixa HEXA Recebido</span>
                    <span className="font-semibold text-[#8BB174] mt-0.5 block">
                      {formatBRL(stats.salesPaidTotal)} ({stats.salesPaidQty} pçs)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0E110F] border border-[#1F2421]">
                    <span className="text-[#88918B] block text-[11px]">A Receber HEXA</span>
                    <span className="font-semibold text-[#E2B979] mt-0.5 block">
                      {formatBRL(stats.salesPendingTotal)} ({stats.salesPendingQty} pçs)
                    </span>
                  </div>
                </div>
              </FloatingMineralCard>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <FloatingMineralCard accent="#F4F1EA" className="p-5">
                  <div className="text-xs text-[#8E9690]">Teto Investimento Drop 001</div>
                  <div className="text-2xl font-semibold text-[#F4F1EA] mt-1.5">
                    {formatBRL(stats.totalProjectCost)}
                  </div>
                  <div className="text-[11px] text-[#7D8680] mt-2">
                    Mapeado (R$ 7.723,07) + Eng./Site/Ads
                  </div>
                </FloatingMineralCard>

                <FloatingMineralCard accent="#5E6D55" className="p-5">
                  <div className="text-xs text-[#8E9690]">Já Pago / Quitado</div>
                  <div className="text-2xl font-semibold text-[#8BB174] mt-1.5">
                    {formatBRL(stats.totalAlreadyPaid)}
                  </div>
                  <div className="text-[11px] text-[#7D8680] mt-2">
                    Malha & Ribana Lavanda + Domínio ativo
                  </div>
                </FloatingMineralCard>

                <FloatingMineralCard accent="#A89AB8" className="p-5">
                  <div className="text-xs text-[#8E9690]">Falta Pagar (Orçamento)</div>
                  <div className="text-2xl font-semibold text-[#A89AB8] mt-1.5">
                    {formatBRL(stats.remainingToPay)}
                  </div>
                  <div className="text-[11px] text-[#7D8680] mt-2">
                    Saldo pendente das etapas
                  </div>
                </FloatingMineralCard>

                <FloatingMineralCard accent="#72293C" className="p-5">
                  <div className="text-xs text-[#8E9690]">Meta Faturamento Bruto (50 pçs)</div>
                  <div className="text-2xl font-semibold text-[#F4F1EA] mt-1.5">
                    {formatBRL(stats.projectedRevenueCerne)}
                  </div>
                  <div className="text-[11px] text-[#8BB174] mt-2">
                    Resultado s/ teto: +{formatBRL(stats.projectedRevenueCerne - stats.totalProjectCost)}
                  </div>
                </FloatingMineralCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FloatingMineralCard accent="#A89AB8" className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#F4F1EA]">
                      Aporte Líquido por Sócio
                    </h4>
                    <button
                      onClick={() => setActiveTab('partners')}
                      className="text-[11px] text-[#A89AB8] hover:underline"
                    >
                      Ajustar regra →
                    </button>
                  </div>
                  <p className="text-xs text-[#8C948E]">
                    Abatendo os <strong className="text-[#8BB174]">{formatBRL(stats.salesPaidTotal)}</strong> já
                    em caixa da coleção HEXA:
                  </p>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-[#0E110F] border border-[#222724] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-[#F4F1EA]">Jonatas (50% saldo)</div>
                        <div className="text-[10px] text-[#7C857F]">Produção + Set + Ads</div>
                      </div>
                      <div className="text-sm font-semibold text-[#F4F1EA]">
                        {formatBRL(stats.jonatasShare)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0E110F] border border-[#222724] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-[#F4F1EA]">Marcos Paulo (50% saldo)</div>
                        <div className="text-[10px] text-[#7C857F]">Produção + Set + Ads</div>
                      </div>
                      <div className="text-sm font-semibold text-[#F4F1EA]">
                        {formatBRL(stats.marcosShare)}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#16141A] border border-[#352E3F] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-[#D8CEE3]">DJ Discroll (Leve)</div>
                        <div className="text-[10px] text-[#9A8FA8]">
                          {data.partnerConfig.discrollSetSharePct}% apenas do Set (teto {formatBRL(data.partnerConfig.discrollCap)})
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#A89AB8]">
                        {formatBRL(stats.discrollShare)}
                      </div>
                    </div>
                  </div>
                </FloatingMineralCard>

                <FloatingMineralCard accent="#5E6D55" disableTilt className="p-5 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#F4F1EA]">
                      Checklist Rápido — Clique para Marcar como Pago
                    </h4>
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="text-[11px] text-[#A89AB8] hover:underline"
                    >
                      Ver todos ({data.checklist.length}) →
                    </button>
                  </div>
                  <div className="divide-y divide-[#1D221F]">
                    {data.checklist.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => toggleChecklistPaid(item.id)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              item.paid
                                ? 'bg-[#5E6D55] border-[#5E6D55] text-[#F4F1EA]'
                                : 'border-[#363E39] group-hover:border-[#A89AB8]'
                            }`}
                          >
                            {item.paid && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <div>
                            <div
                              className={`text-xs font-medium ${
                                item.paid ? 'line-through text-[#7A827D]' : 'text-[#F4F1EA]'
                              }`}
                            >
                              {item.name}
                            </div>
                            <div className="text-[10px] text-[#7D8680]">
                              {item.category} • {item.scope} • Meta: {item.targetQty}
                            </div>
                          </div>
                        </button>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-semibold text-[#F4F1EA]">
                            {formatBRL(item.amount)}
                          </div>
                          <span
                            className={`text-[10px] ${
                              item.paid ? 'text-[#8BB174]' : 'text-[#E2B979]'
                            }`}
                          >
                            {item.paid ? 'Pago' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </FloatingMineralCard>
              </div>
            </>
          )}

          {activeTab === 'checklist' && (
            <ChecklistTab
              items={data.checklist}
              search={globalSearch}
              onTogglePaid={toggleChecklistPaid}
              onUpdateField={updateChecklistField}
              onAdd={addChecklistItem}
              onDelete={deleteChecklistItem}
            />
          )}

          {activeTab === 'pieces' && (
            <PiecesTab
              pieces={data.pieces}
              search={globalSearch}
              onUpdateStage={updatePieceStage}
              onUpdateField={updatePieceField}
              onUpdateSize={updatePieceSize}
            />
          )}

          {activeTab === 'sales' && (
            <SalesTab
              sales={data.sales}
              stats={stats}
              search={globalSearch}
              onCycleStatus={cycleSaleStatus}
              onToggleDelivered={toggleSaleDelivered}
              onAdd={addSaleRecord}
              onDelete={deleteSaleRecord}
            />
          )}

          {activeTab === 'partners' && (
            <PartnersTab
              stats={stats}
              config={data.partnerConfig}
              onUpdateConfig={(patch) =>
                setData((prev) => ({
                  ...prev,
                  partnerConfig: { ...prev.partnerConfig, ...patch }
                }))
              }
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab
              calendar={data.calendar}
              onToggleTask={toggleCalendarTask}
              onAddTask={addCalendarTask}
              onUpdateDays={updateCalendarDays}
            />
          )}

          {activeTab === 'ads' && (
            <AdsTab
              ads={data.ads}
              onUpdateField={updateAdField}
              onAdd={addAdCampaign}
              onDelete={deleteAdCampaign}
            />
          )}
        </div>
      </main>

      {showCloudModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#131715] border border-[#2A312D] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-5 h-5 text-[#A89AB8]" />
                <h3 className="text-base font-medium text-[#F4F1EA]">
                  Sincronização na Nuvem (Supabase)
                </h3>
              </div>
              <button
                onClick={() => setShowCloudModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#1E2421] text-[#8E9690]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9AA39D] leading-relaxed">
              Cole abaixo a <strong>Project URL</strong> e a <strong>Anon Public Key</strong> do
              seu projeto no Supabase para salvar automaticamente todas as edições online e
              sincronizar entre você, Marcos Paulo e Discroll.
            </p>

            <form onSubmit={handleConnectCloud} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8E9690] mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  value={cloudCfg.url}
                  onChange={(e) => setCloudCfg({ ...cloudCfg, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#262C28] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8E9690] mb-1">
                  Anon Public Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={cloudCfg.anonKey}
                  onChange={(e) => setCloudCfg({ ...cloudCfg, anonKey: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#262C28] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                {cloudCfg.connected ? (
                  <button
                    type="button"
                    onClick={handleDisconnectCloud}
                    className="px-3.5 py-2 rounded-xl bg-[#72293C]/20 border border-[#72293C]/50 text-xs text-[#E598A8]"
                  >
                    Desconectar Nuvem
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  {cloudCfg.connected && (
                    <button
                      type="button"
                      onClick={() => pullFromSupabase(cloudCfg.url, cloudCfg.anonKey)}
                      className="px-3.5 py-2 rounded-xl bg-[#1A201D] border border-[#2C342F] text-xs text-[#F4F1EA] flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Puxar da Nuvem</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#F4F1EA] hover:bg-[#A89AB8] text-[#0B0D0C] text-xs font-semibold transition-colors"
                  >
                    Conectar e Enviar Dados Atuais
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTES DAS ABAS
// ============================================================================

function ChecklistTab({ items, search, onTogglePaid, onUpdateField, onAdd, onDelete }) {
  const [catFilter, setCatFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Tecidos');
  const [newScope, setNewScope] = useState('VY-01 (Boxy Cinza)');
  const [newTargetQty, setNewTargetQty] = useState('');
  const [newBoughtQty, setNewBoughtQty] = useState('0');
  const [newAmount, setNewAmount] = useState('');
  const [newPaid, setNewPaid] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState('');

  const categories = [
    'Todos',
    'Tecidos',
    'Ribanas',
    'Aviamentos',
    'Produção',
    'Set & Gravação',
    'Engenharia & Site'
  ];

  const filtered = items.filter((item) => {
    const matchCat = catFilter === 'Todos' || item.category === catFilter;
    const matchStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Pago' && item.paid) ||
      (statusFilter === 'Pendente' && !item.paid);
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.scope.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const filteredTotal = filtered.reduce((acc, i) => acc + Number(i.amount || 0), 0);

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (!newName.trim()) return;
    onAdd({
      name: newName.trim(),
      category: newCat,
      scope: newScope.trim() || 'Coleção CERNE',
      supplier: 'Fornecedor BH',
      targetQty: newTargetQty.trim() || '1 un',
      boughtQty: newPaid ? newTargetQty.trim() || '1 un' : newBoughtQty.trim() || '0',
      amount: parseFloat(String(newAmount).replace(',', '.')) || 0,
      paid: newPaid
    });
    setAddedFeedback(`✓ "${newName.trim()}" adicionado!`);
    setNewName('');
    setNewTargetQty('');
    setNewBoughtQty('0');
    setNewAmount('');
    setNewPaid(false);
    setCatFilter('Todos');
    setStatusFilter('Todos');
    setTimeout(() => setAddedFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      <FloatingMineralCard accent="#A89AB8" disableTilt className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#A89AB8]">
              Adicionar Novo Item Individual (Tecido, Ribana, Aviamento, Costura ou Equipamento)
            </h3>
            <p className="text-[11px] text-[#8E9690] mt-0.5">
              Cadastre cada insumo separadamente vinculando a peça respectiva e a meta de compra.
            </p>
          </div>
          {addedFeedback && (
            <span className="px-3 py-1 rounded-full bg-[#5E6D55]/30 border border-[#5E6D55] text-xs text-[#A5CE8C] font-medium">
              {addedFeedback}
            </span>
          )}
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          <input
            type="text"
            placeholder="Nome do item (ex: Lavanderia VY-04)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="lg:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
          />
          <select
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
          >
            <option value="Tecidos">Tecidos</option>
            <option value="Ribanas">Ribanas</option>
            <option value="Aviamentos">Aviamentos</option>
            <option value="Produção">Produção (Facção)</option>
            <option value="Set & Gravação">Set & Gravação</option>
            <option value="Engenharia & Site">Engenharia & Site</option>
          </select>
          <select
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
          >
            <option value="VY-01 (Boxy Cinza • 8 un)">VY-01 • Boxy Cinza</option>
            <option value="VY-02 (Boxy Lavanda • 8 un)">VY-02 • Boxy Lavanda</option>
            <option value="VY-03 (Boxy Preta • 8 un)">VY-03 • Boxy Preta</option>
            <option value="VY-04 (Jorts Baggy • 12 un)">VY-04 • Jorts Baggy</option>
            <option value="VY-05 (Moletom Zip • 8 un)">VY-05 • Moletom Zip</option>
            <option value="VY-06 (Gorro Vinho • 6 un)">VY-06 • Gorro Vinho</option>
            <option value="Todas as Peças (50 un)">Todas as Peças (50 un)</option>
            <option value="Home Set Discroll">Home Set Discroll (Jul/27)</option>
          </select>
          <input
            type="text"
            placeholder="Meta compra (ex: 3,5000 kg)"
            value={newTargetQty}
            onChange={(e) => setNewTargetQty(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Valor R$ (ex: 150,00)"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#A89AB8]"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNewPaid(!newPaid)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer shrink-0 ${
                newPaid
                  ? 'bg-[#5E6D55]/30 border-[#5E6D55] text-[#A5CE8C]'
                  : 'bg-[#0D100E] border-[#2A312D] text-[#97A09A]'
              }`}
              title="Marcar se já foi pago"
            >
              {newPaid ? 'Pago ✓' : 'Pendente'}
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#A89AB8] active:scale-[0.98] text-[#0B0D0C] text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </FloatingMineralCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                catFilter === cat
                  ? 'bg-[#F4F1EA] text-[#0B0D0C] font-semibold'
                  : 'bg-[#141816] text-[#97A09A] border border-[#242926] hover:text-[#F4F1EA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {['Todos', 'Pago', 'Pendente'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-[11px] cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#A89AB8]/25 text-[#F4F1EA] border border-[#A89AB8]/50 font-medium'
                  : 'bg-[#141816] text-[#8E9690] border border-[#242926]'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-2 text-xs text-[#A89AB8] font-semibold">
            Subtotal filtro: {formatBRL(filteredTotal)}
          </span>
        </div>
      </div>

      <FloatingMineralCard accent="#5E6D55" disableTilt className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#212623] text-[10px] uppercase tracking-wider text-[#88918B] bg-[#0E110F]">
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Item Individual / Ref.</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Peça Respectiva</th>
                <th className="py-3.5 px-4">Meta de Compra</th>
                <th className="py-3.5 px-4">Já Comprado</th>
                <th className="py-3.5 px-4">Valor (R$)</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B201D] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#161B18]/70 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onTogglePaid(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        item.paid
                          ? 'bg-[#5E6D55]/30 text-[#A5CE8C] border border-[#5E6D55]'
                          : 'bg-[#72293C]/25 text-[#E5A0B0] border border-[#72293C]/60'
                      }`}
                    >
                      {item.paid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{item.paid ? 'Pago' : 'Pendente'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 min-w-[230px]">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onUpdateField(item.id, 'name', e.target.value)}
                      className="bg-transparent font-medium text-[#F4F1EA] focus:outline-none focus:border-b focus:border-[#A89AB8] w-full"
                    />
                    <div className="text-[10px] text-[#7D8680] mt-0.5">{item.notes}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#181D1A] border border-[#272D29] text-[11px] text-[#C4CCC7]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.scope}
                      onChange={(e) => onUpdateField(item.id, 'scope', e.target.value)}
                      className="bg-transparent text-[#D8CEE3] font-medium focus:outline-none focus:border-b focus:border-[#A89AB8] w-44"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.targetQty || ''}
                      onChange={(e) => onUpdateField(item.id, 'targetQty', e.target.value)}
                      className="w-28 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[11px] text-[#F4F1EA]"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.boughtQty || ''}
                      onChange={(e) => onUpdateField(item.id, 'boughtQty', e.target.value)}
                      className={`w-28 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[11px] font-medium ${
                        item.paid ? 'text-[#8BB174]' : 'text-[#A4ADA7]'
                      }`}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => onUpdateField(item.id, 'amount', Number(e.target.value))}
                      className="w-28 px-2.5 py-1 rounded-lg bg-[#0E110F] border border-[#262C28] text-xs font-semibold text-[#F4F1EA]"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-[#757E78] hover:text-[#E598A8] hover:bg-[#1E2320] cursor-pointer"
                      title="Excluir item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FloatingMineralCard>
    </div>
  );
}

function PiecesTab({ pieces, search, onUpdateStage, onUpdateField, onUpdateSize }) {
  const filtered = pieces.filter(
    (p) =>
      !search ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.group || '').toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase())
  );

  const totalLotQty = pieces.reduce((acc, p) => acc + getPieceTotalQty(p), 0);
  const totalLotProduction = pieces.reduce(
    (acc, p) => acc + Number(p.productionTotalCost || 0),
    0
  );
  const totalProjectedSales = pieces.reduce(
    (acc, p) => acc + getPieceTotalQty(p) * Number(p.salePrice || 0),
    0
  );

  return (
    <div className="space-y-6">
      <FloatingMineralCard accent="#A89AB8" disableTilt className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#A89AB8]">
              Mix Oficial • 4 Refs × 6 SKUs (Grade: 7P · 17M · 17G · 3GG · 6TU)
            </span>
            <h3 className="text-base font-medium text-[#F4F1EA] mt-1">
              Camisetas Boxy (3 cores) • Jorts Baggy Mescla • Moletom Zip Oliva/Vinho • Gorro Vinho
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-[#0E110F] border border-[#242926]">
              <span className="text-[#8E9690] block text-[10px] uppercase">Grade Total</span>
              <span className={`font-semibold text-sm ${totalLotQty === 50 ? 'text-[#8BB174]' : 'text-[#E2B979]'}`}>
                {totalLotQty} / 50 peças
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#0E110F] border border-[#242926]">
              <span className="text-[#8E9690] block text-[10px] uppercase">Produção BH</span>
              <span className="font-semibold text-sm text-[#F4F1EA]">
                {formatBRL(totalLotProduction)}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#0E110F] border border-[#242926]">
              <span className="text-[#8E9690] block text-[10px] uppercase">Meta Faturamento</span>
              <span className="font-semibold text-sm text-[#8BB174]">
                {formatBRL(totalProjectedSales)}
              </span>
            </div>
          </div>
        </div>
      </FloatingMineralCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((piece) => {
          const pieceQty = getPieceTotalQty(piece);
          const unitCostMoq = pieceQty > 0 ? Number(piece.productionTotalCost || 0) / pieceQty : 0;
          const progress = Math.round((piece.stageIndex / (PRODUCTION_STAGES.length - 1)) * 100);
          const isBeanie = piece.id === 'VY-06';

          return (
            <FloatingMineralCard key={piece.id} accent={piece.accent} disableTilt className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold text-[#0B0D0C]"
                      style={{ backgroundColor: piece.accent }}
                    >
                      {piece.code}
                    </span>
                    <span className="text-[11px] font-medium text-[#A89AB8]">
                      {piece.group}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#F4F1EA] mt-1.5">{piece.name}</h4>
                  <div className="text-[11px] text-[#7D8680]">{piece.mineral}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase text-[#8E9690]">Total Peça</div>
                  <div className="text-base font-bold text-[#F4F1EA]">{pieceQty} un</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0E110F] border border-[#222724]">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8E9690] mb-2">
                  <span>{isBeanie ? 'Grade (TU — Tamanho Único)' : 'Grade de Tamanhos (Editável)'}</span>
                  <span>Peso compra: {Number(piece.fabricWeightKg || 0).toFixed(4)} kg</span>
                </div>
                {isBeanie ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-[#C4CCC7]">Tamanho Único (TU)</span>
                    <input
                      type="number"
                      min="0"
                      value={piece.sizes?.TU ?? 6}
                      onChange={(e) => onUpdateSize(piece.id, 'TU', e.target.value)}
                      className="w-20 px-2.5 py-1 rounded-lg bg-[#151917] border border-[#2A312D] text-center text-xs font-semibold text-[#F4F1EA]"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {['P', 'M', 'G', 'GG'].map((sz) => (
                      <div key={sz} className="text-center">
                        <label className="block text-[10px] font-semibold text-[#A89AB8] mb-1">
                          {sz}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={piece.sizes?.[sz] ?? 0}
                          onChange={(e) => onUpdateSize(piece.id, sz, e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-[#151917] border border-[#2A312D] text-center text-xs font-semibold text-[#F4F1EA]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-[#A4ADA7] space-y-1">
                <div>
                  <strong className="text-[#D1D3D4]">Base Têxtil:</strong> {piece.fabric}
                </div>
                <div>
                  <strong className="text-[#D1D3D4]">Acabamentos:</strong> {piece.trims}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#8E9690]">
                    Etapa: <strong className="text-[#F4F1EA]">{PRODUCTION_STAGES[piece.stageIndex]}</strong>
                  </span>
                  <span className="text-[#A89AB8] font-semibold">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={PRODUCTION_STAGES.length - 1}
                  value={piece.stageIndex}
                  onChange={(e) => onUpdateStage(piece.id, Number(e.target.value))}
                  className="w-full accent-[#A89AB8] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2320] text-xs">
                <div>
                  <span className="text-[10px] text-[#7D8680] block">Total BH (MOQ)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={piece.productionTotalCost}
                    onChange={(e) =>
                      onUpdateField(piece.id, 'productionTotalCost', Number(e.target.value))
                    }
                    className="w-full mt-0.5 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[#F4F1EA] font-semibold"
                  />
                  <span className="text-[10px] text-[#7D8680] block mt-0.5">
                    Unit: {formatBRL(unitCostMoq)} (Efet. {formatBRL(piece.effectiveUnitCost)})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7D8680] block">Preço Venda</span>
                  <input
                    type="number"
                    step="0.1"
                    value={piece.salePrice}
                    onChange={(e) => onUpdateField(piece.id, 'salePrice', Number(e.target.value))}
                    className="w-full mt-0.5 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[#8BB174] font-semibold"
                  />
                </div>
                <div className="text-right flex flex-col justify-center">
                  <span className="text-[10px] text-[#7D8680]">Faturamento SKU</span>
                  <span className="font-semibold text-[#F4F1EA] mt-1">
                    {formatBRL(pieceQty * piece.salePrice)}
                  </span>
                </div>
              </div>
            </FloatingMineralCard>
          );
        })}
      </div>
    </div>
  );
}

function SalesTab({ sales, stats, search, onCycleStatus, onToggleDelivered, onAdd, onDelete }) {
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [customer, setCustomer] = useState('');
  const [variant, setVariant] = useState('Amarela');
  const [qty, setQty] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('Pago');

  const filtered = sales.filter((s) => {
    const matchStatus = statusFilter === 'Todos' || s.paymentStatus === statusFilter;
    const matchSearch =
      !search ||
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.variant.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (!customer.trim()) return;
    onAdd({
      customer: customer.trim(),
      variant,
      qty: Number(qty) || 1,
      unitPrice: paymentStatus === 'Cortesia' ? 0 : 219.9,
      paymentStatus,
      note: 'Novo lançamento'
    });
    setCustomer('');
    setQty(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FloatingMineralCard accent="#5E6D55" className="p-5">
          <div className="text-xs text-[#8E9690]">Caixa Recebido (Pagos HEXA)</div>
          <div className="text-2xl font-semibold text-[#8BB174] mt-1">
            {formatBRL(stats.salesPaidTotal)}
          </div>
          <div className="text-[11px] text-[#7D8680] mt-1">
            {stats.salesPaidQty} peças × R$ 219,90
          </div>
        </FloatingMineralCard>

        <FloatingMineralCard accent="#72293C" className="p-5">
          <div className="text-xs text-[#8E9690]">A Receber (Não Pagos HEXA)</div>
          <div className="text-2xl font-semibold text-[#E2B979] mt-1">
            {formatBRL(stats.salesPendingTotal)}
          </div>
          <div className="text-[11px] text-[#7D8680] mt-1">
            {stats.salesPendingQty} peças pendentes (clique no status para dar baixa)
          </div>
        </FloatingMineralCard>

        <FloatingMineralCard accent="#A89AB8" className="p-5">
          <div className="text-xs text-[#8E9690]">Potencial Total HEXA CLUB</div>
          <div className="text-2xl font-semibold text-[#F4F1EA] mt-1">
            {formatBRL(stats.salesPaidTotal + stats.salesPendingTotal)}
          </div>
          <div className="text-[11px] text-[#7D8680] mt-1">
            + {stats.salesCourtesyQty} cortesias registradas (R$ 0,00)
          </div>
        </FloatingMineralCard>
      </div>

      <FloatingMineralCard accent="#A89AB8" disableTilt className="p-5">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Nome do cliente"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="lg:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA]"
          />
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA]"
          >
            <option value="Amarela">Amarela</option>
            <option value="Verde">Verde</option>
          </select>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA]"
          >
            <option value="Pago">Pago (R$ 219,90)</option>
            <option value="Não pago">Não pago</option>
            <option value="Cortesia">Cortesia (R$ 0)</option>
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#A89AB8] text-[#0B0D0C] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Venda</span>
          </button>
        </form>
      </FloatingMineralCard>

      <div className="flex flex-wrap items-center gap-2">
        {['Todos', 'Pago', 'Não pago', 'Cortesia'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs cursor-pointer ${
              statusFilter === st
                ? 'bg-[#F4F1EA] text-[#0B0D0C] font-semibold'
                : 'bg-[#141816] text-[#97A09A] border border-[#242926]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <FloatingMineralCard accent="#5E6D55" disableTilt className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#212623] text-[10px] uppercase tracking-wider text-[#88918B] bg-[#0E110F]">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Cor</th>
                <th className="py-3 px-4">Qtd</th>
                <th className="py-3 px-4">Pagamento (Clique p/ alterar)</th>
                <th className="py-3 px-4">Entrega</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Obs</th>
                <th className="py-3 px-4 text-right">Excluir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B201D] text-xs">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#161B18]/70">
                  <td className="py-3 px-4 font-medium text-[#F4F1EA]">{s.customer}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] ${
                        s.variant === 'Amarela'
                          ? 'bg-[#E2B979]/15 text-[#E2B979]'
                          : 'bg-[#5E6D55]/25 text-[#9EC785]'
                      }`}
                    >
                      {s.variant}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#C4CCC7]">{s.qty}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onCycleStatus(s.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer ${
                        s.paymentStatus === 'Pago'
                          ? 'bg-[#5E6D55]/30 text-[#A5CE8C] border border-[#5E6D55]'
                          : s.paymentStatus === 'Cortesia'
                          ? 'bg-[#A89AB8]/20 text-[#D8CEE3] border border-[#A89AB8]/40'
                          : 'bg-[#72293C]/30 text-[#E8A2B2] border border-[#72293C]'
                      }`}
                    >
                      {s.paymentStatus}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleDelivered(s.id)}
                      className="text-[11px] text-[#B8C0BB] hover:underline cursor-pointer"
                    >
                      {s.delivered ? '✅ Entregue' : '⏳ Pendente'}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F4F1EA]">
                    {formatBRL(s.qty * s.unitPrice)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#7D8680]">{s.note}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(s.id)}
                      className="p-1.5 rounded-lg text-[#757E78] hover:text-[#E598A8] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FloatingMineralCard>
    </div>
  );
}

function PartnersTab({ stats, config, onUpdateConfig }) {
  return (
    <div className="space-y-6">
      <FloatingMineralCard accent="#A89AB8" disableTilt className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#A89AB8]">
              Engenharia de Aporte • Regra Proporcional
            </span>
            <h3 className="text-lg font-medium text-[#F4F1EA] mt-1">
              Divisão entre Jonatas, Marcos Paulo e DJ Discroll
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#9AA39D] leading-relaxed">
          O <strong>DJ Discroll</strong> participa apenas com uma cota leve sobre os custos de
          gravação do Home Set + Lookbook (Casa Vilas Boas + técnica BH ={' '}
          <strong>{formatBRL(stats.setCostTotal)}</strong>), com teto máximo configurável para não
          pesar para ele. Todo o restante do teto da coleção ({formatBRL(stats.totalProjectCost)}) é
          abatido pelo caixa já recebido da HEXA CLUB ({formatBRL(stats.salesPaidTotal)}) e dividido
          igualmente entre <strong>Jonatas</strong> e <strong>Marcos Paulo</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[#0E110F] border border-[#242926]">
            <label className="block text-[11px] text-[#8E9690] mb-1">
              % do Discroll (apenas sobre o Set)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={config.discrollSetSharePct}
              onChange={(e) => onUpdateConfig({ discrollSetSharePct: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#151917] border border-[#2B322E] text-sm font-semibold text-[#F4F1EA]"
            />
          </div>
          <div className="p-3.5 rounded-xl bg-[#0E110F] border border-[#242926]">
            <label className="block text-[11px] text-[#8E9690] mb-1">
              Teto Máximo Discroll (R$)
            </label>
            <input
              type="number"
              step="50"
              value={config.discrollCap}
              onChange={(e) => onUpdateConfig({ discrollCap: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#151917] border border-[#2B322E] text-sm font-semibold text-[#F4F1EA]"
            />
          </div>
          <div className="p-3.5 rounded-xl bg-[#0E110F] border border-[#242926]">
            <label className="block text-[11px] text-[#8E9690] mb-1">
              Reserva Extra Imprevistos (R$)
            </label>
            <input
              type="number"
              step="50"
              value={config.contingencyReserve}
              onChange={(e) => onUpdateConfig({ contingencyReserve: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#151917] border border-[#2B322E] text-sm font-semibold text-[#F4F1EA]"
            />
          </div>
        </div>
      </FloatingMineralCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FloatingMineralCard accent="#5E6D55" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8BB174]">Co-Founder & CEO</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5E6D55]/25 text-[11px] text-[#A5CE8C]">
              50% Saldo Líquido
            </span>
          </div>
          <h4 className="text-xl font-semibold text-[#F4F1EA]">Jonatas</h4>
          <div className="text-3xl font-bold text-[#F4F1EA]">{formatBRL(stats.jonatasShare)}</div>
          <p className="text-xs text-[#8C948E]">
            Se todos os pendentes da HEXA pagarem ({formatBRL(stats.salesPendingTotal)}), seu aporte cai para{' '}
            <strong className="text-[#8BB174]">{formatBRL(stats.netNeedIfAllPaid / 2)}</strong>.
          </p>
        </FloatingMineralCard>

        <FloatingMineralCard accent="#5E6D55" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8BB174]">Co-Founder</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5E6D55]/25 text-[11px] text-[#A5CE8C]">
              50% Saldo Líquido
            </span>
          </div>
          <h4 className="text-xl font-semibold text-[#F4F1EA]">Marcos Paulo</h4>
          <div className="text-3xl font-bold text-[#F4F1EA]">{formatBRL(stats.marcosShare)}</div>
          <p className="text-xs text-[#8C948E]">
            Se todos os pendentes da HEXA pagarem, seu aporte cai para{' '}
            <strong className="text-[#8BB174]">{formatBRL(stats.netNeedIfAllPaid / 2)}</strong>.
          </p>
        </FloatingMineralCard>

        <FloatingMineralCard accent="#A89AB8" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#A89AB8]">Parceiro Musical</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#A89AB8]/20 text-[11px] text-[#D8CEE3]">
              Apenas Set Julho
            </span>
          </div>
          <h4 className="text-xl font-semibold text-[#F4F1EA]">DJ Discroll</h4>
          <div className="text-3xl font-bold text-[#A89AB8]">{formatBRL(stats.discrollShare)}</div>
          <p className="text-xs text-[#8C948E]">
            Isento dos custos de confecção das roupas. Contribui apenas na estrutura audiovisual do Set.
          </p>
        </FloatingMineralCard>
      </div>
    </div>
  );
}

function CalendarTab({ calendar, onToggleTask, onAddTask, onUpdateDays }) {
  const [taskInputs, setTaskInputs] = useState({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {calendar.map((block) => (
        <FloatingMineralCard
          key={block.id}
          accent={block.month.includes('Julho') ? '#A89AB8' : '#5E6D55'}
          disableTilt
          className="p-5 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-[#1A201D] text-xs font-semibold text-[#A89AB8]">
                {block.month}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#8E9690]">
                <Clock className="w-3 h-3" />
                <span>Prazo médio:</span>
                <input
                  type="number"
                  value={block.avgDays}
                  onChange={(e) => onUpdateDays(block.id, e.target.value)}
                  className="w-11 px-1.5 py-0.5 rounded bg-[#0E110F] border border-[#252B27] text-center text-[#F4F1EA] font-semibold"
                />
                <span>d</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-[#F4F1EA]">{block.title}</h4>

            <div className="space-y-2 pt-1">
              {block.tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask(block.id, task.id)}
                  className="w-full flex items-start gap-2.5 text-left text-xs group cursor-pointer"
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      task.done
                        ? 'bg-[#5E6D55] border-[#5E6D55] text-[#F4F1EA]'
                        : 'border-[#353D38] group-hover:border-[#A89AB8]'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3" />}
                  </span>
                  <span className={task.done ? 'line-through text-[#767F79]' : 'text-[#C8D0CB]'}>
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddTask(block.id, taskInputs[block.id] || '');
              setTaskInputs({ ...taskInputs, [block.id]: '' });
            }}
            className="pt-3 border-t border-[#1E2320] flex gap-2"
          >
            <input
              type="text"
              placeholder="Nova entrega..."
              value={taskInputs[block.id] || ''}
              onChange={(e) => setTaskInputs({ ...taskInputs, [block.id]: e.target.value })}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0E110F] border border-[#242926] text-[11px] text-[#F4F1EA]"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-lg bg-[#1C221F] hover:bg-[#A89AB8] hover:text-[#0B0D0C] text-xs cursor-pointer"
            >
              +
            </button>
          </form>
        </FloatingMineralCard>
      ))}
    </div>
  );
}

function AdsTab({ ads, onUpdateField, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [platform] = useState('Meta Ads (IG + Feed)');
  const [budget, setBudget] = useState('');

  const totalBudget = ads.reduce((a, b) => a + Number(b.budget || 0), 0);
  const totalSpent = ads.reduce((a, b) => a + Number(b.spent || 0), 0);

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !budget) return;
    onAdd({
      name: name.trim(),
      platform,
      phase: 'Lançamento (Ago/27)',
      budget: Number(budget)
    });
    setName('');
    setBudget('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FloatingMineralCard accent="#A89AB8" className="p-5">
          <div className="text-xs text-[#8E9690]">Orçamento Total Tráfego (Meta Ads)</div>
          <div className="text-2xl font-semibold text-[#F4F1EA] mt-1">{formatBRL(totalBudget)}</div>
          <div className="text-[11px] text-[#7D8680] mt-1">Meta: R$ 20/dia × 60 dias</div>
        </FloatingMineralCard>
        <FloatingMineralCard accent="#5E6D55" className="p-5">
          <div className="text-xs text-[#8E9690]">Investido até Agora</div>
          <div className="text-2xl font-semibold text-[#8BB174] mt-1">{formatBRL(totalSpent)}</div>
        </FloatingMineralCard>
        <FloatingMineralCard accent="#72293C" className="p-5">
          <div className="text-xs text-[#8E9690]">Saldo Disponível Mídia</div>
          <div className="text-2xl font-semibold text-[#A89AB8] mt-1">
            {formatBRL(Math.max(0, totalBudget - totalSpent))}
          </div>
        </FloatingMineralCard>
      </div>

      <FloatingMineralCard accent="#A89AB8" disableTilt className="p-5">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Nome da campanha"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA]"
          />
          <input
            type="number"
            placeholder="Orçamento (R$)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0D100E] border border-[#2A312D] text-xs text-[#F4F1EA]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#A89AB8] text-[#0B0D0C] text-xs font-semibold cursor-pointer"
          >
            + Nova Campanha
          </button>
        </form>
      </FloatingMineralCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ads.map((ad) => (
          <FloatingMineralCard key={ad.id} accent="#A89AB8" disableTilt className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#A89AB8]">
                {ad.platform}
              </span>
              <button
                type="button"
                onClick={() => onDelete(ad.id)}
                className="text-[#757E78] hover:text-[#E598A8] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-[#F4F1EA]">{ad.name}</h4>
            <div className="text-[11px] text-[#8E9690]">{ad.phase}</div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2320] text-xs">
              <div>
                <span className="text-[10px] text-[#7D8680] block">Orçamento (R$)</span>
                <input
                  type="number"
                  value={ad.budget}
                  onChange={(e) => onUpdateField(ad.id, 'budget', Number(e.target.value))}
                  className="w-full mt-0.5 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[#F4F1EA]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#7D8680] block">Gasto Real (R$)</span>
                <input
                  type="number"
                  value={ad.spent}
                  onChange={(e) => onUpdateField(ad.id, 'spent', Number(e.target.value))}
                  className="w-full mt-0.5 px-2 py-1 rounded bg-[#0E110F] border border-[#242926] text-[#8BB174] font-semibold"
                />
              </div>
            </div>
          </FloatingMineralCard>
        ))}
      </div>
    </div>
  );
}
