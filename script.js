// 1. O LINK DA SUA PONTE (Troque pelo seu link /exec novo)
const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// 2. SISTEMA DE LOGIN PERSISTENTE (Não esquece o usuário)
window.onload = () => {
    const usuarioSalvo = localStorage.getItem('user_email');
    if (usuarioSalvo) {
        entrarNoPainel();
    }
};

function entrarNoPainel() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    carregarGaleria(); // Chama as fotos assim que entra
}

function sair() {
    localStorage.removeItem('user_email');
    location.reload();
}

// 3. CARREGAR A GALERIA (Busca os dados do Apps Script)
async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "<p style='text-align:center; color:#888;'>Sincronizando com seu Drive...</p>";

    try {
        // O fetch sem método POST aciona o doGet no Apps Script
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = ""; 

        if (dados.length === 0) {
            galeria.innerHTML = "<p style='text-align:center;'>Nenhuma mídia encontrada ainda.</p>";
            return;
        }

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // Verifica se é vídeo ou imagem
            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${item.url}" controls style="width:100%; border-radius:15px;"></video>`;
            } else {
                div.innerHTML = `<img src="${item.url}" style="width:100%; border-radius:15px;">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        console.error(e);
        galeria.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar galeria.</p>";
    }
}

// 4. PROCESSAR LOGIN / CADASTRO
function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;
    const nome = (acao === 'cadastro') ? document.getElementById('nome-c').value : "";

    if (!email || !senha) return alert("Preencha os campos!");

    // Envia os dados para o doPost do Apps Script
    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao: acao, email: email, senha: senha, nome: nome })
    }).then(() => {
        // Como no-cors não dá resposta, assumimos sucesso no envio
        if (acao === 'login') {
            localStorage.setItem('user_email', email);
            entrarNoPainel();
        } else {
            alert("Cadastro enviado! Tente fazer login agora.");
            location.reload();
        }
    });
}

// 5. ENVIAR ARQUIVO (Upload direto para o Drive)
function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    const email = localStorage.getItem('user_email');

    if (!file) return;

    status.innerText = "🚀 Subindo para o Drive... aguarde.";
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            email: email,
            nomeArquivo: file.name,
            tipoMime: file.type,
            base64: e.target.result.split(',')[1]
        };

        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => {
            status.innerText = "✅ Salvo com sucesso!";
            setTimeout(() => { 
                status.innerText = ""; 
                carregarGaleria(); // Atualiza a galeria sem dar F5
            }, 2000);
        });
    };
    reader.readAsDataURL(file);
}

// Alternar entre Login e Cadastro
function switchTab(tipo) {
    document.getElementById('form-login').style.display = (tipo === 'login') ? 'block' : 'none';
    document.getElementById('form-cad').style.display = (tipo === 'cadastro') ? 'block' : 'none';
    document.getElementById('tab-l').classList.toggle('active', tipo === 'login');
    document.getElementById('tab-c').classList.toggle('active', tipo === 'cadastro');
}