const URL_PONTE = "SUA_URL_AQUI"; // Coloque o seu link /exec aqui

function showTab(tipo) {
    if(tipo === 'login') {
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-cadastro').style.display = 'none';
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('tab-cadastro').classList.remove('active');
    } else {
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-cadastro').style.display = 'block';
        document.getElementById('tab-cadastro').classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
    }
}

function auth(tipo) {
    let payload = {};
    if(tipo === 'login') {
        payload = {
            acao: 'login',
            email: document.getElementById('email-login').value,
            senha: document.getElementById('pass-login').value
        };
    } else {
        payload = {
            acao: 'cadastro',
            nome: document.getElementById('nome-cad').value,
            email: document.getElementById('email-cad').value,
            senha: document.getElementById('pass-cad').value
        };
    }

    fetch(URL_PONTE, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
    }).then(() => {
        alert(tipo === 'login' ? "Entrando..." : "Cadastro enviado! Tente logar.");
        if(tipo === 'login') {
            document.getElementById('auth-area').style.display = 'none';
            document.getElementById('site-content').style.display = 'block';
        }
    });
}