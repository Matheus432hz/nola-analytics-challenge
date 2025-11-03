# Nola Analytics Dashboard

Plataforma completa de analise de dados para restaurantes multi-canal

## Sobre o Projeto

Nola Analytics Dashboard e uma solucao end-to-end de Business Intelligence desenvolvida especificamente para donos de restaurantes que operam em multiplos canais de venda (presencial, iFood, Rappi, app proprio).

### Problema que Resolve

Donos de restaurantes possuem volumes massivos de dados operacionais - vendas, produtos, clientes, horarios de pico - mas carecem de ferramentas para extrair insights acionaveis. Solucoes genericas como Power BI sao complexas demais e dashboards fixos nao respondem perguntas especificas do negocio.

### Nossa Solucao

Uma plataforma que empodera donos de restaurantes a:

- Visualizar metricas-chave em tempo real: 514.230 vendas processadas, R$ 574 milhoes em faturamento total
- Construir queries personalizadas dinamicamente SEM escrever uma linha de SQL
- Analisar performance granular por loja, produto, canal de venda e cliente
- Identificar padroes: horarios de pico, produtos campeoes, clientes inativos
- Tomar decisoes baseadas em dados com dashboard visual e intuitivo

## Arquitetura Tecnica

Sistema full-stack com separacao clara de responsabilidades:

CAMADA DE APRESENTACAO
- React 18 + TypeScript
- Dashboard responsivo e moderno
- Graficos interativos Recharts
- Design system proprio

CAMADA DE APLICACAO
- API RESTful Node.js + Express
- Query Builder Dinamico (feature CORE)
- 5 endpoints de analise pre-construidos
- Arquitetura MVC limpa

CAMADA DE DADOS
- PostgreSQL 14 containerizado
- 541.560 registros de vendas
- 50 lojas, 498 produtos, 10.000 clientes
- 6 meses de dados realisticos

### Stack Tecnologica Detalhada

BACKEND
- Node.js 24.x LTS
- TypeScript 5.x (type safety)
- Express.js (framework web)
- pg (PostgreSQL driver nativo)
- tsx (hot module replacement em dev)
- dotenv (variaveis de ambiente)

FRONTEND
- React 18 (biblioteca UI)
- TypeScript (tipagem estatica)
- Vite 7.x (build tool rapido)
- Recharts (biblioteca de graficos)
- Axios (cliente HTTP)
- Lucide React (icones modernos)

DATABASE
- PostgreSQL 14 (banco relacional)
- Docker + Docker Compose (containerizacao)
- Python + Faker (geracao de dados sinteticos)

## Instalacao Completa

### Pre-requisitos

Certifique-se de ter instalado:
- Node.js versao 24 ou superior
- Docker Desktop rodando
- Python 3.x
- Git

### Passo 1: Clone o Repositorio

git clone seu-repositorio-aqui
cd nola-god-level

### Passo 2: Inicie o Banco de Dados

docker compose up -d

Aguarde 30 segundos para o PostgreSQL inicializar completamente.

Verifique se esta rodando:
docker ps

Deve mostrar container postgres rodando na porta 5433.

### Passo 3: Gere os Dados Sinteticos

pip install faker
python generate_data.py

Aguarde de 2 a 5 minutos. Ao final deve exibir:
- Stores: 50
- Products: 498
- Sales: 541,560
- Customers: 10,000

### Passo 4: Configure o Backend

Entre na pasta backend:
cd backend

Instale dependencias:
npm install

Crie arquivo .env na pasta backend com estas variaveis:

DB_HOST=localhost
DB_PORT=5433
DB_USER=challenge
DB_PASSWORD=challenge123
DB_NAME=challenge_db
PORT=3001

### Passo 5: Inicie o Backend

npm run dev

Deve exibir:
- Server running on http://localhost:3001
- Database connected successfully

### Passo 6: Configure o Frontend

Abra um NOVO terminal e entre na pasta frontend:
cd frontend

Instale dependencias:
npm install

### Passo 7: Inicie o Frontend

npm run dev

Deve exibir:
- VITE ready in 873 ms
- Local: http://localhost:3000

### Passo 8: Acesse a Aplicacao

Abra seu navegador em:
http://localhost:3000

Voce deve ver o dashboard completo com metricas, graficos e tabelas.

## Endpoints da API

### 1. Health Check

GET /health

Retorna status do servidor e conexao com banco.

### 2. Metricas Gerais

GET /api/metrics

Retorna KPIs principais:
- Total de vendas completadas
- Faturamento total
- Ticket medio
- Total de lojas ativas
- Total de produtos cadastrados
- Total de clientes unicos

### 3. Query Builder Dinamico (FEATURE CORE)

POST /api/query

O coracao da solucao. Permite construir queries SQL complexas sem escrever codigo.

Exemplo de body JSON:

{
  "table": "sales",
  "fields": ["id", "total_amount", "created_at", "store_id"],
  "filters": [
    {
      "field": "total_amount",
      "operator": "gt",
      "value": 500
    },
    {
      "field": "sale_status_desc",
      "operator": "eq",
      "value": "COMPLETED"
    }
  ],
  "orderBy": [
    {
      "field": "total_amount",
      "direction": "DESC"
    }
  ],
  "limit": 20
}

Operadores suportados:
- eq: igual
- ne: diferente
- gt: maior que
- gte: maior ou igual
- lt: menor que
- lte: menor ou igual
- like: busca textual
- in: lista de valores
- between: intervalo entre dois valores

### 4. Top Produtos

GET /api/analysis/top-products?limit=10

Retorna os produtos mais vendidos por faturamento total.

### 5. Performance de Lojas

GET /api/analysis/store-performance

Retorna analise completa de todas as lojas:
- Total de vendas
- Faturamento
- Ticket medio
- Clientes unicos

### 6. Vendas por Canal

GET /api/analysis/sales-by-channel

Compara performance entre canais de venda (presencial, iFood, Rappi, app).

### 7. Vendas por Horario

GET /api/analysis/sales-by-time

Identifica padroes temporais: dia da semana e hora do dia com maior movimento.

### 8. Clientes Inativos

GET /api/analysis/inactive-customers?days=30

Lista clientes que nao compraram nos ultimos N dias.

## Decisoes Arquiteturais

### Por que Query Builder Dinamico?

Esta e a feature CORE que diferencia nossa solucao. Em vez de criar dezenas de endpoints especificos, fornecemos um unico endpoint poderoso que permite ao usuario construir qualquer query que precise.

Beneficios:
- Flexibilidade total sem deploy de codigo novo
- Permite analises nao previstas pelos desenvolvedores
- Reduz drasticamente o tempo de desenvolvimento
- Escala infinitamente em complexidade

### Seguranca Implementada

Whitelist de Tabelas:
Apenas tabelas explicitamente permitidas podem ser consultadas, prevenindo acesso nao autorizado.

Prepared Statements:
Todas as queries usam parametros vinculados, eliminando 100% do risco de SQL injection.

Validacao de Operadores:
Apenas operadores seguros e testados sao aceitos, bloqueando tentativas de injecao.

### Otimizacoes de Performance

Indices Estrategicos:
Criados indices em product_id, sale_id e created_at para acelerar joins e filtros temporais.

LIMIT Default:
Todas as queries tem limite padrao de 100 registros para evitar sobrecarga do banco.

GROUP BY Otimizado:
Agregacoes usam indices para executar em milissegundos mesmo com 500k+ registros.

Connection Pooling:
Pool de conexoes reutilizaveis reduz overhead de abertura/fechamento de conexoes.

### Escalabilidade

Backend Stateless:
Nenhum estado e mantido entre requisicoes, permitindo escalar horizontalmente.

Frontend/Backend Separados:
Deploy independente permite escalar cada camada conforme necessidade.

Docker:
Infraestrutura como codigo garante reproducibilidade em qualquer ambiente.

## Estrutura de Pastas Completa

nola-god-level/
  backend/
    src/
      config/
        database.ts - Configuracao e pool de conexoes PostgreSQL
      controllers/
        metricsController.ts - Logica de controle de metricas
        queryController.ts - Controlador do query builder
        analysisController.ts - Controllers de analises especificas
      services/
        metricsService.ts - Regras de negocio de metricas
        queryService.ts - CORE: query builder dinamico
        analysisService.ts - Logica de analises pre-prontas
      routes/
        metricsRoutes.ts - Rotas de metricas
        queryRoutes.ts - Rotas do query builder
        analysisRoutes.ts - Rotas de analises
      index.ts - Entry point do servidor Express
    package.json
    tsconfig.json
    .env

  frontend/
    src/
      components/
        MetricsCards.tsx - Cards de KPIs principais
        TopProductsChart.tsx - Grafico de barras top produtos
        StoreTable.tsx - Tabela performance lojas
      services/
        api.ts - Cliente HTTP configurado
      types/
        index.ts - Interfaces TypeScript
      App.tsx - Componente raiz
      App.css - Estilos globais
      main.tsx - Entry point React
    package.json
    vite.config.ts

  docker-compose.yml - Definicao do container PostgreSQL
  generate_data.py - Script Python geracao dados
  README.md - Esta documentacao

## Testando a Solucao

### Teste 1: Health Check

curl http://localhost:3001/health

Resposta esperada: status 200 com informacoes do servidor.

### Teste 2: Metricas Gerais

curl http://localhost:3001/api/metrics

Deve retornar JSON com todas as metricas calculadas.

### Teste 3: Top 5 Produtos

curl http://localhost:3001/api/analysis/top-products?limit=5

Lista os 5 produtos com maior faturamento.

### Teste 4: Query Customizada Avancada

curl -X POST http://localhost:3001/api/query \
-H "Content-Type: application/json" \
-d '{"table":"sales","fields":["store_id","COUNT(*) as total","SUM(total_amount) as revenue"],"filters":[{"field":"sale_status_desc","operator":"eq","value":"COMPLETED"}],"groupBy":["store_id"],"orderBy":[{"field":"revenue","direction":"DESC"}],"limit":5}'

Retorna as 5 lojas com maior faturamento, incluindo totais agregados.

## Proximos Passos

### Melhorias Futuras

- Implementar cache Redis para queries frequentes
- Adicionar autenticacao JWT para usuarios
- Exportar relatorios em PDF/Excel
- Graficos adicionais: pizza, linha temporal, heatmap
- Filtros de data range no frontend
- Comparacao entre periodos (MoM, YoY)
- Alertas automaticos para metricas criticas

## Video Demonstracao

Link: 

Demonstracao de 5 minutos mostrando:
1. Instalacao rapida
2. Dashboard em funcionamento
3. Query builder dinamico em acao
4. Analises customizadas
5. Performance e responsividade

## Autor

Matheus Dias Salla
Email: https://www.linkedin.com/in/matheus-salla
LinkedIn: https://www.linkedin.com/in/matheus-salla

Desenvolvido para o Nola God Level Coder Challenge 2025

## Licenca e Uso

Este projeto foi desenvolvido como parte do desafio tecnico Nola God Level Coder Challenge.

Permitido:
- Uso para avaliacao do desafio
- Uso educacional e estudo
- Fork e contribuicoes

Nao Permitido:
- Uso comercial sem autorizacao
- Redistribuicao sem creditos

## Agradecimentos

- Equipe Nola pela oportunidade e desafio incrivel
- Comunidade open-source pelas ferramentas fantasticas
- Mentores e colegas pelo suporte durante o desenvolvimento

***

Desenvolvido com dedicacao e paixao para o Nola God Level Challenge
Transformando dados em decisoes estrategicas
