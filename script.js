const form = document.getElementById('form-agenda');
const lista = document.getElementById('lista-eventos');

function salvarEventos(eventos) {
  localStorage.setItem('agenda', JSON.stringify(eventos));
}

function carregarEventos() {
  return JSON.parse(localStorage.getItem('agenda')) || [];
}

function baixarEventoComoArquivo(evento) {
  const blob = new Blob([JSON.stringify(evento, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `evento_${evento.data}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function removerEvento(index) {
  const eventos = carregarEventos();
  eventos.splice(index, 1);
  salvarEventos(eventos);
  renderizarEventos();
}

function renderizarEventos() {
  const eventos = carregarEventos();
  lista.innerHTML = '';
  eventos.forEach((evento, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>📄 <strong>${evento.data}</strong> - ${evento.descricao}</span>
      <small>${evento.detalhes || ''}</small>
      <div>
        <button onclick='baixarEventoComoArquivo(${JSON.stringify(evento)})'>⬇️ Baixar</button>
        <button onclick="removerEvento(${index})">❌ Remover</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = document.getElementById('data-evento').value;
  const descricao = document.getElementById('descricao-evento').value;
  const detalhes = document.getElementById('detalhes-evento').value;

  const eventos = carregarEventos();
  eventos.push({ data, descricao, detalhes });
  salvarEventos(eventos);
  renderizarEventos();
  form.reset();
});

renderizarEventos();
