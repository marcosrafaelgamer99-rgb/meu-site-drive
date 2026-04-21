const API = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";
let userEmail = "";

function switchTab(t) {
    document.getElementById('form-login').style.display = t=='login'?'block':'none';
    document.getElementById('form-cad').style.display = t=='cadastro'?'block':'none';
    document.getElementById('tab-l').className = t=='login'?'active':'';
    document.getElementById('tab-c').className = t=='cadastro'?'active':'';
}

function processar(tipo) {
    const email = tipo=='login'?document.getElementById('email-l').value:document.getElementById('email-c').value;
    const pass = tipo=='login'?document.getElementById('pass-l').value:document.getElementById('pass-c').value;
    const nome = document.getElementById('nome-c').value;

    const payload = { acao: tipo, email: email, senha: pass, nome: nome };
    
    fetch(API, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
    .then(() => {
        if(tipo == 'login') {
            userEmail = email;
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-site').style.display = 'block';
            document.getElementById('user-display').innerText = "Olá!";
        } else {
            alert("Cadastrado! Agora faça login.");
            switchTab('login');
        }
    });
}

function enviar(acao) {
    const payload = {
        acao: acao,
        email: userEmail,
        conteudo: document.getElementById('nota-txt').value,
        link: document.getElementById('midia-link').value,
        tipo: document.getElementById('midia-tipo').value
    };

    fetch(API, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
    .then(() => alert("Enviado com sucesso!"));
}