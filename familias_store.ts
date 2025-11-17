// familias.store.ts

// =========================
// Tipos e utilitários
// =========================
export type UUID = string;

export interface Eletronico {
  id: UUID;
  nome: string;
  gasto: number;        // gasto do eletrodoméstico (ex.: kWh/mês ou R$/mês — defina o padrão)
  voltagem: number;     // 110, 127, 220...
  tempoLigado: number;  // horas/dia ou min/dia (mantenha consistente no app)
}

export interface Membro {
  id: UUID;   
  nome: string;
  gasto: number;            // gasto total do membro (sempre recalculado = soma dos eletrônicos)
  eletronicos: Eletronico[];
}

export interface Familia {
  id: UUID;
  nome: string;
  membros: Membro[];
  criadoEm: string;         // ISO string
  atualizadoEm: string;     // ISO string
}

const STORAGE_KEY = "APP_FAMILIAS_V1";

// Gera UUID de forma segura quando disponível
const genId = (): UUID =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);

// Parse seguro do localStorage
function loadAll(): Familia[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // opcional: validar estrutura mínima
    return parsed as Familia[];
  } catch {
    return [];
  }
}

function saveAll(familias: Familia[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(familias));
}

function nowIso(): string {
  return new Date().toISOString();
}

// Regra de negócio: o gasto do membro é a soma dos gastos dos eletrônicos
function recomputaGasto(m: Membro): Membro {
  const total = m.eletronicos.reduce((acc, e) => acc + (Number(e.gasto) || 0), 0);
  return { ...m, gasto: Number(total.toFixed(6)) }; // fixa precisão para evitar ruído de ponto flutuante
}

// =========================
// Repositório (CRUD)
// =========================
export const FamiliaRepo = {
  // ------- Família -------
  list(): Familia[] {
    return loadAll();
  },

  getById(familiaId: UUID): Familia | undefined {
    return loadAll().find(f => f.id === familiaId);
  },

  create(nome: string): Familia {
    const now = nowIso();
    const nova: Familia = {
      id: genId(),
      nome: nome.trim(),
      membros: [],
      criadoEm: now,
      atualizadoEm: now,
    };
    const all = loadAll();
    all.push(nova);
    saveAll(all);
    return nova;
  },

  update(familiaId: UUID, updates: Partial<Pick<Familia, "nome">>): Familia {
    const all = loadAll();
    const idx = all.findIndex(f => f.id === familiaId);
    if (idx < 0) throw new Error("Família não encontrada");

    const atual = all[idx];
    const atualizado: Familia = {
      ...atual,
      ...updates,
      atualizadoEm: nowIso(),
    };
    all[idx] = atualizado;
    saveAll(all);
    return atualizado;
  },

  delete(familiaId: UUID): void {
    const all = loadAll();
    const after = all.filter(f => f.id !== familiaId);
    if (after.length === all.length) throw new Error("Família não encontrada");
    saveAll(after);
  },

  // ------- Membro -------
  addMembro(familiaId: UUID, nome: string): Membro {
    const all = loadAll();
    const idx = all.findIndex(f => f.id === familiaId);
    if (idx < 0) throw new Error("Família não encontrada");

    const membro: Membro = {
      id: genId(),
      nome: nome.trim(),
      eletronicos: [],
      gasto: 0,
    };

    const fam = all[idx];
    const novaFamilia: Familia = {
      ...fam,
      membros: [...fam.membros, membro],
      atualizadoEm: nowIso(),
    };

    all[idx] = novaFamilia;
    saveAll(all);
    return membro;
  },

  updateMembro(familiaId: UUID, membroId: UUID, updates: Partial<Pick<Membro, "nome">>): Membro {
    const all = loadAll();
    const fIdx = all.findIndex(f => f.id === familiaId);
    if (fIdx < 0) throw new Error("Família não encontrada");

    const fam = all[fIdx];
    const mIdx = fam.membros.findIndex(m => m.id === membroId);
    if (mIdx < 0) throw new Error("Membro não encontrado");

    const atual = fam.membros[mIdx];
    // Como o gasto é derivado, não aceitamos updates.gasto diretamente
    const atualizado = recomputaGasto({ ...atual, ...updates });

    const novaFamilia: Familia = {
      ...fam,
      membros: [
        ...fam.membros.slice(0, mIdx),
        atualizado,
        ...fam.membros.slice(mIdx + 1),
      ],
      atualizadoEm: nowIso(),
    };

    all[fIdx] = novaFamilia;
    saveAll(all);
    return atualizado;
  },

  deleteMembro(familiaId: UUID, membroId: UUID): void {
    const all = loadAll();
    const fIdx = all.findIndex(f => f.id === familiaId);
    if (fIdx < 0) throw new Error("Família não encontrada");

    const fam = all[fIdx];
    const after = fam.membros.filter(m => m.id !== membroId);
    if (after.length === fam.membros.length) throw new Error("Membro não encontrado");

    all[fIdx] = {
      ...fam,
      membros: after,
      atualizadoEm: nowIso(),
    };
    saveAll(all);
  },

  // ------- Eletrônico -------
  addEletronico(
    familiaId: UUID,
    membroId: UUID,
    data: Omit<Eletronico, "id">
  ): Eletronico {
    const all = loadAll();
    const fIdx = all.findIndex(f => f.id === familiaId);
    if (fIdx < 0) throw new Error("Família não encontrada");
    const fam = all[fIdx];

    const mIdx = fam.membros.findIndex(m => m.id === membroId);
    if (mIdx < 0) throw new Error("Membro não encontrado");

    const novo: Eletronico = { id: genId(), ...data };

    const membroAtual = fam.membros[mIdx];
    const membroNovo = recomputaGasto({
      ...membroAtual,
      eletronicos: [...membroAtual.eletronicos, novo],
    });

    const novaFamilia: Familia = {
      ...fam,
      membros: [
        ...fam.membros.slice(0, mIdx),
        membroNovo,
        ...fam.membros.slice(mIdx + 1),
      ],
      atualizadoEm: nowIso(),
    };

    all[fIdx] = novaFamilia;
    saveAll(all);
    return novo;
  },

  updateEletronico(
    familiaId: UUID,
    membroId: UUID,
    eletronicoId: UUID,
    updates: Partial<Omit<Eletronico, "id">>
  ): Eletronico {
    const all = loadAll();
    const fIdx = all.findIndex(f => f.id === familiaId);
    if (fIdx < 0) throw new Error("Família não encontrada");
    const fam = all[fIdx];

    const mIdx = fam.membros.findIndex(m => m.id === membroId);
    if (mIdx < 0) throw new Error("Membro não encontrado");

    const membroAtual = fam.membros[mIdx];
    const eIdx = membroAtual.eletronicos.findIndex(e => e.id === eletronicoId);
    if (eIdx < 0) throw new Error("Eletrônico não encontrado");

    const atual = membroAtual.eletronicos[eIdx];
    const atualizado: Eletronico = { ...atual, ...updates };

    const eletronicos = [
      ...membroAtual.eletronicos.slice(0, eIdx),
      atualizado,
      ...membroAtual.eletronicos.slice(eIdx + 1),
    ];
    const membroNovo = recomputaGasto({ ...membroAtual, eletronicos });

    const novaFamilia: Familia = {
      ...fam,
      membros: [
        ...fam.membros.slice(0, mIdx),
        membroNovo,
        ...fam.membros.slice(mIdx + 1),
      ],
      atualizadoEm: nowIso(),
    };

    all[fIdx] = novaFamilia;
    saveAll(all);
    return atualizado;
  },

  deleteEletronico(familiaId: UUID, membroId: UUID, eletronicoId: UUID): void {
    const all = loadAll();
    const fIdx = all.findIndex(f => f.id === familiaId);
    if (fIdx < 0) throw new Error("Família não encontrada");
    const fam = all[fIdx];

    const mIdx = fam.membros.findIndex(m => m.id === membroId);
    if (mIdx < 0) throw new Error("Membro não encontrado");

    const membroAtual = fam.membros[mIdx];
    const after = membroAtual.eletronicos.filter(e => e.id !== eletronicoId);
    if (after.length === membroAtual.eletronicos.length)
      throw new Error("Eletrônico não encontrado");

    const membroNovo = recomputaGasto({ ...membroAtual, eletronicos: after });

    all[fIdx] = {
      ...fam,
      membros: [
        ...fam.membros.slice(0, mIdx),
        membroNovo,
        ...fam.membros.slice(mIdx + 1),
      ],
      atualizadoEm: nowIso(),
    };
    saveAll(all);
  },

  // ------- Auxiliares -------
  clearAll(): void {
    saveAll([]);
  },
};

// =========================
// Exemplo rápido de uso
// =========================
// (remova os comentários abaixo para testar no navegador)
// ;(() => {
//   // 1) Criar família
//   const fam = FamiliaRepo.create("Família Silva");
//
//   // 2) Adicionar membros
//   const m1 = FamiliaRepo.addMembro(fam.id, "Ana");
//   const m2 = FamiliaRepo.addMembro(fam.id, "Carlos");
//
//   // 3) Adicionar eletrônicos para Ana
//   FamiliaRepo.addEletronico(fam.id, m1.id, {
//     nome: "Geladeira",
//     gasto: 30,
//     voltagem: 127,
//     tempoLigado: 24,
//   });
//   FamiliaRepo.addEletronico(fam.id, m1.id, {
//     nome: "TV",
//     gasto: 8,
//     voltagem: 127,
//     tempoLigado: 4,
//   });
//
//   // 4) Atualizar nome do membro
//   FamiliaRepo.updateMembro(fam.id, m2.id, { nome: "Carlos Silva" });
//
//   // 5) Listar e inspecionar
//   console.log("Todas as famílias:", FamiliaRepo.list());
//   console.log("Família por ID:", FamiliaRepo.getById(fam.id));
// })();
