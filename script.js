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
        alert("Já existe uma cotação com esse número.");
        return;
    }

    const dados = {
        territorial: territorial.value,
        especialista: especialista.value,
        vigencia: vigencia.value,
        produto: produto.value,
        status: status.value
    };

    await docRef.set(dados);
    alert("Cotação salva com sucesso!");
    formulario.reset();
    formulario.classList.add("hidden");
    formulario.dataset.editando = "";
    carregarTabela();
});

async function carregarTabela(filtro = {}) {
    tabelaBody.innerHTML = "";
    let query = db.collection("pipeline_empresas");

    if (filtro.territorial) query = query.where("territorial", "==", filtro.territorial);
    if (filtro.especialista) query = query.where("especialista", "==", filtro.especialista);
    if (filtro.produto) query = query.where("produto", "==", filtro.produto);
    if (filtro.status) query = query.where("status", "==", filtro.status);

    const snap = await query.get();
    snap.forEach(doc => {
        const d = doc.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${doc.id}</td>
            <td>${d.territorial || ""}</td>
            <td>${d.especialista || ""}</td>
            <td>${d.vigencia || ""}</td>
            <td>${d.produto || ""}</td>
            <td>${d.status || ""}</td>
            <td>
                <button onclick="editarCotacao('${doc.id}')">Editar</button>
                <button onclick="excluirCotacao('${doc.id}')">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

window.editarCotacao = async function (id) {
    const doc = await db.collection("pipeline_empresas").doc(id).get();
    if (!doc.exists) return;
    const d = doc.data();
    numCotacao.value = id;
    territorial.value = d.territorial;
    especialista.value = d.especialista;
    vigencia.value = d.vigencia;
    produto.value = d.produto;
    status.value = d.status;
    formulario.classList.remove("hidden");
    formulario.dataset.editando = "true";
};

window.excluirCotacao = async function (id) {
    if (confirm("Deseja realmente excluir esta cotação?")) {
        await db.collection("pipeline_empresas").doc(id).delete();
        carregarTabela();
    }
};

// =================== FILTROS ==========================
filtroBtn.addEventListener("click", () => {
    filtros.classList.toggle("hidden");
    formulario.classList.add("hidden");
});

aplicarFiltro.addEventListener("click", () => {
    const filtro = {
        territorial: document.getElementById("territorialFiltro").value,
        especialista: document.getElementById("especialistaFiltro").value,
        vigencia: document.getElementById("vigenciaFiltro").value,
        produto: document.getElementById("produtoFiltro").value,
        status: document.getElementById("statusFiltro").value
    };
    carregarTabela(filtro);
});

// =================== EXPORTAÇÃO EXCEL ==========================
exportarBtn.addEventListener("click", () => {
    const linhas = [["Nº Cotação", "Territorial", "Especialista", "Início Vigência", "Produto", "Status Comercial"]];
    document.querySelectorAll("#tabela tbody tr").forEach(tr => {
        const cols = [...tr.children].slice(0, 6).map(td => td.textContent);
        linhas.push(cols);
    });

    const csv = linhas.map(l => l.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Relatorio_Pipeline_Empresas.csv";
    a.click();
});

// =================== AJUDA ==========================
ajudaBtn.addEventListener("click", () => ajudaPopup.classList.remove("hidden"));
fecharAjuda.addEventListener("click", () => ajudaPopup.classList.add("hidden"));
