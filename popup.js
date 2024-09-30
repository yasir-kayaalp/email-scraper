/**
 * ╔═════════════════════════════════════════╗
 * ║                                         ║
 * ║ ██╗   ██╗ █████╗ ███████╗██╗██████╗     ║
 * ║ ╚██╗ ██╔╝██╔══██╗██╔════╝██║██╔══██╗    ║
 * ║  ╚████╔╝ ███████║███████╗██║██████╔╝    ║
 * ║   ╚██╔╝  ██╔══██║╚════██║██║██╔══██╗    ║
 * ║    ██║   ██║  ██║███████║██║██║  ██║    ║
 * ║    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝    ║
 * ║                                         ║
 * ║             YASIR KAYAALP               ║
 * ║           yasirkayaalp.link             ║
 * ║                                         ║
 * ╚═════════════════════════════════════════╝
 */

document.addEventListener('DOMContentLoaded', () => {
  updateCounter();
  
  document.getElementById('indirTSV').addEventListener('click', downloadTSV);
  document.getElementById('temizle').addEventListener('click', temizleVeriler);
});

function updateCounter() {
  chrome.storage.local.get({veriler: []}, (result) => {
    document.getElementById('veriSayisi').textContent = result.veriler.length;
  });
}

function downloadTSV() {
  chrome.storage.local.get({veriler: []}, (result) => {
    const veriler = result.veriler;
    if (veriler.length === 0) {
      alert('İndirilecek veri yok!');
      return;
    }

    const header = Object.keys(veriler[0]).join('\t');
    const rows = veriler.map(veri => Object.values(veri).join('\t'));
    const tsvContent = [header, ...rows].join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'veriler.tsv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function temizleVeriler() {
  chrome.storage.local.set({veriler: []}, () => {
    updateCounter();
    alert('Tüm veriler temizlendi!');
  });
}
