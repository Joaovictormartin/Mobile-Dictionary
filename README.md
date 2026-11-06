# Mobile Dictionary

Aplicativo mobile para descobrir palavras em ingles, consultar significados, ouvir a pronuncia e manter favoritos e historico de consultas.

This is a challenge by [Coodesh](https://coodesh.com/).

## Tecnologias

- React Native, Expo SDK 58, Expo Router e TypeScript
- TanStack Query para cache e deduplicacao das consultas
- Axios e Zod para comunicacao e validacao da API
- Zustand e AsyncStorage para favoritos e historico persistidos
- Expo Speech para pronuncia

## Funcionalidades

- Lista paginada visualmente com busca local e `FlatList`
- Consulta de detalhes pela Free Dictionary API
- Fonetica, IPA, classes gramaticais, definicoes, exemplos, sinonimos, antonimos e origem quando disponiveis
- Favoritos sem duplicidade e persistidos localmente
- Historico ordenado pela consulta mais recente
- Cadastro, login e logout com sessao local
- Favoritos e historico isolados por usuario
- Cache de detalhes por palavra
- Pronuncia por sintese de voz
- Estados de carregamento, erro, retry e lista vazia

## Testes

Os testes cobrem:

- Consulta e validacao de palavras pela API
- Tratamento de falhas da API
- Cache de consultas por palavra
- Adicao, remocao e persistencia de favoritos
- Registro, ordenacao e persistencia do historico
- Cadastro, login e validacao de credenciais
- Interacao do componente de palavra

Execute a suite com:

```bash
yarn test
```

## Arquitetura

As telas e rotas ficam em `src/app`. Componentes reutilizaveis ficam em `src/components`, enquanto integracoes e regras de negocio ficam organizadas por feature em `src/features`. O alias `@/*` aponta para `src/*`.

O dicionario remoto e carregado uma vez pelo TanStack Query e paginado em memoria para que somente uma janela de palavras seja renderizada. Os detalhes sao consultados com uma chave independente por palavra, permitindo reutilizacao e deduplicacao do cache.

## Estrutura principal

```text
src/
  app/                 rotas Expo Router
  components/          componentes compartilhados
  constants/           URLs e chaves de persistencia
  features/            words, favorites e history
  hooks/               hooks compartilhados
  services/            adaptadores de armazenamento
  theme/               cores e espacamentos
  types/               tipos de dominio
```

## Instalacao e execucao

Use Node `>=22.13.0` (Node 24 recomendado):

```bash
nvm use 24
yarn install
yarn start
```

No terminal do Expo, use `i` para iOS, `a` para Android ou `w` para Web.

## Validacao

```bash
yarn tsc --noEmit
yarn lint
yarn test
```

## Limitacoes conhecidas

- O arquivo de palavras e uma fonte remota do GitHub; a primeira abertura depende de conectividade.
- A Free Dictionary API nem sempre fornece audio, etimologia ou todos os campos. Quando o audio nao existe, o aplicativo usa Expo Speech.
- O dicionario remoto depende de conectividade na primeira carga.
- As contas sao locais ao dispositivo; esta implementacao nao substitui um backend de autenticacao em producao.
