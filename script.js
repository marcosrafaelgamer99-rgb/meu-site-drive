const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// 1. NUNCA ESQUECER: Verifica login ao abrir
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

// 2. CARREGAR IMAGENS E VÍDEOS
async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "<p style='text-align:center'>A carregar os teus 2TB...</p>";

    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = ""; 

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // Verifica se é vídeo ou imagem/gif
            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${item.url}" controls style="width:100%; border-radius:15px; margin-bottom:10px;"></video>`;
            } else {
                div.innerHTML = `<img src="${item.url}" style="width:100%; border-radius:15px; display:block; margin-bottom:10px;">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        galeria.innerHTML = "<p>Nenhuma mídia encontrada ainda.</p>";
    }
}

// 3. PROCESSAR LOGIN
function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao: acao, email: email, senha: senha })
    }).then(() => {
        if (acao === 'login') {
            localStorage.setItem('meu_acervo_login', email); // SALVA PARA SEMPRE
            entrarNoPainel();
        } else {
            alert("Conta Criada!");
            location.reload();
        }
    });
}

// 4. UPLOAD
function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    if (!file) return;

    status.innerText = "🚀 A enviar...";
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
            status.innerText = "✅ Concluído!";
            setTimeout(() => { status.innerText = ""; carregarGaleria(); }, 2000);
        });
    };
    reader.readAsDataURL(file);
}