const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";
let usuarioLogado = "";

function switchTab(tipo) {
    document.getElementById('form-login').style.display = (tipo === 'login') ? 'block' : 'none';
    document.getElementById('form-cad').style.display = (tipo === 'cadastro') ? 'block' : 'none';
    document.getElementById('tab-l').classList.toggle('active', tipo === 'login');
    document.getElementById('tab-c').classList.toggle('active', tipo === 'cadastro');
}

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
        alert("Enviado! Verifique sua planilha.");
        if (acao === 'login') {
            usuarioLogado = email;
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-site').style.display = 'block';
        }
    });
}

function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    if (!file) return;

    status.innerText = "Enviando... 🚀";
    const reader = new FileReader();
    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            email: usuarioLogado,
            nomeArquivo: file.name,
            tipoMime: file.type,
            base64: e.target.result.split(',')[1]
        };
        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => status.innerText = "✅ Salvo no Drive!");
    };
    reader.readAsDataURL(file);
}