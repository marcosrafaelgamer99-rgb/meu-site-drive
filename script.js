const API_URL = "https://script.google.com/macros/s/AKfycbyvZ90Wg_7uvCWmyCCCtJgRmzWYM12JHZ0Hbypx6NGDJntIoFowYXLpT_kFLpDeypuN/exec";

// 1. ISSO AQUI FAZ VOCÊ VOLTAR PARA A CONTA AUTOMATICAMENTE
window.onload = () => {
    const logado = localStorage.getItem('sessao_ativa');
    if (logado === 'sim') {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-site').style.display = 'block';
        carregarGaleria();
    }
};

function sair() {
    localStorage.removeItem('sessao_ativa');
    location.reload();
}

async function carregarGaleria() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = "Carregando acervo...";
    
    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        galeria.innerHTML = "";

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = "card-midia";
            
            // TRANSFORMA O LINK DO DRIVE EM LINK DIRETO PARA NÃO PISCAR
            let linkDireto = item.url.replace("file/d/", "uc?export=view&id=").replace("/view?usp=sharing", "").replace("/view", "");

            if (item.tipo.includes('video')) {
                div.innerHTML = `<video src="${linkDireto}" controls></video>`;
            } else {
                div.innerHTML = `<img src="${linkDireto}" onerror="this.src='https://via.placeholder.com/300?text=Erro+no+Google+Drive'">`;
            }
            galeria.appendChild(div);
        });
    } catch (e) {
        galeria.innerHTML = "Erro ao conectar com a nuvem.";
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
            localStorage.setItem('sessao_ativa', 'sim'); // SALVA O LOGIN NO CELULAR
            location.reload(); // Recarrega para entrar direto
        } else {
            alert("Cadastro feito!");
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
            status.innerText = "✅ Salvo!";
            setTimeout(() => { status.innerText = ""; carregarGaleria(); }, 2000);
        });
    };
    reader.readAsDataURL(file);
}