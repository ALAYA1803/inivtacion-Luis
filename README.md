# 🍻 Invitación y Confirmación de Asistencia (RSVP) - Cumpleaños de Luchito

Landing Page interactiva, mobile-first y de alto impacto visual diseñada para la invitación y confirmación de asistencia (RSVP) al cumpleaños de **LUCHITO**. 

Inspirada exactamente en la estética visual de la invitación vintage con textura de pizarra carbón, marco con esquinas redondeadas invertidas, tipografía display gruesa (*Lilita One*), jarras de cerveza brindando con efervescencia animada y acentos dorados (`#A68932` / `#B59436`).

Arquitectura **100% estática y gratuita**, optimizada para desplegarse en **GitHub Pages** y conectada a una hoja de cálculo en **Google Sheets** mediante Google Apps Script (sin necesidad de pagar hosting ni servidores de backend).

---

## 🎨 Características UI/UX y Funcionalidades

1. **Fidelidad Estética al 100%:**
   - Paleta de color exacta: Fondo pizarra carbón (`#121212` / `#181818`), marco crema cálido (`#F5EFE6`) y dorados cervecero / mostaza (`#A68932` / `#B59436`).
   - Marco decorativo perimetral con **esquinas redondeadas invertidas** (arcos cóncavos) y destellos.
   - Bloque de fecha y hora idéntico al póster: `[MIERCOLES]` | `4:00 PM` | `18` | `[NOVIEMBRE]`.
   - Botón píldora dorada con doble borde crema característico.

2. **Micro-interacciones y Animaciones:**
   - Ilustración vectorial SVG de **dos jarras de cerveza brindando**: haz clic en las jarras para ver la animación de choque y escuchar el sonido de brindis sintetizado con la **Web Audio API** (sin depender de archivos de audio externos).
   - Burbujas de cerveza efervescentes flotando suavemente en el fondo.
   - Efectos de hover y micro-escalado en tarjetas y botones.

3. **Herramientas para Invitados:**
   - **Contador regresivo en vivo** hasta el Miércoles 18 de Noviembre de 2026, 4:00 PM.
   - **Ubicación exacta**: C. Bernardo de O'Higgins 125, Pueblo Libre con botón directo a Google Maps, botón de copiado rápido al portapapeles y mapa interactivo.
   - **Formulario de confirmación (RSVP)**:
     - Nombre y Apellido.
     - Selector visual "¿Asistirás?" (*"¡Obvio, ahí estaré! 🍻"* o *"No podré ir 😢"*).
     - Stepper numérico interactivo (1 al 5 personas) para reservar cupos.
     - Campo de felicitaciones o pedido de canción.
   - **Modal de confirmación:**
     - Lluvia de confeti dorado y cervecero en canvas.
     - Botón para **"Agregar a Google Calendar"**.
     - Botón para **"Descargar recordatorio (.ics)"** (compatible con iPhone, Android, Mac y Outlook).
     - Botón para **"Avisarle a Luchito por WhatsApp"**.

---

## 📊 Paso 1: Conectar con Google Sheets (Gratis)

El formulario ya viene listo con un **MODO DEMO**: si abres la página ahora mismo, puedes probar el envío, el confeti y los calendarios sin errores. Para que las confirmaciones se guarden en tu propio Excel en la nube:

1. Entra a [Google Sheets](https://sheets.new) y crea una hoja nueva llamada **"Cumpleaños Luchito - Asistencias"**.
2. En el menú superior de Google Sheets, ve a: **Extensiones** > **Apps Script**.
3. Borra el código de ejemplo y pega el siguiente script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Crear encabezados si la hoja está en blanco
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha / Hora de Registro",
        "Nombre y Apellido",
        "¿Asistirá?",
        "Cantidad de Personas",
        "Mensaje / Canción Pedida",
        "Dispositivo / Navegador"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#A68932");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
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
    
    sheet.appendRow([
      fechaRegistro,
      nombre,
      asistencia,
      cantidadPersonas,
      mensaje,
      userAgent
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Confirmación registrada"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Haz clic en el icono de guardar 💾 (**Ctrl + S**).
5. Haz clic en el botón azul superior **Implementar** (Deploy) > **Nueva implementación** (New deployment).
   - En el engranaje ⚙️ elige: **Aplicación web** (Web app).
   - **Descripción**: RSVP Luchito.
   - **Ejecutar como**: *Yo* (tu correo).
   - **Quién tiene acceso**: **Cualquiera** (*Anyone*). *(⚠️ Importante para que tus invitados puedan enviar datos sin pedirles inicio de sesión)*.
6. Haz clic en **Implementar**, autoriza los permisos de tu cuenta de Google y copia la **URL de la aplicación web** (la que termina en `/exec`).
7. Abre el archivo `script.js` en tu proyecto y reemplaza la primera línea:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/TU_ID_AQUI/exec";
   ```

---

## 🚀 Paso 2: Subir a GitHub y Activar GitHub Pages

Abre una terminal en la carpeta del proyecto (`c:\Users\rodri\Desktop\asistencia-luis`) y ejecuta los siguientes comandos exactos:

```bash
# 1. Iniciar el repositorio local
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: landing page de invitacion y RSVP para el cumple de Luchito"

# 4. Configurar la rama principal como main
git branch -M main

# 5. Conectar con el repositorio remoto de GitHub
git remote add origin https://github.com/ALAYA1803/inivtacion-Luis.git

# 6. Subir los archivos a GitHub
git push -u origin main
```

*(Si ya tenías el repositorio inicializado en GitHub, puedes hacer `git push -u origin main --force` si es un repositorio nuevo).*

---

## 🌐 Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub: [https://github.com/ALAYA1803/inivtacion-Luis](https://github.com/ALAYA1803/inivtacion-Luis).
2. Haz clic en la pestaña **Settings** (Configuración) en la parte superior.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - **Source**: Elige **Deploy from a branch**.
   - **Branch**: Selecciona `main` y en la carpeta elige `/(root)`.
5. Haz clic en **Save** (Guardar).
6. En 1 o 2 minutos, tu página estará activa y visible en todo el mundo en:
   👉 **`https://alaya1803.github.io/inivtacion-Luis/`**

---

## 📁 Estructura del Proyecto

```text
asistencia-luis/
├── index.html        # Estructura semántica, Hero Card vintage, RSVP y Modales
├── styles.css        # Estilos visuales, marco con esquinas invertidas y animaciones
├── script.js         # Lógica interactiva, Web Audio API, Confeti, Google Sheets y Calendario
└── README.md         # Documentación y guía de despliegue paso a paso
```

¡Salud por el cumple de Luchito! 🍻
