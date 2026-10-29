/* Veeduría SENA · Vibras Positivas HM */
const TZ = 'America/Bogota';
const DENUNCIA = new Date('2026-10-25T12:00:00-05:00');
const SECOP_API = 'https://www.datos.gov.co/resource/jbjy-vk9h.json';
let LANG = (() => { try { return localStorage.getItem('vs-lang') || 'es'; } catch (e) { return 'es'; } })();
let NEWS = [];

const T = {
  es: {
    brandSub:'por Vibras Positivas HM', refresh:'Actualizar',
    heroKicker:'Veeduría ciudadana · Contratos del SENA',
    heroTitle:'La plata del SENA es de los aprendices',
    heroP:'El 25 de octubre de 2026 el Gobierno denunció presuntas irregularidades en contratos del SENA regional Córdoba y anunció revisión en todas las regionales del país. Aquí le hacemos seguimiento, con datos y fuentes.',
    c1:'millones en dos contratos cuestionados (Córdoba)', c2:'millones · contrato de bienestar', c3:'millones · contrato de medicamentos', c4:'días desde la denuncia',
    ctaHoy:'Ver lo de hoy', ctaVeedor:'Hacer veeduría',
    hoyTitle:'Hoy', ojoTitle:'Ojo antes de compartir',
    ojoP1:'Muchas piezas que circulan en redes sobre este caso están marcadas como contenido hecho con IA. En los medios revisados no aparece la frase "todo el que comió de esos contratos va a ir preso". Lo que sí dijo el presidente, según la prensa, es que no habrá intocables y que el informe irá a la Fiscalía.',
    ojoP2:'Una denuncia del Gobierno no es una condena. Hasta que Fiscalía, Procuraduría o Contraloría decidan, se habla de presuntas irregularidades. Un buen veedor verifica antes de señalar.',
    semTitle:'Semáforo del caso', halTitle:'Lo que dice el informe preliminar', tlTitle:'Línea de tiempo',
    newsTitle:'Noticias', searchPh:'Buscar: Córdoba, Sucre, Fiscalía, tu regional...', searchBtn:'Buscar en vivo',
    vTitle:'Haz tu veeduría: contratos reales de tu regional',
    vP:'Consulta en vivo los contratos del SENA publicados en el SECOP II (datos abiertos del Estado). Elige tu departamento y mira quién contrata, por cuánto y para qué.',
    secopPh:'Palabra clave: refrigerios, medicamentos, tiquetes...', secopBtn:'Consultar contratos', secopLink:'Ver la base completa del SECOP II en datos.gov.co',
    alertTitle:'Señales de alerta que puedes revisar tú mismo',
    cartaTitle:'Tu derecho de petición, listo para enviar',
    cartaP:'Cada ciudadano puede pedir información a las entidades y ellas deben responder en 15 días hábiles (10 días si son documentos). Llena tus datos, elige la entidad y copia la carta.',
    fNombre:'Nombre completo', fCedula:'Cédula', fCiudad:'Ciudad o municipio', fCorreo:'Correo para la respuesta',
    copy:'Copiar carta', portal:'Ir al portal de la entidad', share:'Compartir app por WhatsApp',
    crearTitle:'Cómo crear una veeduría ciudadana (Ley 850 de 2003)', fuentesTitle:'Fuentes',
    footP:'App ciudadana independiente. No pertenece al SENA ni al Gobierno. La información es de medios y datos abiertos; verifícala siempre en la fuente.',
    updated:'Actualizado', robot:'Robot de noticias', ago:'hace', min:'min', h:'h', d:'días',
    hoyNone:'Hoy no han salido noticias nuevas del caso. Abajo están las más recientes.',
    hoyN:n=>`${n} noticia${n>1?'s':''} del caso en las últimas 24 horas.`,
    dayN:n=>`Día ${n} del seguimiento.`,
    searching:'Buscando en vivo...', found:n=>`${n} resultados.`, liveFail:'No se pudo buscar en vivo ahora; mostrando lo que trajo el robot.',
    copied:'Carta copiada', allDeps:'Todo el país', choose:'Elige la regional',
    secopLoading:'Consultando el SECOP II...', secopFail:'No se pudo consultar el SECOP II en este momento. Usa el enlace de abajo.',
    secopN:n=>`${n} contratos más recientes encontrados.`, secopCount:'contratos', secopTotal:'valor sumado',
    th:['Firma','Objeto','Contratista','Modalidad','Valor','Ver'], see:'Ver proceso',
    entity:'Entidad'
  },
  en: {
    brandSub:'by Vibras Positivas HM', refresh:'Refresh',
    heroKicker:'Citizen oversight · SENA contracts',
    heroTitle:'SENA money belongs to its students',
    heroP:'On October 25, 2026 the Government reported alleged irregularities in contracts of SENA\'s Córdoba office and announced reviews in every regional office in the country. We track it here, with data and sources.',
    c1:'million pesos in two questioned contracts (Córdoba)', c2:'million · student welfare contract', c3:'million · medicines contract', c4:'days since the report',
    ctaHoy:'See today', ctaVeedor:'Be a watchdog',
    hoyTitle:'Today', ojoTitle:'Check before you share',
    ojoP1:'Many posts circulating about this case are labeled as AI-generated. The phrase "everyone who ate from those contracts will go to jail" does not appear in the outlets we reviewed. According to the press, what the President did say is that no one will be untouchable and that the report will go to the Attorney General\'s Office.',
    ojoP2:'A Government report is not a conviction. Until prosecutors or oversight bodies rule, these are alleged irregularities. A good watchdog verifies before pointing fingers.',
    semTitle:'Case status', halTitle:'What the preliminary report says', tlTitle:'Timeline',
    newsTitle:'News', searchPh:'Search: Córdoba, Sucre, Fiscalía, your region...', searchBtn:'Live search',
    vTitle:'Do your own oversight: real contracts in your region',
    vP:'Query live the SENA contracts published on SECOP II (Colombia\'s open procurement data). Pick your department and see who is hired, for how much and for what.',
    secopPh:'Keyword: refrigerios, medicamentos, tiquetes...', secopBtn:'Search contracts', secopLink:'See the full SECOP II dataset on datos.gov.co',
    alertTitle:'Red flags you can check yourself',
    cartaTitle:'Your right-of-petition letter, ready to send',
    cartaP:'Any citizen can request information and agencies must answer within 15 business days (10 for documents). Fill in your details, pick the agency and copy the letter (it stays in Spanish, as required).',
    fNombre:'Full name', fCedula:'ID number', fCiudad:'City or town', fCorreo:'Email for the reply',
    copy:'Copy letter', portal:'Go to the agency portal', share:'Share app on WhatsApp',
    crearTitle:'How to create a citizen oversight group (Law 850 of 2003)', fuentesTitle:'Sources',
    footP:'Independent citizen app. Not affiliated with SENA or the Government. Information comes from media and open data; always verify at the source.',
    updated:'Updated', robot:'News robot', ago:'', min:'min ago', h:'h ago', d:'days ago',
    hoyNone:'No new stories on the case today. The latest ones are below.',
    hoyN:n=>`${n} stor${n>1?'ies':'y'} on the case in the last 24 hours.`,
    dayN:n=>`Day ${n} of tracking.`,
    searching:'Searching live...', found:n=>`${n} results.`, liveFail:'Live search is unavailable right now; showing what the robot brought.',
    copied:'Letter copied', allDeps:'Whole country', choose:'Pick the regional office',
    secopLoading:'Querying SECOP II...', secopFail:'SECOP II could not be reached right now. Use the link below.',
    secopN:n=>`${n} most recent contracts found.`, secopCount:'contracts', secopTotal:'total value',
    th:['Signed','Purpose','Contractor','Method','Value','Open'], see:'Open process',
    entity:'Agency'
  }
};
const t = k => (T[LANG][k] ?? T.es[k]);
const L = o => (typeof o === 'object' && o ? (o[LANG] || o.es) : o);

/* ---------- Contenido verificado ---------- */
const STEPS = [
  {s:'ok', es:['Denuncia pública','El presidente publicó los hallazgos preliminares en X el 25 de octubre de 2026.'], en:['Public report','The President posted the preliminary findings on X on October 25, 2026.']},
  {s:'ok', es:['Visitas de verificación','El director general del SENA, Fray Ricardo Torres Castro, lideró las visitas a las regionales Córdoba y Sucre.'], en:['Verification visits','SENA director general Fray Ricardo Torres Castro led visits to the Córdoba and Sucre offices.']},
  {s:'wait', es:['Informe definitivo','Anunciado para la semana del 26 de octubre; incluirá infraestructura, instructores, formación y finanzas.'], en:['Final report','Announced for the week of October 26; it will cover infrastructure, instructors, training and finances.']},
  {s:'wait', es:['Traslado a Fiscalía, Procuraduría y Contraloría','Anunciado por el Gobierno. Falta confirmar la radicación y el número de radicado.'], en:['Referral to prosecutors and oversight bodies','Announced by the Government. Filing still to be confirmed.']},
  {s:'wait', es:['Revisión en todas las regionales','Anunciada para todo el país: contratos, pagos, infraestructura, programas y recursos.'], en:['Nationwide review','Announced for every regional office: contracts, payments, infrastructure, programs and funds.']},
  {s:'no', es:['Decisiones de los entes de control','Aún no hay imputaciones, pliegos de cargos ni hallazgos fiscales públicos sobre estos contratos.'], en:['Oversight decisions','No charges or formal findings on these contracts have been made public yet.']}
];
const HALLAZGOS = [
  {es:['Contrato de bienestar por $933 millones','Según el informe preliminar, refrigerios en mal estado y pago del 100 % de eventos a pesar de la inasistencia de decenas de participantes.'], en:['$933M student welfare contract','Per the preliminary report: spoiled snacks and 100% payment for events despite dozens of absentees.']},
  {es:['Contrato de medicamentos por $765 millones','Se reportaron medicamentos próximos a vencer.'], en:['$765M medicines contract','Medicines close to expiry were reported.']},
  {es:['Pliegos direccionados','Requisitos que habrían favorecido a los mismos contratistas durante años.'], en:['Tailored bidding terms','Requirements that allegedly favored the same contractors for years.']},
  {es:['Sin estudios de mercado','Valores de contratos sin sustento técnico.'], en:['No market studies','Contract values without technical support.']},
  {es:['Fraccionamiento de contratos','Dividir un contrato grande en varios pequeños para evitar la licitación.'], en:['Contract splitting','Breaking a large contract into smaller ones to avoid open bidding.']},
  {es:['Supervisión que no supervisó','Desembolsos autorizados sin verificar que se cumpliera.'], en:['Oversight that did not oversee','Payments approved without verifying delivery.']},
  {es:['Otros rubros en revisión','Tiquetes aéreos, alimentación, servicios médicos y actividades para aprendices.'], en:['Other items under review','Airfare, food, medical services and student activities.']},
  {es:['Vínculos políticos','El Gobierno dijo que buscará esclarecer presuntos vínculos de políticos de Córdoba y funcionarios.'], en:['Political ties','The Government said it will look into alleged ties of Córdoba politicians and officials.']}
];
const TIMELINE = [
  {w:{es:'25 oct 2026',en:'Oct 25, 2026'}, es:'El presidente Abelardo de la Espriella denuncia en X presuntas irregularidades en el SENA Córdoba por $1.698 millones.', en:'President Abelardo de la Espriella reports on X alleged irregularities at SENA Córdoba worth COP 1,698 million.'},
  {w:{es:'25 oct 2026',en:'Oct 25, 2026'}, es:'El Gobierno anuncia que el expediente irá a Fiscalía, Contraloría y Procuraduría, y que revisará todas las regionales.', en:'The Government says the file will go to prosecutors and oversight bodies, and that all regional offices will be reviewed.'},
  {w:{es:'25 oct 2026',en:'Oct 25, 2026'}, es:'Desde Sucre, el director del SENA dice que también hay hallazgos que se enviarán a los entes de control.', en:'From Sucre, SENA\'s director says there are findings there too that will go to oversight bodies.'},
  {w:{es:'27 oct 2026',en:'Oct 27, 2026'}, es:'Se reitera que la inspección abarcará todas las regionales y centros del SENA.', en:'It is reiterated that the inspection will cover all SENA regional offices and centers.'},
  {w:{es:'Pendiente',en:'Pending'}, es:'Publicación del informe definitivo y confirmación de las denuncias radicadas.', en:'Release of the final report and confirmation of filed complaints.'}
];
const ALERTAS = [
  {es:['El mismo contratista año tras año','Busca el nombre del contratista: si gana siempre, pregunta por qué.'], en:['Same contractor every year','Search the contractor name: if it always wins, ask why.']},
  {es:['Contratación directa en exceso','Mira la modalidad. La contratación directa debe ser la excepción.'], en:['Too much direct hiring','Check the method. Direct award should be the exception.']},
  {es:['Contratos casi iguales, el mismo mes','Varios contratos pequeños del mismo objeto pueden ser fraccionamiento.'], en:['Near-identical contracts, same month','Several small contracts for the same purpose may be splitting.']},
  {es:['Valores redondos o inflados','Compara con precios del mercado de tu pueblo.'], en:['Round or inflated values','Compare with local market prices.']},
  {es:['Lo que se pagó no llegó','Pregunta a aprendices e instructores si recibieron lo contratado.'], en:['Paid for but never delivered','Ask students and instructors if they got what was contracted.']},
  {es:['Sin informes de supervisión','Pide por petición los informes del supervisor y las actas de recibo.'], en:['No supervision reports','Request the supervisor reports and delivery records by petition.']}
];
const HOWTO = {
  es:['Reúnanse ciudadanos u organizaciones interesados en vigilar el SENA de su regional.','Elaboren un acta de constitución: nombres, documentos, objeto de la vigilancia, territorio y duración.','Inscriban la veeduría ante la Personería municipal o la Cámara de Comercio.','Pidan información con derechos de petición y revisen el SECOP II.','Hagan visitas, recojan pruebas y escriban un informe con lo encontrado.','Lleven el informe a la Procuraduría, Contraloría o Fiscalía, y compártanlo con la comunidad.'],
  en:['Gather citizens or organizations interested in watching their SENA regional office.','Draft a founding record: names, IDs, purpose, territory and duration.','Register the group with the municipal Personería or the Chamber of Commerce.','Request information by petition and review SECOP II.','Visit, collect evidence and write a findings report.','Take the report to the oversight bodies and share it with the community.']
};
const ENTIDADES = [
  {id:'sena', n:'SENA - Dirección General', url:'https://www.sena.edu.co', pide:'copia de los contratos, estudios previos, estudios de mercado, informes de supervisión, actas de recibo y comprobantes de pago de la regional {R} correspondientes a 2024, 2025 y 2026, en especial los de bienestar de aprendices, alimentación, medicamentos y tiquetes aéreos'},
  {id:'proc', n:'Procuraduría General de la Nación', url:'https://www.procuraduria.gov.co', pide:'información sobre si existe indagación o investigación disciplinaria abierta por los contratos del SENA regional {R} denunciados públicamente el 25 de octubre de 2026, su número de radicado y su estado'},
  {id:'contra', n:'Contraloría General de la República', url:'https://www.contraloria.gov.co', pide:'información sobre si existe actuación o auditoría fiscal sobre los contratos del SENA regional {R} denunciados públicamente el 25 de octubre de 2026, su número y su estado'},
  {id:'fisc', n:'Fiscalía General de la Nación', url:'https://www.fiscalia.gov.co', pide:'información sobre si ya se recibió la denuncia anunciada por el Gobierno Nacional sobre contratos del SENA regional {R}, el número de noticia criminal asignado y el estado general del trámite, en lo que no esté sujeto a reserva'}
];
const DEPS = ['Antioquia','Atlántico','Bogotá','Bolívar','Boyacá','Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada','Amazonas','Arauca'];
const FUENTES = [
  ['El Tiempo','https://www.eltiempo.com/politica/abelardo-de-la-espriella/presidente-abelardo-de-la-espriella-denuncio-presuntas-irregularidades-en-contratos-del-sena-en-cordoba-y-anuncio-auditorias-en-la-entidad-3596259'],
  ['Semana','https://www.semana.com/nacion/articulo/abelardo-de-la-espriella-anuncio-que-llevara-hallazgos-del-sena-a-la-fiscalia-esto-es-una-verguenza/202621/'],
  ['Infobae','https://www.infobae.com/colombia/2026/10/25/abelardo-de-la-espriella-denuncio-presunta-corrupcion-en-una-de-las-sedes-del-sena-esto-apenas-es-la-punta-del-iceberg/'],
  ['El Heraldo','https://www.elheraldo.co/colombia/2026/10/25/presidente-de-la-espriella-denuncia-irregularidades-en-el-sena-cordoba-no-voy-a-permitir-que-se-sigan-robando-a-la-institucion/'],
  ['Portafolio','https://www.portafolio.co/economia/gobierno/de-la-espriella-denuncia-presuntas-irregularidades-en-contratos-del-sena-en-cordoba-por-1-698-millones-505085'],
  ['Asuntos Legales','https://www.asuntoslegales.com.co/actualidad/gobierno-denuncia-presuntas-irregularidades-en-millonarios-contratos-del-sena-en-cordoba-4510653'],
  ['El Frente','https://elfrente.com.co/se-acabo-la-fiesta-con-la-plata-del-sena-presidente-denuncio-presuntas-irregularidades/'],
  ['SECOP II · datos.gov.co','https://www.datos.gov.co/Gastos-Gubernamentales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h']
];

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate = d => new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-US', {timeZone:TZ, day:'numeric', month:'short', hour:'numeric', minute:'2-digit'}).format(d);
const fmtDay = d => new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-US', {timeZone:TZ, weekday:'long', day:'numeric', month:'long', year:'numeric'}).format(d);
const money = v => new Intl.NumberFormat('es-CO', {style:'currency', currency:'COP', maximumFractionDigits:0}).format(v);
function ago(d){
  const m = Math.max(1, Math.round((Date.now() - d) / 60000));
  if (m < 60) return LANG === 'es' ? `hace ${m} min` : `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return LANG === 'es' ? `hace ${h} h` : `${h} h ago`;
  const dd = Math.round(h / 24);
  return LANG === 'es' ? `hace ${dd} días` : `${dd} days ago`;
}
function toast(msg){ const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }
const daysSince = () => Math.max(1, Math.floor((Date.now() - DENUNCIA) / 86400000) + 1);

/* ---------- Render estático ---------- */
function applyI18n(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('#btnLang').textContent = LANG === 'es' ? 'EN' : 'ES';
  $('#steps').innerHTML = STEPS.map(s => `<div class="step"><span class="dot ${s.s}"></span><div><b>${esc(s[LANG][0])}</b><span class="muted">${esc(s[LANG][1])}</span></div></div>`).join('');
  $('#hallazgos').innerHTML = HALLAZGOS.map(h => `<div class="item"><b>${esc(h[LANG][0])}</b><span class="muted">${esc(h[LANG][1])}</span></div>`).join('');
  $('#timeline').innerHTML = TIMELINE.map(x => `<li><div class="when">${esc(L(x.w))}</div>${esc(x[LANG])}</li>`).join('');
  $('#alertas').innerHTML = ALERTAS.map(h => `<div class="item"><b>${esc(h[LANG][0])}</b><span class="muted">${esc(h[LANG][1])}</span></div>`).join('');
  $('#howto').innerHTML = HOWTO[LANG].map(x => `<li>${esc(x)}</li>`).join('');
  $('#fuentes').innerHTML = FUENTES.map(([n,u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join('');
  fillSelects();
  renderNews(NEWS);
  renderHoy();
  buildLetter();
}
function fillSelects(){
  const keepDep = $('#dep').value || 'Córdoba', keepReg = $('#fRegional').value || 'Córdoba', keepEnt = $('#fEntidad').value || 'sena';
  $('#dep').innerHTML = `<option value="">${t('allDeps')}</option>` + DEPS.slice().sort().map(d => `<option>${d}</option>`).join('');
  $('#dep').value = keepDep;
  $('#fRegional').innerHTML = DEPS.slice().sort().map(d => `<option>${d}</option>`).join('');
  $('#fRegional').value = keepReg;
  $('#fEntidad').innerHTML = ENTIDADES.map(e => `<option value="${e.id}">${t('entity')}: ${e.n}</option>`).join('');
  $('#fEntidad').value = keepEnt;
}
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('es-CO'); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  $('#dayCount').textContent = daysSince();
}

/* ---------- Noticias ---------- */
function card(n){
  const d = new Date(n.fecha);
  const img = n.imagen ? `<div class="card-img" style="background-image:url('${esc(n.imagen)}')"></div>` : `<div class="card-img noimg">SENA</div>`;
  return `<a class="card" href="${esc(n.url)}" target="_blank" rel="noopener">${img}<div class="card-b"><h4>${esc(n.titulo)}</h4><div class="meta"><span class="tag">${esc(n.fuente || 'Prensa')}</span>${isNaN(d) ? '' : ago(d)}</div></div></a>`;
}
function renderNews(list){
  $('#newsCards').innerHTML = list.slice(0, 30).map(card).join('') || `<p class="muted">${t('liveFail')}</p>`;
  const heads = list.slice(0, 10).map(n => `<span>${esc(n.titulo)}</span>`).join('');
  $('#ticker').innerHTML = heads + heads;
  const withImg = list.find(n => n.imagen);
  if (withImg) $('#heroBg').style.backgroundImage = `linear-gradient(rgba(7,13,31,.2),rgba(7,13,31,.2)),url('${withImg.imagen}')`;
}
function renderHoy(){
  const now = new Date();
  $('#hoyStamp').textContent = `${t('updated')} ${fmtDate(now)}`;
  const recent = NEWS.filter(n => Date.now() - new Date(n.fecha) < 86400000);
  $('#hoyResumen').textContent = `${fmtDay(now)}. ${T[LANG].dayN(daysSince())} ${recent.length ? T[LANG].hoyN(recent.length) : t('hoyNone')}`;
  $('#hoyCards').innerHTML = (recent.length ? recent : NEWS).slice(0, 4).map(card).join('');
}
function merge(a, b){
  const seen = new Set(), out = [];
  [...a, ...b].forEach(n => {
    const k = (n.titulo || '').toLowerCase().replace(/[^a-z0-9áéíóúñ]/g, '').slice(0, 60);
    if (!k || seen.has(k)) return; seen.add(k); out.push(n);
  });
  return out.sort((x, y) => new Date(y.fecha) - new Date(x.fecha));
}
async function loadRobot(){
  try {
    const r = await fetch('data/noticias.json?t=' + Date.now(), {cache:'no-store'});
    const j = await r.json();
    if (j.actualizado) $('#robotStamp').textContent = `${t('robot')}: ${fmtDate(new Date(j.actualizado))}`;
    return j.noticias || [];
  } catch (e) { return []; }
}
function parseRss(xml){
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  return [...doc.querySelectorAll('item')].map(it => {
    let titulo = it.querySelector('title')?.textContent || '';
    const fuente = it.querySelector('source')?.textContent || (titulo.includes(' - ') ? titulo.split(' - ').pop() : 'Prensa');
    if (titulo.includes(' - ')) titulo = titulo.split(' - ').slice(0, -1).join(' - ');
    return {titulo, url: it.querySelector('link')?.textContent || '', fecha: it.querySelector('pubDate')?.textContent || '', fuente, imagen:''};
  });
}
async function liveSearch(term){
  const q = encodeURIComponent(`SENA ${term || 'contratos irregularidades'} when:30d`);
  const rss = `https://news.google.com/rss/search?q=${q}&hl=es-419&gl=CO&ceid=CO:es-419`;
  const tries = [
    async () => { const r = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rss)); const j = await r.json(); if (j.status !== 'ok') throw 0;
      return j.items.map(i => { const p = i.title.split(' - '); return {titulo: p.length > 1 ? p.slice(0, -1).join(' - ') : i.title, fuente: p.length > 1 ? p.pop() : 'Prensa', url:i.link, fecha:i.pubDate.replace(' ', 'T') + 'Z', imagen: i.thumbnail || ''}; }); },
    async () => { const r = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(rss)); return parseRss(await r.text()); }
  ];
  for (const f of tries) { try { const res = await f(); if (res.length) return res.filter(n => /sena/i.test(n.titulo)); } catch (e) {} }
  throw new Error('live');
}
async function refreshAll(term){
  $('#btnRefresh').classList.add('spin');
  $('#searchState').textContent = t('searching');
  const robot = await loadRobot();
  NEWS = merge(robot, NEWS);
  renderNews(NEWS); renderHoy();
  try {
    const live = await liveSearch(term);
    NEWS = merge(NEWS, live);
    $('#searchState').textContent = T[LANG].found(live.length);
  } catch (e) { $('#searchState').textContent = t('liveFail'); }
  const shown = term ? NEWS.filter(n => (n.titulo + ' ' + n.fuente).toLowerCase().includes(term.toLowerCase())) : NEWS;
  renderNews(shown.length ? shown : NEWS); renderHoy();
  $('#btnRefresh').classList.remove('spin');
}

/* ---------- SECOP II en vivo ---------- */
const loose = s => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[AEIOU]/g, '_').replace(/'/g, "''");
async function querySecop(){
  const dep = $('#dep').value, kw = $('#secopQ').value.trim();
  $('#secopState').textContent = t('secopLoading'); $('#secopTable').innerHTML = ''; $('#secopSum').innerHTML = '';
  let where = `upper(nombre_entidad) like '%APRENDIZAJE%'`;
  if (dep) where += ` AND upper(departamento) like '%${loose(dep)}%'`;
  if (kw) where += ` AND upper(descripcion_del_proceso) like '%${loose(kw)}%'`;
  const url = `${SECOP_API}?$where=${encodeURIComponent(where)}&$order=fecha_de_firma DESC&$limit=60`;
  try {
    const r = await fetch(url); if (!r.ok) throw 0;
    const rows = await r.json();
    const total = rows.reduce((s, x) => s + (+x.valor_del_contrato || 0), 0);
    $('#secopState').textContent = T[LANG].secopN(rows.length);
    $('#secopSum').innerHTML = `<div><b>${rows.length}</b>${t('secopCount')}</div><div><b>${money(total)}</b>${t('secopTotal')}</div>`;
    const th = T[LANG].th;
    $('#secopTable').innerHTML = `<tr>${th.map(h => `<th>${h}</th>`).join('')}</tr>` + rows.map(x => {
      const link = (x.urlproceso && (x.urlproceso.url || x.urlproceso)) || '';
      const f = x.fecha_de_firma ? new Date(x.fecha_de_firma).toLocaleDateString('es-CO', {timeZone:TZ}) : '';
      return `<tr><td>${f}</td><td>${esc((x.descripcion_del_proceso || x.objeto_del_contrato || '').slice(0, 220))}</td><td>${esc(x.proveedor_adjudicado || '')}</td><td>${esc(x.modalidad_de_contratacion || '')}</td><td class="money">${money(+x.valor_del_contrato || 0)}</td><td>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">${t('see')}</a>` : ''}</td></tr>`;
    }).join('');
  } catch (e) { $('#secopState').textContent = t('secopFail'); }
}

/* ---------- Carta de derecho de petición ---------- */
function buildLetter(){
  const e = ENTIDADES.find(x => x.id === $('#fEntidad').value) || ENTIDADES[0];
  const R = $('#fRegional').value || 'Córdoba';
  const nombre = $('#fNombre').value || '[Nombre completo]', cc = $('#fCedula').value || '[Cédula]';
  const ciudad = $('#fCiudad').value || '[Ciudad]', correo = $('#fCorreo').value || '[Correo]';
  const fecha = new Intl.DateTimeFormat('es-CO', {timeZone:TZ, day:'numeric', month:'long', year:'numeric'}).format(new Date());
  $('#cartaTxt').value =
`${ciudad}, ${fecha}

Señores
${e.n}
E. S. D.

Asunto: Derecho de petición de información — contratos SENA regional ${R}

Yo, ${nombre}, identificado(a) con cédula de ciudadanía No. ${cc}, en ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política, regulado por la Ley 1755 de 2015, y del derecho de control social de la Ley 850 de 2003, respetuosamente solicito:

1. Se me suministre ${e.pide.replace('{R}', R)}.
2. Se me informe qué medidas se han adoptado para proteger los recursos destinados a los aprendices.
3. Si alguna información tiene reserva legal, se me indique la norma que la sustenta y se entregue la parte no reservada.

Hechos: el 25 de octubre de 2026 el Gobierno Nacional informó públicamente presuntas irregularidades en contratos del SENA regional Córdoba y anunció la revisión de todas las regionales del país.

Agradezco la respuesta dentro de los términos legales (15 días hábiles; 10 días hábiles para solicitud de documentos) al correo ${correo}.

Atentamente,

${nombre}
C.C. ${cc}
${correo}`;
  $('#btnPortal').href = e.url;
}

/* ---------- Arranque ---------- */
function bind(){
  $('#btnLang').onclick = () => { LANG = LANG === 'es' ? 'en' : 'es'; try { localStorage.setItem('vs-lang', LANG); } catch (e) {} applyI18n(); };
  $('#btnRefresh').onclick = () => refreshAll($('#q').value.trim());
  $('#btnSearch').onclick = () => refreshAll($('#q').value.trim());
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') refreshAll($('#q').value.trim()); });
  $('#q').addEventListener('input', () => { const v = $('#q').value.trim().toLowerCase(); renderNews(v ? NEWS.filter(n => (n.titulo + ' ' + n.fuente).toLowerCase().includes(v)) : NEWS); });
  $('#btnSecop').onclick = querySecop;
  ['#fNombre','#fCedula','#fCiudad','#fCorreo','#fEntidad','#fRegional'].forEach(s => $(s).addEventListener('input', buildLetter));
  $('#btnCopy').onclick = async () => { try { await navigator.clipboard.writeText($('#cartaTxt').value); } catch (e) { $('#cartaTxt').select(); document.execCommand('copy'); } toast(t('copied')); };
  $('#btnWa').href = 'https://wa.me/?text=' + encodeURIComponent('Veeduría SENA: sigue el caso de los contratos y revisa los de tu regional https://veeduria-sena.netlify.app');
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshAll(); });
}
document.addEventListener('DOMContentLoaded', () => {
  bind(); applyI18n(); animateCounters();
  refreshAll();
  querySecop();
  setInterval(() => refreshAll(), 30 * 60 * 1000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});
