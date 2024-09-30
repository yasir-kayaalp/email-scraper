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
function toplaVeriler() {
  const icerik = document.body.innerHTML;
  const veriler = new Set();

  // E-posta regex'i
  const epostaRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g;
  const epostalar = icerik.match(epostaRegex) || [];


  const telefonRegex = /(\+90|0)?\s?5[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}/g;
  const telefonlar = icerik.match(telefonRegex) || [];

  // Web sitesi regex'i (geliştirilmiş)
  const webSiteRegex = /(https?:\/\/[^\s"'<>]+)/g;
  const webSiteler = icerik.match(webSiteRegex) || [];

  // Şirket ismini bulmak için fonksiyon
  function bulSirketIsmi() {
    // Meta etiketlerini kontrol et
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const content = metaDescription.getAttribute('content');
      const sirketRegex = /([A-Z][a-z]+ )+Ltd\.?|([A-Z][a-z]+ )+Inc\.?|([A-Z][a-z]+ )+A\.Ş\.?/;
      const match = content.match(sirketRegex);
      if (match) return match[0];
    }

    // Başlığı kontrol et
    const title = document.title;
    const titleMatch = title.match(/([A-Z][a-z]+ )+Ltd\.?|([A-Z][a-z]+ )+Inc\.?|([A-Z][a-z]+ )+A\.Ş\.?/);
    if (titleMatch) return titleMatch[0];

    // H1 etiketlerini kontrol et
    const h1Elements = document.getElementsByTagName('h1');
    for (let h1 of h1Elements) {
      const h1Match = h1.textContent.match(/([A-Z][a-z]+ )+Ltd\.?|([A-Z][a-z]+ )+Inc\.?|([A-Z][a-z]+ )+A\.Ş\.?/);
      if (h1Match) return h1Match[0];
    }

    // Eğer hiçbir şey bulunamazsa, domain adını döndür
    return window.location.hostname.replace('www.', '').split('.')[0];
  }

  const sirketIsmi = bulSirketIsmi();

  epostalar.forEach(eposta => {
    const telefon = telefonlar.find(tel => icerik.indexOf(tel) < icerik.indexOf(eposta) + 200 && icerik.indexOf(tel) > icerik.indexOf(eposta) - 200) || '';
    const webSite = webSiteler.find(site => site.toLowerCase().includes(sirketIsmi.toLowerCase())) || window.location.origin;

    veriler.add(JSON.stringify({eposta, sirketIsmi, telefon, webSite}));
  });

  const benzersizVeriler = Array.from(veriler).map(JSON.parse);
  chrome.runtime.sendMessage({action: "kaydetVeriler", veriler: benzersizVeriler});
}

// Sayfa yüklendiğinde fonksiyonu çağır
toplaVeriler();

// Sayfa içeriği değiştiğinde de fonksiyonu çağır (dinamik içerik için)
const observer = new MutationObserver(toplaVeriler);
observer.observe(document.body, { childList: true, subtree: true });
