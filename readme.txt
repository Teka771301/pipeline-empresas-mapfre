PIPELINE EMPRESAS – MAPFRE
======================================
Sistema Web de controle de cotações com login corporativo e integração Firebase.

--------------------------------------------------------
1. CRIAR PROJETO NO FIREBASE
--------------------------------------------------------
1️⃣ Acesse https://console.firebase.google.com e entre com o e-mail terrpr905@gmail.com  
2️⃣ Clique em “Adicionar Projeto” → nome: pipeline-empresas-mapfre  
3️⃣ Ative o Firestore Database:
   - Menu lateral → Firestore Database → Criar Banco
   - Modo de teste (para início)
4️⃣ Ative Authentication:
   - Menu lateral → Authentication → Começar → E-mail/Senha → Ativar

--------------------------------------------------------
2. PEGAR AS CREDENCIAIS
--------------------------------------------------------
1️⃣ No menu lateral → Configurações ⚙️ → Configurações do Projeto → Suas apps  
2️⃣ Clique em “</> Web App” → Dê o nome “pipeline-empresas”  
3️⃣ Copie as chaves de configuração (apiKey, authDomain, projectId, etc.)
4️⃣ Cole dentro do arquivo script.js, no trecho:
   const firebaseConfig = { ... }

--------------------------------------------------------
3. PUBLICAR NO GITHUB PAGES
--------------------------------------------------------
1️⃣ Crie uma conta no https://github.com e um repositório chamado “pipeline-empresas-mapfre”
2️⃣ Envie os arquivos:
   - index.html
   - style.css
   - script.js
   - logo.jpeg
   - README.txt
3️⃣ Vá em Configurações → Páginas → Escolha a branch “main” → Salvar
4️⃣ Seu sistema ficará disponível em:
   https://SEU_USUARIO.github.io/pipeline-empresas-mapfre

--------------------------------------------------------
4. LOGIN DE USUÁRIO
--------------------------------------------------------
1️⃣ Vá em Firebase → Authentication → Usuários
2️⃣ Adicione usuários com e-mails do domínio @mapfre.com.br
3️⃣ Somente esses poderão acessar.

--------------------------------------------------------
5. FIRESTORE (BANCO DE DADOS)
--------------------------------------------------------
Crie a coleção chamada:
pipeline_empresas

Campos armazenados:
- territorial
- especialista
- vigencia
- produto
- status

--------------------------------------------------------
6. TESTAR LOCALMENTE
--------------------------------------------------------
1️⃣ Clique duas vezes no arquivo index.html
2️⃣ Faça login com e-mail autorizado
3️⃣ Inclua, edite, exclua e filtre cotações.

--------------------------------------------------------
Suporte: Desempenho Comercial MAPFRE