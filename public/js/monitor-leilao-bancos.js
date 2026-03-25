const STORAGE_KEY = 'auction-monitor-config-v1';
const RECIPIENTS_KEY = 'auction-monitor-recipients-v1';

const BANKS = ['Caixa Econômica Federal', 'Banco do Brasil', 'Sicoob', 'Sicredi', 'Itaú', 'Santander', 'Bradesco'];

const MOCK_AUCTIONS = [
  {
    bank: 'Caixa Econômica Federal',
    city: 'São Paulo',
    state: 'SP',
    type: 'Apartamento',
    minBid: 265000,
    date: '2026-03-30',
  },
  {
    bank: 'Banco do Brasil',
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'Casa',
    minBid: 350000,
    date: '2026-04-01',
  },
  {
    bank: 'Santander',
    city: 'Curitiba',
    state: 'PR',
    type: 'Terreno',
    minBid: 145000,
    date: '2026-03-29',
  },
  {
    bank: 'Itaú',
    city: 'Belo Horizonte',
    state: 'MG',
    type: 'Apartamento',
    minBid: 220000,
    date: '2026-04-04',
  },
  {
    bank: 'Sicredi',
    city: 'Porto Alegre',
    state: 'RS',
    type: 'Casa',
    minBid: 410000,
    date: '2026-04-07',
  },
  {
    bank: 'Sicoob',
    city: 'Goiânia',
    state: 'GO',
    type: 'Apartamento',
    minBid: 180000,
    date: '2026-04-10',
  },
];

const senderEmailInput = document.getElementById('senderEmail');
const scheduleTimeInput = document.getElementById('scheduleTime');
const webhookUrlInput = document.getElementById('webhookUrl');
const banksListElement = document.getElementById('banksList');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const runNowBtn = document.getElementById('runNowBtn');
const schedulerStatus = document.getElementById('schedulerStatus');

const recipientNameInput = document.getElementById('recipientName');
const recipientEmailInput = document.getElementById('recipientEmail');
const citySearchInput = document.getElementById('citySearch');
const citiesListElement = document.getElementById('citiesList');
const addRecipientBtn = document.getElementById('addRecipientBtn');
const selectedCitiesPreview = document.getElementById('selectedCitiesPreview');
const recipientsContainer = document.getElementById('recipientsContainer');
const executionLog = document.getElementById('executionLog');

let allCities = [];
let selectedCities = new Set();
let lastExecutionDate = null;

const readConfig = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      senderEmail: '',
      scheduleTime: '08:00',
      webhookUrl: '',
      banks: [...BANKS],
    };
  }
  return JSON.parse(raw);
};

const saveConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

const readRecipients = () => {
  const raw = localStorage.getItem(RECIPIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveRecipients = (recipients) => {
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
};

const currency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const renderBanks = () => {
  const config = readConfig();
  banksListElement.innerHTML = BANKS.map(
    (bank) =>
      `<label><input type="checkbox" class="bank-check" value="${bank}" ${
        config.banks.includes(bank) ? 'checked' : ''
      } /> ${bank}</label>`,
  ).join('');
};

const getSelectedBanks = () =>
  [...document.querySelectorAll('.bank-check:checked')].map((input) => input.value).filter(Boolean);

const renderCities = (filter = '') => {
  const normalized = filter.trim().toLowerCase();
  const visibleCities = allCities
    .filter((city) => !normalized || city.toLowerCase().includes(normalized))
    .slice(0, 400);

  citiesListElement.innerHTML = visibleCities
    .map(
      (city) =>
        `<label><input type="checkbox" value="${city}" class="city-check" ${
          selectedCities.has(city) ? 'checked' : ''
        } /> ${city}</label>`,
    )
    .join('');
};

const renderSelectedCitiesPreview = () => {
  const preview = [...selectedCities]
    .slice(0, 8)
    .map((city) => `<span class="chip">${city}</span>`)
    .join('');

  const total = selectedCities.size;
  selectedCitiesPreview.innerHTML = total
    ? `${preview}${
        total > 8 ? `<span class="chip">+${total - 8} cidades</span>` : ''
      }`
    : '<span class="status">Nenhuma cidade selecionada.</span>';
};

const renderRecipients = () => {
  const recipients = readRecipients();

  if (!recipients.length) {
    recipientsContainer.innerHTML = '<p class="subtitle">Nenhum destinatário cadastrado.</p>';
    return;
  }

  recipientsContainer.innerHTML = recipients
    .map(
      (recipient) => `
      <div class="recipient-item">
        <h4>${recipient.name}</h4>
        <div class="recipient-meta">
          ${recipient.email} • ${recipient.active ? 'Ativo' : 'Inativo'} • ${recipient.cities.length} cidade(s)
        </div>
        <div class="actions">
          <button class="ghost" data-action="toggle" data-id="${recipient.id}">${
            recipient.active ? 'Desativar' : 'Ativar'
          }</button>
          <button class="ghost" data-action="remove" data-id="${recipient.id}">Remover</button>
        </div>
      </div>
    `,
    )
    .join('');
};

const formatAuctionLine = (auction) => {
  const date = new Date(`${auction.date}T00:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  return `• ${auction.bank} | ${auction.type} | ${auction.city}/${auction.state} | Lance mínimo ${currency(
    auction.minBid,
  )} | Data ${date}`;
};

const generateRecipientReport = (recipient, config) => {
  const byBank = MOCK_AUCTIONS.filter((auction) => config.banks.includes(auction.bank));
  const byCity = byBank.filter((auction) => recipient.cities.includes(auction.city));

  const title = `Relatório de leilões bancários - ${new Date().toLocaleString('pt-BR')}`;

  if (!byCity.length) {
    return `${title}\nDestinatário: ${recipient.name} <${recipient.email}>\nNenhum imóvel encontrado para as cidades selecionadas.`;
  }

  return `${title}\nDestinatário: ${recipient.name} <${recipient.email}>\n\n${byCity.map(formatAuctionLine).join('\n')}`;
};

const logExecution = (text) => {
  executionLog.textContent = `${new Date().toLocaleString('pt-BR')}\n${text}`;
};

const dispatchReport = async (recipient, report, config) => {
  if (!config.webhookUrl) {
    return `Simulação: relatório preparado para ${recipient.email} (sem webhook configurado).`;
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.senderEmail,
        to: recipient.email,
        subject: 'Relatório diário de leilões bancários',
        body: report,
      }),
    });

    if (!response.ok) {
      return `Erro no envio para ${recipient.email} (HTTP ${response.status}).`;
    }

    return `Envio concluído para ${recipient.email}.`;
  } catch (error) {
    return `Erro de conexão ao enviar para ${recipient.email}: ${error.message}`;
  }
};

const runMonitoring = async () => {
  const config = readConfig();
  const recipients = readRecipients().filter((recipient) => recipient.active);

  if (!config.senderEmail) {
    logExecution('Configure o e-mail remetente antes da execução.');
    return;
  }

  if (!recipients.length) {
    logExecution('Nenhum destinatário ativo para receber relatórios.');
    return;
  }

  const lines = [`Execução iniciada. Destinatários ativos: ${recipients.length}.`];

  for (const recipient of recipients) {
    const report = generateRecipientReport(recipient, config);
    const result = await dispatchReport(recipient, report, config);
    lines.push(result);
  }

  lines.push('Execução finalizada.');
  logExecution(lines.join('\n'));
};

const checkSchedule = async () => {
  const config = readConfig();
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  const date = now.toISOString().slice(0, 10);

  schedulerStatus.textContent = `Próxima execução diária às ${config.scheduleTime}. Última execução: ${
    lastExecutionDate || 'ainda não executado'
  }.`;

  if (time === config.scheduleTime && lastExecutionDate !== date) {
    lastExecutionDate = date;
    await runMonitoring();
  }
};

const initConfigForm = () => {
  const config = readConfig();
  senderEmailInput.value = config.senderEmail;
  scheduleTimeInput.value = config.scheduleTime;
  webhookUrlInput.value = config.webhookUrl;

  renderBanks();
};

const loadCitiesFromIBGE = async () => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
    const data = await response.json();
    allCities = data
      .map((item) => `${item.nome}`)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    renderCities();
  } catch (error) {
    citiesListElement.innerHTML = '<p>Não foi possível carregar as cidades da API do IBGE.</p>';
  }
};

saveConfigBtn.addEventListener('click', () => {
  const config = {
    senderEmail: senderEmailInput.value.trim(),
    scheduleTime: scheduleTimeInput.value || '08:00',
    webhookUrl: webhookUrlInput.value.trim(),
    banks: getSelectedBanks(),
  };

  saveConfig(config);
  schedulerStatus.textContent = `Configuração salva. Execução diária às ${config.scheduleTime}.`;
});

runNowBtn.addEventListener('click', async () => {
  await runMonitoring();
});

citiesListElement.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
    return;
  }

  if (target.checked) {
    selectedCities.add(target.value);
  } else {
    selectedCities.delete(target.value);
  }

  renderSelectedCitiesPreview();
});

citySearchInput.addEventListener('input', () => {
  renderCities(citySearchInput.value);
});

addRecipientBtn.addEventListener('click', () => {
  const name = recipientNameInput.value.trim();
  const email = recipientEmailInput.value.trim();
  const cities = [...selectedCities];

  if (!name || !email || !cities.length) {
    alert('Informe nome, e-mail e selecione pelo menos uma cidade.');
    return;
  }

  const recipients = readRecipients();
  recipients.push({
    id: crypto.randomUUID(),
    name,
    email,
    active: true,
    cities,
  });

  saveRecipients(recipients);
  recipientNameInput.value = '';
  recipientEmailInput.value = '';
  selectedCities = new Set();
  renderCities(citySearchInput.value);
  renderSelectedCitiesPreview();
  renderRecipients();
});

recipientsContainer.addEventListener('click', (event) => {
  const button = event.target;
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action || !id) {
    return;
  }

  const recipients = readRecipients();
  const index = recipients.findIndex((recipient) => recipient.id === id);
  if (index === -1) {
    return;
  }

  if (action === 'toggle') {
    recipients[index].active = !recipients[index].active;
  }

  if (action === 'remove') {
    recipients.splice(index, 1);
  }

  saveRecipients(recipients);
  renderRecipients();
});

const bootstrap = async () => {
  initConfigForm();
  renderRecipients();
  renderSelectedCitiesPreview();
  await loadCitiesFromIBGE();
  await checkSchedule();
  setInterval(checkSchedule, 60_000);
};

bootstrap();
