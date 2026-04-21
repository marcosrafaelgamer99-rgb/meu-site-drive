const API = "SUA_URL_AQUI"; // COLOQUE SUA URL /exec
let userEmail = "";

// ... (Mantenha as funções switchTab e processar de login anteriores) ...

function enviarArquivo() {
    const fileInput = document.getElementById('input-arquivo');
    const status = document.getElementById('status-upload');
    const file = fileInput.files[0];

    if (!file) return;

    status.innerText = "Processando arquivo... aguarde.";
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        const payload = {
            acao: 'upload_direto',
            email: userEmail,
            nomeArquivo: file.name,
            tipoMime: file.type,
            base64: base64Data
        };

        fetch(API, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(payload) 
        }).then(() => {
            status.innerText = "Enviado com sucesso para o Drive!";
            setTimeout(() => { status.innerText = ""; }, 3000);
        }).catch(() => status.innerText = "Erro ao enviar.");
    };
    reader.readAsDataURL(file);
}