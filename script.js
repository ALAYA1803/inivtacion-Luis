/**
 * ==========================================================================
 * CUMPLEAÑOS DE LUCHITO - SCRIPT INTERACTIVO (VANILLA JS)
 * ==========================================================================
 * Arquitectura 100% gratuita para GitHub Pages + Google Sheets.
 * Incluye:
 *  - Envío fetch() POST a Google Apps Script con modo de prueba automático
 *  - Animación de choque de jarras y sonido Web Audio API (sin archivos externos)
 *  - Contador regresivo en tiempo real al 18 de Noviembre de 2026, 4:00 PM
 *  - Selector interactivo de asistencia y cantidad de acompañantes (1 a 5)
 *  - Modal con motor de confeti cervecero dorado
 *  - Enlaces automáticos a Google Calendar y descarga de archivo .ics
 *  - Botón de compartir en WhatsApp y copiar dirección al portapapeles
 *  - Generador de burbujas efervescentes en segundo plano
 * ==========================================================================
 */

// 1. CONFIGURACIÓN DEL BACKEND (GOOGLE APPS SCRIPT)
// ⚠️ Reemplaza esta URL con la URL de tu Web App de Google Apps Script.
// Si dejas "TU_URL_DE_APPS_SCRIPT_AQUI", la página funcionará en MODO DEMO,
// permitiéndote probar toda la interfaz y el confeti sin errores.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwIVxztodUv_VbeOSFnKWV5XD4eNwHS_HcG9spqpQR0eVRuGremdAXQOp0vQcDdpCPg/exec";

// Fecha y hora del evento: Miércoles 18 de Noviembre de 2026 a las 4:00 PM (Hora de Lima / UTC-5)
const EVENT_CONFIG = {
  title: "Cumpleaños de Luchito 🍻",
  dateStartIso: "2026-11-18T16:00:00-05:00",
  dateEndIso: "2026-11-18T23:59:00-05:00",
  gcalDates: "20261118T210000Z/20261119T050000Z", // En formato UTC (16:00 UTC-5 = 21:00 UTC)
  address: "C. Bernardo de O'Higgins 125, Pueblo Libre",
  mapsUrl: "https://maps.app.goo.gl/nE8yuqM2n8inwzYq9",
  description: "¡Acompáñanos a celebrar el cumpleaños de Luchito! Brindis, cerveza helada, buena música y los mejores amigos. "
};

// ==========================================================================
// 2. INICIALIZACIÓN AL CARGAR EL DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initBackgroundBubbles();
  initCountdown();
  initBeerToastInteraction();
  initRsvpForm();
  initAddressCopy();
  initModalActions();
  checkPreviousRsvp();
});

// ==========================================================================
// 3. GENERADOR DE BURBUJAS DE FONDO (EFERVESCENCIA SUTIL)
// ==========================================================================
function initBackgroundBubbles() {
  const container = document.getElementById("bubblesContainer");
  if (!container) return;

  const bubbleCount = 18;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.className = "float-bubble";

    const size = Math.random() * 16 + 8; // Entre 8px y 24px
    const leftPos = Math.random() * 100; // 0% a 100%
    const duration = Math.random() * 8 + 8; // 8s a 16s
    const delay = Math.random() * 10; // 0s a 10s

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${leftPos}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    container.appendChild(bubble);
  }
}

// ==========================================================================
// 4. CONTADOR REGRESIVO EN TIEMPO REAL
// ==========================================================================
function initCountdown() {
  const daysEl = document.getElementById("daysVal");
  const hoursEl = document.getElementById("hoursVal");
  const minutesEl = document.getElementById("minutesVal");
  const secondsEl = document.getElementById("secondsVal");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(EVENT_CONFIG.dateStartIso).getTime();

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const descEl = document.querySelector(".section-desc");
      if (descEl) descEl.textContent = "¡La fiesta de Luchito ya comenzó!  ¡Salud!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ==========================================================================
// 5. SONIDO WEB AUDIO API & INTERACCIÓN DE BRINDIS DE JARRAS
// ==========================================================================
// Sintetiza un choque realista de vasos/jarras de vidrio grueso sin audio externo
function playClinkSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Oscilador 1: Tono cristalino agudo principal
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(2450, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.35);

    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    // Oscilador 2: Resonancia armónica de jarra de cerveza
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1280, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.5);

    gain2.gain.setValueAtTime(0.25, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    // Conexión y disparo
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    // Si el navegador bloquea audio antes de la interacción de usuario
    console.debug("Web Audio no disponible o bloqueado:", err);
  }
}

function initBeerToastInteraction() {
  const beerBtn = document.getElementById("beerToastBtn");
  const soundNavBtn = document.getElementById("soundToggleBtn");

  function triggerClinkAnimation() {
    playClinkSound();
    if (beerBtn) {
      beerBtn.classList.remove("clinking");
      // Truco de reflow para reiniciar animación
      void beerBtn.offsetWidth;
      beerBtn.classList.add("clinking");
    }
  }

  if (beerBtn) {
    beerBtn.addEventListener("click", triggerClinkAnimation);
    beerBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerClinkAnimation();
      }
    });
  }

  if (soundNavBtn) {
    soundNavBtn.addEventListener("click", () => {
      triggerClinkAnimation();
      showToast("¡Salud por Luchito! ");
    });
  }
}

// ==========================================================================
// 6. FORMULARIO RSVP DE CONFIRMACIÓN DE ASISTENCIA
// ==========================================================================
function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const optionYesCard = document.getElementById("optionYesCard");
  const optionNoCard = document.getElementById("optionNoCard");
  const guestsCountGroup = document.getElementById("guestsCountGroup");
  const guestsCountInput = document.getElementById("guestsCountInput");
  const btnMinusGuest = document.getElementById("btnMinusGuest");
  const btnPlusGuest = document.getElementById("btnPlusGuest");
  const stepperHint = document.getElementById("stepperHint");
  const stepperUnitText = document.getElementById("stepperUnitText");

  const guestNameInput = document.getElementById("guestName");
  const nameError = document.getElementById("nameError");
  const btnSubmitRsvp = document.getElementById("btnSubmitRsvp");
  const btnSubmitLabel = document.getElementById("btnSubmitLabel");
  const formFeedback = document.getElementById("formFeedback");

  if (!form) return;

  // Manejo de opciones "¿Asistirás?"
  const radioInputs = document.querySelectorAll('input[name="asistencia"]');
  radioInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "SI") {
        optionYesCard.classList.add("active");
        optionNoCard.classList.remove("active");
        if (guestsCountGroup) {
          guestsCountGroup.style.display = "flex";
        }
      } else {
        optionNoCard.classList.add("active");
        optionYesCard.classList.remove("active");
        if (guestsCountGroup) {
          guestsCountGroup.style.display = "none";
        }
      }
    });
  });

  // Manejo de Stepper Numérico (1 al 5)
  function updateStepperUi(val) {
    guestsCountInput.value = val;
    btnMinusGuest.disabled = val <= 1;
    btnPlusGuest.disabled = val >= 5;

    stepperUnitText.textContent = val === 1 ? "persona" : "personas";

    if (val === 1) {
      stepperHint.textContent = "1 lugar reservado para ti";
    } else if (val === 2) {
      stepperHint.textContent = "2 lugares (tú + 1 acompañante)";
    } else {
      stepperHint.textContent = `${val} lugares (tú + ${val - 1} acompañantes)`;
    }
  }

  btnMinusGuest.addEventListener("click", () => {
    let current = parseInt(guestsCountInput.value, 10) || 1;
    if (current > 1) {
      current--;
      updateStepperUi(current);
    }
  });

  btnPlusGuest.addEventListener("click", () => {
    let current = parseInt(guestsCountInput.value, 10) || 1;
    if (current < 5) {
      current++;
      updateStepperUi(current);
    }
  });

  // Validación rápida de nombre
  guestNameInput.addEventListener("input", () => {
    if (guestNameInput.value.trim().length >= 2) {
      nameError.style.display = "none";
      guestNameInput.style.borderColor = "rgba(245, 239, 230, 0.15)";
    }
  });

  // Envío del Formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = guestNameInput.value.trim();
    if (!nombre || nombre.length < 2) {
      nameError.style.display = "block";
      guestNameInput.focus();
      guestNameInput.style.borderColor = "#FF8A80";
      return;
    }

    const asistencia = document.querySelector('input[name="asistencia"]:checked')?.value || "SI";
    const cantidadPersonas = asistencia === "SI" ? (parseInt(guestsCountInput.value, 10) || 1) : 0;
    const mensaje = document.getElementById("guestMessage")?.value.trim() || "";
    const fechaRegistro = new Date().toLocaleString("es-PE", { timeZone: "America/Lima" });

    const payload = {
      nombre,
      asistencia,
      cantidadPersonas,
      mensaje,
      fechaRegistro,
      userAgent: navigator.userAgent
    };

    // Estado visual de carga
    btnSubmitRsvp.disabled = true;
    btnSubmitRsvp.classList.add("loading");
    btnSubmitLabel.textContent = "Enviando confirmación... ";
    formFeedback.style.display = "none";

    try {
      // 1. Detectar si estamos en MODO DEMO o con URL real
      const isDemoMode = GOOGLE_SCRIPT_URL === "TU_URL_DE_APPS_SCRIPT_AQUI" || !GOOGLE_SCRIPT_URL.startsWith("http");

      if (isDemoMode) {
        console.info(
          "ℹ️ [MODO DEMO ACTIVO]: Datos recibidos en frontend:",
          payload,
          "\nPara guardar estos datos en Google Sheets, sigue las instrucciones de Google Apps Script al final de script.js."
        );
        // Simular latencia de red para feedback realista
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        // Envío real a Google Apps Script usando POST
        // Usamos mode: 'no-cors' debido a la redirección 302 estándar de Google Web Apps
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }

      // Guardar en almacenamiento local para recordar al usuario
      localStorage.setItem("luchito_rsvp_data", JSON.stringify(payload));

      // Reproducir sonido de brindis y abrir modal con confeti
      playClinkSound();
      openSuccessModal(payload);

      // Limpiar o resetear formulario
      form.reset();
      updateStepperUi(1);

    } catch (error) {
      console.error("Error al enviar confirmación:", error);
      formFeedback.className = "form-feedback error";
      formFeedback.textContent = "Hubo un pequeño error al conectar. Por favor intenta de nuevo o escríbele a Luchito.";
      formFeedback.style.display = "block";
    } finally {
      btnSubmitRsvp.disabled = false;
      btnSubmitRsvp.classList.remove("loading");
      btnSubmitLabel.textContent = "CONFIRMAR ASISTENCIA";
    }
  });
}

// ==========================================================================
// 7. MODAL DE CONFIRMACIÓN EXITOSA & MOTOR DE CONFETI CERVECERO
// ==========================================================================
function openSuccessModal(data) {
  const modal = document.getElementById("successModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const btnGoogleCalendar = document.getElementById("btnGoogleCalendar");
  const btnWhatsAppShare = document.getElementById("btnWhatsAppShare");

  if (!modal) return;

  // Personalización según si asiste o no
  if (data.asistencia === "SI") {
    modalTitle.textContent = "¡CONFIRMACIÓN RECIBIDA! ";
    modalMessage.innerHTML = `¡Genial, <strong>${escapeHtml(data.nombre)}</strong>! Luchito te espera con una jarra bien helada este <strong>miércoles 18 de noviembre a las 4:00 PM</strong> (${data.cantidadPersonas} ${data.cantidadPersonas === 1 ? "lugar reservado" : "lugares reservados"}).`;
    
    // Configurar enlace de Google Calendar
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_CONFIG.title)}&dates=${EVENT_CONFIG.gcalDates}&details=${encodeURIComponent(EVENT_CONFIG.description)}&location=${encodeURIComponent(EVENT_CONFIG.address)}`;
    btnGoogleCalendar.href = gcalUrl;
    btnGoogleCalendar.style.display = "flex";

    // Mensaje de WhatsApp
    const waText = `¡Hola Luchito!  Ya confirmé mi asistencia a tu cumple para el miércoles 18 de nov a las 4:00 PM  (${data.cantidadPersonas} ${data.cantidadPersonas === 1 ? "persona" : "personas"}). ¡Nos vemos pronto!`;
    btnWhatsAppShare.href = `https://api.whatsapp.com/send?phone=51985833463&text=${encodeURIComponent(waText)}`;

  } else {
    modalTitle.textContent = "¡GRACIAS POR AVISAR! ";
    modalMessage.innerHTML = `¡Gracias por avisar, <strong>${escapeHtml(data.nombre)}</strong>! Se te extrañará en el brindis, pero brindaremos por ti a la distancia.`;
    btnGoogleCalendar.style.display = "none";

    const waText = `¡Hola Luchito! Te escribo para mandarte un fuerte abrazo por tu cumple. No podré acompañarte este 18 de nov pero brindaré por ti . ¡Que lo pases genial!`;
    btnWhatsAppShare.href = `https://api.whatsapp.com/send?phone=51985833463&text=${encodeURIComponent(waText)}`;
  }

  // Mostrar modal y disparar confeti dorado y cervecero
  modal.style.display = "flex";
  launchConfetti();
}

function initModalActions() {
  const modal = document.getElementById("successModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const doneBtn = document.getElementById("modalDoneBtn");
  const btnDownloadIcs = document.getElementById("btnDownloadIcs");

  function closeModal() {
    if (modal) modal.style.display = "none";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (doneBtn) doneBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Generador dinámico de archivo .ics descargable
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener("click", () => {
      generateAndDownloadIcs();
    });
  }
}

// Genera un archivo .ICS estándar compatible con iPhone (Apple Calendar), Android, Outlook y Mac
function generateAndDownloadIcs() {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cumpleanos de Luchito//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:cumple-luchito-20261118@fiesta.pe",
    "DTSTAMP:20261118T000000Z",
    "DTSTART:20261118T210000Z",
    "DTEND:20261119T050000Z",
    `SUMMARY:${EVENT_CONFIG.title}`,
    `DESCRIPTION:${EVENT_CONFIG.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${EVENT_CONFIG.address}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "Cumpleanos_Luchito_18Nov.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("¡Archivo de calendario descargado! 📅");
}

// ==========================================================================
// 8. MOTOR DE CONFETI CANVAS CERVECERO Y DORADO
// ==========================================================================
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  // Paleta de confeti: Dorado cerveza, crema, espuma blanca y destellos
  const colors = ["#C59B32", "#A68932", "#B59436", "#F5EFE6", "#FFFFFF", "#E0D5C1"];
  const particles = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 80,
      y: height / 2 + (Math.random() - 0.5) * 80,
      radius: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4, // Empuje inicial hacia arriba
      gravity: 0.35,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.4 ? "rect" : "circle",
      opacity: 1
    });
  }

  let animationFrame;
  let startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.vx *= 0.98;

      if (elapsed > 1800) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < height) {
        activeParticles++;
        ctx.save();
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.radius, -p.radius / 1.5, p.radius * 2, p.radius * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    });

    if (activeParticles > 0 && elapsed < 4000) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

// ==========================================================================
// 9. COPIAR DIRECCIÓN AL PORTAPAPELES
// ==========================================================================
function initAddressCopy() {
  const copyBtn = document.getElementById("copyAddressBtn");
  const copyBtnText = document.getElementById("copyBtnText");

  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(EVENT_CONFIG.address);
      } else {
        // Fallback para navegadores antiguos
        const tempInput = document.createElement("textarea");
        tempInput.value = EVENT_CONFIG.address;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      if (copyBtnText) copyBtnText.textContent = "¡Copiada!";
      showToast("¡Dirección copiada al portapapeles! 📍");

      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = "Copiar Dirección";
      }, 2500);
    } catch (err) {
      showToast("Dirección: " + EVENT_CONFIG.address);
    }
  });
}

// Muestra un toast flotante elegante
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Verifica si ya confirmó antes
function checkPreviousRsvp() {
  try {
    const saved = localStorage.getItem("luchito_rsvp_data");
    if (saved) {
      const data = JSON.parse(saved);
      const nameInput = document.getElementById("guestName");
      if (nameInput && !nameInput.value) {
        nameInput.value = data.nombre || "";
      }
    }
  } catch (e) {
    // Silencioso
  }
}

// Utilidad anti-XSS para renderizar texto en el DOM
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
 * 10. CÓDIGO DE GOOGLE APPS SCRIPT (doPost) PARA GOOGLE SHEETS
 * ==========================================================================
 * 
 * INSTRUCCIONES RÁPIDAS PARA CONECTAR TU HOJA DE GOOGLE SHEETS:
 * 
 * 1. Crea una hoja de cálculo nueva en Google Drive (https://sheets.new)
 *    y ponle de nombre: "Cumpleaños Luchito - Asistencias".
 * 
 * 2. En el menú superior, ve a: "Extensiones" > "Apps Script".
 * 
 * 3. Borra todo el código que aparezca y pega EXACTAMENTE el código
 *    JavaScript que está en el bloque de abajo.
 * 
 * 4. Haz clic en el disquete para Guardar (Ctrl + S).
 * 
 * 5. Haz clic en el botón azul superior "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 *    - En el icono de engranaje (⚙️), selecciona: "Aplicación web" (Web app).
 *    - Descripción: "RSVP Luchito".
 *    - Ejecutar como (Execute as): "Yo" (Tu cuenta de Google).
 *    - Quién tiene acceso (Who has access): "Cualquiera" (Anyone). ⚠️ ¡Muy importante para que no pida login!
 * 
 * 6. Haz clic en "Implementar", autoriza los permisos con tu cuenta de Google
 *    (haciendo clic en "Configuración avanzada" > "Ir a Proyecto (no seguro)").
 * 
 * 7. Copia la "URL de la aplicación web" (termina en `/exec`) y pégala
 *    arriba en la constante:
 *    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
 * 
 * --------------------------------------------------------------------------
 * COPIA A PARTIR DE AQUÍ DENTRO DE APPS SCRIPT:
 * --------------------------------------------------------------------------

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está completamente vacía, creamos los encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha / Hora de Registro",
        "Nombre y Apellido",
        "¿Asistirá?",
        "Cantidad de Personas",
        "Mensaje / Canción Pedida",
        "Dispositivo / Navegador"
      ]);
      
      // Estilo visual dorado para la cabecera
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#A68932");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Parseo de los datos enviados por la landing page
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var nombre = data.nombre || "Anónimo";
    var asistencia = (data.asistencia || "SI").toUpperCase();
    var cantidadPersonas = asistencia === "SI" ? (Number(data.cantidadPersonas) || 1) : 0;
    var mensaje = data.mensaje || "";
    var fechaRegistro = data.fechaRegistro || Utilities.formatDate(new Date(), "America/Lima", "yyyy-MM-dd HH:mm:ss");
    var userAgent = data.userAgent || "";
    
    // Insertamos la nueva fila con la confirmación
    sheet.appendRow([
      fechaRegistro,
      nombre,
      asistencia,
      cantidadPersonas,
      mensaje,
      userAgent
    ]);
    
    // Respuesta de éxito en formato JSON
    var response = {
      status: "success",
      message: "Confirmación guardada correctamente para " + nombre,
      asistencia: asistencia,
      cupos: cantidadPersonas
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función auxiliar para probar manualmente en Apps Script
function testDoPost() {
  doPost({
    postData: {
      contents: JSON.stringify({
        nombre: "Test Luchito",
        asistencia: "SI",
        cantidadPersonas: 2,
        mensaje: "¡Salud por el cumpleañero! Que suene rock clásico 🎸",
        fechaRegistro: "18/11/2026, 4:00:00 p. m."
      })
    }
  });
}

 * --------------------------------------------------------------------------
 * FIN DEL CÓDIGO DE GOOGLE APPS SCRIPT
 * --------------------------------------------------------------------------
 */
