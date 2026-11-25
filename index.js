const admin = require('firebase-admin');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

// Verifica se existe o arquivo de credenciais
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.log('❌ Arquivo serviceAccountKey.json não encontrado!');
  console.log('📋 Crie um projeto no Firebase Console, gere a chave privada e salve como serviceAccountKey.json na raiz do projeto.');
  process.exit(1);
}

// Inicializa o Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const alunosRef = db.collection('alunos');

// Funções CRUD
async function criarAluno() {
  console.log('\n--- CADASTRAR ALUNO ---');
  const nome = readlineSync.question('Nome: ');
  const turma = readlineSync.question('Turma: ');
  const dataNascimento = readlineSync.question('Data de nascimento (AAAA-MM-DD): ');
  const ativo = readlineSync.question('Ativo? (s/n): ').toLowerCase() === 's';

  try {
    const docRef = await alunosRef.add({
      nome,
      turma,
      dataNascimento,
      ativo
    });
    console.log(`✅ Aluno cadastrado com ID: ${docRef.id}`);
  } catch (error) {
    console.error('❌ Erro ao cadastrar:', error.message);
  }
}

async function listarAlunos() {
  console.log('\n--- LISTAR ALUNOS ---');
  try {
    const snapshot = await alunosRef.orderBy('nome').get();
    
    if (snapshot.empty) {
      console.log('Nenhum aluno encontrado.');
      return;
    }

    console.log('\nID                                    | Nome                    | Turma       | Nascimento  | Ativo');
    console.log('----------------------------------------------------------------------------------');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id.padEnd(36);
      const nome = (data.nome || '').padEnd(23);
      const turma = (data.turma || '').padEnd(11);
      const nasc = (data.dataNascimento || '').padEnd(11);
      const ativo = data.ativo ? 'Sim' : 'Não';
      console.log(`${id} | ${nome} | ${turma} | ${nasc} | ${ativo}`);
    });
  } catch (error) {
    console.error('❌ Erro ao listar:', error.message);
  }
}

async function atualizarAluno() {
  console.log('\n--- ATUALIZAR ALUNO ---');
  const id = readlineSync.question('ID do aluno: ');
  
  try {
    const doc = await alunosRef.doc(id).get();
    if (!doc.exists) {
      console.log('❌ Aluno não encontrado.');
      return;
    }

    const data = doc.data();
    console.log(`\nDados atuais: ${data.nome} | ${data.turma} | ${data.dataNascimento} | ${data.ativo ? 'Ativo' : 'Inativo'}\n`);

    const nome = readlineSync.question(`Novo nome [${data.nome}]: `) || data.nome;
    const turma = readlineSync.question(`Nova turma [${data.turma}]: `) || data.turma;
    const dataNascimento = readlineSync.question(`Nova data nascimento [${data.dataNascimento}]: `) || data.dataNascimento;
    const ativoInput = readlineSync.question(`Ativo? (s/n) [${data.ativo ? 's' : 'n'}]: `);
    const ativo = ativoInput ? ativoInput.toLowerCase() === 's' : data.ativo;

    await alunosRef.doc(id).update({ nome, turma, dataNascimento, ativo });
    console.log('✅ Aluno atualizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error.message);
  }
}

async function excluirAluno() {
  console.log('\n--- EXCLUIR ALUNO ---');
  const id = readlineSync.question('ID do aluno: ');
  
  try {
    const doc = await alunosRef.doc(id).get();
    if (!doc.exists) {
      console.log('❌ Aluno não encontrado.');
      return;
    }

    const confirm = readlineSync.question(`Confirmar exclusão de ${doc.data().nome}? (s/n): `);
    if (confirm.toLowerCase() === 's') {
      await alunosRef.doc(id).delete();
      console.log('✅ Aluno excluído com sucesso!');
    } else {
      console.log('Operação cancelada.');
    }
  } catch (error) {
    console.error('❌ Erro ao excluir:', error.message);
  }
}

async function consultarPorTurma() {
  console.log('\n--- CONSULTAR POR TURMA ---');
  const turma = readlineSync.question('Turma: ');
  
  try {
    const snapshot = await alunosRef.where('turma', '==', turma).orderBy('nome').get();
    
    if (snapshot.empty) {
      console.log(`Nenhum aluno encontrado na turma "${turma}".`);
      return;
    }

    console.log(`\nAlunos da turma "${turma}":`);
    console.log('ID                                    | Nome                    | Nascimento  | Ativo');
    console.log('--------------------------------------------------------------------------');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id.padEnd(36);
      const nome = (data.nome || '').padEnd(23);
      const nasc = (data.dataNascimento || '').padEnd(11);
      const ativo = data.ativo ? 'Sim' : 'Não';
      console.log(`${id} | ${nome} | ${nasc} | ${ativo}`);
    });
  } catch (error) {
    console.error('❌ Erro na consulta:', error.message);
  }
}

async function consultarPorDataNascimento() {
  console.log('\n--- CONSULTAR POR DATA DE NASCIMENTO ---');
  console.log('1 - Data exata');
  console.log('2 - Intervalo (entre duas datas)');
  const opcao = readlineSync.question('Opção: ');

  try {
    let snapshot;
    
    if (opcao === '1') {
      const data = readlineSync.question('Data (AAAA-MM-DD): ');
      snapshot = await alunosRef.where('dataNascimento', '==', data).orderBy('nome').get();
    } else if (opcao === '2') {
      const inicio = readlineSync.question('Data início (AAAA-MM-DD): ');
      const fim = readlineSync.question('Data fim (AAAA-MM-DD): ');
      snapshot = await alunosRef
        .where('dataNascimento', '>=', inicio)
        .where('dataNascimento', '<=', fim)
        .orderBy('dataNascimento')
        .orderBy('nome')
        .get();
    } else {
      console.log('Opção inválida.');
      return;
    }

    if (snapshot.empty) {
      console.log('Nenhum aluno encontrado.');
      return;
    }

    console.log('\nResultados:');
    console.log('ID                                    | Nome                    | Turma       | Nascimento  | Ativo');
    console.log('----------------------------------------------------------------------------------');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id.padEnd(36);
      const nome = (data.nome || '').padEnd(23);
      const turma = (data.turma || '').padEnd(11);
      const nasc = (data.dataNascimento || '').padEnd(11);
      const ativo = data.ativo ? 'Sim' : 'Não';
      console.log(`${id} | ${nome} | ${turma} | ${nasc} | ${ativo}`);
    });
  } catch (error) {
    console.error('❌ Erro na consulta:', error.message);
  }
}

// Menu principal
function mostrarMenu() {
  console.log('\n========== CRUD ALUNOS - FIRESTORE ==========');
  console.log('1 - Cadastrar aluno');
  console.log('2 - Listar todos os alunos');
  console.log('3 - Atualizar aluno');
  console.log('4 - Excluir aluno');
  console.log('5 - Consultar por turma');
  console.log('6 - Consultar por data de nascimento');
  console.log('0 - Sair');
  console.log('=============================================');
}

async function main() {
  let opcao;
  
  do {
    mostrarMenu();
    opcao = readlineSync.question('Escolha uma opção: ');
    
    switch (opcao) {
      case '1':
        await criarAluno();
        break;
      case '2':
        await listarAlunos();
        break;
      case '3':
        await atualizarAluno();
        break;
      case '4':
        await excluirAluno();
        break;
      case '5':
        await consultarPorTurma();
        break;
      case '6':
        await consultarPorDataNascimento();
        break;
      case '0':
        console.log('\n👋 Saindo...');
        break;
      default:
        console.log('❌ Opção inválida!');
    }
  } while (opcao !== '0');
  
  process.exit(0);
}

main();