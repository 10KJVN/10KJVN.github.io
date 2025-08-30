function cycleBackgrounds(elementId, imageList, interval = 5000) {
    const el = document.getElementById(elementId);
    if (!el || imageList.length === 0) return;

    let index = 0;
    el.style.backgroundImage = `url(${imageList[index]})`;

    setInterval(() => {
        index = (index + 1) % imageList.length;
        el.style.backgroundImage = `url(${imageList[index]})`;
    }, interval);
}

cycleBackgrounds("ensemble", [
    "img/Ensemble/EnsembleBG.jpg",
    "img/Ensemble/EnsBG5.jpg",
    "img/Ensemble/EnsBG2.jpg"
], 9000); // 9s interval
