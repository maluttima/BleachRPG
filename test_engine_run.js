const engine = require('./spiritual_engine.js');

const testChar = {
  nome: 'Kurosaki Ren',
  atributos: { pressao: 45, forca: 30, velocidade: 60, resiliencia: 25 },
  personalidade: {
    texto: 'Um guerreiro calmo e analítico que valoriza o autocontrole e o dever, mas teme perder o controle de suas emoções.',
    virtudes: 'Foco inabalável, honra e paciência estratégica',
    defeitos: 'Dificuldade de confiar plenamente nos outros',
    desejos: 'Proteger seus amigos sem ser um fardo',
    medos: 'Ser impotente diante de um massacre',
    conflitos: 'Obedecer ordens versus seguir sua bússola moral'
  }
};

const dna = engine.construirDnaEspiritual(testChar);
console.log("DNA Dominante:", dna.dominante.label, "(", dna.dominante.val, ")");
console.log("DNA Deficiente:", dna.deficiente.label, "(", dna.deficiente.val, ")");
console.log("Princípio Espiritual:", dna.principioEspiritual);

const caminhos = engine.gerar4CaminhosZanpakutoAI(testChar, [], []);
console.log("\nTOTAL DE CAMINHOS GERADOS:", caminhos.length);

caminhos.forEach((c, idx) => {
  console.log("\n--- CAMINHO " + (idx+1) + ": " + c.tipoCaminho + " ---");
  console.log("Shikai:", c.shikai.nome, " | ", c.shikai.comando, " | Elemento:", c.shikai.elemento);
  console.log("Natureza:", c.shikai.natureza);
  console.log("Poder:", c.shikai.poder.slice(0, 100) + "...");
  console.log("Indices:", c.shikai.indices);
  console.log("Bankai Correspondente:", c.bankai.nome, " | Tipo:", c.bankai.tipoEvolucao);
  console.log("Bankai Poder:", c.bankai.poder.slice(0, 100) + "...");
});
