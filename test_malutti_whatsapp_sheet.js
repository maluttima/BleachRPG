const assert = require('assert');
const fs = require('fs');
const { gerarFichaFormatadaMalutti, copiarFichaFormatadaWhatsApp } = require('./spiritual_engine.js');

console.log("=== INICIANDO TESTE DO MOLDE OFICIAL WHATSAPP (MADE BY MALUTTI) ===");

const charMock = {
  id: "char-123",
  nome: "Kurogane Ren",
  whatsapp: "5511988885476",
  idadePlayer: "22",
  aniversarioPlayer: "06/04/2002",
  idadeChar: "18",
  aniversarioChar: "15/07",
  faceclaim: "Freya Mavor",
  raca: "Shinigami",
  esquadrao: "11º Esquadrão",
  estado: "Inteiro",
  atributos: {
    pressao: 55,
    forca: 45,
    velocidade: 40,
    resiliencia: 50
  },
  zanpakuto: {
    nome: "Enzan",
    shikaiAtiva: {
      nome: "Enzan",
      comando: "Estabeleça a ordem no caos da alma, Enzan!",
      elemento: "Ressonância Harmônica & Vibração Molecular",
      poder: "Emite ondas de choque sónicas através do ar..."
    },
    bankaiAtiva: {
      nome: "Enzan: Jikū Kaiji no Judai",
      comando: "Ban-kai! Imponha a lei sagrada da harmonia, Enzan!",
      tipo: "Imposição Territorial de Leis Absolutas"
    }
  },
  tecnicas: [
    { id: "1", nome: "Byakurai", categoria: "Hadō #4" },
    { id: "2", nome: "Sai", categoria: "Bakudō #1" },
    { id: "3", nome: "Rikujōkōrō", categoria: "Bakudō #61" }
  ],
  personalidade: {
    texto: "Guerreiro focado na disciplina interior e honra.",
    virtudes: "Lealdade inabalável e calma estratégica.",
    defeitos: "Orgulho excessivo sob provocação direta.",
    desejos: "Dominar a Bankai com maestria absoluta.",
    medos: "Trair a confiança de seus companheiros de divisão.",
    estiloCombate: "Combate rítmico intercalando investidas de Zanjutsu e contenções de Bakudō."
  }
};

const textoFicha = gerarFichaFormatadaMalutti(charMock);
console.log("\n--- PRÉVIA DA FICHA GERADA ---");
console.log(textoFicha);
console.log("-------------------------------\n");

// VALIDAÇÕES
assert.ok(textoFicha.includes("Made By Malutti") || textoFicha.includes("𝗠𝗮𝗱𝗲 𝗕𝘆 𝗠𝗮𝗹𝘂𝘁𝘁𝗶"), "Deve conter a assinatura Made By Malutti");
assert.ok(textoFicha.includes("5476"), "Deve conter os 4 dígitos do WhatsApp");
assert.ok(textoFicha.includes("Kurogane Ren"), "Deve conter o nome do personagem");
assert.ok(textoFicha.includes("Freya Mavor"), "Deve conter o Faceclaim");
assert.ok(textoFicha.includes("pɾessɑ̃o espı́ɾituɑl: 55"), "Deve conter Pressão Espiritual");
assert.ok(textoFicha.includes("foɾçɑ: 45"), "Deve conter Força");
assert.ok(textoFicha.includes("velocidɑde: 40"), "Deve conter Velocidade");
assert.ok(textoFicha.includes("ɾesiliênciɑ: 50"), "Deve conter Resiliência");
assert.ok(textoFicha.includes("Estabeleça a ordem no caos da alma, Enzan!"), "Deve conter o comando de Shikai");
assert.ok(textoFicha.includes("Enzan: Jikū Kaiji no Judai"), "Deve conter o nome da Bankai");
assert.ok(textoFicha.includes("TERMO DE CONSENTIMENTO") || textoFicha.includes("𝗧𝗘𝗥𝗠𝗢 𝗗𝗘 𝗖𝗢𝗡𝗦𝗘𝗡𝗧𝗜𝗠𝗘𝗡𝗧𝗢"), "Deve conter o termo de consentimento");

// TESTE COM PERSONAGEM BÁSICO
const charBasico = {
  nome: "Novato Ichiro",
  atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 }
};
const textoBasico = gerarFichaFormatadaMalutti(charBasico);
assert.ok(textoBasico.includes("Novato Ichiro"), "Deve formatar personagem básico");
assert.ok(textoBasico.includes("Made By Malutti") || textoBasico.includes("𝗠𝗮𝗱𝗲 𝗕𝘆 𝗠𝗮𝗹𝘂𝘁𝘁𝗶"), "Personagem básico deve ter assinatura Made By Malutti");

console.log("✓ Todos os testes do Molde Oficial WhatsApp (Made By Malutti) passaram com 100% de sucesso!");
