// 1. LINK DA SUA API (CONFIGURADO)
const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// 2. VERIFICAÇÃO DE LOGIN AO CARREGAR A PÁGINA
window.onload = () => {
    const usuarioSalvo = localStorage.getItem('meu_acervo_user');
    if (usuarioSalvo) {
        entrarNoPainel(usuarioSalvo);
    }
};

// 3. FUNÇÃO PARA ENTRAR NO PAINEL
function entrarNoPainel(email) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    console.log("Logado como:", email);
    carregarGaleria(); // Busca as fotos assim que entra
}

// 4. FUNÇÃO PARA SAIR (LIMPAR MEMÓRIA)
function sair() {
    localStorage.removeItem('meu_acervo_user');
    location.reload();
}

// 5. CARREGAR GALERIA (BUSCA NA PLANILHA)
async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "<p style='text-align:center; color:#888;'>Sincronizando acervo...</p>";

    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = ""; 

        if (dados.length === 0) {
            galeria.innerHTML = "<p style='text-align:center; color:#888;'>Nenhuma mídia encontrada ainda.</p>";
            return;
        }

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // Verifica se é vídeo/gif ou imagem
            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${item.url}" controls style="width:100%; border-radius:15px;"></video>`;
            } else {
                div.innerHTML = `<img src="${item.url}" style="width:100%; border-radius:15px;" loading="lazy">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        console.error("Erro ao carregar:", e);
        galeria.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar mídias da planilha.</p>";
    }
}

// 6. PROCESSAR LOGIN E CADASTRO
function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;
    const nome = (acao === 'cadastro') ? document.getElementById('nome-c').value : "";

    if (!email || !senha) return alert("Por favor, preencha todos os campos.");

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao: acao, email: email, senha: senha, nome: nome })
    }).then(() => {
        if (acao === 'login') {
            localStorage.setItem('meu_acervo_user', email); // Salva o login
            entrarNoPainel(email);
        } else {
            alert("Cadastro enviado! Agora você já pode fazer login.");
            switchTab('login');
        }
    }).catch(err => alert("Erro na conexão: " + err));
}

// 7. ENVIAR ARQUIVO (UPLOAD PARA O DRIVE)
function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    const emailLogado = localStorage.getItem('meu_acervo_user');

    if (!file) return;

    status.innerText = "🚀 Enviando para o Drive... aguarde.";
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            email: emailLogado,
            nomeArquivo: file.name,
            tipoMime: file.type,
            base64: e.target.result.split(',')[1]
        };

        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => {
            status.innerText = "✅ Salvo com sucesso!";
            setTimeout(() => { 
                status.innerText = ""; 
                carregarGaleria(); // Atualiza as fotos na tela
            }, 2000);
        });
    };
    reader.readAsDataURL(file);
}

// 8. ALTERNAR ABAS (LOGIN/CADASTRO)
function switchTab(tipo) {
    document.getElementById('form-login').style.display = (tipo === 'login') ? 'block' : 'none';
    document.getElementById('form-cad').style.display = (tipo === 'cadastro') ? 'block' : 'none';
    document.getElementById('tab-l').classList.toggle('active', tipo === 'login');
    document.getElementById('tab-c').classList.toggle('active', tipo === 'cadastro');
}