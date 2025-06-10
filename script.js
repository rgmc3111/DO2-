function calculateDO2() {
    const bsa = parseFloat(document.getElementById('bsa').value); // 体表面積を取得
    const hematocrit = parseFloat(document.getElementById('hematocrit').value);
    let spo2 = parseFloat(document.getElementById('spo2').value);
    const pao2 = parseFloat(document.getElementById('pao2').value);
    const flow = parseFloat(document.getElementById('flow').value);

    const spo2ErrorElement = document.getElementById('spo2-error');
    const resultElement = document.getElementById('do2-result'); // pタグ自体を取得

    // エラーメッセージと結果表示を初期化
    if (spo2ErrorElement) {
        spo2ErrorElement.textContent = ''; // エラーメッセージをクリア
        spo2ErrorElement.style.color = ''; // エラーメッセージの色をリセット
    }
    // ここで、既存の色クラスをすべて削除し、さらに直接スタイルもリセットする（念のため）
    resultElement.classList.remove('red', 'orange', 'blue'); 
    resultElement.style.color = ''; // **** ここで直接スタイルもリセット ****
    resultElement.textContent = ''; // 結果をクリア

    // 全ての項目が数値であることを確認
    if (isNaN(bsa) || isNaN(hematocrit) || isNaN(spo2) || isNaN(pao2) || isNaN(flow)) {
        if (spo2ErrorElement) {
            spo2ErrorElement.textContent = "全ての項目に数値を入力してください。";
            spo2ErrorElement.style.color = 'red';
        }
        return; // 計算を中断
    }

    // 酸素飽和度のバリデーション
    if (spo2 > 100 || spo2 < 0) {
        if (spo2ErrorElement) {
            spo2ErrorElement.textContent = "酸素飽和度は0%から100%の間で入力してください。";
            spo2ErrorElement.style.color = 'red';
        }
        return; // 計算を中断
    }

    spo2 = spo2 / 100; // %を小数に変換

    // ヘモグロビン濃度を計算 (g/dL)
    const hemoglobin = hematocrit / 3; // ヘマトクリット値から推定

    // 動脈血酸素含有量 (CaO2, mL O2/dL)
    const cao2 = (hemoglobin * 1.34 * spo2) + (pao2 * 0.003);

    // 酸素供給量 (DO2, mL/min)
    const do2 = flow * cao2 * 10;

    // 体表面積で補正した酸素供給量 (DO2i, mL/min/m²)
    const do2i = bsa > 0 ? do2 / bsa : 0; // 体表面積が0より大きい場合のみ計算

    // 結果のテキストを設定
    resultElement.textContent = `${do2i.toFixed(2)}`; 

    // DO2iの値に基づいて色クラスを追加
    // 今回は、CSSの!importantで強制適用するため、JavaScript側でstyle.colorは直接設定しません。
    if (do2i <= 259) {
        resultElement.classList.add('red');
    } else if (do2i >= 260 && do2i <= 280) {
        resultElement.classList.add('orange');
    } else if (do2i >= 281) {
        resultElement.classList.add('blue');
    }
}