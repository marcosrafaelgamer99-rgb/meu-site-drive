const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

function entrar() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    carregarGaleria();
}

async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "Carregando...";
    const res = await fetch(API_URL);
    const dados = await res.json();
    galeria.innerHTML = "";
    dados.forEach(item => {
        const div = document.createElement('div');
        div.className = "card-midia";
        if (item.tipo.includes('video')) {
            div.innerHTML = `<video src="${item.url}" controls></video>`;
        } else {
            div.innerHTML = `<img src="${item.url}">`;
        }
        galeria.appendChild(div);
    });
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
        if(acao === 'login') { entrar(); } else { alert("Cadastrado!"); location.reload(); }
    });
}

function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const reader = new FileReader();
    document.getElementById('status-upload').innerText = "Enviando...";
    reader.onload = function(e) {
        const payload = { acao: 'upload_direto', base64: e.target.result.split(',')[1], tipoMime: file.type, nomeArquivo: file.name, email: "user" };
        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => { alert("Sucesso!"); carregarGaleria(); });
    };
    reader.readAsDataURL(file);
}