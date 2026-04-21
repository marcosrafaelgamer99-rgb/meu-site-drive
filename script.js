const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// 1. PERSISTÊNCIA: Verifica se já está logado ao abrir o site
window.onload = () => {
    const userSalvo = localStorage.getItem('meu_acervo_login');
    if (userSalvo) {
        entrarNoPainel();
    }
};

function entrarNoPainel() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    carregarGaleria();
}

function sair() {
    localStorage.removeItem('meu_acervo_login');
    location.reload();
}

// 2. GALERIA: Busca as imagens, gifs e vídeos da planilha
async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "<p style='text-align:center; color:#888;'>Carregando seu acervo...</p>";

    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = ""; 

        if (dados.length === 0) {
            galeria.innerHTML = "<p style='text-align:center; color:#888;'>Nenhuma mídia encontrada. Envie algo!</p>";
            return;
        }

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // Verifica o tipo para renderizar corretamente
            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${item.url}" controls></video>`;
            } else {
                div.innerHTML = `<img src="${item.url}" loading="lazy">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        console.error("Erro ao carregar galeria:", e);
        galeria.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar mídias.</p>";
    }
}

// 3. LOGIN E CADASTRO
function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;
    const nome = (acao === 'cadastro') ? document.getElementById('nome-c').value : "";

    if (!email || !senha) return alert("Preencha os campos!");

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao: acao, email: email, senha: senha, nome: nome })
    }).then(() => {
        if (acao === 'login') {
            localStorage.setItem('meu_acervo_login', email); // Grava o login para sempre
            entrarNoPainel();
        } else {
            alert("Conta criada com sucesso! Agora faça login.");
            location.reload();
        }
    });
}

// 4. UPLOAD DIRETO PARA O DRIVE
function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    if (!file) return;

    status.innerText = "🚀 Enviando arquivo... aguarde.";
    const reader = new FileReader();
    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            email: localStorage.getItem('meu_acervo_login'),
            nomeArquivo: file.name,
            tipoMime: file.type,
            base64: e.target.result.split(',')[1]
        };

        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => {
            status.innerText = "✅ Salvo com sucesso!";
            setTimeout(() => { 
                status.innerText = ""; 
                carregarGaleria(); // Atualiza a galeria na hora
            }, 2000);
        });
    };
    reader.readAsDataURL(file);
}

// Troca de abas (Login/Cadastro)
function switchTab(tipo) {
    document.getElementById('form-login').style.display = (tipo === 'login') ? 'block' : 'none';
    document.getElementById('form-cad').style.display = (tipo === 'cadastro') ? 'block' : 'none';
    document.getElementById('tab-l').classList.toggle('active', tipo === 'login');
    document.getElementById('tab-c').classList.toggle('active', tipo === 'cadastro');
}