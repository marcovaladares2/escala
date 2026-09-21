# Escala Pediatria

Aplicação estática para consultar a escala de residentes de Pediatria, inclusive offline após a primeira visita.

## Executar

Abra a pasta com um servidor estático local. Não há dependências, backend ou banco de dados.

## Estrutura

- `js/data`: residentes, períodos e semanas oficiais.
- `js/core`: datas civis, rotação, consulta oficial e camada pessoal.
- `js/storage`: única abstração de `localStorage`.
- `js/ui`: telas e componentes.
- `sw.js` e `manifest.webmanifest`: PWA/offline.

## Atualizar uma próxima escala

Após 28/02/2027, adicione um período em `js/data/schedule-periods.js` com novo marco zero, ciclo e letras iniciais. Atualize residentes e semanas-padrão se necessário. Não cadastre datas individuais: o motor calcula os blocos de 14 dias. Acrescente testes de limite e aumente `CACHE_NAME` em `sw.js` para publicar a atualização offline.

## Dados locais

Perfil, preferências e alterações pessoais ficam somente no `localStorage` do navegador. Use Configurações para exportar/importar backup JSON ao trocar de dispositivo. Não existe sincronização automática entre aparelhos.
