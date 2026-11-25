# CRUD Alunos - Firebase Firestore

Aplicação Node.js simples para gerenciar alunos no Firebase Cloud Firestore.

## Estrutura da Coleção `alunos`

| Campo | Tipo |
|-------|------|
| nome | string |
| turma | string |
| dataNascimento | string (AAAA-MM-DD) |
| ativo | boolean |

## Pré-requisitos

1. Node.js instalado (versão 16+)
2. Projeto no [Firebase Console](https://console.firebase.google.com/)
3. Firestore habilitado no projeto
4. Chave de conta de serviço (serviceAccountKey.json)

## Configuração

### 1. Criar projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga os passos para criar o projeto

### 2. Habilitar Firestore
1. No menu lateral, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione a localização e confirme

### 3. Gerar chave de serviço
1. Vá em **Configurações do projeto** (ícone de engrenagem) → **Contas de serviço**
2. Clique em **Gerar nova chave privada**
3. Salve o arquivo como `serviceAccountKey.json` na raiz do projeto

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `serviceAccountKey.json` no GitHub! Ele já está no `.gitignore`.

### 4. Instalar dependências
```bash
npm install
```

## Executar

```bash
npm start
```

## Funcionalidades

- **CREATE**: Cadastrar novo aluno
- **READ**: Listar todos os alunos
- **UPDATE**: Atualizar dados de um aluno
- **DELETE**: Excluir um aluno
- **Consulta por turma**: Filtrar alunos por turma
- **Consulta por data de nascimento**: Buscar por data exata ou intervalo

## Menu do Terminal

```
========== CRUD ALUNOS - FIRESTORE ==========
1 - Cadastrar aluno
2 - Listar todos os alunos
3 - Atualizar aluno
4 - Excluir aluno
5 - Consultar por turma
6 - Consultar por data de nascimento
0 - Sair
=============================================
```

## Exemplo de uso

1. Execute `npm start`
2. Escolha a opção **1** para cadastrar
3. Preencha os dados:
   - Nome: João Silva
   - Turma: 3A
   - Data de nascimento: 2010-05-15
   - Ativo: s
4. Use a opção **2** para ver a lista
5. Teste as consultas (opções 5 e 6)

## Entrega da Atividade

Para entregar no Google Sala de Aula:
1. Suba o código para um repositório GitHub (sem o serviceAccountKey.json!)
2. Tire prints do terminal funcionando (CRUD + consultas)
3. Envie o link do repositório e as capturas de tela