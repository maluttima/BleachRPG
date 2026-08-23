// =========================================================================
// VIEWS PART 3: ADMIN PANEL, RICH SISTEMAS VIEW & APP MOUNT
// =========================================================================

// TAB: PAINEL DE CONTROLE DA ADMINISTRAÇÃO
function AdminPanel({ db, saveDb, session, cloudStatus, onAbrirFicha }) {
  const isSuper = session?.role === "super_admin";
  const [tabAdm, setTabAdm] = useState("fichas");
  const [novoSubUser, setNovoSubUser] = useState("");
  const [novoSubPass, setNovoSubPass] = useState("");
  const [novoSubNome, setNovoSubNome] = useState("");
  const [novoSubCargo, setNovoSubCargo] = useState("Avaliador de Cenas & Fichas");

  // Dados para Novo Personagem
  const [novoNome, setNovoNome] = useState("");
  const [novoWhats, setNovoWhats] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoRaca, setNovoRaca] = useState("Shinigami");
  const [novoEsquadrao, setNovoEsquadrao] = useState("11º Esquadrão");

  // Dados de Rolagem de Dados
  const [dadoTipo, setDadoTipo] = useState("d20");
  const [dadoChar, setDadoChar] = useState(db.personagens?.[0]?.nome || "Geral");

  function criarPersonagem(e) {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) {
      alert("Nome e Código de Acesso são obrigatórios!");
      return;
    }

    const novoP = {
      id: "char-" + uid(),
      nome: novoNome.trim(),
      foto: "assets/ichigo-orange.png",
      whatsapp: novoWhats.trim(),
      codigo: novoCodigo.trim(),
      raca: novoRaca,
      esquadrao: novoEsquadrao,
      faceclaim: novoNome.trim(),
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
      zanpakuto: {
        nome: "Em despertar",
        fotoShikai: "assets/ichigo-orange.png",
        fotoBankai: "assets/ichigo-moon.png",
        shikaiAtiva: null,
        bankaiAtiva: null,
        bankaiPadrao: null,
        shikaiEscolhida: false,
        bankaiEscolhida: false,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{ id: uid(), data: nowStr(), texto: "Ficha criada e aprovada pela Administração." }]
    };

    saveDb({ ...db, personagens: [...(db.personagens || []), novoP] });
    setNovoNome("");
    setNovoWhats("");
    setNovoCodigo("");
    playReiatsuSound('win');
    alert(`Personagem ${novoP.nome} criado com sucesso!`);
  }

  function apagarPersonagem(charId, charNome) {
    const confirma = confirm(`⚠️ Tem certeza absoluta que deseja excluir a ficha de ${charNome}?\n\nIsso apagará todos os dados, revogará qualquer login ativo e liberará a Zanpakutō no banco de dados.`);
    if (!confirma) return;

    const novosP = (db.personagens || []).filter(p => p.id !== charId);
    const novasZk = (db.zanpakutosVinculadas || []).filter(z => z.charId !== charId && z.charNome !== charNome);

    saveDb({ ...db, personagens: novosP, zanpakutosVinculadas: novasZk });
    playReiatsuSound('shatter');
    alert(`A ficha de ${charNome} foi excluída e a sessão do jogador foi revogada com sucesso.`);
  }

  function adicionarSubAdm(e) {
    e.preventDefault();
    if (!novoSubUser.trim() || !novoSubPass.trim() || !novoSubNome.trim()) {
      alert("Preencha todos os campos do sub-administrador.");
      return;
    }
    const novoSub = {
      id: "adm-" + uid(),
      usuario: novoSubUser.trim().toLowerCase(),
      senha: novoSubPass.trim(),
      nome: novoSubNome.trim(),
      cargo: novoSubCargo
    };
    saveDb({ ...db, subAdms: [...(db.subAdms || []), novoSub] });
    setNovoSubUser("");
    setNovoSubPass("");
    setNovoSubNome("");
    alert(`Sub-administrador ${novoSub.nome} adicionado com sucesso!`);
  }

  function removerSubAdm(subId) {
    if (!confirm("Deseja remover este avaliador?")) return;
    saveDb({ ...db, subAdms: (db.subAdms || []).filter(s => s.id !== subId) });
  }

  function rolarDadoPublico() {
    const lados = dadoTipo === "d20" ? 20 : dadoTipo === "d100" ? 100 : 10;
    const res = Math.floor(Math.random() * lados) + 1;
    let cat = "Sucesso Regular";
    if (dadoTipo === "d20") {
      if (res === 20) cat = "🌟 Sucesso Crítico Absoluto (20)";
      else if (res >= 16) cat = "✨ Extremo Sucesso (+80%)";
      else if (res >= 10) cat = "✓ Sucesso Médio (+50%)";
      else if (res === 1) cat = "💀 Falha Crítica (Desastre 1)";
      else cat = "✗ Falha";
    }

    const rollLog = {
      id: uid(),
      autor: session?.nome || "ADM",
      personagem: dadoChar,
      dado: dadoTipo,
      resultado: res,
      categoria: cat,
      data: nowStr()
    };

    saveDb({ ...db, rolagensDadosPublicas: [rollLog, ...(db.rolagensDadosPublicas || []).slice(0, 30)] });
    playReiatsuSound('roll');
  }

  return (
    <div className="space-y-6">
      <div className="bg-banner-overlay border-2 border-yellow-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider">
              👑 Painel Central de Comando • {isSuper ? "Comandante Supremo (ADM Máximo)" : "Avaliador Autorizado"}
            </span>
            <h2 className="font-title text-3xl sm:text-4xl tracking-widest text-yellow-400 mt-2">
              GERENCIADOR DE FICHAS & NARRATIVA
            </h2>
            <p className="text-xs text-bleach-creamDim mt-1">
              Crie, gerencie, recompense e fiscalize todas as fichas e combates do RPG.
            </p>
          </div>

          <div className="flex gap-2">
            {["fichas", "novo", "subadms", "dados"].map(t => (
              <button
                key={t}
                onClick={() => setTabAdm(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  tabAdm === t ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-yellow-500/30 text-yellow-200"
                }`}
              >
                {t === "fichas" ? "Fichas" : t === "novo" ? "+ Criar" : t === "subadms" ? "Avaliadores" : "Dados"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUBTAB: LISTA DE FICHAS */}
      {tabAdm === "fichas" && (
        <Section title="Fichas de Shinigamis Registradas" subtitle="Clique para abrir e gerenciar qualquer personagem">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(db.personagens || []).map((p) => {
              const temShikai = !!p?.zanpakuto?.shikaiAtiva;
              const temBankai = !!p?.zanpakuto?.bankaiAtiva;
              return (
                <div key={p.id} className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.foto || 'assets/ichigo-orange.png'} className="w-12 h-12 rounded-lg object-cover border border-bleach-border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{p.nome}</h4>
                      <p className="text-[11px] text-bleach-muted">Código: <strong className="text-yellow-400 font-mono">{p.codigo}</strong></p>
                      <div className="text-[10px] text-bleach-muted flex gap-2 mt-0.5">
                        <span>PTS: <strong className="text-bleach-orange">{p.pontosDisponiveis || 0}</strong></span>
                        <span>COM: <strong className="text-white">{p.sorteiosComunsRestantes || 0}</strong></span>
                        <span>ESP: <strong className="text-purple-300">{p.sorteiosEspeciaisRestantes || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {temShikai ? <span className="px-2 py-0.5 bg-blue-950 text-cyan-300 rounded border border-cyan-500">🗡️ {p.zanpakuto.shikaiAtiva.nome}</span> : <span className="px-2 py-0.5 bg-black text-bleach-muted rounded">Lâmina Selada</span>}
                    {temBankai && <span className="px-2 py-0.5 bg-amber-950 text-yellow-300 rounded border border-amber-500">卍 Bankai</span>}
                    {p.personalidadeTravada && <span className="px-2 py-0.5 bg-green-950 text-green-300 rounded">🔒 DNA Selado</span>}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onAbrirFicha(p.id)}
                      className="flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-lg shadow"
                    >
                      ✏️ Gerenciar Ficha
                    </button>
                    <button
                      onClick={() => apagarPersonagem(p.id, p.nome)}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-lg"
                      title="Excluir Ficha"
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

      {/* SUBTAB: CRIAR NOVO PERSONAGEM */}
      {tabAdm === "novo" && (
        <Section title="Cadastrar Nova Ficha de Shinigami" subtitle="Preencha os dados iniciais para gerar a ficha e código de acesso">
          <form onSubmit={criarPersonagem} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Nome do Personagem *</label>
                <input type="text" placeholder="Ex: Zaraki Kenji" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Código de Acesso (Senha) *</label>
                <input type="text" placeholder="Ex: ZAR-9901" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">WhatsApp (Opcional)</label>
                <input type="text" placeholder="Ex: 11988887777" value={novoWhats} onChange={(e) => setNovoWhats(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Esquadrão</label>
                <input type="text" value={novoEsquadrao} onChange={(e) => setNovoEsquadrao(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg">
              ✨ Criar Ficha com 20 Pts Iniciais & 2 Giros
            </button>
          </form>
        </Section>
      )}

      {/* SUBTAB: SUB-ADMS */}
      {tabAdm === "subadms" && isSuper && (
        <Section title="Gerenciador de Avaliadores & Sub-Administradores" subtitle="Cadastre avaliadores com senhas individuais">
          <form onSubmit={adicionarSubAdm} className="p-4 bg-black/60 rounded-xl border border-yellow-500/40 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6">
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Nome do Avaliador</label>
              <input type="text" placeholder="Ex: Mestre Kisuke" value={novoSubNome} onChange={(e) => setNovoSubNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Usuário</label>
              <input type="text" placeholder="Ex: kisuke" value={novoSubUser} onChange={(e) => setNovoSubUser(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Senha</label>
              <input type="password" placeholder="••••••" value={novoSubPass} onChange={(e) => setNovoSubPass(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow">
                + Adicionar
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {(db.subAdms || []).map(s => (
              <div key={s.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{s.nome}</strong>
                  <span className="text-[11px] text-bleach-muted">Usuário: <code className="text-yellow-400">{s.usuario}</code> | Cargo: {s.cargo}</span>
                </div>
                <button onClick={() => removerSubAdm(s.id)} className="text-red-400 hover:text-red-300 font-bold">Remover</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SUBTAB: ROLAGEM DE DADOS */}
      {tabAdm === "dados" && (
        <Section title="Mesa de Rolagem de Dados de Alta Tensão" subtitle="Rolagens públicas de d20 e d100 para julgamento de cenas">
          <div className="p-4 bg-black/60 rounded-xl border border-bleach-border flex flex-wrap gap-3 items-center mb-6">
            <select value={dadoTipo} onChange={(e) => setDadoTipo(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white">
              <option value="d20">🎲 Dado d20 (Testes & Combate)</option>
              <option value="d100">🎲 Dado d100 (Porcentagens)</option>
              <option value="d10">🎲 Dado d10 (Escalas Rápidas)</option>
            </select>

            <select value={dadoChar} onChange={(e) => setDadoChar(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white">
              <option value="Geral">Personagem: Geral</option>
              {(db.personagens || []).map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
            </select>

            <button onClick={rolarDadoPublico} className="px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110">
              🎲 Rolar Dado em Público
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {(db.rolagensDadosPublicas || []).map(d => (
              <div key={d.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white">{d.personagem}</span>
                  <span className="text-bleach-muted ml-2 font-mono">({d.dado}) — Por {d.autor}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-black text-bleach-orange mr-2">{d.resultado}</span>
                  <span className="text-[11px] text-yellow-300 font-bold">{d.categoria}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// RICH SISTEMAS & REGRAS VIEW (COMPLETE ORIGINAL SYSTEMS RESTORED)
function SistemasView() {
  const [tabSis, setTabSis] = useState("atributos");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider">
            Regulamento Oficial da Sociedade das Almas • Versão 2026
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow">
            COMPÊNDIO DE SISTEMAS & MECÂNICAS
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Consulte todas as diretrizes oficiais de atributos, treinos em ON, roletas de sorteio, individualização de Zanpakutōs e regras de conjuração de Kidō.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-bleach-borderSoft pb-2">
        {[
          { id: "atributos", label: "Atributos & Patamares", icon: "⚡" },
          { id: "treinos", label: "Treinos em ON & Ganhos", icon: "✍️" },
          { id: "sorteios", label: "Sorteios & Roletas", icon: "🎁" },
          { id: "zanpakuto", label: "Zanpakutō & 33 Regras de IA", icon: "🗡️" },
          { id: "kidos", label: "Kidō & Encantamentos", icon: "📕" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTabSis(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition whitespace-nowrap flex items-center gap-2 ${
              tabSis === t.id ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ABA 1: ATRIBUTOS & PATAMARES */}
      {tabSis === "atributos" && (
        <div className="space-y-6">
          <Section title="Os 4 Atributos Primários da Alma" subtitle="A base estrutural do poder de todo Shinigami">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ATTRS.map(a => (
                <div key={a.key} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: a.color }}>{a.label}</h4>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">{a.desc}</p>
                  <div className="text-[11px] text-bleach-muted pt-1 border-t border-white/5">
                    {a.key === "pressao" && "Determina a quantidade máxima de Kidōs por cena, o alcance de percepção sensorial e a resistência contra supressões espirituais."}
                    {a.key === "forca" && "Governa a potência do Zanjutsu (esgrima) e Hakuda (combate desarmado), além do impacto de cortes e colisões físicas."}
                    {a.key === "velocidade" && "Rege a velocidade de locomoção, reflexos de combate, capacidade de esquiva e a maestria na técnica de Hohō/Shunpo."}
                    {a.key === "resiliencia" && "Controla a vitalidade do corpo espiritual (Hakusui e Saketsu), absorção de impacto, resistência a ferimentos e fadiga."}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Escala Oficial de Patamares de Poder" subtitle="A hierarquia espiritual da Sociedade das Almas">
            <div className="space-y-3">
              {[
                { faixa: "1 a 10 pts", titulo: "Inexperiente", desc: "Aluno recém-ingressado na Academia Shinō.", cor: C.muted },
                { faixa: "11 a 30 pts", titulo: "Iniciante", desc: "Oficial subalterno, combatente raso de Esquadrão.", cor: C.green },
                { faixa: "31 a 60 pts", titulo: "Treinado", desc: "Oficial de Assento (10º ao 4º Oficial), experiente em missões no Mundo Humano.", cor: C.blue },
                { faixa: "61 a 100 pts", titulo: "Veterano", desc: "3º Oficial ou Tenente de Esquadrão; maestria de Shikai e combate de alta escala.", cor: C.purple },
                { faixa: "101 a 150 pts", titulo: "Mestre", desc: "Capitão do Gotei 13; domínio pleno de Bankai e liderança militar absoluta.", cor: C.yellow },
                { faixa: "150+ pts", titulo: "Transcendental", desc: "Nível Divisão Zero / Guarda Real / Força Primordial do Seireitei.", cor: "#FFD700" }
              ].map(tier => (
                <div key={tier.titulo} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-black text-white border border-white/10">{tier.faixa}</span>
                    <div>
                      <h5 className="font-bold text-xs uppercase" style={{ color: tier.cor }}>{tier.titulo}</h5>
                      <p className="text-[11px] text-bleach-muted">{tier.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ABA 2: TREINOS EM ON */}
      {tabSis === "treinos" && (
        <div className="space-y-6">
          <Section title="Sistema de Treinos em ON & Ganhos" subtitle="Diretrizes para progressão de atributos através de roleplay">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="p-4 bg-bleach-panel2 border-l-4 border-bleach-orange rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-bleach-orange uppercase">📜 Treino Básico em ON (30 Linhas)</h4>
                <p>O jogador que narrar uma cena individual de treino focada e bem estruturada com no mínimo <strong>30 linhas</strong> no grupo oficial receberá:</p>
                <ul className="list-disc list-inside space-y-1 text-white font-mono">
                  <li>+1 Ponto Livre de Atributo (ou em atributo treinado)</li>
                  <li>+4 Giros de Sorteio Comum</li>
                  <li>+1 Giro de Sorteio Especial</li>
                </ul>
              </div>

              <div className="p-4 bg-bleach-panel2 border-l-4 border-cyan-400 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-cyan-400 uppercase">⚡ Cenas de Arco & Missões Principais (90+ Linhas)</h4>
                <p>Cenas profundas de desenvolvimento de arco ou missões narradas com <strong>90 linhas ou mais</strong> concedem automaticamente <strong>+15 Pontos de Atributo Garantidos</strong> e pacotes especiais de roletas de bonificação após avaliação do ADM.</p>
              </div>

              <div className="p-4 bg-bleach-panel2 border-l-4 border-purple-400 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-purple-400 uppercase">⚔️ Combates em ON & Arbitragem</h4>
                <p>Combates na Arena são julgados por turnos com apoio de rolagens públicas de d20. A vitória e a criatividade tática rendem pontos proporcionais definidos pelo Juiz da Arena.</p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ABA 3: SORTEIOS & ROLETAS */}
      {tabSis === "sorteios" && (
        <div className="space-y-6">
          <Section title="Probabilidades do Sorteio Gacha Comum" subtitle="Tabela estatística oficial de drops para cada giro comum">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {RARIDADES_COMUNS.map(r => (
                <div key={r.nome} className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase" style={{ color: r.cor }}>{r.nome}</span>
                    <span className="font-mono text-xs font-bold text-white">{r.chanceStr}</span>
                  </div>
                  <p className="text-[11px] text-bleach-creamDim leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Catálogo de Recompensas do Sorteio Especial" subtitle="Itens sagrados, elixires nobres e despertar narrativo supremo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RECOMPENSAS_ESPECIAIS.map(item => (
                <div key={item.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl flex justify-between items-start gap-2">
                  <div>
                    <h5 className="font-bold text-xs" style={{ color: item.cor }}>{item.nome}</h5>
                    <p className="text-[11px] text-bleach-muted mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white shrink-0">
                    {item.chanceStr}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ABA 4: ZANPAKUTO & 33 REGRAS */}
      {tabSis === "zanpakuto" && (
        <div className="space-y-6">
          <Section title="Motor Definitivo de Individualização Espiritual (33 Regras)" subtitle="Como a IA gera armas 100% únicas e exclusivas a partir do DNA da alma">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <p>Nenhuma Zanpakutō na Sociedade das Almas pode ser duplicada ou genérica. O motor de IA utiliza a <strong>Personalidade Selada</strong>, virtudes, fraquezas e estilo de combate para sintetizar simultaneamente <strong>4 Caminhos Espirituais</strong>:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-bleach-panel2 border border-red-500/40 rounded-xl space-y-1">
                  <strong className="text-red-400 block font-bold">1. Caminho Elemental / Temperamento (~45%)</strong>
                  <p>Alinhado diretamente à psicologia dominante do personagem (Chamas, Raios, Sombras, Vento, Gelo, Gravidade).</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-blue-500/40 rounded-xl space-y-1">
                  <strong className="text-cyan-400 block font-bold">2. Caminho Conceitual / Progressivo (~20%)</strong>
                  <p>Baseado em regras, estágios, ciclos de carga, contadores e mecânicas táticas de acúmulo.</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-purple-500/40 rounded-xl space-y-1">
                  <strong className="text-purple-400 block font-bold">3. Caminho Compensatório / Complementar</strong>
                  <p>Fornece exatamente o recurso que falta na anatomia tática do personagem para cobrir suas fraquezas.</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-amber-500/40 rounded-xl space-y-1">
                  <strong className="text-yellow-400 block font-bold">4. Caminho Opositivo / Experimental</strong>
                  <p>Subverte a expectativa: manifesta o paradoxo inconsciente e a sombra da alma do Shinigami.</p>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 border border-yellow-500/40 rounded-xl text-[11px] text-yellow-200">
                <strong>🛡️ Regra de Exclusividade & Anti-Duplicação:</strong> Cada arma escolhida recebe uma Assinatura Espiritual única (`zk-sig-...`) e é registrada no catálogo global. Duplicatas com mais de 60% de similaridade são bloqueadas pelo sistema.
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ABA 5: KIDOS & ENCANTAMENTOS */}
      {tabSis === "kidos" && (
        <div className="space-y-6">
          <Section title="Grimório & Regras de Conjuração de Kidō" subtitle="Diretrizes para o uso de magias espirituais em combate e cenas">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-cyan-400 uppercase">⚡ Limite de Feitiços por Cena</h4>
                <p>A quantidade máxima de feitiços que um Shinigami pode conjurar em uma mesma cena é calculada pela fórmula:</p>
                <div className="p-2.5 bg-black rounded font-mono text-center text-bleach-orange font-bold text-sm">
                  Máximo de Kidōs = Math.max(3, Math.floor(Pressão Espiritual / 7) + 1)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1">
                  <strong className="text-red-300 block font-bold">Hadō (Destruição)</strong>
                  <p className="text-[11px]">Feitiços ofensivos de dano direto, calor, eletricidade e impacto cinético.</p>
                </div>
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl space-y-1">
                  <strong className="text-cyan-300 block font-bold">Bakudō (Aprisionamento)</strong>
                  <p className="text-[11px]">Feitiços de contenção, barreiras reflexivas, rastreamento e supressão de movimento.</p>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1">
                  <strong className="text-emerald-300 block font-bold">Kaidō (Cura)</strong>
                  <p className="text-[11px]">Técnicas médicas de regeneração de tecidos e restauração de canais de Reiatsu.</p>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-1 text-[11px]">
                <strong className="text-white block font-bold">📜 Eishōhaki (Abandono de Encantamento):</strong>
                <p>Conjurar um Kidō sem recitar o encantamento reduz o tempo de conjuração pela metade, porém diminui a potência do feitiço em aproximadamente um terço. Recitar o encantamento completo libera 100% do poder destrutivo da magia.</p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
