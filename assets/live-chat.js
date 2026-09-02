(() => {
  const config = {
    number: "",
    message: "Buongiorno, vorrei informazioni su un progetto di stampa."
  };

  const normalizedNumber = config.number.replace(/\D/g, "");
  const isActive = normalizedNumber.length >= 8;

  const destination = isActive
    ? `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(config.message)}`
    : "";

  const wrapper = document.createElement("aside");
  wrapper.className = `live-chat${isActive ? " is-active" : " is-pending"}`;
  wrapper.setAttribute("aria-label", "Contatto tramite live chat");
  wrapper.innerHTML = `
    <div class="live-chat__panel" id="liveChatPanel" hidden>
      <div class="live-chat__topline">
        <p class="live-chat__eyebrow">Canale diretto</p>
        <button class="live-chat__close" type="button" aria-label="Chiudi la live chat">×</button>
      </div>
      <h2 class="live-chat__title">Parliamo del tuo progetto.</h2>
      <p class="live-chat__copy">${isActive
        ? "Scrivici per richieste, tempi e preventivi. La conversazione si apre nell'app WhatsApp o in WhatsApp Web."
        : "Il contatto diretto via WhatsApp sarà disponibile a breve. Nel frattempo puoi scriverci dalla pagina Contatti."}</p>
      ${isActive
        ? `<a class="live-chat__action" href="${destination}" target="_blank" rel="noopener noreferrer nofollow"><span>Apri la chat</span><span aria-hidden="true">↗</span></a>`
        : `<button class="live-chat__action" type="button" aria-disabled="true" disabled><span>Canale in attivazione</span><span aria-hidden="true">—</span></button>`}
      <p class="live-chat__disclosure">${isActive
        ? 'Dopo il clic, il trattamento dei dati avviene anche secondo le condizioni di WhatsApp. Consulta la nostra <a href="privacy.html">informativa privacy</a>.'
        : 'Il sito non si collega a WhatsApp finché il canale non viene attivato. Consulta la nostra <a href="privacy.html">informativa privacy</a>.'}</p>
    </div>
    <button class="live-chat__launcher" type="button" aria-expanded="false" aria-controls="liveChatPanel">
      <svg class="live-chat__launcher-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5.5h14v10H9l-4 3v-13Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 9.1h7M8.5 12h4.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <span>Contattaci tramite live chat</span>
    </button>`;

  document.body.append(wrapper);
  const panel = wrapper.querySelector(".live-chat__panel");
  const launcher = wrapper.querySelector(".live-chat__launcher");
  const closeButton = wrapper.querySelector(".live-chat__close");

  const setOpen = open => {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) closeButton.focus();
    else launcher.focus();
  };

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  document.addEventListener("pointerdown", event => {
    if (!panel.hidden && !wrapper.contains(event.target)) setOpen(false);
  });
})();
