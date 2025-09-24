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
let catalogsCetaform = ["CF 1. TOOL CONTAINERS AND ASSORTMENTS", "CF 2. WRENCHES AND HEX KEYS", "CF 3. SOCKETS AND ACCESSORIES", "CF 4. TORQUE WRENCHES", "CF 5. SCREWDRIVERS AND BITS", "CF 6. PLIERS AND CUTTERS", "CF 7. VDE 1000V INSULATED TOOLS AND MULTIMETERS", "CF 8. ELECTRONIC SCREWDRIVERS AND PLIERS", "CF 9. PLUMBING TOOLS", "CF 10. CUTTING TOOLS AND FILES", "CF 11. HAMMERS AND CHISELS", "CF 12. SPECIALIST AUTOMOTIVE TOOLS", "CF 13. MEASURING TOOLS", "CF 14. GENERAL MAINTENANCE AND WORKSHOP TOOLS"]

let popoverKronus = "This is the popover KRONUS! This is the popover KRONUS! This is the popover KRONUS!"
let catalogsKronus = ["Kronus 1. Wrenches", "Kronus 2. Sockets, socket sets and accessories", "Kronus 3. Pliers", "Kronus 4. Cutters, Knives, Scalpels", "Kronus 5. Screwdivers", "Kronus 6. Measuring instruments", "Kronus 7. Saws, Perforating punches", "Kronus 8. Hammers, Axes", "Kronus 9. Levers, Trowels, Pickaxes", "Kronus 10. Vices", "Kronus 11. Plumbing tools", "Kronus 12. Grease Pipes", "Kronus 13. Bags, Holders, Boxes", "Kronus 14. Bits and accessories"]

let popoverUnior = "This is the popover UNIOR! This is the popover UNIOR! This is the popover UNIOR!"
let catalogsUnior = ["Unior 1. Клучеви", "Unior 2. Насадни клучеви и дополнителни делови", "Unior 3. Клешти", "Unior 4. Сечење кабли, алати за соголување на жици и кримп клешти", "Unior 5. Изолирани алати", "Unior 6. Ножици", "Unior 7. Одвртувачи", "Unior 8. Извлекувачи", "Unior 9. Чекани, Пробивачи и Длета", "Unior 10. Опрема за во работилница", "Unior 11. Пневматски алати", "Unior 12. Контролни и мерни алати", "Unior 13. Алати за сервисирање на велосипеди", "Unior 14. Алати за мотори", "Unior 15. Дополнителни разни алати", "Unior 16. Алат за работа на висина", "Unior 17. Гарнитури алати"]

let popoverInsize = "This is the popover INSIZE! This is the popover INSIZE! This is the popover INSIZE!"
let catalogsInsize = ["Insize 1. DATA OUTPUT AND SOFTWARE", "Insize 2. CALIPERS", "Insize 3. DEPTH MEASUREMENT", "Insize 4. HEIGHT MEASUREMENT", "Insize 5. COMPARISON INSTRUMENTS", "Insize 6. MICROMETERS", "Insize 7. BORE DIAMETER, CIRCUMFERENCE MEASUREMENT", "Insize 8. ARC RADIUS MEASUREMENT", "Insize 9. KEYWAY MEASUREMENT", "Insize 10. CHAMFER MEASUREMENT", "Insize 11. INDICATORS, LINEAR GAGES, DIAL INDICATOR STANDS", "Insize 12. INDICATING MEASURING INSTRUMENTS", "Insize 13. PETROLEUM PIPE THREAD MEASUREMENT", "Insize 14. STANDARDS AND GAGE BLOCKS", "Insize 15. ANGLE, STRAIGHTNESS, FLATNESS MEASUREMENT", "Insize 16. CONCENTRICITY AND RUNOUT TESTERS", "Insize 17. SIMPLE MEASURING TOOLS", "Insize 18. SET-UP TOOLS", "Insize 19. ON-MACHINE MEASUREMENT", "Insize 20. LEVELS", "Insize 21. LINEAR SCALES, DIGITAL READOUTS, AIR GAGES, AIR LEAKAGE TESTER, LASER SCAN MICROMETERS, SPECTROMETERS, TOOL PRESETTERS", "Insize 22. FLAW DETECTORS", "Insize 23. CMM", "Insize 24. PROFILE PROJECTORS, QUICK MEASUREMENT SYSTEMS, VISION MEASURING SYSTEMS", "Insize 25. MICROSCOPES, MAGNIFIERS", "Insize 26. VIDEOSCOPES", "Insize 27. COATING INSPECTION", "Insize 28. PORTABLE INSTRUMENTS", "Insize 29. ELECTRONIC TESTING", "Insize 30. TEMPERATURE AND HUMIDITY MEASUREMENT", "Insize 31. ROUNDNESS, PROFILE AND ROUGHNESS TESTERS", "Insize 32. HARDNESS TESTERS", "Insize 33. METALLOGRAPHY PREPARATION", "Insize 34. TESTING MACHINES, FORCE GAGES", "Insize 35. TORQUE TESTERS TORQUE WRENCHES", "Insize 36. SCALES", "Insize 37. SALT SPRAY TESTERS, TEMPERATURE AND HUMIDITY CHAMBERS"]

let popoverKeil = "This is the popover KEIL! This is the popover KEIL! This is the popover KEIL!"
let catalogsKeil = ["Keil 1. HAMMER DRILL BITS", "Keil 2. CHISELS", "Keil 3. STONE AND SPECIAL DRILL BITS", "Keil 4. METAL DRILL BITS", "Keil 5. WOOD DRILL BITS", "Keil 6. SAWS", "Keil 7. ASSORTMENTS", "Keil 8. MODULES"]

let popoverKern = "This is the popover KERN! This is the popover KERN! This is the popover KERN!"
let catalogsKern = ["Kern 1. Diamond saw blades", "Kern 2. Diamond Grinding tools", "Kern 3. Diamond Cutting rings", "Kern 4. Dry Core drills", "Kern 5. Wet Core Drills", "Kern 6. Tile Processing", "Kern 7. Core Drilling Equipment", "Kern 8. Accessories", "Kern 9. Cutting Machines"]

let popoverKocel = "This is the popover KOCEL! This is the popover KOCEL! This is the popover KOCEL!"
let catalogsKocel = ["Kocel 1. Drawer Cabinets", "Kocel 2. CNC Tool Cabinets", "Kocel 3. Computer Working Cabinets", "Kocel 4. Industrial Cabinets", "Kocel 5. Material Cabinets", "Kocel 6. PPE Lockers", "Kocel 7. LinBin Systems", "Kocel 8. Workbenches", "Kocel 9. Mobile Workbenches", "Kocel 10. Handling and Tool Carts", "Kocel 11. Pegboards", "Kocel 12. Shelf Systems", "Kocel 13. Accessory and Labelling"]

let popoverVolkel = "This is the popover VOLKEL! This is the popover VOLKEL! This is the popover VOLKEL!"
let catalogsVolkel = ["Volkel 1. Tap Wrenchers", "Volkel 2. Hand Taps", "Volkel 3. Short Machine Taps", "Volkel 4. HexTap, Bits and Combined Taps", "Volkel 5. Machine Taps", "Volkel 6. Machine Taps with Coloured Ring", "Volkel 7. Fluteless (Forming) Taps", "Volkel 8. Machine Nut Taps", "Volkel 9. Round Dies and Hexagon Die Nuts", "Volkel 10. Tap & Die Sets"]

let popoverRodcraft = "This is the popover RODCRAFT! This is the popover RODCRAFT! This is the popover RODCRAFT!"
let catalogsRodcraft = ["Rodcraft 1. Battery products", "Rodcraft 2. Impact wrenches", "Rodcraft 3. Torque wrenches & sockets", "Rodcraft 4. Ratchets", "Rodcraft 5. Rodflex-Tools", "Rodcraft 6. Mini tools", "Rodcraft 7. Drills & screwdrivers", "Rodcraft 8. Chisel hammers & needle scalers", "Rodcraft 9. Sanders", "Rodcraft 10. MBX Multi Sander", "Rodcraft 11. Polishers", "Rodcraft 12. Special tools & cutting", "Rodcraft 13. Riveters", "Rodcraft 14. Other pneumatic tools", "Rodcraft 15. Capacitor jump-starter", "Rodcraft 16. Car jacks", "Rodcraft 17. Workshop equipment", "Rodcraft 18. Workshop presses", "Rodcraft 19. Air line accessories"]

let popoverPiher = "This is the popover PIHER! This is the popover PIHER! This is the popover PIHER!"
let catalogsPiher = ["Piher 1. LIGHT PROPS", "Piher 2. MULTICLAMPS", "Piher 3. MAXIPRESS", "Piher 4. SMALL CLAMPS", "Piher 5. CLASSIC PISTON CLAMPS", "Piher 6. PROFESSIONAL G CLAMPS", "Piher 7. PARALLEL JAW CLAMPS", "Piher 8. LIGHT CLAMPS", "Piher 9. ONE-HAND CLAMPS", "Piher 10. LE VER CLAMPS", "Piher 11. FOR HOLES & GUIDES", "Piher 12. SPRING CLAMPS", "Piher 13. PROGRESSIVE MANUAL PRESSURE  CLAMPS", "Piher 14. PROFESSIONAL STEEL BAND CLAMPS", "Piher 15. STRAP CLAMPS", "Piher 16. EDGE-GRIP SCREWS", "Piher 17. ANGLE CLAMPS", "Piher 18. BENCH VICES", "Piher 19. FOR WORKING ON METAL & WOODEN HOLED TABLES", "Piher 20. FOR WOODEN TABLE", "Piher 21. TGA · QUICK SELF-ADJUSTABLE TOGGLE CLAMP", "Piher 22. TS · UNIVERSAL BOLTS & STOPS", "Piher 23. TCS · HOLE TABLE CLAMPS AND POSITIONERS", "Piher 24. TOGGLE CLAMPS", "Piher 25. LOCKING PLIERS", "Piher 26. MAGNETIC WELDING TOOLS", "Piher 27. SUCTION CUPS", "Piher 28. LIFTERS & TRANSPORTERS", "Piher 29. TRANSPORTERS & SAW HORSES"]

let popoverAltec = "This is the popover ALTEC! This is the popover ALTEC! This is the popover ALTEC!"
let catalogsAltec = ["Altec 1. ALTEC scaffold series", "Altec 2. Working heights and working surfaces of our scaffolds", "Altec 3. MySelf-Tower One person assembly system", "Altec 4. Rollfix The do-it-yourself scaffold", "Altec 5. Rollfix Classic & Slim version", "Altec 6. MySelf-Tower & Rollfix parts", "Altec 7. AluKlik The mobile folding scaffold", "Altec 8. AluKlik Classic & Slim version", "Altec 9. AluKlik Eco (70)", "Altec 10. AluDeck Professional & do-it-yourself stage", "Altec 11. AluKlik & AluDeck parts", "Altec 12. AluLight The professional rolling scaffold", "Altec 13. AluLight Classic & Slim version", "Altec 14. AluLight S-Double railing", "Altec 15. AluLight Comfortable stair tower", "Altec 16. AluLight parts", "Altec 17. AluSteg"]

let manufacturersCatalogs = [catalogsCetaform, catalogsKronus, catalogsUnior, catalogsInsize, catalogsKeil, catalogsKern, catalogsKocel, catalogsVolkel, catalogsRodcraft, catalogsPiher, catalogsAltec]
let manufacturersPopovers = [popoverCetaForm, popoverKronus, popoverUnior, popoverInsize, popoverKeil, popoverKern, popoverKocel, popoverVolkel, popoverRodcraft, popoverPiher, popoverAltec]

for (let i=0; i<manufacturersCatalogs.length; i++) {
    createSectionStructure (manufacturersNames[i], manufacturersCatalogs[i], manufacturersPopovers[i]);
}



