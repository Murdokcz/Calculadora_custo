let historico = [];
try {
    const savedHistorico = localStorage.getItem('historico');
    if (savedHistorico) {
        historico = JSON.parse(savedHistorico);
    }
} catch (error) {
    console.error('Error loading historico:', error);
    historico = [];
}

function mostrarCalculadora() {
    document.getElementById('calculadora').classList.remove('hidden');
    document.getElementById('historico').classList.add('hidden');
    document.getElementById('custoKM').classList.add('hidden');
    document.getElementById('estimativas').classList.add('hidden');
}

function mostrarHistorico() {
    document.getElementById('calculadora').classList.add('hidden');
    document.getElementById('historico').classList.remove('hidden');
    document.getElementById('custoKM').classList.add('hidden');
    document.getElementById('estimativas').classList.add('hidden');
    atualizarHistorico();
}

function mostrarCustoKM() {
    document.getElementById('calculadora').classList.add('hidden');
    document.getElementById('historico').classList.add('hidden');
    document.getElementById('custoKM').classList.remove('hidden');
    document.getElementById('estimativas').classList.add('hidden');
}

function calcularCustoKM() {
    const aluguelCarro = parseFloat(document.getElementById('aluguelCarroCusto').value) || 0;
    const prestacaoCarro = parseFloat(document.getElementById('prestacaoCarro').value) || 0;
    const despesasMedia = parseFloat(document.getElementById('despesasMedia').value) || 0;
    const consumoCarro = parseFloat(document.getElementById('consumoCarroCusto').value);
    const valorCombustivel = parseFloat(document.getElementById('valorCombustivelCusto').value);
    const despesasDiarias = parseFloat(document.getElementById('despesasDiarias').value) || 0;
    const kmRodado = parseFloat(document.getElementById('kmRodadoCusto').value);

    const litrosGastos = kmRodado / consumoCarro;
    const custoCombustivel = litrosGastos * valorCombustivel;
    const custoTotal = aluguelCarro + prestacaoCarro + despesasMedia + custoCombustivel + despesasDiarias;
    const custoPorKM = custoTotal / kmRodado;
    const valorLiquido = (2 * kmRodado) - custoTotal;

    const custoKMTexto = `
        <strong>Custo por KM:</strong> R$ ${custoPorKM.toFixed(2)}
    `;
    const despesasDiariasTexto = `
        <strong>Valor das Despesas Diárias:</strong> R$ ${custoTotal.toFixed(2)}
    `;
    const valorLiquidoTexto = `
        <strong>Valor Líquido Aceitando Corridas a R$ 2,00/KM:</strong> R$ ${valorLiquido.toFixed(2)}
    `;

    document.getElementById('custoKMTexto').innerHTML = custoKMTexto;
    document.getElementById('despesasDiariasTexto').innerHTML = despesasDiariasTexto;
    document.getElementById('valorLiquidoTexto').innerHTML = valorLiquidoTexto;
    document.getElementById('resultadoCustoKM').classList.remove('hidden');
}

function validarEntradas() {
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const valorGanho = document.getElementById('valorGanho').value;

    if (parseFloat(valorGanho) <= 0) {
        alert('O valor ganho deve ser maior que zero.');
        return false;
    }

    const inicio = new Date(`1970-01-01T${horaInicio}`);
    const fim = new Date(`1970-01-01T${horaFim}`);
    if (fim <= inicio) {
        alert('O horário de fim deve ser maior que o horário de início.');
        return false;
    }

    return true;
}

function calcularGanhos() {
    const valorGanho = parseFloat(document.getElementById('valorGanho').value).toFixed(2);
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const kmRodado = parseFloat(document.getElementById('kmRodado').value);
    const consumoCarro = parseFloat(document.getElementById('consumoCarro').value);
    const aluguelCarro = parseFloat(document.getElementById('aluguelCarro').value);
    const valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value);

    // Calcular horas trabalhadas
    const inicio = new Date(`1970-01-01T${horaInicio}`);
    const fim = new Date(`1970-01-01T${horaFim}`);
    const horasTrabalhadas = (fim - inicio) / (1000 * 60 * 60);

    // Calcular valor ganho por hora e por km
    const valorPorHora = valorGanho / horasTrabalhadas;
    const valorPorKm = valorGanho / kmRodado;

    if (!validarPeriodoTrabalho(horaInicio, horaFim)) {
        alert('O período de trabalho não pode exceder 24 horas.');
        return;
    }

    // Calcular custos
    const litrosGastos = kmRodado / consumoCarro;
    const custoCombustivel = litrosGastos * valorCombustivel;
    const custoTotal = parseFloat(custoCombustivel) + parseFloat(aluguelCarro);
    const lucroLiquido = parseFloat(valorGanho) - custoTotal;

    document.getElementById('salvarBtn').disabled = false;

    const resultadoTexto = `
        <strong>Data:</strong> ${document.getElementById('data').value}<br>
        <strong>Valor Ganho:</strong> R$ ${valorGanho}<br>
        <strong>Horário de Início:</strong> ${horaInicio}<br>
        <strong>Horário de Fim:</strong> ${horaFim}<br>
        <strong>KM Rodado:</strong> ${kmRodado.toFixed(1)} km<br>
        <strong>Valor Ganho por Hora:</strong> R$ ${valorPorHora.toFixed(2)}<br>
        <strong>Valor Ganho por KM:</strong> R$ ${valorPorKm.toFixed(2)}<br>
        <strong>Consumo do Carro:</strong> ${consumoCarro.toFixed(1)} km/l<br>
        <strong>Aluguel do Carro:</strong> R$ ${aluguelCarro.toFixed(2)}<br>
        <strong>Valor do Combustível:</strong> R$ ${valorCombustivel.toFixed(2)} por litro<br>
        <strong>Custos do Dia:</strong><br>
        - Combustível: R$ ${custoCombustivel.toFixed(2)}<br>
        - Aluguel: R$ ${aluguelCarro.toFixed(2)}<br>
        <strong>Custo Total:</strong> R$ ${custoTotal.toFixed(2)}<br>
        <strong>Lucro Líquido:</strong> R$ ${lucroLiquido.toFixed(2)}
    `;

    const estimativaSemanal = (lucroLiquido * 6).toFixed(2);
    const estimativaTexto = `
        <strong>Estimativa Semanal (Lucro Líquido):</strong> R$ ${estimativaSemanal} (trabalhando 6 dias por semana)
    `;

    document.getElementById('resultadoTexto').innerHTML = resultadoTexto;
    document.getElementById('estimativaTexto').innerHTML = estimativaTexto;
    document.getElementById('resultadoCalculo').classList.remove('hidden');
}

function validarPeriodoTrabalho(horaInicio, horaFim) {
    const inicio = new Date(`1970-01-01T${horaInicio}:00`);
    const fim = new Date(`1970-01-01T${horaFim}:00`);
    const diff = (fim - inicio) / (1000 * 60 * 60);
    return diff <= 24;
}

function salvarDados() {
    const data = document.getElementById('data').value;
    const valorGanho = parseFloat(document.getElementById('valorGanho').value);
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const kmRodado = parseFloat(document.getElementById('kmRodado').value);
    const consumoCarro = parseFloat(document.getElementById('consumoCarro').value);
    const aluguelCarro = parseFloat(document.getElementById('aluguelCarro').value);
    const valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value);

    const litrosGastos = kmRodado / consumoCarro;
    const custoCombustivel = litrosGastos * valorCombustivel;
    const custoTotal = custoCombustivel + aluguelCarro;
    const lucroLiquido = valorGanho - custoTotal;
    const estimativaSemanal = lucroLiquido * 6;

    const novoRegistro = {
        data,
        valorGanho: valorGanho.toFixed(2),
        horaInicio,
        horaFim,
        kmRodado: kmRodado.toFixed(1),
        consumoCarro: consumoCarro.toFixed(1),
        aluguelCarro: aluguelCarro.toFixed(2),
        valorCombustivel: valorCombustivel.toFixed(2),
        custoCombustivel: custoCombustivel.toFixed(2),
        custoTotal: custoTotal.toFixed(2),
        lucroLiquido: lucroLiquido.toFixed(2),
        estimativaSemanal: estimativaSemanal.toFixed(2),
        timestamp: new Date(data).getTime()
    };

    if (historico.some(registro => registro.timestamp === novoRegistro.timestamp)) {
        alert('Registro para esta data já existe.');
        return;
    }

    historico.push(novoRegistro);
    historico.sort((a, b) => b.timestamp - a.timestamp);

    localStorage.setItem('historico', JSON.stringify(historico));

    // Após salvar os dados, limpar os campos do formulário
    limparFormulario();

    document.getElementById('salvarBtn').disabled = true;
    atualizarHistorico();
}

function limparFormulario() {
    document.getElementById('data').value = '';
    document.getElementById('valorGanho').value = '';
    document.getElementById('horaInicio').value = '';
    document.getElementById('horaFim').value = '';
    document.getElementById('kmRodado').value = '';
    document.getElementById('consumoCarro').value = '';
    document.getElementById('aluguelCarro').value = '';
    document.getElementById('valorCombustivel').value = '';

    // Ocultar o resultado do cálculo
    document.getElementById('resultadoCalculo').classList.add('hidden');
}

function atualizarTabelaHistorico(dados) {
    const historicoCorpo = document.getElementById('historicoCorpo');
    historicoCorpo.innerHTML = '';

    if (!Array.isArray(dados)) {
        console.error('dados is not an array:', dados);
        return;
    }

    dados.forEach((registro, index) => {
        const horasTrabalhadas = calcularHorasTrabalhadas(registro.horaInicio, registro.horaFim);
        const ganhoPorKm = (parseFloat(registro.valorGanho) / parseFloat(registro.kmRodado)).toFixed(2);
        const ganhoPorHora = (parseFloat(registro.valorGanho) / horasTrabalhadas).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${registro.data}</td>
            <td class="py-2 px-4 border-b">${registro.valorGanho}</td>
            <td class="py-2 px-4 border-b">${registro.horaInicio}</td>
            <td class="py-2 px-4 border-b">${registro.horaFim}</td>
            <td class="py-2 px-4 border-b">${registro.kmRodado}</td>
            <td class="py-2 px-4 border-b">R$ ${ganhoPorKm}</td>
            <td class="py-2 px-4 border-b">R$ ${ganhoPorHora}</td>
            <td class="py-2 px-4 border-b">${registro.consumoCarro}</td>
            <td class="py-2 px-4 border-b">${registro.aluguelCarro}</td>
            <td class="py-2 px-4 border-b">${registro.valorCombustivel}</td>
            <td class="py-2 px-4 border-b">
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="apagarRegistro(${index})">Apagar</button>
            </td>
        `;
        historicoCorpo.appendChild(row);
    });
}

function atualizarHistorico(dadosFiltrados = null) {
    const dadosParaExibir = Array.isArray(dadosFiltrados) ? dadosFiltrados : (Array.isArray(historico) ? historico : []);
    atualizarTabelaHistorico(dadosParaExibir);

    // Calcular totalizadores
    if (dadosParaExibir.length === 0) {
        return;
    }

    const totais = dadosParaExibir.reduce((acc, registro) => {
        const horasTrabalhadas = calcularHorasTrabalhadas(registro.horaInicio, registro.horaFim);
        return {
            valorTotal: acc.valorTotal + parseFloat(registro.valorGanho),
            kmTotal: acc.kmTotal + parseFloat(registro.kmRodado),
            lucroTotal: acc.lucroTotal + parseFloat(registro.lucroLiquido),
            aluguelTotal: acc.aluguelTotal + parseFloat(registro.aluguelCarro),
            horasTotal: acc.horasTotal + horasTrabalhadas,
            combustivelGastoReais: acc.combustivelGastoReais + parseFloat(registro.custoCombustivel),
            combustivelGastoLitros: acc.combustivelGastoLitros + (parseFloat(registro.kmRodado) / parseFloat(registro.consumoCarro)),
            dias: acc.dias + 1
        };
    }, { valorTotal: 0, kmTotal: 0, lucroTotal: 0, aluguelTotal: 0, horasTotal: 0, combustivelGastoReais: 0, combustivelGastoLitros: 0, dias: 0 });

    const mediaHTML = `
        <div class="mt-4 p-4 bg-gray-100 rounded">
            <h3 class="font-bold mb-2">Estatísticas ${dadosFiltrados ? 'do Período Filtrado' : 'Gerais'}</h3>
            <p>Total de Dias: ${totais.dias}</p>
            <p>Media Ganho por KM: R$ ${(totais.valorTotal / totais.kmTotal).toFixed(2)}</p>
            <p>Media Ganho por HORA: R$ ${(totais.valorTotal / totais.horasTotal).toFixed(2)}</p>
            <p>Total Aluguel do Carro: R$ ${totais.aluguelTotal.toFixed(2)}</p>
            <p>Total de Horas Trabalhadas: ${totais.horasTotal.toFixed(1)} horas</p>
            <p>Total de KM Rodado: ${totais.kmTotal.toFixed(1)} km</p>
            <p>Total de Combustível gasto: R$ ${totais.combustivelGastoReais.toFixed(2)} (${totais.combustivelGastoLitros.toFixed(1)} litros)</p>
            <p>Lucro: R$ ${totais.lucroTotal.toFixed(2)}</p>
        </div>
    `;

    const estatisticasDiv = document.querySelector('#historico .mt-4');
    if (estatisticasDiv) {
        estatisticasDiv.remove();
    }
    document.querySelector('#historico').insertAdjacentHTML('beforeend', mediaHTML);
}

function calcularHorasTrabalhadas(horaInicio, horaFim) {
    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [fimHoras, fimMinutos] = horaFim.split(':').map(Number);

    let diferencaHoras = fimHoras - inicioHoras;
    let diferencaMinutos = fimMinutos - inicioMinutos;

    if (diferencaMinutos < 0) {
        diferencaHoras--;
        diferencaMinutos += 60;
    }

    if (diferencaHoras < 0) {
        diferencaHoras += 24;
    }

    const totalHoras = diferencaHoras + diferencaMinutos / 60;
    return totalHoras;
}

function filtrarHistorico() {
    const inicio = new Date(document.getElementById('filtroInicio').value);
    const fim = new Date(document.getElementById('filtroFim').value);

    const historicoFiltrado = historico.filter(registro => {
        const data = new Date(registro.data);
        return data >= inicio && data <= fim;
    });

    atualizarHistorico(historicoFiltrado);
}

function limparFiltro() {
    document.getElementById('filtroInicio').value = '';
    document.getElementById('filtroFim').value = '';
    atualizarHistorico();
}

function apagarRegistro(index) {
    if (confirm('Tem certeza que deseja apagar este registro?')) {
        historico.splice(index, 1);
        localStorage.setItem('historico', JSON.stringify(historico));
        atualizarHistorico();
    }
}

// Atualiza o histórico ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarHistorico);

function mostrarEstimativas() {
    document.getElementById('calculadora').classList.add('hidden');
    document.getElementById('historico').classList.add('hidden');
    document.getElementById('custoKM').classList.add('hidden');
    document.getElementById('estimativas').classList.remove('hidden');
}

function calcularEstimativas() {
    const lucroDesejado = parseFloat(document.getElementById('lucroDesejado').value);
    const aluguel = parseFloat(document.getElementById('aluguelDiario').value) || 0;
    const prestacao = parseFloat(document.getElementById('prestacaoDiaria').value) || 0;
    const despesasMedias = parseFloat(document.getElementById('despesasMedias').value) || 0;
    const despesasDiarias = parseFloat(document.getElementById('despesasDiariasEstimativas').value) || 0;
    const consumo = parseFloat(document.getElementById('consumoCarroEstimativas').value);
    const combustivel = parseFloat(document.getElementById('valorCombustivelEstimativas').value);
    const horas = parseFloat(document.getElementById('horasTrabalho').value);
    const km = parseFloat(document.getElementById('kmDia').value);
    const diasSemana = parseInt(document.getElementById('diasSemana').value);

    const litrosNecessarios = km / consumo;
    const custoCombustivel = litrosNecessarios * combustivel;
    const totalDespesas = aluguel + prestacao + despesasMedias + despesasDiarias + custoCombustivel;
    const valorBruto = lucroDesejado + totalDespesas;
    const valorPorKm = valorBruto / km;
    const valorPorHora = valorBruto / horas;
    const lucroSemanal = lucroDesejado * diasSemana;

    document.getElementById('valorKm').textContent = `R$ ${valorPorKm.toFixed(2)}`;
    document.getElementById('valorHora').textContent = `R$ ${valorPorHora.toFixed(2)}`;
    document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.getElementById('valorBruto').textContent = `R$ ${valorBruto.toFixed(2)}`;
    document.getElementById('lucroLiquido').textContent = `R$ ${lucroDesejado.toFixed(2)}`;
    document.getElementById('lucroSemanal').textContent = `R$ ${lucroSemanal.toFixed(2)} (${diasSemana} dias)`;
    
    document.getElementById('resultadoEstimativas').classList.remove('hidden');
}

// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    htmlElement.classList.add('dark');
    updateDarkModeIcon(true);
}

darkModeToggle.addEventListener('click', () => {
    const isDarkMode = htmlElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon(isDarkMode);
});

function updateDarkModeIcon(isDarkMode) {
    const icon = darkModeToggle.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toast notification functionality
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    // Update toast style based on type
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    // Update icon based on type
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`;
    
    // Show toast
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(100%)';
        toast.style.opacity = '0';
    }, 3000);
}

// Add toast notifications to key actions
const originalSalvarDados = salvarDados;
salvarDados = function() {
    try {
        originalSalvarDados();
        showToast('Dados salvos com sucesso!');
    } catch (error) {
        showToast('Erro ao salvar dados.', 'error');
    }
};

const originalApagarRegistro = apagarRegistro;
apagarRegistro = function(index) {
    if (confirm('Tem certeza que deseja apagar este registro?')) {
        try {
            originalApagarRegistro(index);
            showToast('Registro apagado com sucesso!');
        } catch (error) {
            showToast('Erro ao apagar registro.', 'error');
        }
    }
};
