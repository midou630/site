// العناصر
const fileInput = document.getElementById('fileInput');
const passwordInput = document.getElementById('password');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const shareBtn = document.getElementById('shareBtn');
const encryptShareBtn = document.getElementById('encryptShareBtn');
const statusBox = document.getElementById('status');

// ✅ تشفير وتحميل مع التوقيع
encryptBtn.addEventListener('click', () => {
  if (!fileInput.files[0] || !passwordInput.value) {
    statusBox.textContent = '❌ اختر ملفًا وأدخل الرمز السري.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileData = e.target.result;
    const wordArray = CryptoJS.lib.WordArray.create(fileData);

    // ✨ إضافة توقيع قبل البيانات
    const sign = "MYAPP|";
    const combined = sign + CryptoJS.enc.Base64.stringify(wordArray);

    const encrypted = CryptoJS.AES.encrypt(combined, passwordInput.value).toString();
    const blob = new Blob([encrypted], { type: "text/plain" });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileInput.files[0].name + '.enc';
    link.click();

    statusBox.textContent = '✅ تم تشفير الملف وتحميله.';
  };
  reader.readAsArrayBuffer(fileInput.files[0]);
});

// ✅ فك التشفير مع التحقق من التوقيع
decryptBtn.addEventListener('click', () => {
  if (!fileInput.files[0] || !passwordInput.value) {
    statusBox.textContent = '❌ اختر الملف المشفر وأدخل الرمز السري.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const encryptedString = e.target.result;

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedString, passwordInput.value).toString(CryptoJS.enc.Utf8);

      // ✨ تحقق من التوقيع
      if (!decrypted.startsWith("MYAPP|")) {
        statusBox.textContent = '❌ الرمز السري خاطئ!';
        return;
      }

      // ✅ إزالة التوقيع وتحويل Base64 إلى Uint8Array
      const base64Data = decrypted.slice(6);
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      // 🗃️ إنشاء الملف
      const blob = new Blob([byteArray]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileInput.files[0].name.replace('.enc', '');
      link.click();

      statusBox.textContent = '✅ تم فك التشفير وتحميل الملف.';
    } catch (err) {
      statusBox.textContent = '❌ الرمز السري خاطئ أو الملف تالف.';
      console.error(err);
    }
  };

  reader.readAsText(fileInput.files[0]);
});

// ✅ مشاركة ملف مشفر موجود
shareBtn.addEventListener('click', () => {
  if (!fileInput.files[0]) {
    statusBox.textContent = '❌ اختر الملف المشفر أولاً.';
    return;
  }

  const file = fileInput.files[0];
  const pageUrl = window.location.href;

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: '🔐 ملف مشفر',
      text: `استخدم أداتنا لفك التشفير: ${pageUrl}`,
      files: [file],
    }).then(() => {
      statusBox.textContent = '✅ تمت المشاركة بنجاح!';
    }).catch((err) => {
      console.error(err);
      statusBox.textContent = '❌ حدث خطأ أثناء المشاركة.';
    });
  } else {
    statusBox.innerHTML = `❌ جهازك لا يدعم المشاركة التلقائية.<br>انسخ الرابط يدويًا: <a href="${pageUrl}" target="_blank">${pageUrl}</a>`;
  }
});

// ✅ تشفير ومشاركة في خطوة واحدة
encryptShareBtn.addEventListener('click', () => {
  if (!fileInput.files[0] || !passwordInput.value) {
    statusBox.textContent = '❌ اختر ملفًا وأدخل الرمز السري.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileData = e.target.result;
    const wordArray = CryptoJS.lib.WordArray.create(fileData);

    // ✨ إضافة توقيع قبل التشفير
    const sign = "MYAPP|";
    const combined = sign + CryptoJS.enc.Base64.stringify(wordArray);

    const encrypted = CryptoJS.AES.encrypt(combined, passwordInput.value).toString();
    const blob = new Blob([encrypted], { type: "text/plain" });
    const fileToShare = new File([blob], fileInput.files[0].name + '.enc', { type: "text/plain" });

    const pageUrl = window.location.href;

    if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
      navigator.share({
        title: '🔐 ملف مشفر',
        text: `استخدم أداتنا لفك التشفير: ${pageUrl}`,
        files: [fileToShare],
      }).then(() => {
        statusBox.textContent = '✅ تمت المشاركة بنجاح!';
      }).catch((err) => {
        console.error(err);
        statusBox.textContent = '❌ حدث خطأ أثناء المشاركة.';
      });
    } else {
      statusBox.innerHTML = `❌ جهازك لا يدعم المشاركة التلقائية.<br>انسخ الرابط يدويًا: <a href="${pageUrl}" target="_blank">${pageUrl}</a>`;
    }
  };
  reader.readAsArrayBuffer(fileInput.files[0]);
});
