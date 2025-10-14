// =============== CONFIGURAÇÃO DO FIREBASE ==================
// Substitua pelos dados do seu projeto (após criá-lo no Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyCIF1EN1BFKi2LJ9cPYx6avTymGQzO9zMM",
  authDomain: "pipeline-empresas-mapfre.firebaseapp.com",
  projectId: "pipeline-empresas-mapfre",
  storageBucket: "pipeline-empresas-mapfre.firebasestorage.app",
  messagingSenderId: "148451438481",
  appId: "1:148451438481:web:7b50b93552c7476972f430",
  measurementId: "G-KFWYL08FB0"
};

// Inicialização Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =============== ELEMENTOS DA INTERFACE ==================
const loginContainer = document.getElementById("login-container");
const painelContainer = document.getElementById("painel-container");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("loginError");
const bemvindo = document.getElementById("bemvindo");
const ajudaBtn = document.getElementById("ajudaBtn");
const ajudaPopup = document.getElementById("ajudaPopup");
const fecharAjuda = document.getElementById("fecharAjuda");

// Campos de formulário e botões
const novaBtn = document.getElementById("novaBtn");
const filtroBtn = document.getElementById("filtroBtn");
const exportarBtn = document.getElementById("exportarBtn");
const salvarBtn = document.getElementById("salvarBtn");
const aplicarFiltro = document.getElementById("aplicarFiltro");
const tabelaBody = document.querySelector("#tabela tbody");

const formulario = document.getElementById("formulario");
const filtros = document.getElementById("filtros");

// Campos de cotação
const numCotacao = document.getElementById("numCotacao");
const territorial = document.getElementById("territorial");
const especialista = document.getElementById("especialista");
const vigencia = document.getElementById("vigencia");
const produto = document.getElementById("produto");
const status = document.getElementById("status");

// =================== LOGIN ==========================
loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!email.endsWith("@mapfre.com.br")) {
        loginError.textContent = "Apenas e-mails @mapfre.com.br podem acessar.";
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, senha);
    } catch (error) {
        loginError.textContent = "Erro ao entrar: " + error.message;
    }
});

logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    painelContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
});

// Monitora estado do login
auth.onAuthStateChanged((user) => {
    if (user && user.email.endsWith("@mapfre.com.br")) {
        loginContainer.classList.add("hidden");
        painelContainer.classList.remove("hidden");
        const nome = user.email.split("@")[0].split(".")[0];
        bemvindo.textContent = Bem-vindo ao PIPELINE EMPRESAS – MAPFRE, ${nome.charAt(0).toUpperCase() + nome.slice(1)}!;
        carregarTabela();
    } else {
        painelContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    }
});

// =================== CRUD (Create, Read, Update, Delete) ===================
novaBtn.addEventListener("click", () => {
    formulario.classList.toggle("hidden");
    filtros.classList.add("hidden");
});

salvarBtn.addEventListener("click", async () => {
    const cotacao = numCotacao.value.trim();

    if (!cotacao) {
        alert("O campo Nº Cotação é obrigatório.");
        return;
    }

    const docRef = db.collection("pipeline_empresas").doc(cotacao);
    const doc = await docRef.get();

    if (doc.exists && !formulario.dataset.editando) {
        alert("Já existe uma cotação com esse nú…