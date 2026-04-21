const API_URL = "TEU_LINK_AQUI_FINALIZADO_EM_EXEC";

// Verifica se já está logado ao abrir
window.onload = () => {
    const user = localStorage.getItem('user_email');
    if (user) {
        mostrarPainel();
    }
};

function switchTab(t) {
    document.getElementById('form-login').style.display = t=='login'?'block':'none';
    document.getElementById('form-cad').style.display = t=='cadastro'?'block':'none';
    document.getElementById('tab-l').className = t=='login'?'active':'';
    document.getElementById('tab-c').className = t=='cadastro'?'active':'';
}

function processar(acao) {
    const email = acao=='login'? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = acao=='login'? document.getElementById('pass-l').value : document.getElementById('pass-c').value;
    
    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({acao: acao, email: email, senha: senha})
    }).then(() => {
        if(acao == 'login') {
            localStorage.setItem('user_email', email); // LEMBRA A CONTA
            mostrarPainel();
        } else {
            alert("Conta criada!");
            switchTab('login');
        }
    });
}

function mostrarPainel() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    carregarGaleria();
}

function sair() {
    localStorage.removeItem('user_email');
    location.reload();
}

async function carregarGaleria() {
    const res = await fetch(API_URL);
    const dados = await res.json();
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "";

    dados.forEach(item => {
        const div = document.createElement('div');
        div.className = "card-midia";
        if(item.tipo.includes('video')) {
            div.innerHTML = `<video src="${item.url}" controls></video>`;
        } else {
            div.innerHTML = `<img src="${item.url}">`;
        }
        galeria.appendChild(div);
    });
}