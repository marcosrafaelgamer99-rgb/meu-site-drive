const URL_PONTE = "SUA_URL_DA_PONTE_AQUI";

function entrar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Feedback visual de carregamento
    const btn = document.querySelector('button');
    btn.innerText = "Entrando...";

    fetch(URL_PONTE, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ email: email, senha: senha })
    }).then(() => {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('site-content').style.display = 'block';
        carregarConteudo();
    }).catch(() => alert("Erro ao conectar."));
}

function carregarConteudo() {
    const galeria = document.getElementById('galeria');
    // Exemplo de como o código vai "desenhar" os itens no site
    // Você deve alimentar a sua planilha com os links do Drive
    const itensDeExemplo = [
        {tipo: 'gif', url: 'LINK_DO_SEU_GIF_NO_DRIVE'},
        {tipo: 'video', url: 'LINK_DO_SEU_VIDEO_NO_DRIVE'}
    ];

    itensDeExemplo.forEach(item => {
        let html = `<div class="card-midia">`;
        if(item.tipo === 'video') {
            html += `<video src="${item.url}" controls></video>`;
        } else {
            html += `<img src="${item.url}" loading="lazy">`; // loading lazy deixa o site super leve
        }
        html += `</div>`;
        galeria.innerHTML += html;
    });
}