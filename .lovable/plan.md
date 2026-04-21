
## Problema

A landing page (`/`) aparece em branco. O erro de runtime anterior (`Cannot read properties of null (reading 'useEffect')`) indica que o React está sendo carregado como `null` dentro do `QueryClientProvider`. Isso normalmente acontece quando há **duas cópias do React** no bundle (ex.: uma resolvida via `react` e outra via caminho diferente), fazendo com que o `useEffect` do `@tanstack/react-query` receba um React sem hooks.

A limpeza do cache do Vite (`node_modules/.vite`) feita anteriormente não resolveu de forma persistente — o erro volta porque a causa raiz está na resolução de dependências, não só no cache.

## Causa provável

Inspecionei `src/main.tsx`, `src/App.tsx` e `package.json`. Suspeitas principais:
1. Versões duplicadas/incompatíveis entre `react`, `react-dom` e `@tanstack/react-query` (o react-query v5 exige React 18+; se houver mismatch ou duas instâncias, o hook quebra).
2. Cache do Vite corrompido + `optimizeDeps` não forçando dedupe de `react`.
3. Possível instalação parcial (bun.lock vs package-lock.json coexistindo) gerando árvore inconsistente.

## Plano de correção

1. **Verificar `package.json`** — confirmar versões de `react`, `react-dom`, `@tanstack/react-query` e garantir compatibilidade (React 18.3.x + react-query 5.x).
2. **Forçar dedupe do React no Vite** — adicionar em `vite.config.ts`:
   - `resolve.dedupe: ['react', 'react-dom']`
   - `optimizeDeps.include: ['react', 'react-dom', '@tanstack/react-query']`
3. **Reinstalar dependências limpas** — remover `node_modules`, `node_modules/.vite` e um dos lockfiles conflitantes (manter apenas `bun.lock` OU `package-lock.json`), depois reinstalar.
4. **Validar no preview** — recarregar `/` e confirmar que a Landing renderiza (hero "ARENA OF GODS", features, roadmap).
5. **Fallback (se persistir)** — envolver `QueryClientProvider` em try/import dinâmico não é necessário; mas se o erro continuar, simplificar `App.tsx` removendo temporariamente o `QueryClientProvider` para isolar a falha e reintroduzir após confirmar que a árvore React está saudável.

## Arquivos afetados

- `vite.config.ts` — adicionar `dedupe` + `optimizeDeps`.
- `package.json` / lockfiles — alinhar versões e remover lockfile duplicado.
- Sem mudanças necessárias na Landing em si — o conteúdo já existe e está correto; o problema é puramente de bootstrap do React.

## Resultado esperado

Após aprovação, ao abrir `/` você verá a landing completa: navbar com logo A.O.G, hero com título "ARENA OF GODS" e CTA "JOGAR AGORA", seção FEATURES (4 cards), ROADMAP (4 fases) e CTA final "PRONTO PARA ASCENDER?".
