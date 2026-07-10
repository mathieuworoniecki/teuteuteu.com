export type TextDirection = "ltr" | "rtl";

export type Messages = {
  instruction: string;
  loading: string;
  machineLabel: string;
  playAction: string;
  pauseAction: string;
  counter: string;
  statusPlaying: string;
  statusPaused: string;
  statusError: string;
  support: string;
  donors: string;
};

const translations = {
  en: { instruction: "Press the button", loading: "Loading…", machineLabel: "The teuteuteu button", playAction: "Play teuteuteu", pauseAction: "Pause teuteuteu", counter: "Worldwide clicks: {count}", statusPlaying: "Playing.", statusPaused: "Paused.", statusError: "Sound cannot be played on this device.", support: "A teu for hosting?", donors: "Supporters" },
  fr: { instruction: "Appuie sur le bouton", loading: "Chargement…", machineLabel: "Le bouton teuteuteu", playAction: "Lancer teuteuteu", pauseAction: "Mettre teuteuteu en pause", counter: "Clics dans le monde : {count}", statusPlaying: "Lecture en cours.", statusPaused: "Lecture en pause.", statusError: "Le son ne peut pas être lu sur cet appareil.", support: "Un teu pour l’hébergement ?", donors: "Donateurs" },
  de: { instruction: "Drück den Knopf", loading: "Wird geladen…", machineLabel: "Der teuteuteu-Knopf", playAction: "Teuteuteu abspielen", pauseAction: "Teuteuteu pausieren", counter: "Klicks weltweit: {count}", statusPlaying: "Wiedergabe läuft.", statusPaused: "Pausiert.", statusError: "Der Ton kann auf diesem Gerät nicht abgespielt werden.", support: "Ein Teu fürs Hosting?", donors: "Unterstützer" },
  es: { instruction: "Pulsa el botón", loading: "Cargando…", machineLabel: "El botón teuteuteu", playAction: "Reproducir teuteuteu", pauseAction: "Pausar teuteuteu", counter: "Clics en todo el mundo: {count}", statusPlaying: "Reproduciendo.", statusPaused: "En pausa.", statusError: "No se puede reproducir el sonido en este dispositivo.", support: "¿Un teu para el alojamiento?", donors: "Donantes" },
  it: { instruction: "Premi il pulsante", loading: "Caricamento…", machineLabel: "Il pulsante teuteuteu", playAction: "Riproduci teuteuteu", pauseAction: "Metti in pausa teuteuteu", counter: "Clic nel mondo: {count}", statusPlaying: "Riproduzione in corso.", statusPaused: "In pausa.", statusError: "Impossibile riprodurre l’audio su questo dispositivo.", support: "Un teu per l’hosting?", donors: "Sostenitori" },
  "pt-PT": { instruction: "Carrega no botão", loading: "A carregar…", machineLabel: "O botão teuteuteu", playAction: "Reproduzir teuteuteu", pauseAction: "Pausar teuteuteu", counter: "Cliques no mundo: {count}", statusPlaying: "A reproduzir.", statusPaused: "Em pausa.", statusError: "Não é possível reproduzir o som neste dispositivo.", support: "Um teu para o alojamento?", donors: "Apoiantes" },
  "pt-BR": { instruction: "Aperte o botão", loading: "Carregando…", machineLabel: "O botão teuteuteu", playAction: "Reproduzir teuteuteu", pauseAction: "Pausar teuteuteu", counter: "Cliques no mundo: {count}", statusPlaying: "Reproduzindo.", statusPaused: "Pausado.", statusError: "Não é possível reproduzir o som neste dispositivo.", support: "Um teu para a hospedagem?", donors: "Apoiadores" },
  nl: { instruction: "Druk op de knop", loading: "Laden…", machineLabel: "De teuteuteu-knop", playAction: "Teuteuteu afspelen", pauseAction: "Teuteuteu pauzeren", counter: "Klikken wereldwijd: {count}", statusPlaying: "Wordt afgespeeld.", statusPaused: "Gepauzeerd.", statusError: "Geluid kan niet worden afgespeeld op dit apparaat.", support: "Een teu voor de hosting?", donors: "Donateurs" },
  pl: { instruction: "Naciśnij przycisk", loading: "Ładowanie…", machineLabel: "Przycisk teuteuteu", playAction: "Odtwórz teuteuteu", pauseAction: "Wstrzymaj teuteuteu", counter: "Kliknięcia na świecie: {count}", statusPlaying: "Odtwarzanie.", statusPaused: "Wstrzymano.", statusError: "Nie można odtworzyć dźwięku na tym urządzeniu.", support: "Teu na hosting?", donors: "Wspierający" },
  cs: { instruction: "Stiskni tlačítko", loading: "Načítání…", machineLabel: "Tlačítko teuteuteu", playAction: "Přehrát teuteuteu", pauseAction: "Pozastavit teuteuteu", counter: "Kliknutí po celém světě: {count}", statusPlaying: "Přehrává se.", statusPaused: "Pozastaveno.", statusError: "Na tomto zařízení nelze přehrát zvuk.", support: "Teu na hosting?", donors: "Podporovatelé" },
  sk: { instruction: "Stlač tlačidlo", loading: "Načítava sa…", machineLabel: "Tlačidlo teuteuteu", playAction: "Prehrať teuteuteu", pauseAction: "Pozastaviť teuteuteu", counter: "Kliknutia na celom svete: {count}", statusPlaying: "Prehráva sa.", statusPaused: "Pozastavené.", statusError: "Na tomto zariadení sa nedá prehrať zvuk.", support: "Teu na hosting?", donors: "Podporovatelia" },
  hu: { instruction: "Nyomd meg a gombot", loading: "Betöltés…", machineLabel: "A teuteuteu gomb", playAction: "Teuteuteu lejátszása", pauseAction: "Teuteuteu szüneteltetése", counter: "Kattintások világszerte: {count}", statusPlaying: "Lejátszás.", statusPaused: "Szüneteltetve.", statusError: "A hang nem játszható le ezen az eszközön.", support: "Egy teu a tárhelyért?", donors: "Támogatók" },
  ro: { instruction: "Apasă butonul", loading: "Se încarcă…", machineLabel: "Butonul teuteuteu", playAction: "Redă teuteuteu", pauseAction: "Întrerupe teuteuteu", counter: "Clicuri în întreaga lume: {count}", statusPlaying: "Se redă.", statusPaused: "În pauză.", statusError: "Sunetul nu poate fi redat pe acest dispozitiv.", support: "Un teu pentru găzduire?", donors: "Susținători" },
  bg: { instruction: "Натисни бутона", loading: "Зареждане…", machineLabel: "Бутонът teuteuteu", playAction: "Пусни teuteuteu", pauseAction: "Постави teuteuteu на пауза", counter: "Кликвания по света: {count}", statusPlaying: "Възпроизвежда се.", statusPaused: "На пауза.", statusError: "Звукът не може да се възпроизведе на това устройство.", support: "Едно teu за хостинга?", donors: "Поддръжници" },
  el: { instruction: "Πάτησε το κουμπί", loading: "Φόρτωση…", machineLabel: "Το κουμπί teuteuteu", playAction: "Αναπαραγωγή teuteuteu", pauseAction: "Παύση teuteuteu", counter: "Κλικ παγκοσμίως: {count}", statusPlaying: "Αναπαραγωγή.", statusPaused: "Σε παύση.", statusError: "Ο ήχος δεν μπορεί να αναπαραχθεί σε αυτή τη συσκευή.", support: "Ένα teu για τη φιλοξενία;", donors: "Υποστηρικτές" },
  tr: { instruction: "Düğmeye bas", loading: "Yükleniyor…", machineLabel: "Teuteuteu düğmesi", playAction: "Teuteuteu’yu oynat", pauseAction: "Teuteuteu’yu duraklat", counter: "Dünya çapında tıklamalar: {count}", statusPlaying: "Oynatılıyor.", statusPaused: "Duraklatıldı.", statusError: "Ses bu cihazda oynatılamıyor.", support: "Barındırma için bir teu?", donors: "Destekçiler" },
  ru: { instruction: "Нажми на кнопку", loading: "Загрузка…", machineLabel: "Кнопка teuteuteu", playAction: "Включить teuteuteu", pauseAction: "Приостановить teuteuteu", counter: "Нажатий по всему миру: {count}", statusPlaying: "Воспроизведение.", statusPaused: "Пауза.", statusError: "На этом устройстве невозможно воспроизвести звук.", support: "Teu на хостинг?", donors: "Поддержавшие" },
  uk: { instruction: "Натисни кнопку", loading: "Завантаження…", machineLabel: "Кнопка teuteuteu", playAction: "Увімкнути teuteuteu", pauseAction: "Призупинити teuteuteu", counter: "Натискань у всьому світі: {count}", statusPlaying: "Відтворення.", statusPaused: "Пауза.", statusError: "На цьому пристрої неможливо відтворити звук.", support: "Teu на хостинг?", donors: "Підтримали" },
  sv: { instruction: "Tryck på knappen", loading: "Laddar…", machineLabel: "Teuteuteu-knappen", playAction: "Spela teuteuteu", pauseAction: "Pausa teuteuteu", counter: "Klick i hela världen: {count}", statusPlaying: "Spelar.", statusPaused: "Pausad.", statusError: "Ljudet kan inte spelas på den här enheten.", support: "En teu till webbhotellet?", donors: "Supportrar" },
  no: { instruction: "Trykk på knappen", loading: "Laster…", machineLabel: "Teuteuteu-knappen", playAction: "Spill teuteuteu", pauseAction: "Sett teuteuteu på pause", counter: "Klikk over hele verden: {count}", statusPlaying: "Spiller.", statusPaused: "Satt på pause.", statusError: "Lyden kan ikke spilles av på denne enheten.", support: "En teu til driften?", donors: "Støttespillere" },
  da: { instruction: "Tryk på knappen", loading: "Indlæser…", machineLabel: "Teuteuteu-knappen", playAction: "Afspil teuteuteu", pauseAction: "Sæt teuteuteu på pause", counter: "Klik i hele verden: {count}", statusPlaying: "Afspiller.", statusPaused: "På pause.", statusError: "Lyden kan ikke afspilles på denne enhed.", support: "En teu til hosting?", donors: "Støtter" },
  fi: { instruction: "Paina nappia", loading: "Ladataan…", machineLabel: "Teuteuteu-painike", playAction: "Toista teuteuteu", pauseAction: "Keskeytä teuteuteu", counter: "Klikkauksia maailmanlaajuisesti: {count}", statusPlaying: "Toistetaan.", statusPaused: "Keskeytetty.", statusError: "Ääntä ei voi toistaa tällä laitteella.", support: "Teu palvelinkuluihin?", donors: "Tukijat" },
  et: { instruction: "Vajuta nuppu", loading: "Laadimine…", machineLabel: "Teuteuteu nupp", playAction: "Esita teuteuteu", pauseAction: "Peata teuteuteu", counter: "Klõpsud maailmas: {count}", statusPlaying: "Esitamine.", statusPaused: "Peatatud.", statusError: "Sellel seadmel ei saa heli esitada.", support: "Üks teu majutuse jaoks?", donors: "Toetajad" },
  lv: { instruction: "Nospied pogu", loading: "Ielādē…", machineLabel: "Teuteuteu poga", playAction: "Atskaņot teuteuteu", pauseAction: "Pauzēt teuteuteu", counter: "Klikšķi visā pasaulē: {count}", statusPlaying: "Atskaņo.", statusPaused: "Pauzēts.", statusError: "Šajā ierīcē skaņu nevar atskaņot.", support: "Viens teu mitināšanai?", donors: "Atbalstītāji" },
  lt: { instruction: "Paspausk mygtuką", loading: "Įkeliama…", machineLabel: "Teuteuteu mygtukas", playAction: "Paleisti teuteuteu", pauseAction: "Pristabdyti teuteuteu", counter: "Paspaudimai visame pasaulyje: {count}", statusPlaying: "Grojama.", statusPaused: "Pristabdyta.", statusError: "Šiame įrenginyje garso paleisti negalima.", support: "Vienas teu prieglobai?", donors: "Rėmėjai" },
  sl: { instruction: "Pritisni gumb", loading: "Nalaganje…", machineLabel: "Gumb teuteuteu", playAction: "Predvajaj teuteuteu", pauseAction: "Začasno ustavi teuteuteu", counter: "Kliki po vsem svetu: {count}", statusPlaying: "Predvajanje.", statusPaused: "Začasno ustavljeno.", statusError: "Zvoka ni mogoče predvajati v tej napravi.", support: "En teu za gostovanje?", donors: "Podporniki" },
  hr: { instruction: "Pritisni gumb", loading: "Učitavanje…", machineLabel: "Gumb teuteuteu", playAction: "Pokreni teuteuteu", pauseAction: "Pauziraj teuteuteu", counter: "Klikovi diljem svijeta: {count}", statusPlaying: "Reprodukcija.", statusPaused: "Pauzirano.", statusError: "Zvuk se ne može reproducirati na ovom uređaju.", support: "Jedan teu za hosting?", donors: "Podržavatelji" },
  sr: { instruction: "Притисни дугме", loading: "Учитавање…", machineLabel: "Дугме teuteuteu", playAction: "Пусти teuteuteu", pauseAction: "Паузирај teuteuteu", counter: "Кликови широм света: {count}", statusPlaying: "Репродукција.", statusPaused: "Паузирано.", statusError: "Звук се не може репродуковати на овом уређају.", support: "Један teu за хостинг?", donors: "Подржаваоци" },
  bs: { instruction: "Pritisni dugme", loading: "Učitavanje…", machineLabel: "Dugme teuteuteu", playAction: "Pokreni teuteuteu", pauseAction: "Pauziraj teuteuteu", counter: "Klikovi širom svijeta: {count}", statusPlaying: "Reprodukcija.", statusPaused: "Pauzirano.", statusError: "Zvuk se ne može reproducirati na ovom uređaju.", support: "Jedan teu za hosting?", donors: "Podržavaoci" },
  sq: { instruction: "Shtyp butonin", loading: "Duke u ngarkuar…", machineLabel: "Butoni teuteuteu", playAction: "Luaj teuteuteu", pauseAction: "Ndalo përkohësisht teuteuteu", counter: "Klikime në mbarë botën: {count}", statusPlaying: "Po luhet.", statusPaused: "Në pauzë.", statusError: "Zëri nuk mund të luhet në këtë pajisje.", support: "Një teu për hostimin?", donors: "Mbështetësit" },
  ca: { instruction: "Prem el botó", loading: "S’està carregant…", machineLabel: "El botó teuteuteu", playAction: "Reprodueix teuteuteu", pauseAction: "Posa teuteuteu en pausa", counter: "Clics arreu del món: {count}", statusPlaying: "En reproducció.", statusPaused: "En pausa.", statusError: "No es pot reproduir el so en aquest dispositiu.", support: "Un teu per a l’allotjament?", donors: "Col·laboradors" },
  eu: { instruction: "Sakatu botoia", loading: "Kargatzen…", machineLabel: "Teuteuteu botoia", playAction: "Erreproduzitu teuteuteu", pauseAction: "Pausatu teuteuteu", counter: "Klikak mundu osoan: {count}", statusPlaying: "Erreproduzitzen.", statusPaused: "Pausatuta.", statusError: "Ezin da soinua gailu honetan erreproduzitu.", support: "Teu bat ostalaritzarako?", donors: "Babesleak" },
  gl: { instruction: "Preme o botón", loading: "Cargando…", machineLabel: "O botón teuteuteu", playAction: "Reproducir teuteuteu", pauseAction: "Pausar teuteuteu", counter: "Clics en todo o mundo: {count}", statusPlaying: "Reproducindo.", statusPaused: "En pausa.", statusError: "Non se pode reproducir o son neste dispositivo.", support: "Un teu para o aloxamento?", donors: "Apoiantes" },
  ga: { instruction: "Brúigh an cnaipe", loading: "Á lódáil…", machineLabel: "An cnaipe teuteuteu", playAction: "Seinn teuteuteu", pauseAction: "Cuir teuteuteu ar sos", counter: "Cliceanna ar fud an domhain: {count}", statusPlaying: "Ag seinm.", statusPaused: "Ar sos.", statusError: "Ní féidir an fhuaim a sheinm ar an ngléas seo.", support: "Teu don óstáil?", donors: "Lucht tacaíochta" },
  cy: { instruction: "Pwysa’r botwm", loading: "Yn llwytho…", machineLabel: "Y botwm teuteuteu", playAction: "Chwarae teuteuteu", pauseAction: "Oedi teuteuteu", counter: "Cliciau ledled y byd: {count}", statusPlaying: "Yn chwarae.", statusPaused: "Wedi oedi.", statusError: "Ni ellir chwarae’r sain ar y ddyfais hon.", support: "Teu ar gyfer y gwe-letya?", donors: "Cefnogwyr" },
  is: { instruction: "Ýttu á hnappinn", loading: "Hleður…", machineLabel: "Teuteuteu-hnappurinn", playAction: "Spila teuteuteu", pauseAction: "Gera hlé á teuteuteu", counter: "Smellir um allan heim: {count}", statusPlaying: "Spilar.", statusPaused: "Í bið.", statusError: "Ekki er hægt að spila hljóðið í þessu tæki.", support: "Eitt teu fyrir hýsinguna?", donors: "Stuðningsaðilar" },
  mt: { instruction: "Agħfas il-buttuna", loading: "Qed jitgħabba…", machineLabel: "Il-buttuna teuteuteu", playAction: "Doqq teuteuteu", pauseAction: "Waqqaf teuteuteu", counter: "Klikks madwar id-dinja: {count}", statusPlaying: "Qed jindaqq.", statusPaused: "Imwaqqaf.", statusError: "Il-ħoss ma jistax jindaqq fuq dan l-apparat.", support: "Teu għall-hosting?", donors: "Sostenituri" },
  ar: { instruction: "اضغط على الزر", loading: "جارٍ التحميل…", machineLabel: "زر teuteuteu", playAction: "تشغيل teuteuteu", pauseAction: "إيقاف teuteuteu مؤقتًا", counter: "النقرات حول العالم: {count}", statusPlaying: "قيد التشغيل.", statusPaused: "متوقف مؤقتًا.", statusError: "لا يمكن تشغيل الصوت على هذا الجهاز.", support: "هل تساهم بـ teu للاستضافة؟", donors: "الداعمون" },
  he: { instruction: "לחצו על הכפתור", loading: "טוען…", machineLabel: "כפתור teuteuteu", playAction: "הפעלת teuteuteu", pauseAction: "השהיית teuteuteu", counter: "לחיצות ברחבי העולם: {count}", statusPlaying: "מתנגן.", statusPaused: "מושהה.", statusError: "לא ניתן להשמיע את הצליל במכשיר הזה.", support: "teu לאחסון האתר?", donors: "תומכים" },
  fa: { instruction: "دکمه را فشار دهید", loading: "در حال بارگیری…", machineLabel: "دکمهٔ teuteuteu", playAction: "پخش teuteuteu", pauseAction: "توقف موقت teuteuteu", counter: "کلیک‌ها در سراسر جهان: {count}", statusPlaying: "در حال پخش.", statusPaused: "متوقف شده.", statusError: "صدا در این دستگاه قابل پخش نیست.", support: "یک teu برای میزبانی؟", donors: "حامیان" },
  ur: { instruction: "بٹن دبائیں", loading: "لوڈ ہو رہا ہے…", machineLabel: "teuteuteu بٹن", playAction: "teuteuteu چلائیں", pauseAction: "teuteuteu روکیں", counter: "دنیا بھر میں کلکس: {count}", statusPlaying: "چل رہا ہے۔", statusPaused: "رکا ہوا ہے۔", statusError: "اس آلے پر آواز نہیں چلائی جا سکتی۔", support: "ہوسٹنگ کے لیے ایک teu؟", donors: "معاونین" },
  hi: { instruction: "बटन दबाएँ", loading: "लोड हो रहा है…", machineLabel: "teuteuteu बटन", playAction: "teuteuteu चलाएँ", pauseAction: "teuteuteu रोकें", counter: "दुनिया भर में क्लिक: {count}", statusPlaying: "चल रहा है।", statusPaused: "रुका हुआ है।", statusError: "इस डिवाइस पर ध्वनि नहीं चलाई जा सकती।", support: "होस्टिंग के लिए एक teu?", donors: "समर्थक" },
  bn: { instruction: "বোতামটি চাপুন", loading: "লোড হচ্ছে…", machineLabel: "teuteuteu বোতাম", playAction: "teuteuteu চালান", pauseAction: "teuteuteu বিরতি দিন", counter: "বিশ্বজুড়ে ক্লিক: {count}", statusPlaying: "চলছে।", statusPaused: "বিরতিতে।", statusError: "এই ডিভাইসে শব্দ চালানো যাচ্ছে না।", support: "হোস্টিংয়ের জন্য একটি teu?", donors: "সমর্থকেরা" },
  id: { instruction: "Tekan tombolnya", loading: "Memuat…", machineLabel: "Tombol teuteuteu", playAction: "Putar teuteuteu", pauseAction: "Jeda teuteuteu", counter: "Klik di seluruh dunia: {count}", statusPlaying: "Sedang diputar.", statusPaused: "Dijeda.", statusError: "Suara tidak dapat diputar di perangkat ini.", support: "Satu teu untuk hosting?", donors: "Pendukung" },
  ms: { instruction: "Tekan butang", loading: "Memuatkan…", machineLabel: "Butang teuteuteu", playAction: "Mainkan teuteuteu", pauseAction: "Jeda teuteuteu", counter: "Klik di seluruh dunia: {count}", statusPlaying: "Sedang dimainkan.", statusPaused: "Dijeda.", statusError: "Bunyi tidak dapat dimainkan pada peranti ini.", support: "Satu teu untuk pengehosan?", donors: "Penyokong" },
  vi: { instruction: "Nhấn nút", loading: "Đang tải…", machineLabel: "Nút teuteuteu", playAction: "Phát teuteuteu", pauseAction: "Tạm dừng teuteuteu", counter: "Lượt nhấp trên toàn thế giới: {count}", statusPlaying: "Đang phát.", statusPaused: "Đã tạm dừng.", statusError: "Không thể phát âm thanh trên thiết bị này.", support: "Một teu cho phí lưu trữ?", donors: "Người ủng hộ" },
  th: { instruction: "กดปุ่ม", loading: "กำลังโหลด…", machineLabel: "ปุ่ม teuteuteu", playAction: "เล่น teuteuteu", pauseAction: "หยุด teuteuteu ชั่วคราว", counter: "คลิกทั่วโลก: {count}", statusPlaying: "กำลังเล่น", statusPaused: "หยุดชั่วคราว", statusError: "อุปกรณ์นี้ไม่สามารถเล่นเสียงได้", support: "ช่วยค่าโฮสติ้งด้วย teu ไหม?", donors: "ผู้สนับสนุน" },
  ja: { instruction: "ボタンを押して", loading: "読み込み中…", machineLabel: "teuteuteu ボタン", playAction: "teuteuteu を再生", pauseAction: "teuteuteu を一時停止", counter: "世界中のクリック数：{count}", statusPlaying: "再生中。", statusPaused: "一時停止中。", statusError: "この端末では音声を再生できません。", support: "ホスティングに teu を？", donors: "サポーター" },
  ko: { instruction: "버튼을 누르세요", loading: "불러오는 중…", machineLabel: "teuteuteu 버튼", playAction: "teuteuteu 재생", pauseAction: "teuteuteu 일시 정지", counter: "전 세계 클릭 수: {count}", statusPlaying: "재생 중.", statusPaused: "일시 정지됨.", statusError: "이 기기에서는 소리를 재생할 수 없습니다.", support: "호스팅을 위한 teu 하나?", donors: "후원자" },
  "zh-CN": { instruction: "按下按钮", loading: "正在加载…", machineLabel: "teuteuteu 按钮", playAction: "播放 teuteuteu", pauseAction: "暂停 teuteuteu", counter: "全球点击次数：{count}", statusPlaying: "正在播放。", statusPaused: "已暂停。", statusError: "无法在此设备上播放声音。", support: "为托管贡献一个 teu？", donors: "支持者" },
  "zh-TW": { instruction: "按下按鈕", loading: "載入中…", machineLabel: "teuteuteu 按鈕", playAction: "播放 teuteuteu", pauseAction: "暫停 teuteuteu", counter: "全球點擊次數：{count}", statusPlaying: "正在播放。", statusPaused: "已暫停。", statusError: "無法在此裝置上播放聲音。", support: "為主機費用貢獻一個 teu？", donors: "支持者" },
} as const satisfies Record<string, Messages>;

export type SupportedLocale = keyof typeof translations;

const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);
const localeKeys = new Set<string>(Object.keys(translations));

function canonicalTag(value: string): string | null {
  try {
    return Intl.getCanonicalLocales(value.replaceAll("_", "-"))[0] ?? null;
  } catch {
    return null;
  }
}

export function supportedLocale(value: string | null | undefined): SupportedLocale | null {
  if (!value || value.length > 64) return null;
  const canonical = canonicalTag(value.trim());
  if (!canonical) return null;
  if (localeKeys.has(canonical)) return canonical as SupportedLocale;

  const lower = canonical.toLowerCase();
  if (lower === "pt" || lower.startsWith("pt-")) return lower === "pt-br" ? "pt-BR" : "pt-PT";
  if (lower === "zh" || lower.startsWith("zh-")) {
    return /(?:hant|tw|hk|mo)(?:-|$)/i.test(canonical) ? "zh-TW" : "zh-CN";
  }

  const base = canonical.split("-")[0].toLowerCase();
  return localeKeys.has(base) ? (base as SupportedLocale) : null;
}

export function resolveAcceptLanguage(header: string | null | undefined): SupportedLocale {
  if (!header) return "en";
  const candidates = header
    .slice(0, 1024)
    .split(",")
    .map((part, index) => {
      const [tag, ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { tag, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ tag, quality }) => tag !== "*" && quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const candidate of candidates) {
    const locale = supportedLocale(candidate.tag);
    if (locale) return locale;
  }
  return "en";
}

export function messagesFor(locale: SupportedLocale): Messages {
  return translations[locale];
}

export function directionFor(locale: SupportedLocale): TextDirection {
  return RTL_LANGUAGES.has(locale.split("-")[0]) ? "rtl" : "ltr";
}

export function interpolate(message: string, values: Record<string, string>): string {
  return message.replace(/\{([a-z]+)\}/gi, (placeholder, key: string) => values[key] ?? placeholder);
}

export const supportedLocales = Object.freeze(Object.keys(translations) as SupportedLocale[]);
