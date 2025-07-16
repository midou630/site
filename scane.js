// crypto.js

// شيفرة AES باستخدام مكتبة CryptoJS

const fileInput = document.getElementById('fileInput');
const passwordInput = document.getElementById('password');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const statusBox = document.getElementById('status');

encryptBtn.addEventListener('click', () => {
  if (!fileInput.files[0] || !passwordInput.value) {
    statusBox.textContent = 'يرجى اختيار الملف وإدخال الرمز السري.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileData = e.target.result;
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    const encrypted = CryptoJS.AES.encrypt(wordArray, passwordInput.value).toString();
    const blob = new Blob([encrypted]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileInput.files[0].name + '.enc';
    link.click();
    statusBox.textContent = '✅ تم تشفير الملف وتحميله.';
  };
  reader.readAsArrayBuffer(fileInput.files[0]);
});

decryptBtn.addEventListener('click', () => {
  if (!fileInput.files[0] || !passwordInput.value) {
    statusBox.textContent = 'يرجى اختيار الملف المشفر وإدخال الرمز السري.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const encrypted = e.target.result;
    try {
      const decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Latin1.parse(encrypted), passwordInput.value);
      const typedArray = new Uint8Array(decrypted.words.map(word => [(word >> 24) & 0xff, (word >> 16) & 0xff, (word >> 8) & 0xff, word & 0xff]).flat());
      const blob = new Blob([typedArray]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileInput.files[0].name.replace('.enc', '');
      link.click();
      statusBox.textContent = '✅ تم فك التشفير وتحميل الملف.';
    } catch (err) {
      statusBox.textContent = '❌ الرمز السري خاطئ أو الملف تالف.';
    }
  };
  reader.readAsText(fileInput.files[0]);
});
const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', () => {
  if (!fileInput.files[0]) {
    statusBox.textContent = '❌ يرجى اختيار الملف المشفر أولاً.';
    return;
  }

  const file = fileInput.files[0];
  const fileName = file.name;
  const pageUrl = window.location.href;

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: 'ملف مشفر 🔐',
      text: `إليك الملف المشفر. لفك التشفير استخدم أداتنا هنا: ${pageUrl}`,
      files: [file]
    })
    .then(() => {
      statusBox.textContent = '✅ تمت المشاركة بنجاح!';
    })
    .catch((error) => {
      statusBox.textContent = '❌ حدث خطأ أثناء المشاركة.';
      console.error(error);
    });
  } else {
    statusBox.innerHTML = `
      ❌ جهازك لا يدعم المشاركة التلقائية.<br>
      انسخ الرابط يدويًا: <a href="${pageUrl}" target="_blank">${pageUrl}</a>
    `;
  }
});
