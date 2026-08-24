# ⚔️ Bleach RPG · Sociedade das Almas — Guia Mestre de Continuidade

Este documento serve como a base de conhecimento permanente para você (ou qualquer sessão futura de IA) continuar o desenvolvimento deste projeto instantaneamente.

---

## 📁 1. Localização dos Arquivos no Computador
Todos os arquivos do projeto estão salvos na pasta:
`C:\Users\V1598\.gemini\antigravity-ide\scratch\bleach-rpg-app`

---

## 🚀 2. Como Compilar & Testar Alterações

Toda vez que você ou a IA fizer alterações nos códigos:
1. **Compilar para Produção (Gera `app.js` e `index.html`):**
   ```bash
   node build.js
   ```
2. **Executar a Suíte de Testes Automatizada (19 Telas & Componentes):**
   ```bash
   node test_master_suite.js
   ```
3. **Iniciar Servidor Local de Testes (Opcional):**
   ```bash
   node server.js
   ```
   *Acesse no navegador em:* `http://localhost:3000`

---

## 🏛️ 3. Arquitetura Modular dos Arquivos

| Arquivo | Função Principal |
| :--- | :--- |
| **`templates_part1_builder.js`** | TopBar, Navegação, Patch Notes, Chat Global, Rankings, Kidos, Arena, Regras de Combate. |
| **`templates_part2_builder.js`** | Ficha do Personagem, Personalidade & DNA Espiritual, Atributos, Gestão de Shikai & Bankai, Painel ADM. |
| **`templates_part3_builder.js`** | Sistemas Oficiais, Power Scaling (1 a 3.300+ pts), Tabela de Diferenças, Dicionário & Lore. |
| **`templates_builder.js`** | Modais Globais: Ritual de Despertar de 4 Caminhos (Zanpakuto4PathsModal), Baú Espiritual (Gacha), Cena de Despertar. |
| **`spiritual_engine.js`** | Motor Zanpakuto Genesis Engine v5.0 (IA Gemini 3.6 Flash / ChatGPT + Fallback Cognitivo com Ponto Fraco). |
| **`build_clean_source.js`** | Núcleo do App, Estado Global do Banco de Dados, Sincronização Firebase Cloud, Sanitizador `sanitizeChar`. |
| **`build.js`** | Script de montagem e transpilação com Babel Standalone para gerar `app.js` e `index.html`. |

---

## 🔑 4. Recursos Especiais Implementados
1. **Zanpakuto Genesis Engine v5.0:** Geração de 4 Shikais autoriais e 3 Bankais com Ponto Fraco e Brecha Estratégica.
2. **Persistência Definitiva:** Opções de Shikai e Bankai permanecem salvas na ficha permanentemente até a decisão do player.
3. **Auto-Draft da Personalidade:** Salvamento instantâneo no `localStorage` a cada letra digitada.
4. **Grande Escala de Poder:** Inexperiente (1–200 pts) até Transcendente (3.300+ pts).
