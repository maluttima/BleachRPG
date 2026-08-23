// =========================================================================
// VIEWS PART 3: ADMINPANEL, SISTEMASVIEW & ROOT RENDER
// =========================================================================

// TAB: ADMIN PANEL
function AdminPanel({ db, saveDb, session, cloudStatus, onAbrirFicha }) {
  const isSuper = session?.role === "super_admin";
  const [adminTab, setAdminTab] = useState("personagens");
  const [busca, setBusca] = useState("");
  const [charToDelete, setCharToDelete] = useState(null);
  
  // Novo Personagem Form
  const [novoNome, setNovoNome] = useState("");
  const [novoWhats, setNovoWhats] = useState("");
  const [novoCod, setNovoCod] = useState("");
  const [novoEsquadrao, setNovoEsquadrao] = useState("11º Esquadrão");

  // Sub-ADM Form
  const [novoSubUser, setNovoSubUser] = useState("");
  const [novoSubSenha, setNovoSubSenha] = useState("");
  const [novoSubNome, setNovoSubNome] = useState("");
  const [novoSubCargo, setNovoSubCargo] = useState("Avaliador de Cenas & Fichas");

  // Dice Roller
  const [dadoTipo, setDadoTipo] = useState("d20");
  const [dadoChar, setDadoChar] = useState(db.personagens?.[0]?.nome || "");
  const [dadoResultado, setDadoResultado] = useState(null);

  // Cloud Config
  const [editFirebaseUrl, setEditFirebaseUrl] = useState(db.firebaseUrl || "");

  function criarPersonagem(e) {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert("Digite o nome do personagem.");
      return;
    }
    const codGerado = novoCod.trim() || `SHIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const novoP = {
      id: uid(),
      nome: novoNome.trim(),
      whatsapp: novoWhats.trim() || "11999999999",
      codigo: codGerado,
      foto: "assets/ichigo-orange.png",
      raca: "Shinigami",
      esquadrao: novoEsquadrao,
      faceclaim: "Personagem Oficial",
      idadePlayer: "20",
      aniversarioPlayer: "01/01",
      idadeChar: "18",
      aniversarioChar: "15/07",
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 },
      kidosConhecidos: [
        { id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3 },
        { id: "b1", numero: 1, nome: "Sai", cat: "Bakudō", custoReiatsu: 2 }
      ],
      tecnicas: [
        { id: uid(), nome: "Hadō #4 — Byakurai", categoria: "Hadō" },
        { id: uid(), nome: "Bakudō #1 — Sai", categoria: "Bakudō" }
      ],
      personalidade: { texto: "", virtudes: "", defeitos: "", desejos: "", medos: "", conflitos: "", estiloCombate: "" },
      personalidadeTravada: false,
      cenaDespertarShikai: "",
      cenaDespertarBankai: "",
      zanpakuto: { nome: "Em despertar", fotoShikai: "assets/ichigo-orange.png", fotoBankai: "assets/ichigo-moon.png", shikaiAtiva: null, bankaiAtiva: null, notas: "" },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{ id: uid(), data: nowStr(), texto: "Ficha criada e aprovada pela Administração." }]
    };

    const personagens = [novoP, ...(db.personagens || [])];
    saveDb({ ...db, personagens });
    setNovoNome("");
    setNovoWhats("");
    setNovoCod("");
    alert(`Personagem ${novoP.nome} criado com sucesso! Código de acesso: ${novoP.codigo}`);
    playReiatsuSound('win');
  }

  function deletarPersonagemConfirmado() {
    if (!charToDelete) return;
    const charId = charToDelete.id;
    const charNome = charToDelete.nome;

    const personagens = (db.personagens || []).filter(p => p.id !== charId);
    const novasVinculadas = (db.zanpakutosVinculadas || []).filter(z => z.charId !== charId);

    saveDb({ ...db, personagens, zanpakutosVinculadas: novasVinculadas });
    setCharToDelete(null);
    alert(`Ficha de ${charNome} excluída permanentemente. Se o jogador estiver online, a sessão dele será revogada.`);
    playReiatsuSound('shatter');
  }

  function criarSubAdm(e) {
    e.preventDefault();
    if (!novoSubUser.trim() || !novoSubSenha.trim()) {
      alert("Preencha usuário e senha do Sub-ADM.");
      return;
    }
    const novoSub = {
      id: uid(),
      usuario: novoSubUser.trim().toLowerCase(),
      senha: novoSubSenha.trim(),
      nome: novoSubNome.trim() || "Avaliador",
      cargo: novoSubCargo.trim()
    };
    const subAdms = [...(db.subAdms || []), novoSub];
    saveDb({ ...db, subAdms });
    setNovoSubUser("");
    setNovoSubSenha("");
    setNovoSubNome("");
    alert(`Sub-ADM ${novoSub.nome} cadastrado!`);
  }

  function removerSubAdm(id) {
    const subAdms = (db.subAdms || []).filter(s => s.id !== id);
    saveDb({ ...db, subAdms });
  }

  function salvarConfigCloud() {
    saveDb({ ...db, firebaseUrl: editFirebaseUrl.trim() });
    alert("URL do Firebase atualizada!");
  }

  function exportarBackup() {
    const jsonStr = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_bleach_rpg_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importarBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported && imported.personagens) {
          saveDb(imported);
          alert("Backup restaurado com sucesso!");
        } else {
          alert("Arquivo de backup inválido.");
        }
      } catch (err) {
        alert("Erro ao ler JSON de backup.");
      }
    };
    reader.readAsText(file);
  }

  function rolarDado() {
    let max = 20;
    if (dadoTipo === "d100") max = 100;
    else if (dadoTipo === "d6") max = 6;
    else if (dadoTipo === "d10") max = 10;

    const res = Math.floor(Math.random() * max) + 1;
    let cat = "Sucesso";
    if (dadoTipo === "d20") {
      if (res === 1) cat = "Desastre Crítico (Falha Grave)";
      else if (res <= 6) cat = "Falha Comum";
      else if (res <= 13) cat = "Sucesso Parcial (+50%)";
      else if (res <= 19) cat = "Extremo Sucesso (+80%)";
      else cat = "✨ CRÍTICO ABSOLUTO (+100%)";
    }

    const rollObj = {
      id: uid(),
      autor: session?.nome || "Mestre ADM",
      personagem: dadoChar || "Geral",
      dado: dadoTipo,
      resultado: res,
      categoria: cat,
      data: nowStr()
    };

    setDadoResultado(rollObj);
    const rolagensDadosPublicas = [rollObj, ...(db.rolagensDadosPublicas || []).slice(0, 30)];
    saveDb({ ...db, rolagensDadosPublicas });
    playReiatsuSound('roll');
  }

  const charsFiltrados = (db.personagens || []).filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.codigo || "").toLowerCase().includes(busca.toLowerCase()) ||
    (p.esquadrao || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-yellow-950/60 via-bleach-panel to-black border-2 border-yellow-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500 text-black flex items-center justify-center font-title text-2xl font-extrabold shadow-[0_0_15px_#E0B34C]">
            👑
          </div>
          <div>
            <h2 className="font-title text-2xl text-yellow-400 tracking-wider">PAINEL SUPREMO DE ADMINISTRAÇÃO</h2>
            <p className="text-xs text-bleach-creamDim">Controle global de fichas, sessões, regras e banco de dados</p>
          </div>
        </div>

        <div className="flex gap-2">
          {["personagens", "novo_char", "dados", "sub_adms", "nuvem"].map(tab => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase ${
                adminTab === tab ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-white/10 text-bleach-creamDim hover:text-white"
              }`}
            >
              {tab === "personagens" ? "👥 Fichas" :
               tab === "novo_char" ? "+ Nova Ficha" :
               tab === "dados" ? "🎲 Dados & IA" :
               tab === "sub_adms" ? "🛡️ Avaliadores" : "☁️ Nuvem & Backup"}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: LISTA DE PERSONAGENS */}
      {adminTab === "personagens" && (
        <Section title="Gestão Geral de Fichas dos Jogadores" subtitle="Acesse qualquer ficha, conceda giros ou exclua contas">
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Buscar por nome, código ou esquadrão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="space-y-3">
            {charsFiltrados.map(p => {
              const temShikai = !!p.zanpakuto?.shikaiAtiva;
              return (
                <div key={p.id} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img src={p.foto || 'assets/ichigo-orange.png'} className="w-12 h-12 rounded-xl object-cover border border-bleach-border bg-black" />
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{p.nome}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-bleach-orange border border-bleach-border">
                          {p.codigo}
                        </span>
                      </h4>
                      <div className="text-[11px] text-bleach-muted flex flex-wrap gap-2 mt-0.5">
                        <span>Divisão: <strong>{p.esquadrao}</strong></span>
                        <span>Pontos Livres: <strong className="text-bleach-orange">{p.pontosDisponiveis || 0}</strong></span>
                        <span>Giros: <strong>🎲 {p.sorteiosComunsRestantes || 0}</strong> / <strong>🌟 {p.sorteiosEspeciaisRestantes || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Código de Acesso: ${p.codigo}\nNome: ${p.nome}`);
                        alert("Credenciais copiadas para a área de transferência!");
                      }}
                      className="px-3 py-1.5 bg-black/60 border border-white/10 hover:border-white text-bleach-creamDim text-xs font-bold rounded-lg"
                      title="Copiar credenciais de login"
                    >
                      📋 Copiar Login
                    </button>

                    <button
                      onClick={() => onAbrirFicha(p.id)}
                      className="px-4 py-1.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
                    >
                      ⚙️ Gerenciar Ficha
                    </button>

                    <button
                      onClick={() => setCharToDelete(p)}
                      className="px-2.5 py-1.5 bg-red-950/60 border border-red-500/50 hover:bg-red-800 text-red-300 text-xs font-bold rounded-lg"
                      title="Excluir ficha"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* TAB: CRIAR NOVO PERSONAGEM */}
      {adminTab === "novo_char" && (
        <Section title="Criar Nova Ficha de Shinigami" subtitle="Cadastre um novo jogador e gere seu código de acesso oficial">
          <form onSubmit={criarPersonagem} className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="block font-bold text-bleach-cream mb-1 uppercase">Nome do Personagem *</label>
              <input type="text" placeholder="Ex: Kurosaki Ren" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-bleach-cream mb-1 uppercase">WhatsApp (Opcional)</label>
                <input type="text" placeholder="Ex: 11988887777" value={novoWhats} onChange={(e) => setNovoWhats(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block font-bold text-bleach-cream mb-1 uppercase">Código de Acesso (Senha)</label>
                <input type="text" placeholder="Deixe em branco para auto-gerar" value={novoCod} onChange={(e) => setNovoCod(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white font-mono" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-bleach-cream mb-1 uppercase">Esquadrão Inicial</label>
              <select value={novoEsquadrao} onChange={(e) => setNovoEsquadrao(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white">
                {Array.from({ length: 13 }, (_, i) => `${i + 1}º Esquadrão`).map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full py-3 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-xl shadow hover:bg-orange-400">
              ✓ Cadastrar & Aprovar Ficha
            </button>
          </form>
        </Section>
      )}

      {/* TAB: DADOS & ÁRBITRO */}
      {adminTab === "dados" && (
        <Section title="Mesa de Dados & Arbitragem" subtitle="Role dados com cálculo de tensão narrativa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-bleach-orange uppercase">Rolagem Rápida</h4>
              <div>
                <label className="block text-[11px] text-bleach-muted mb-1">Tipo de Dado</label>
                <select value={dadoTipo} onChange={(e) => setDadoTipo(e.target.value)} className="w-full bg-black border border-bleach-border rounded p-2 text-xs text-white">
                  <option value="d20">d20 (Sistema Padrão Bleach)</option>
                  <option value="d100">d100 (Porcentagem)</option>
                  <option value="d6">d6</option>
                  <option value="d10">d10</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-bleach-muted mb-1">Personagem</label>
                <input type="text" value={dadoChar} onChange={(e) => setDadoChar(e.target.value)} className="w-full bg-black border border-bleach-border rounded p-2 text-xs text-white" />
              </div>

              <button onClick={rolarDado} className="w-full py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded shadow">
                🎲 Rolar Dado
              </button>
            </div>

            {dadoResultado && (
              <div className="md:col-span-2 p-5 bg-black/80 border-2 border-bleach-orange rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-[10px] text-bleach-muted uppercase font-mono">{dadoResultado.personagem} rolou {dadoResultado.dado}</span>
                <span className="text-6xl font-black font-mono text-bleach-orange">{dadoResultado.resultado}</span>
                <span className="text-sm font-bold text-white">{dadoResultado.categoria}</span>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* TAB: SUB-ADMS */}
      {adminTab === "sub_adms" && isSuper && (
        <Section title="Gerenciamento de Avaliadores & Sub-ADMs" subtitle="Adicione membros da staff autorizados a avaliar cenas">
          <form onSubmit={criarSubAdm} className="max-w-md space-y-3 text-xs mb-6">
            <div>
              <label className="block font-bold text-bleach-cream mb-1">Nome do Avaliador</label>
              <input type="text" placeholder="Ex: Mestre Kisuke" value={novoSubNome} onChange={(e) => setNovoSubNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-bleach-cream mb-1">Usuário</label>
                <input type="text" placeholder="kisuke" value={novoSubUser} onChange={(e) => setNovoSubUser(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
              </div>
              <div>
                <label className="block font-bold text-bleach-cream mb-1">Senha</label>
                <input type="text" placeholder="123" value={novoSubSenha} onChange={(e) => setNovoSubSenha(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-yellow-500 text-black font-bold uppercase rounded shadow">
              + Adicionar Avaliador
            </button>
          </form>

          <div className="space-y-2">
            {(db.subAdms || []).map(sub => (
              <div key={sub.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white">{sub.nome}</strong>
                  <span className="text-bleach-muted ml-2">Usuário: <code className="text-yellow-400">{sub.usuario}</code></span>
                </div>
                <button onClick={() => removerSubAdm(sub.id)} className="text-red-400 hover:text-red-300 font-bold">Remover</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* TAB: NUVEM & BACKUP */}
      {adminTab === "nuvem" && (
        <Section title="Nuvem Firebase & Backup de Segurança" subtitle="Sincronize com o Realtime Database e faça cópias locais">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-bleach-cream mb-1 uppercase">URL do Firebase Realtime Database</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://seu-banco-rtdb.firebaseio.com/"
                  value={editFirebaseUrl}
                  onChange={(e) => setEditFirebaseUrl(e.target.value)}
                  className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white font-mono"
                />
                <button onClick={salvarConfigCloud} className="px-4 py-2 bg-bleach-orange text-black font-bold uppercase rounded-lg">
                  Salvar URL
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-bleach-borderSoft">
              <button onClick={exportarBackup} className="px-4 py-2.5 bg-bleach-panel2 border border-bleach-border hover:border-white text-white font-bold rounded-lg shadow">
                💾 Baixar Backup JSON
              </button>

              <label className="px-4 py-2.5 bg-bleach-panel2 border border-bleach-border hover:border-yellow-400 text-yellow-400 font-bold rounded-lg cursor-pointer shadow">
                📥 Restaurar Backup JSON
                <input type="file" accept=".json" onChange={importarBackup} className="hidden" />
              </label>
            </div>
          </div>
        </Section>
      )}

      {/* MODAL DE DELEÇÃO DE PERSONAGEM COM REVOGAÇÃO IMEDIATA */}
      {charToDelete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-bleach-panel border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="text-4xl">🗑️</div>
            <h3 className="font-title text-2xl text-red-400">EXCLUIR FICHA DE PERSONAGEM</h3>
            <p className="text-xs text-bleach-creamDim leading-relaxed">
              Tem certeza que deseja apagar permanentemente a ficha de <strong className="text-white">{charToDelete.nome}</strong>?
            </p>
            <div className="text-[11px] text-left p-3 bg-black/60 rounded-xl border border-red-500/30 text-bleach-muted space-y-1">
              <div>• A conta será removida imediatamente da base de dados.</div>
              <div>• Se o jogador estiver logado, a sessão dele será <strong>revogada instantaneamente</strong>.</div>
              <div>• As assinaturas de Zanpakutō vinculadas serão liberadas.</div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCharToDelete(null)} className="flex-1 py-2.5 bg-bleach-panel2 border border-bleach-border text-xs text-white rounded-lg">
                Cancelar
              </button>
              <button onClick={deletarPersonagemConfirmado} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-lg shadow">
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TAB: SISTEMAS & REGRAS
function SistemasView() {
  return (
    <div className="space-y-6">
      <Section title="Manual de Sistemas & Regras do Bleach RPG" subtitle="Diretrizes oficiais da Sociedade das Almas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
            <h4 className="font-title text-lg text-bleach-orange">⚡ Atributos & Patamares</h4>
            <p className="text-bleach-creamDim leading-relaxed">
              O poder de cada Shinigami é medido por 4 atributos primários: <strong>Pressão Espiritual</strong>, <strong>Força</strong>, <strong>Velocidade</strong> e <strong>Resiliência</strong>.
            </p>
            <ul className="list-disc pl-4 text-bleach-muted space-y-1">
              <li>1–10: Inexperiente (Estudante da Academia)</li>
              <li>11–30: Iniciante (Oficial Subalterno)</li>
              <li>31–60: Treinado (Oficial de Assento)</li>
              <li>61–100: Veterano (Tenente de Esquadrão)</li>
              <li>101–150: Mestre (Capitão do Gotei 13)</li>
              <li>150+: Transcendental (Divisão Zero / Poder Além do Limite)</li>
            </ul>
          </div>

          <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
            <h4 className="font-title text-lg text-cyan-400">⚔️ Despertar de Zanpakutō (33 Regras de IA)</h4>
            <p className="text-bleach-creamDim leading-relaxed">
              As Zanpakutōs são forjadas com base no <strong>DNA Espiritual</strong> selado na sua ficha. O motor de IA gera 4 manifestações únicas (Elemental, Progressiva, Compensatória e Opositiva) com compatibilidade exclusiva.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

// MOUNT REACT APPLICATION
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`;

fs.writeFileSync('templates/views_part3.jsx', CodeContent);
console.log("Written templates/views_part3.jsx!");
