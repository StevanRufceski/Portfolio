// -----kreiranje katalozi-----
function createSectionStructure (manufacturer, catalog, popover) {
    let newSection = document.createElement(`section`);
    newSection.id = idFromTitle(manufacturer);
    document.getElementsByClassName(`catalogsStart`)[0].appendChild(newSection);
    let newH2 = document.createElement(`h2`);
    newH2.className = "sticky-md-top fw-bold pt-3 pt-md-5 pb-2 pb-md-3";
    newH2.id = `${idFromTitle(manufacturer)}h2`;
    newH2.innerText = manufacturer;

    newH2.style.display = `none`

    document.getElementById(`${idFromTitle(manufacturer)}`).appendChild(newH2);

    for (let j=0; j<catalog.length; j++){
        createArticleStructure(manufacturer, catalog[j], j+1)
    }
    integrateButton(manufacturer, catalog, popover)

}
function createArticleStructure(manufacturer, catalog, n){
    let newArticle = document.createElement(`article`);
    newArticle.className = "my-3";
    newArticle.id = `${idFromTitle(manufacturer)}${n}`

    newArticle.style.display = `none`

    document.getElementById(`${idFromTitle(manufacturer)}`).appendChild(newArticle);
    let newDivOne = document.createElement(`div`);
    newDivOne.className = "bd-heading sticky-md-top align-self-start mt-5 mb-3 mt-md-0 mb-md-2";
    newDivOne.id = `${idFromTitle(manufacturer)}${n}divOne`
    document.getElementById(`${idFromTitle(manufacturer)}${n}`).appendChild(newDivOne);
    let newH3 = document.createElement(`h3`);
    newH3.innerText = trimTitle(catalog)
    document.getElementById(`${idFromTitle(manufacturer)}${n}divOne`).appendChild(newH3);
    let newA1 = document.createElement(`a`);
    newA1.innerText = "На почеток"
    newA1.className = "d-flex align-items-center"
    newA1.href = `#top`
    document.getElementById(`${idFromTitle(manufacturer)}${n}divOne`).appendChild(newA1);
    let newDivTwo = document.createElement(`div`);
    newDivTwo.className = `${idFromTitle(manufacturer)}divTwo`
    newDivTwo.id = `${idFromTitle(manufacturer)}${n}divTwo`
    document.getElementById(`${idFromTitle(manufacturer)}${n}`).appendChild(newDivTwo);
}
// ------ kreiranje side menu -------------
function integrateButton (manufacturer, catalog, popover) {
    let newLiUpper = document.createElement(`li`);
    newLiUpper.className = "my-2 popover-wrapper mt-0 mb-0";
    newLiUpper.id = `${idFromTitle(manufacturer)}li`;
    document.getElementsByClassName(`sideButtonsStart`)[0].appendChild(newLiUpper);
    let newButton = document.createElement(`button`);
    newButton.type = "button";
    newButton.className = "btn d-inline-flex align-items-center collapsed border-0";
    newButton.id = (`${idFromTitle(manufacturer)}Btn`);
    newButton.type = `button`
    newButton.setAttribute('data-bs-toggle', 'collapse');
    newButton.setAttribute('aria-expanded', 'false');
    newButton.setAttribute('data-bs-target', `#${idFromTitle(manufacturer)}-collapse`);
    newButton.setAttribute('aria-controls', `${idFromTitle(manufacturer)}-collapse`);
    newButton.innerText = manufacturer;
    document.getElementById(`${idFromTitle(manufacturer)}li`).appendChild(newButton);
    let newDiv = document.createElement(`div`);
    newDiv.className = "popover-content";
    newDiv.id = `${idFromTitle(manufacturer)}div`;
    document.getElementById(`${idFromTitle(manufacturer)}li`).appendChild(newDiv);
    let newP = document.createElement(`p`);
    newP.innerText = popover;
    document.getElementById(`${idFromTitle(manufacturer)}div`).appendChild(newP);
    let newUl = document.createElement(`ul`);
    newUl.className = `list-unstyled ps-3 collapse`;
    newUl.id = `${idFromTitle(manufacturer)}-collapse`;
    document.getElementById(`${idFromTitle(manufacturer)}li`).appendChild(newUl);

    for (let j=1; j<catalog.length+1; j++){
        integrateMenu(manufacturer, catalog[j-1], j, newUl.id)
    }
}
function integrateMenu(manufacturer, catalog, n, ul){
    let newLiDowner = document.createElement(`li`);
    newLiDowner.id = `${idFromTitle(manufacturer)}${n}li`
    document.getElementById(ul).appendChild(newLiDowner);
    let newA = document.createElement(`a`);
    newA.className = `d-inline-flex align-items-center rounded text-decoration-none`;
    newA.id = `${idFromTitle(manufacturer)}${n}A`
    newA.innerText = trimTitle (catalog)
    newA.href = `#${idFromTitle(manufacturer)}${n}`
    document.getElementById(`${idFromTitle(manufacturer)}${n}li`).appendChild(newA);

    let loadPdfBtn = document.getElementById(`${idFromTitle(manufacturer)}${n}A`);
    loadPdfBtn.addEventListener("click", function(){

        document.getElementById(`${idFromTitle(manufacturer)}${n}`).style.display = `grid`
        document.getElementById(`${idFromTitle(manufacturer)}h2`).style.display = `block`

        let newObject = document.createElement('object');
        newObject.className = "pdff";
        newObject.id = `${idFromTitle(manufacturer)}${n}idBtn`;
        newObject.type = "application/pdf";
        newObject.data = `katalozi/${manufacturer}/${catalog}.pdf`;

        document.getElementsByClassName(`${idFromTitle(manufacturer)}divTwo`)[n-1].appendChild(newObject);
    })
}
// ---------- basic, samo objects vo articles da se stavaat-----
function trimTitle (catalogName) {
    let array = catalogName.split(" ")
    let slicedArray = array.slice(2,array.length);
    let trimmedTitle = slicedArray.join(" ");
    return trimmedTitle
}
function idFromTitle (title){
    let array = title.split(" ")
    let titleId = (array.join("")).toLowerCase();
    return titleId;
}
let pFooter = document.getElementById('pFooter');
const currentYear = new Date().getFullYear();
pFooter.innerText = `\u00A9 Сите права задржани ${currentYear} Tехнохаус ДООЕЛ`

let manufacturersNames = ["Ceta Form", "Kronus", "Unior", "Insize", "Keil", "Kern", "Kocel", "Volkel", "Rodcraft", "Piher", "Altec"]

let popoverCetaForm = "This is the popover CETA FORM! This is the popover CETA FORM! This is the popover CETA FORM!"
let catalogsCetaform = ["CF 1. Кутии и колички за алат", "CF 2. Клучеви и имбуси", "CF 3. Насадни клучеви и додатоци", "CF 4. Момент клучеви", "CF 5. Штрафцигери и битови", "CF 6. Клешти и секачи", "CF 7. VDE Изолиран 1000 V алат и мултимери", "CF 8. Штрафцигери и клешти за електроника", "CF 9. Водоводџиски алат", "CF 10. Алат за сечење", "CF 11. Чекани и длета", "CF 12. Специјален алат за автомобили", "CF 13. Мерни инструменти", "CF 14. Алати за одржување"]

let popoverKronus = "This is the popover KRONUS! This is the popover KRONUS! This is the popover KRONUS!"
let catalogsKronus = ["Kronus 1. Клучеви", "Kronus 2. Насадни клучеви, сетови и прибор", "Kronus 3. Клешти", "Kronus 4. Секачи, ножеви и скалпери", "Kronus 5. Одвртувачи", "Kronus 6. Метра и маркери", "Kronus 7. Бонсеци и змби", "Kronus 8. Чекани и секири", "Kronus 9. Хебли, мистрии и копачи", "Kronus 10. Менгемиња", "Kronus 11. Алат за водовод", "Kronus 12. Подмачкувачи", "Kronus 13. Торби, држачи и кутии за алат", "Kronus 14. Битови и додатоци"]

let popoverUnior = "This is the popover UNIOR! This is the popover UNIOR! This is the popover UNIOR!"
let catalogsUnior = ["Unior 1. Клучеви", "Unior 2. Насадни клучеви и дополнителни делови", "Unior 3. Клешти", "Unior 4. Сечење кабли, алати за соголување на жици и кримп клешти", "Unior 5. Изолирани алати", "Unior 6. Ножици", "Unior 7. Одвртувачи", "Unior 8. Извлекувачи", "Unior 9. Чекани, Пробивачи и Длета", "Unior 10. Опрема за во работилница", "Unior 11. Пневматски алати", "Unior 12. Контролни и мерни алати", "Unior 13. Алати за сервисирање на велосипеди", "Unior 14. Алати за мотори", "Unior 15. Дополнителни разни алати", "Unior 16. Алат за работа на висина", "Unior 17. Гарнитури алати"]

let popoverInsize = "This is the popover INSIZE! This is the popover INSIZE! This is the popover INSIZE!"
let catalogsInsize = ["Insize 1. Експорт на податоци и софтвер", "Insize 2. Шублери", "Insize 3. Мерачи на длабочина", "Insize 4. Мерачи на висина", "Insize 5. Компаратори", "Insize 6. Микрометри", "Insize 7. Мерачи на дијаметар и опсег на отвори", "Insize 8. Мерачи на радиус на лак", "Insize 9. Мерачи на жлебови за клучеви", "Insize 10. Мерачи на косини", "Insize 11. Индикатори, линеарни мерила, држачи за индикатори", "Insize 12. Различни мерни инструменти со индикатор", "Insize 13. Мерачи на навои на цевки", "Insize 14. Стандарди и мерни блокови", "Insize 15. Мерачи на агол, правост, рамнина", "Insize 16. Тестери за концентричност и биење", "Insize 17. Едноставни мерни алати", "Insize 18. Прибор за поставување", "Insize 19. Машински мерачи", "Insize 20. Рачни и машински либели", "Insize 21. Линеари, дигитални индикатори, воздушни мерила, тестери за истекување на воздух, ласерски скен микрометри, спектрометри", "Insize 22. Разновидни детектори", "Insize 23. CMM - координатни мерни машини", "Insize 24. Профил проектори, системи за брзо мерење, визуелни мерни системи", "Insize 25. Микроскопи, лупи", "Insize 26. Видеоскопи", "Insize 27. Мерачи на наслаги", "Insize 28. Преносливи инструменти", "Insize 29. Електронско тестирање", "Insize 30. Мерачи на температура и влажност", "Insize 31. Мерачи за кружност, профил и рапавост", "Insize 32. Мерачи за тврдина", "Insize 33. Подготовка за металографија", "Insize 34. Мерачи на силина", "Insize 35. Мерачи на вртежен момент, клучеви за вртежен момент", "Insize 36. Ваги", "Insize 37. Мерач на спреј на сол, комори за температура и влажност"]

let popoverKeil = "This is the popover KEIL! This is the popover KEIL! This is the popover KEIL!"
let catalogsKeil = ["Keil 1. Бургии за електропневматски чекан", "Keil 2. Длета", "Keil 3. Бургии за вибрациона дупчалка", "Keil 4. Бургии за метал", "Keil 5. Бургии за дрво", "Keil 6. Пили", "Keil 7. Комплети", "Keil 8. Продажни модули"]

let popoverKern = "This is the popover KERN! This is the popover KERN! This is the popover KERN!"
let catalogsKern = ["Kern 1. Дијамантски пили", "Kern 2. Дијамантски алат за брусење", "Kern 3. Дијамантски прстени за сечење", "Kern 4. Дијамантски круни за суво бушење", "Kern 5. Дијамантски круни за водено бушење", "Kern 6. Круни и алат за обработка на плочки", "Kern 7. Дупчалки за бушење со круни", "Kern 8. Додатоци", "Kern 9. Машини за сечење"]

let popoverKocel = "This is the popover KOCEL! This is the popover KOCEL! This is the popover KOCEL!"
let catalogsKocel = ["Kocel 1. Кабинети со фиоки", "Kocel 2. Кабинети за CNC алати", "Kocel 3. Кабинети за компјутерска работа", "Kocel 4. Индустриски кабинети", "Kocel 5. Кабинети за материјали", "Kocel 6. Ормари за лична заштитна опрема", "Kocel 7. LinBin системи за складирање", "Kocel 8. Работни маси", "Kocel 9. Мобилни работни маси", "Kocel 10. Колички за ракување и алати", "Kocel 11. Прибор за работни маси", "Kocel 12. Сталажи", "Kocel 13. Додатоци и етикетирање"]

let popoverVolkel = "This is the popover VOLKEL! This is the popover VOLKEL! This is the popover VOLKEL!"
let catalogsVolkel = ["Volkel 1. Држачи за врезници и нарезници", "Volkel 2. Рачни врезници", "Volkel 3. Кратки машински врезници", "Volkel 4. Шестоаголни врезници, битови и комбинирани врезници", "Volkel 5. Машински врезници", "Volkel 6. Машински врезници со обоен прстен", "Volkel 7. Безжлебни врезници (формирачки)", "Volkel 8. Машински врезници со навртки", "Volkel 9. Тркалезни и шестоаголни нарезници", "Volkel 10. Комплети врезници и нарезници", "Volkel 11. Алат за поправка на навој"]

let popoverRodcraft = "This is the popover RODCRAFT! This is the popover RODCRAFT! This is the popover RODCRAFT!"
let catalogsRodcraft = ["Rodcraft 1. Батериски производи", "Rodcraft 2. Пневматски одвртувачи", "Rodcraft 3. Моментни клучеви и прибор", "Rodcraft 4. Крцкалки", "Rodcraft 5. Rodflex-алати", "Rodcraft 6. Мини алати", "Rodcraft 7. Пневматски дупчалки и одвртувачи", "Rodcraft 8. Пневматски чекани и прибор", "Rodcraft 9. Пневматски брусалки", "Rodcraft 10. Мулти-брусалка MBX", "Rodcraft 11. Пневматски полирки", "Rodcraft 12. Пневматски алати за сечење", "Rodcraft 13. Пневматски поп-клешти", "Rodcraft 14. Други пневматски алати", "Rodcraft 15. Стартери", "Rodcraft 16. Дигалки за автомобили", "Rodcraft 17. Опрема за работилница", "Rodcraft 18. Преси за работилница", "Rodcraft 19. Додатоци за воздушни линии"]

let popoverPiher = "This is the popover PIHER! This is the popover PIHER! This is the popover PIHER!"
let catalogsPiher = ["Piher 1. Телескопски потпирачи", "Piher 2. Мултистеги", "Piher 3. Стеги - MAXIPRESS", "Piher 4. Мали стеги", "Piher 5. Класични стеги", "Piher 6. Професионални G стеги", "Piher 7. Паралелни вилични стеги", "Piher 8. Лесни стеги", "Piher 9. Еднорачни стеги", "Piher 10. Стеги со лостови - LE VER", "Piher 11. Стеги за дупки и водилки", "Piher 12. Стеги со пружини", "Piher 13. Рачни стеги за притисок", "Piher 14. Челични стеги за рамки", "Piher 15. Стеги со ремен", "Piher 16. Штрафови за стеги", "Piher 17. Аголни стеги", "Piher 18. Менгеме стеги", "Piher 19. Стеги за работа на метални и дрвени маси со дупки", "Piher 20. Стеги за дрвена маса", "Piher 21. TGA · Грип-стеги", "Piher 22. TS · Универзални завртки и стопирачки", "Piher 23. TCS · Стеги и позиционери за маси со дупки", "Piher 24. Брзи стеги", "Piher 25. Грип клешти", "Piher 26. Магнетни прибор за заварување", "Piher 27. Вакум рачки", "Piher 28. Подигнувачи и транспортери", "Piher 29. Платформи за пилирање", "Piher 30. Изложбени полици"]

let popoverAltec = "This is the popover ALTEC! This is the popover ALTEC! This is the popover ALTEC!"
let catalogsAltec = ["Altec 1. Серија скелиња ALTEC", "Altec 2. Работни висини и работни површини на нашите скелиња", "Altec 3. MySelf-Tower: Систем за монтажа од едно лице", "Altec 4. Rollfix Скеле „направи сам“", "Altec 5. Rollfix Classic & Slim верзија", "Altec 6. Делови за MySelf-Tower & Rollfix", "Altec 7. AluKlik Мобилно склопливо скеле", "Altec 8. AluKlik Classic & Slim верзија", "Altec 9. AluKlik Eco (70)", "Altec 10. AluDeck Професионална и „направи сам“ платформа", "Altec 11. Делови за AluKlik & AluDeck", "Altec 12. AluLight Професионално подвижно скеле", "Altec 13. AluLight Classic & Slim верзија", "Altec 14. AluLight S-Двојна ограда", "Altec 15. AluLight Професионално подвижно скеле со скали", "Altec 16. Делови за AluLight", "Altec 17. AluSteg - мостови за скелиња"]

let manufacturersCatalogs = [catalogsCetaform, catalogsKronus, catalogsUnior, catalogsInsize, catalogsKeil, catalogsKern, catalogsKocel, catalogsVolkel, catalogsRodcraft, catalogsPiher, catalogsAltec]
let manufacturersPopovers = [popoverCetaForm, popoverKronus, popoverUnior, popoverInsize, popoverKeil, popoverKern, popoverKocel, popoverVolkel, popoverRodcraft, popoverPiher, popoverAltec]

for (let i=0; i<manufacturersCatalogs.length; i++) {
    createSectionStructure (manufacturersNames[i], manufacturersCatalogs[i], manufacturersPopovers[i]);
}



