const services = {
    "Remote Legal Consultation": { url: "service-index/cons.html", icon: "bx bx-right-arrow-alt" },
    "Mobile Office Consultation": { url: "service-index/cons-remot.html", icon: "bx bx-right-arrow-alt" },
    "Request to Establish a New Company": { url: "service-index/request.html", icon: "bx bx-right-arrow-alt" },
    "Internal Corruption Investigation": { url: "service-index/cora.html", icon: "bx bx-right-arrow-alt" },
    "Corporate Legal Rescue": { url: "service-index/is3af.html", icon: "bx bx-right-arrow-alt" }
};

const searchBox = document.getElementById("searchBox");
const suggestionsBox = document.getElementById("suggestions");

let index = 0;
let charIndex = 0;
let isDeleting = false;
let isUserTyping = false;
let servicesArray = Object.keys(services);

function typeEffect() {
    if (isUserTyping) return; // إيقاف التأثير عند الكتابة اليدوية

    let currentService = servicesArray[index];
    let currentIcon = services[currentService].icon;

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    let displayText = currentService.substring(0, charIndex);

    // إضافة الأيقونة بجانب النص في مربع البحث أثناء التأثير
    searchBox.placeholder = displayText;
    searchBox.dataset.icon = currentIcon;

    if (!isDeleting && charIndex === currentService.length + 1) {
        isDeleting = true;
        setTimeout(typeEffect, 1000);
    } else if (isDeleting && charIndex === -1) {
        isDeleting = false;
        index = (index + 1) % servicesArray.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

typeEffect();

// عند التركيز على مربع البحث، يتم إيقاف التأثير
searchBox.addEventListener("focus", function () {
    isUserTyping = true;
    searchBox.placeholder = "";
    searchBox.value = "";
});

// عند فقدان التركيز، يتم إعادة التأثير إذا لم يكتب المستخدم شيئًا
searchBox.addEventListener("blur", function () {
    if (searchBox.value.trim() === "") {
        isUserTyping = false;
        setTimeout(typeEffect, 1000);
    }
});

// البحث وإظهار القائمة مع الأيقونات
searchBox.addEventListener("input", function () {
    isUserTyping = true;
    let inputValue = searchBox.value.trim();

    let filteredServices = servicesArray.filter(service =>
        service.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    suggestionsBox.innerHTML = "";

    if (inputValue && filteredServices.length > 0) {
        suggestionsBox.style.display = "block";
        filteredServices.forEach(service => {
            let listItem = document.createElement("li");

            // إضافة الأيقونة بجانب اسم الخدمة
            listItem.innerHTML = `<i class='${services[service].icon}'></i> ${service}`;

            listItem.addEventListener("click", function () {
                window.location.href = services[service].url;
            });

            suggestionsBox.appendChild(listItem);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
});

searchBox.addEventListener("blur", function () {
    setTimeout(() => { suggestionsBox.style.display = "none"; }, 200);
});
