const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

function toggleAuth(cad) {
    document.getElementById('login-fields').style.display = cad ? 'none' : 'block';
    document.getElementById('cad-fields').style.display = cad ? 'block' : 'none';
}

function sair() {
    localStorage.removeItem('logado');
    location.reload();
}

async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "Carregando arquivos...";
    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = "";
        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${item.url}" controls></video>`;
            } else {
                div.innerHTML = `<img src="${item.url}" loading="lazy">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) { galeria.innerHTML = "Erro ao carregar galeria."; }
}

function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;
    const nome = document.getElementById('nome-c').value;

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao, email, senha, nome })
    }).then(() => {
        if(acao === 'login') {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-site').style.display = 'block';
            carregarGaleria();
        } else {
            alert("Cadastro realizado! Faça login.");
            location.reload();
        }
    });
}

function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    const reader = new FileReader();
    status.innerText = "Enviando para nuvem...";
    
    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            base64: e.target.result.split(',')[1],
            tipoMime: file.type,
            nomeArquivo: file.name,
            email: "usuario_logado"
        };
        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => {
            status.innerText = "Sucesso!";
            setTimeout(() => { status.innerText = ""; carregarGaleria(); }, 2000);
        });
    };
    reader.readAsDataURL(file);
}