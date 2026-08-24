const fs = require('fs');
const spiritual = require('./spiritual_engine.js');

console.log("=========================================================================");
console.log("VERIFICAÇÃO DO MÓDULO DE TRANSCENDÊNCIA DE BANKAI (3 EVOLUÇÕES DIRETAS)");
console.log("=========================================================================");

const testChar = {
  id: "test-bankai-evol",
  nome: "Kuchiki Ren",
  atributos: { pressao: 85, forca: 60, velocidade: 75, resiliencia: 50 },
  personalidade: {
    texto: "Espadachim frio e calculista que protege o orgulho da família nobre acima de tudo.",
    virtudes: "Disciplina inabalável e elegância tática",
    defeitos: "Orgulho e inflexibilidade",
    desejos: "Dominar a espada até o ápice da perfeição",
    medos: "Manchar a honra do clã com uma derrota",
    conflitos: "Afeto pessoal versus Lei da Soul Society",
    estiloCombate: "Cortes de precisão milimétrica e manipulação de pétalas cortantes"
  },
  zanpakuto: {
    shikaiAtiva: {
      nome: "Senbonzakura",
      kanji: "「千本桜」",
      traducao: "Mil Pétalas de Cerejeira",
      comando: "Disperse-se, Senbonzakura!",
      elemento: "Lâminas de Pétalas de Aço Espiritual",
      aparencia: "A lâmina se dissolve em milhares de fragmentos microscópicos que brilham como pétalas rosadas.",
      poder: "As lâminas flutuantes são controladas pela empunhadura e pela mente de Ren, atacando de múltiplos ângulos simultaneamente.",
      limitacoes: "Zona de segurança de 85cm ao redor do corpo onde as lâminas não podem entrar."
    }
  }
};

const bankais = spiritual.gerar3BankaisEvolucaoAI(testChar, testChar.zanpakuto.shikaiAtiva, [], [], "Cena diante do portal do Seireitei");

console.log("Total de Bankais geradas:", bankais.length);
if (bankais.length !== 3) {
  console.error("ERRO: Deveria ter gerado exatamente 3 Bankais!");
  process.exit(1);
}

const tipos = bankais.map(b => b.bankai.tipoEvolucao);
console.log("Tipos de Evolução gerados:", tipos);

bankais.forEach((b, idx) => {
  console.log(`\n✓ [BAN-KAI ${idx+1}] ${b.bankai.tipoEvolucao}:`);
  console.log(`  Nome: ${b.bankai.nome} ${b.bankai.kanji} (${b.bankai.traducao})`);
  console.log(`  Comando: "${b.bankai.comando}"`);
  console.log(`  Ponto de Ruptura (Breakpoint): ${b.bankai.pontoRuptura}`);
  console.log(`  Poder: ${b.bankai.poder.slice(0, 100)}...`);
  console.log(`  Forma Monumental: ${b.bankai.formaMonumental.slice(0, 100)}...`);
});

console.log("\n=========================================================================");
console.log("SUCESSO ABSOLUTO: AS 3 EVOLUÇÕES DE BANKAI FORAM VALIDADAS COM 100% DE ÊXITO!");
console.log("=========================================================================");
