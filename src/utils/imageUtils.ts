/**
 * Compresses an image file client-side using HTML Canvas.
 * Ensures data URLs are compact (~100-300KB) to safely fit in localStorage.
 */
export async function compressImage(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.84
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to raw data url if canvas context fails
          resolve(e.target?.result as string);
          return;
        }

        // Clear background
        ctx.fillStyle = '#090b10';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type || 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Normalizes a filename to find the best match with catalog equipment IDs.
 */
export function matchFilenameToEquipmentId(fileName: string): string | null {
  const clean = fileName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_ ]+/g, '');

  const rules: Record<string, string[]> = {
    'techo-truss-10x10': ['techotruss', 'techo10x10', 'techos', 'techo'],
    'lona-cubierta-truss': ['lona', 'lonanegra', 'lonatruss', 'cubierta'],
    'puente-truss-estructuras': ['estructuras', 'estructura', 'puentetruss', 'trussluces', 'truss'],
    'tarima-modular-pro': ['tarima', 'tarima1', 'tarima2', 'tarimamodular', 'tarimas'],
    'escenario-conciertos-pro': ['escenario', 'escenario1', 'escenario2', 'escenario3', 'escenarios'],
    'vallas-seguridad-pasamanos': ['vallasdeseguridad', 'vallas', 'valla', 'pasamanos', 'vallasdeseguridad2'],
    'sonido-movil-monitores': ['sonidomovil', 'sonidosmovil2', 'monitores', 'sonidomovil1', 'monitordepiso'],
    'sonido-line-array-conciertos': ['conciertos', 'conciertos2', 'concierto', 'linearray', 'sonidomasivo'],
    'cabezales-moviles-robot-led': ['robotled', 'robot', 'cabezales', 'lucesroboticas', 'luces', 'cabezalmovil'],
    'transmision-en-vivo-streaming': ['transmisionenvivo', 'transmision', 'streaming', 'broadcast', 'envivo'],
    'videoconferencias-corporativas': ['videoonferencias', 'videoconferencias', 'videoconferencia', 'zoom', 'conferencias'],
    'pantallas-led-gigantes': ['pantalla', 'pantallas', 'pantallaled', 'pantallasled', 'ledscreen'],
    'planta-electrica-generador': ['plantaelectrica', 'planta', 'generador', 'plantaelectrica2', 'generadorelectrico'],
    'efectos-especiales-sparkular-humo': ['efectosespeciales', 'maquinadeconfeti', 'confeti', 'chispa', 'chispasfrias', 'humobajo'],
    'maquina-espuma-efectos': ['maquinadeespuma', 'maquinadeespuma2', 'espuma', 'fiestaespuma', 'espuma2'],
  };

  for (const [itemId, patterns] of Object.entries(rules)) {
    if (patterns.some((p) => clean.includes(p) || p.includes(clean))) {
      return itemId;
    }
  }

  return null;
}
