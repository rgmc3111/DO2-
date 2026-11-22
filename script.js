function calculateDO2() {
    const bsa = parseFloat(document.getElementById('bsa').value);
    const hematocrit = parseFloat(document.getElementById('hematocrit').value);
    let spo2 = parseFloat(document.getElementById('spo2').value);
    const pao2 = parseFloat(document.getElementById('pao2').value);
    const flow = parseFloat(document.getElementById('flow').value);

    const spo2ErrorElement = document.getElementById('spo2-error');
    const resultElement = document.getElementById('do2-result');
    const statusPill = document.getElementById('status-pill');

    if (spo2ErrorElement) {
        spo2ErrorElement.textContent = '';
        spo2ErrorElement.style.color = '';
    }
    resultElement.classList.remove('red', 'orange', 'blue');
    resultElement.style.color = '';
    resultElement.textContent = '--';

    if (statusPill) {
        statusPill.classList.remove('red', 'orange', 'blue');
        statusPill.textContent = 'READY';
    }

    if (isNaN(bsa) || isNaN(hematocrit) || isNaN(spo2) || isNaN(pao2) || isNaN(flow)) {
        if (spo2ErrorElement) {
            spo2ErrorElement.textContent = "全ての項目に数値を入力してください。";
        }
        return;
    }

    if (spo2 > 100 || spo2 < 0) {
        if (spo2ErrorElement) {
            spo2ErrorElement.textContent = "酸素飽和度は0%から100%の間で入力してください。";
        }
        return;
    }

    spo2 = spo2 / 100;
    const hemoglobin = hematocrit / 3;
    const cao2 = (hemoglobin * 1.34 * spo2) + (pao2 * 0.003);
    const do2 = flow * cao2 * 10;
    const do2i = bsa > 0 ? do2 / bsa : 0;

    resultElement.textContent = `${do2i.toFixed(2)}`;

    if (do2i <= 259) {
        resultElement.classList.add('red');
        if (statusPill) {
            statusPill.classList.add('red');
            statusPill.textContent = 'LOW (< 260)';
        }
    } else if (do2i >= 260 && do2i <= 280) {
        resultElement.classList.add('orange');
        if (statusPill) {
            statusPill.classList.add('orange');
            statusPill.textContent = 'CAUTION (260-280)';
        }
    } else if (do2i >= 281) {
        resultElement.classList.add('blue');
        if (statusPill) {
            statusPill.classList.add('blue');
            statusPill.textContent = 'OPTIMAL (> 280)';
        }
    }
}
