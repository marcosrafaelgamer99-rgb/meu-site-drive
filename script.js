const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// VERIFICA LOGIN AO ABRIR O SITE
window.onload = () => {
    const usuarioLogado = localStorage.getItem('logado_acervo');
    if (usuarioLogado === 'sim') {
        entrarNoPainel();
    }
};

function entrarNoPainel() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    carregarGaleria();
}

function sair() {
    localStorage.removeItem('logado_acervo'); // Limpa a memória para sair
    location.reload();
}

async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "<p>Buscando suas mídias...</p>";
    
    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = "";

        if (dados.length === 0) {
            galeria.innerHTML = "<p>Sua nuvem está vazia.</p>";
            return;
        }

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // LINK DE VISUALIZAÇÃO DIRETA (UC?ID=...)
            const linkVisualizacao = item.url.replace("view?usp=sharing", "view");

            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${linkVisualizacao}" controls></video>`;
            } else {
                // TAG DE IMAGEM COM LOADING LAZY PARA NÃO BUGAR
                div.innerHTML = `<img src="${linkVisualizacao}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Erro+no+Link+do+Drive'">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        galeria.innerHTML = "<p>Erro ao carregar galeria.</p>";
    }
}

function processar(acao) {
    const email = (acao === 'login') ? document.getElementById('email-l').value : document.getElementById('email-c').value;
    const senha = (acao === 'login') ? document.getElementById('pass-l').value : document.getElementById('pass-c').value;

    fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ acao, email, senha })
    }).then(() => {
        if(acao === 'login') {
            localStorage.setItem('logado_acervo', 'sim'); // SALVA QUE VOCÊ ESTÁ LOGADO
            entrarNoPainel();
        } else {
            alert("Cadastro realizado!");
            location.reload();
        }
    });
}

function enviarArquivo() {
    const file = document.getElementById('input-arquivo').files[0];
    const status = document.getElementById('status-upload');
    const reader = new FileReader();
    status.innerText = "🚀 Enviando...";

    reader.onload = function(e) {
        const payload = {
            acao: 'upload_direto',
            base64: e.target.result.split(',')[1],
            tipoMime: file.type,
            nomeArquivo: file.name,
            email: "user"
        };
        fetch(API_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
        .then(() => {
            status.innerText = "✅ Sucesso!";
            setTimeout(() => { status.innerText = ""; carregarGaleria(); }, 2000);
        });
    };
    reader.readAsDataURL(file);
}