// =========================================================================
// GUIA PARA NOVATOS: COMO EVOLUIR DE MODO SIMPLES & SISTEMA DE COMBATE
// =========================================================================

function GuiaNovatosView() {
  const [subAba, setSubAba] = useState("evolucao");

  return (
    <div className="space-y-6">
      {/* Banner Principal de Boas-Vindas */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-[#131713] to-[#0E100E] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                Manual Oficial da Academia Shin’ō • Recém-Chegados
              </span>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl tracking-wider text-emerald-200 mt-1">
              GUIA PARA NOVATOS: COMO EVOLUIR DE MODO SIMPLES
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Tudo o que você precisa saber para construir seu guerreiro, entender as recompensas em pontos, limites de cenas, regras de fadiga e duelos.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/5">
            {[
              { id: "evolucao", label: "Dicas & Builds", icon: "📈" },
              { id: "pontos", label: "Pontos & Ganhos", icon: "🎁" },
              { id: "limites", label: "Limites & Fadiga", icon: "⏱️" },
              { id: "combate", label: "Combate & Escala", icon: "⚔️" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubAba(tab.id)}
                className={"px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 " + (
                  subAba === tab.id
                    ? "bg-emerald-500 text-black font-black shadow-md"
                    : "text-zinc-400 hover:text-emerald-200 hover:bg-white/5"
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-ABA 1: COMO EVOLUIR DE FORMA SIMPLES & RECOMENDAÇÕES DE BUILDS */}
      {/* ========================================================================= */}
      {subAba === "evolucao" && (
        <div className="space-y-6">
          
          {/* Passo a Passo */}
          <Section
            title="📈 Guia Passo a Passo: As 4 Etapas da sua Jornada"
            subtitle="O caminho fundamental para transformar um recém-formado em um respeitado oficial do Gotei 13"
            className="border-2 border-emerald-500/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Passo 1 */}
              <div className="p-5 bg-black/70 rounded-xl border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center font-title text-emerald-300 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-title text-base text-emerald-300">Distribua seus 20 Pontos Iniciais com Sabedoria</h4>
                    <span className="text-[10px] text-bleach-muted uppercase font-mono">Criação da Ficha</span>
                  </div>
                </div>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  Todo novo Shinigami começa com <strong>10 pontos em cada um dos 4 atributos</strong> (40 pts base) e ganha <strong>20 Pontos Livres</strong> para moldar sua especialidade marcial.
                </p>
                <div className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  ✦ <strong className="text-yellow-300">Dica:</strong> Escolha uma função clara (Dano, Tanque, Furtivo, Suporte/Cura ou Kidō) para ter vantagens na escala de combate.
                </div>
              </div>

              {/* Passo 2 */}
              <div className="p-5 bg-black/70 rounded-xl border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center font-title text-emerald-300 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-title text-base text-emerald-300">Cene no WhatsApp com Constância (1 Cena = 10 ₪)</h4>
                    <span className="text-[10px] text-bleach-muted uppercase font-mono">Economia de Conhecimento</span>
                  </div>
                </div>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  Toda cena feita no WhatsApp concede <strong>exatamente 10 ₪ de Conhecimento fixos</strong>. Não importa se é um treino individual, uma patrulha, um diálogo em Rukongai ou um combate.
                </p>
                <div className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  ✦ <strong className="text-yellow-300">Ritmo de Compra:</strong> Com 5 a 10 cenas diárias, você acumula de 350 ₪ a 700 ₪ semanais, podendo comprar de <strong>2 a 3 Kidōs novos por semana</strong>!
                </div>
              </div>

              {/* Passo 3 */}
              <div className="p-5 bg-black/70 rounded-xl border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center font-title text-emerald-300 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-title text-base text-emerald-300">Conecte-se com sua Lâmina Selada (Jinzen & Meditação)</h4>
                    <span className="text-[10px] text-bleach-muted uppercase font-mono">Comunhão Espiritual</span>
                  </div>
                </div>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  Todo recém-formado recebe uma <strong>lâmina selada tradicional (Asauchi)</strong>. A espada é um espelho de sua alma: preencha sua <strong>Personalidade</strong> (virtudes, defeitos, desejos, medos e estilo de combate) para que sua lâmina sintonize com sua essência.
                </p>
                <div className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  ✦ <strong className="text-purple-300">Dica:</strong> Narre cenas de Jinzen (meditação com a lâmina cruzada sobre os joelhos) para que o espírito da espada reconheça sua convicção.
                </div>
              </div>

              {/* Passo 4 */}
              <div className="p-5 bg-black/70 rounded-xl border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-400 flex items-center justify-center font-title text-emerald-300 font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h4 className="font-title text-base text-emerald-300">Participe dos Arcos Narrativos (Maior Salto de Poder)</h4>
                    <span className="text-[10px] text-bleach-muted uppercase font-mono">Recompensas Épicas</span>
                  </div>
                </div>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  As <strong>Cenas de Arco (mínimo de 90 linhas)</strong> são os momentos de clímax onde a história avança. Concluir um arco oficial garante a maior premiação do RPG:
                </p>
                <div className="p-3 bg-amber-950/40 border border-yellow-500/50 rounded-lg text-xs space-y-1 font-mono">
                  <span className="text-yellow-300 font-bold block">🎁 Recompensa Garantida por Conclusão de Arco:</span>
                  <span className="text-white block">+15 Pontos de Atributo Livres</span>
                  <span className="text-cyan-300 block">+2 Giros no Baú de Sorteio Comum</span>
                  <span className="text-purple-300 block">+1 Giro no Baú Especial de Seireitei</span>
                </div>
              </div>

            </div>
          </Section>

          {/* Recomendações de Builds Estratégicas */}
          <Section
            title="🛡️ Recomendações de Builds para Iniciantes (20 Pontos Livres)"
            subtitle="Sugestões de distribuição inicial para definir o papel tático do seu guerreiro no esquadrão"
            className="border-2 border-cyan-500/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Build 1: Suporte & Cura */}
              <div className="p-4 bg-bleach-panel2 border border-emerald-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>🏥</span>
                  <span className="font-title text-sm uppercase">Suporte Médico & Defesa Tática</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: 4º Esquadrão (Kaidō & Bakudō)</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">18 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Pressão Espiritual:</span><strong className="text-blue-300">16 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">14 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">12 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Sustenta aliados em combate, cura ferimentos críticos com Kaidō, ergue barreiras protetoras e possui alta estamina para suportar investidas.
                </p>
              </div>

              {/* Build 2: Tanque Guardião */}
              <div className="p-4 bg-bleach-panel2 border border-purple-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <span>🛡️</span>
                  <span className="font-title text-sm uppercase">Tanque Guardião / Muralha Viva</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: 7º ou 11º Esquadrão</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">20 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">16 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Pressão Espiritual:</span><strong className="text-blue-300">12 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">12 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Absorve o impacto dos golpes mais pesados, protege companheiros frágeis e quebra a postura dos inimigos com pura massa corporal de Reishi.
                </p>
              </div>

              {/* Build 3: Assassino Furtivo */}
              <div className="p-4 bg-bleach-panel2 border border-green-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <span>⚡</span>
                  <span className="font-title text-sm uppercase">Assassino de Elite / Velocista</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: 2º Esquadrão (Onmitsukidō)</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">20 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">16 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Pressão Espiritual:</span><strong className="text-blue-300">12 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">12 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Mobilidade extrema com Shunpo, flanqueamento instantâneo e ataques cirúrgicos em pontos vitais sem dar tempo de reação.
                </p>
              </div>

              {/* Build 4: Combatente de Choque */}
              <div className="p-4 bg-bleach-panel2 border border-red-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <span>⚔️</span>
                  <span className="font-title text-sm uppercase">Combatente de Choque / Zanjutsu</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: 11º Esquadrão (Zaraki)</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">20 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">16 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">14 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Pressão Espiritual:</span><strong className="text-blue-300">10 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Destruição frontal de lâminas e armaduras através de pura potência de corte e choques violentos de aço.
                </p>
              </div>

              {/* Build 5: Mestre em Kidō */}
              <div className="p-4 bg-bleach-panel2 border border-blue-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <span>🔮</span>
                  <span className="font-title text-sm uppercase">Mestre Espiritual / Kidō Destrutivo</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: 5º Esquadrão (Feitiçaria)</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Pressão Espiritual:</span><strong className="text-blue-300">20 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">16 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">12 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">12 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Bombardeio à distância com Hadō de alto calibre, imposição de barreiras e anulação de feitiços inimigos pela densidade de Reiatsu.
                </p>
              </div>

              {/* Build 6: Generalista Equilibrado */}
              <div className="p-4 bg-bleach-panel2 border border-yellow-500/40 rounded-xl space-y-2 shadow">
                <div className="flex items-center gap-2 text-yellow-400 font-bold">
                  <span>⚖️</span>
                  <span className="font-title text-sm uppercase">Guerreiro Tático / Híbrido Flexível</span>
                </div>
                <span className="text-[10px] text-bleach-muted block font-mono">Recomendado: Generalista do Gotei 13</span>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 text-[11px] font-mono space-y-0.5">
                  <div className="flex justify-between text-bleach-muted"><span>Pressão:</span><strong className="text-blue-300">15 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Força:</span><strong className="text-red-300">15 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Velocidade:</span><strong className="text-green-300">15 pts</strong></div>
                  <div className="flex justify-between text-bleach-muted"><span>Resiliência:</span><strong className="text-purple-300">15 pts</strong></div>
                </div>
                <p className="text-[11px] text-bleach-creamDim leading-relaxed">
                  <strong>Papel:</strong> Adaptabilidade universal a qualquer adversário e terreno, sem fraquezas graves de combate.
                </p>
              </div>

            </div>
          </Section>

          {/* 5 Dicas de Ouro para Iniciantes */}
          <Section
            title="💡 5 Dicas de Ouro para Evoluir Rápido & Sem Desperdício"
            subtitle="Recomendações dos oficiais veteranos para otimizar sua progressão diária"
            className="border-2 border-yellow-500/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 space-y-1.5">
                <h5 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                  <span>1️⃣</span> Monte seu Grimório Inicial com os 450 ₪ de Base
                </h5>
                <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                  Como Shinigami, você começa com 450 ₪ de Conhecimento. Compre um kit versátil:
                  <br />• <strong>1 Hadō Rápido</strong> (ex: #4 Byakurai [140 ₪])
                  <br />• <strong>1 Bakudō de Contenção</strong> (ex: #1 Sai [95 ₪])
                  <br />• <strong>1 Kaidō de Primeiros Socorros</strong> (ex: #1 Kyōsō [120 ₪])
                  <br />• <strong>1 Feitiço de Impacto</strong> (ex: Hadō #1 Shō [90 ₪]).
                  <br /><em className="text-emerald-300">Total: 445 ₪ gastos com máxima utilidade em combate!</em>
                </p>
              </div>

              <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 space-y-1.5">
                <h5 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                  <span>2️⃣</span> Estruture seus Treinos em 3 Blocos de 10 Linhas
                </h5>
                <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                  Para atingir com facilidade o mínimo de <strong>30 linhas por treino</strong>:
                  <br />• <strong>Linhas 1-10:</strong> Aquecimento e canalização de Reishi.
                  <br />• <strong>Linhas 11-20:</strong> Execução técnica, repetições e cansaço.
                  <br />• <strong>Linhas 21-30:</strong> Superação, corte decisivo e reflexão.
                </p>
              </div>

              <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 space-y-1.5">
                <h5 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                  <span>3️⃣</span> Espace seus 3 Treinos Diários nos Turnos
                </h5>
                <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                  Não envie os 3 treinos de uma vez em 5 minutos! Narre o <strong>1º de manhã</strong>, o <strong>2º à tarde</strong> e o <strong>3º à noite</strong>. Isso respeita a regra da fadiga e dá riqueza e imersão ao roleplay.
                </p>
              </div>

              <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 space-y-1.5">
                <h5 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                  <span>4️⃣</span> Sincronize com seu Código de Atividade (ACT-XXXX)
                </h5>
                <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                  Ao postar sua cena no grupo do WhatsApp, coloque sempre seu código <strong>[ACT-XXXX]</strong> no topo. A Staff usará seu código para lançar suas cenas e seus pontos instantaneamente no painel!
                </p>
              </div>

            </div>
          </Section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 2: TABELA OFICIAL DE PONTOS & RECOMPENSAS */}
      {/* ========================================================================= */}
      {subAba === "pontos" && (
        <div className="space-y-6">
          <Section
            title="🎁 Tabela Oficial de Recompensas em Pontos de Atributo"
            subtitle="Valores exatos creditados em sua ficha para cada tipo de cena e atividade no WhatsApp"
            className="border-2 border-emerald-500/50"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Treino Diário */}
                <div className="p-4 bg-black/80 rounded-xl border-2 border-red-500/50 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-title font-bold text-red-300 uppercase">🥋 Treino Diário</span>
                    <span className="px-2.5 py-0.5 bg-red-950 text-red-200 border border-red-400 font-mono font-black text-xs rounded-full">
                      +3 Pontos
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">
                    Mínimo de <strong>30 linhas</strong> por treino.
                  </p>
                  <div className="pt-1 border-t border-white/10 text-[11px] font-mono text-yellow-300">
                    +10 ₪ Conhecimento por cena
                  </div>
                </div>

                {/* Miscelânea */}
                <div className="p-4 bg-black/80 rounded-xl border-2 border-cyan-500/50 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-title font-bold text-cyan-300 uppercase">📜 Miscelânea / Diálogo</span>
                    <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-200 border border-cyan-400 font-mono font-black text-xs rounded-full">
                      +1 Ponto
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">
                    Mínimo de <strong>30 linhas</strong> de interação cotidiana.
                  </p>
                  <div className="pt-1 border-t border-white/10 text-[11px] font-mono text-yellow-300">
                    +10 ₪ Conhecimento por cena
                  </div>
                </div>

                {/* PVP / Duelo */}
                <div className="p-4 bg-black/80 rounded-xl border-2 border-yellow-500/50 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-title font-bold text-yellow-300 uppercase">⚔️ PVP / Duelo ON</span>
                    <span className="px-2.5 py-0.5 bg-yellow-950 text-yellow-200 border border-yellow-400 font-mono font-black text-xs rounded-full">
                      +2 Pontos
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">
                    Mínimo de <strong>30 linhas</strong> por participante em combate.
                  </p>
                  <div className="pt-1 border-t border-white/10 text-[11px] font-mono text-yellow-300">
                    +10 ₪ Conhecimento por cena
                  </div>
                </div>

                {/* Conclusão de Arco */}
                <div className="sm:col-span-2 lg:col-span-3 p-5 bg-gradient-to-r from-amber-950/60 via-black to-purple-950/60 rounded-xl border-2 border-yellow-500/80 space-y-3 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-title font-bold text-yellow-300 uppercase flex items-center gap-2">
                      <span>👑</span> Conclusão de Arco Narrativo Oficial (Missão Principal)
                    </span>
                    <span className="px-3 py-1 bg-yellow-950 text-yellow-300 border border-yellow-400 font-mono font-black text-xs rounded-full shadow">
                      +15 Pontos Livres + 3 Giros
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">
                    Cenas com mínimo de <strong>90 linhas</strong> narrando o clímax da trama do personagem ou missão do esquadrão.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                    <div className="p-2 bg-black/60 rounded border border-white/5 text-white">✦ +15 Pontos de Atributos Livres</div>
                    <div className="p-2 bg-black/60 rounded border border-white/5 text-cyan-300">✦ +2 Giros de Baú Comum</div>
                    <div className="p-2 bg-black/60 rounded border border-white/5 text-purple-300">✦ +1 Giro Especial de Seireitei</div>
                  </div>
                </div>

              </div>

              {/* Premiação Semanal do Ranking de Atividade */}
              <div className="p-5 bg-black/80 rounded-xl border border-yellow-500/40 space-y-3">
                <h4 className="font-title text-base text-yellow-400 flex items-center gap-2">
                  <span>🏆</span> Premiação Semanal do Ranking de Atividade (Ciclo de 7 Dias)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-yellow-950/40 border border-yellow-500 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-bold text-yellow-300">🥇 1º Lugar Geral:</span>
                    <strong className="text-white font-mono text-sm">+15 Pontos Livres</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-400 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">🥈 2º Lugar Geral:</span>
                    <strong className="text-white font-mono text-sm">+10 Pontos Livres</strong>
                  </div>
                  <div className="p-3 bg-amber-950/40 border border-amber-600 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">🥉 3º Lugar Geral:</span>
                    <strong className="text-white font-mono text-sm">+5 Pontos Livres</strong>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 3: LIMITES DE CENAS & SISTEMA DE FADIGA DE TREINO */}
      {/* ========================================================================= */}
      {subAba === "limites" && (
        <div className="space-y-6">
          <Section
            title="⏱️ Limites Oficiais de Cenas & Regras de Atividade"
            subtitle="Equilíbrio para garantir roleplay de alta qualidade e evolução justa entre todos os jogadores"
            className="border-2 border-amber-500/50"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 bg-black/80 rounded-xl border border-purple-500/40 space-y-2 text-center">
                <span className="text-2xl block">🎭</span>
                <h4 className="font-title text-base text-purple-300">Cenas de Arco</h4>
                <span className="px-2.5 py-1 bg-purple-950 border border-purple-400 text-purple-200 text-xs font-mono font-bold rounded-full block">
                  Máximo: 2 por Semana
                </span>
                <p className="text-[11px] text-bleach-creamDim">
                  Mínimo de <strong>90 linhas</strong> por cena. Foco narrativo em missões capitais, clímax de eventos e provações espirituais profundas.
                </p>
              </div>

              <div className="p-4 bg-black/80 rounded-xl border border-red-500/40 space-y-2 text-center">
                <span className="text-2xl block">🥋</span>
                <h4 className="font-title text-base text-red-300">Cenas de Treino</h4>
                <span className="px-2.5 py-1 bg-red-950 border border-red-400 text-red-200 text-xs font-mono font-bold rounded-full block">
                  Máximo: 3 Diários
                </span>
                <p className="text-[11px] text-bleach-creamDim">
                  Mínimo de <strong>30 linhas</strong> cada. Divididos nos 3 períodos diários (Manhã, Tarde e Noite), gerando acúmulo de fadiga.
                </p>
              </div>

              <div className="p-4 bg-black/80 rounded-xl border border-cyan-500/40 space-y-2 text-center">
                <span className="text-2xl block">📜</span>
                <h4 className="font-title text-base text-cyan-300">Miscelâneas (ON)</h4>
                <span className="px-2.5 py-1 bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold rounded-full block">
                  Máximo: 4 Semanais
                </span>
                <p className="text-[11px] text-bleach-creamDim">
                  Mínimo de <strong>30 linhas</strong>. Cenas de convivência no esquadrão, visitas a Rukongai, diálogos de tavern ou patrulhas comuns.
                </p>
              </div>

              <div className="p-4 bg-black/80 rounded-xl border border-yellow-500/40 space-y-2 text-center">
                <span className="text-2xl block">⚔️</span>
                <h4 className="font-title text-base text-yellow-300">PVP / Duelos ON</h4>
                <span className="px-2.5 py-1 bg-yellow-950 border border-yellow-400 text-yellow-200 text-xs font-mono font-bold rounded-full block">
                  Máximo: 1 Diário
                </span>
                <p className="text-[11px] text-bleach-creamDim">
                  Mínimo de <strong>30 linhas</strong> por participante. Duelos oficiais na Arena ou confrontos de rivalidade autorizados pela Staff.
                </p>
              </div>

            </div>
          </Section>

          {/* Sistema de Fadiga de Treino */}
          <Section
            title="💤 Sistema de Fadiga de Treino: A Regra dos 3 Períodos Diários"
            subtitle="Como o corpo espiritual e os circuitos de Reishi reagem ao esforço físico e mágico contínuo"
            className="border-2 border-red-500/50"
          >
            <div className="space-y-4">
              <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl space-y-2">
                <h4 className="font-title text-base text-red-300 flex items-center gap-2">
                  <span>⚠️</span> Por que o limite de 3 treinos diários impõe fadiga?
                </h4>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  O fluxo de Reishi nos Shinigamis percorre os <em>Saketsu</em> (elo espiritual) e os <em>Hakusui</em> (fonte da alma). Treinar exaustivamente satura esses canais. O corpo humanoide espiritual necessita de descanso biológico para converter a prática em aumento permanente de força.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-bleach-panel2 border border-green-500/40 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-green-300 font-bold uppercase text-[11px]">
                    <span>🌅 1º Período (Manhã)</span>
                    <span>100% Vigor</span>
                  </div>
                  <strong className="text-white block">1º Treino do Dia</strong>
                  <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                    Corpo totalmente descansado. Controle de Reiatsu perfeito, reflexos afiados e ganho pleno de aprendizado técnico (+3 pts).
                  </p>
                </div>

                <div className="p-3.5 bg-bleach-panel2 border border-yellow-500/40 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-yellow-300 font-bold uppercase text-[11px]">
                    <span>☀️ 2º Período (Tarde)</span>
                    <span>70% Vigor</span>
                  </div>
                  <strong className="text-white block">2º Treino do Dia</strong>
                  <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                    Início de microlesões nos canais espirituais e fadiga muscular. O guerreiro precisa de foco mental redobrado para manter o ritmo (+3 pts).
                  </p>
                </div>

                <div className="p-3.5 bg-bleach-panel2 border border-red-500/40 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-red-300 font-bold uppercase text-[11px]">
                    <span>🌙 3º Período (Noite)</span>
                    <span>30% Vigor (Crítico)</span>
                  </div>
                  <strong className="text-white block">3º Treino do Dia (Fadiga Extrema)</strong>
                  <p className="text-bleach-creamDim leading-relaxed text-[11px]">
                    Esgotamento da estamina. Músculos ardem, a velocidade de reação cai pela metade e feitiços de Kidō oscilam pela sobrecarga de Reishi (+3 pts).
                  </p>
                </div>
              </div>

              {/* Exemplo Prático de Fadiga */}
              <div className="p-4 bg-black/80 rounded-xl border border-yellow-500/50 space-y-2">
                <span className="text-[10px] uppercase font-bold text-yellow-400 block font-mono">
                  📖 Exemplo Narrativo de Fadiga em Ação:
                </span>
                <p className="text-xs text-bleach-cream leading-relaxed italic">
                  "O Shinigami Ren acordou às 06h e fez um treino pesado de Zanjutsu contra bonecos de ferro no 11º Esquadrão (1º período, +3 pts). Às 14h, foi até as montanhas de Rukongai praticar saltos de Shunpo de alta velocidade (2º período, +3 pts). Às 21h, ainda insistiu em forçar um 3º treino tentando conjurar Hadō #31 Shakkahō (3º período, +3 pts). Na 3ª cena, seus braços tremiam involuntariamente, o Reishi da explosão queimou suas próprias mãos devido à perda de concentração e seu corpo desabou de exaustão. Sem uma noite completa de sono para restaurar o fluxo de Hakusui, ele estaria vulnerável e incapaz de duelar no dia seguinte."
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 4: COMBATE DO RPG & ESCALA DE DIFERENÇA DE ATRIBUTOS */}
      {/* ========================================================================= */}
      {subAba === "combate" && (
        <div className="space-y-6">
          <Section
            title="⚔️ Sistema de Combate & Escala de Diferença de Poder"
            subtitle="Regra oficial da Sociedade das Almas para confrontos diretos, choques de atributos e narrativa marcial"
            className="border-2 border-cyan-500/50"
          >
            <div className="space-y-5">
              
              {/* Tabela da Escala de Diferença idêntica à imagem */}
              <div className="p-5 bg-black/90 rounded-xl border-2 border-cyan-500/60 space-y-3 shadow-2xl">
                <h4 className="font-title text-xl text-cyan-400 tracking-wider">
                  DIFERENÇA EM COMBATE
                </h4>

                <div className="space-y-2">
                  {[
                    { faixa: "0 – 50 pts", rotulo: "Equivalentes", cor: "text-white", borda: "border-white/10" },
                    { faixa: "51 – 150 pts", rotulo: "Pequena vantagem", cor: "text-green-400", borda: "border-green-500/20" },
                    { faixa: "151 – 300 pts", rotulo: "Vantagem clara", cor: "text-cyan-300", borda: "border-cyan-500/30" },
                    { faixa: "301 – 600 pts", rotulo: "Grande vantagem", cor: "text-yellow-300", borda: "border-yellow-500/40" },
                    { faixa: "601 – 1000 pts", rotulo: "Abismo de poder", cor: "text-orange-400", borda: "border-orange-500/50" },
                    { faixa: "1001+ pts", rotulo: "Diferença monstruosa", cor: "text-red-400 font-black", borda: "border-red-500/60" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={"p-3 bg-bleach-panel2 rounded-xl border flex items-center justify-between gap-4 transition " + item.borda}
                    >
                      <span className="font-mono text-sm sm:text-base font-bold text-bleach-creamDim">
                        {item.faixa}
                      </span>
                      <span className={"font-title text-sm sm:text-base tracking-wide " + item.cor}>
                        {item.rotulo}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-bleach-creamDim italic pt-2 text-center">
                  "Quanto maior a diferença, mais difícil é superar a inferioridade através de técnica pura."
                </p>
              </div>

              {/* Explicação Profunda por Atributo */}
              <div className="space-y-4 pt-2">
                <h4 className="font-title text-lg text-white border-b border-white/10 pb-2">
                  🔍 O que cada diferença significa em cada atributo:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* 1. Pressão Espiritual */}
                  <div className="p-4 bg-bleach-panel2 border border-blue-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <span>🔥</span>
                      <span className="text-sm font-title uppercase">Pressão Espiritual (Reiatsu & Kidō)</span>
                    </div>
                    <ul className="space-y-1.5 text-bleach-creamDim list-disc list-inside leading-relaxed text-[11px]">
                      <li><strong>50–150 pts de vantagem:</strong> A aura do mais forte aquece/pesa no ar; feitiços básicos têm 20% mais penetração.</li>
                      <li><strong>300–600 pts de vantagem:</strong> A presença espiritual faz o chão tremer; Kidōs de nível 1 a 30 do inimigo podem ser dissipados no choque direto com a pele ou lâmina.</li>
                      <li><strong>1000+ pts de vantagem (Abismo):</strong> O oponente mal consegue respirar de pé; a densidade de Reishi anula feitiços médios sem esforço (efeito Aizen / Yamamoto).</li>
                    </ul>
                  </div>

                  {/* 2. Força Física */}
                  <div className="p-4 bg-bleach-panel2 border border-red-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <span>⚔️</span>
                      <span className="text-sm font-title uppercase">Força Física (Zanjutsu & Hakuda)</span>
                    </div>
                    <ul className="space-y-1.5 text-bleach-creamDim list-disc list-inside leading-relaxed text-[11px]">
                      <li><strong>50–150 pts de vantagem:</strong> O choque de espadas estremece o pulso do defensor, empurrando-o um passo para trás.</li>
                      <li><strong>300–600 pts de vantagem:</strong> Cada golpe contundente quebra posturas defensivas, parte muros de pedra e arremessa o oponente longe.</li>
                      <li><strong>1000+ pts de vantagem (Abismo):</strong> A força bruta esmaga defesas sólidas com as mãos nuas e corta estruturas maciças com a pressão de ar do balanço.</li>
                    </ul>
                  </div>

                  {/* 3. Velocidade */}
                  <div className="p-4 bg-bleach-panel2 border border-green-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-green-400 font-bold">
                      <span>⚡</span>
                      <span className="text-sm font-title uppercase">Velocidade (Shunpo & Sonido)</span>
                    </div>
                    <ul className="space-y-1.5 text-bleach-creamDim list-disc list-inside leading-relaxed text-[11px]">
                      <li><strong>50–150 pts de vantagem:</strong> Chega meio segundo antes aos ângulos laterais, forçando o adversário a se virar com pressa.</li>
                      <li><strong>300–600 pts de vantagem:</strong> Cria ilusões de pós-imagem (passos fantasmas) e flanqueia pelas costas antes que o inimigo termine o ataque frontal.</li>
                      <li><strong>1000+ pts de vantagem (Abismo):</strong> Desaparece por completo do campo de visão; desfere múltiplos golpes antes que o som do primeiro impacto seja processado.</li>
                    </ul>
                  </div>

                  {/* 4. Resiliência */}
                  <div className="p-4 bg-bleach-panel2 border border-purple-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <span>🛡️</span>
                      <span className="text-sm font-title uppercase">Resiliência (Hierro & Estamina)</span>
                    </div>
                    <ul className="space-y-1.5 text-bleach-creamDim list-disc list-inside leading-relaxed text-[11px]">
                      <li><strong>50–150 pts de vantagem:</strong> Cicatrização mais rápida de cortes superficiais e menor gasto de energia em combates médios.</li>
                      <li><strong>300–600 pts de vantagem:</strong> Suporta explosões e impactos de Kidōs intermediários sem cair de joelhos, continuando a lutar mesmo ferido.</li>
                      <li><strong>1000+ pts de vantagem (Abismo):</strong> A couraça de Reishi repele lâminas fracas, impedindo penetração e tornando ataques desarmados inofensivos.</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </Section>
        </div>
      )}

    </div>
  );
}
