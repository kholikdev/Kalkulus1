document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const setInputContainer = document.getElementById('setInputContainer');
    const calculator = document.getElementById('calculator');
    const addSetBtn = document.getElementById('addSet');
    const removeSetBtn = document.getElementById('removeSet');
    const resetSetsBtn = document.getElementById('resetSets');
    const expressionDisplay = document.getElementById('expressionDisplay');
    const clearBtn = document.getElementById('clearBtn');
    const solveBtn = document.getElementById('solveBtn');
    const resultDisplay = document.getElementById('result');
    const solutionSteps = document.getElementById('solutionSteps');
    const numberLineContainer = document.getElementById('numberLineContainer');
    
    // State aplikasi
    let currentExpression = '';
    let sets = {
        'A': { min: -6, max: -1 },
        'B': { min: -1, max: 4 }
    };
    let nextSetLetter = 'C';
    const maxSets = 8; // Maksimal himpunan yang bisa ditambahkan

    // Inisialisasi
    initializeCalculator();

    function initializeCalculator() {
        updateSets();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Event listener untuk tombol kalkulator
        calculator.addEventListener('click', function(e) {
            if (e.target.getAttribute('data-set')) {
                currentExpression += e.target.getAttribute('data-set');
                updateExpressionDisplay();
            } else if (e.target.getAttribute('data-operator')) {
                currentExpression += e.target.getAttribute('data-operator');
                updateExpressionDisplay();
            }
        });

        // Event listener untuk contoh soal
        document.querySelectorAll('.example-btn').forEach(button => {
            button.addEventListener('click', function() {
                currentExpression = this.getAttribute('data-expr');
                updateExpressionDisplay();
            });
        });

        // Event listener untuk tombol aksi
        addSetBtn.addEventListener('click', addNewSet);
        removeSetBtn.addEventListener('click', removeLastSet);
        resetSetsBtn.addEventListener('click', resetAllSets);
        clearBtn.addEventListener('click', clearExpression);
        solveBtn.addEventListener('click', solveExpression);
    }

    function updateExpressionDisplay() {
        expressionDisplay.textContent = currentExpression || 'Ekspresi akan muncul di sini';
    }

    // Fungsi untuk menambah himpunan baru
    function addNewSet() {
        if (nextSetLetter > 'Z') {
            alert('Tidak dapat menambah himpunan lebih dari 26');
            return;
        }

        if (Object.keys(sets).length >= maxSets) {
            alert(`Maksimal ${maxSets} himpunan yang dapat ditambahkan`);
            return;
        }

        // Tambah input himpunan
        const newSetInput = document.createElement('div');
        newSetInput.className = 'set-input';
        newSetInput.innerHTML = `
            <label for="set${nextSetLetter}">Himpunan ${nextSetLetter}</label>
            <input type="text" id="set${nextSetLetter}" placeholder="Contoh: 0 ≤ x ≤ 5" value="0 ≤ x ≤ 5">
        `;
        setInputContainer.appendChild(newSetInput);

        // Tambah tombol di kalkulator
        const newSetButton = document.createElement('button');
        newSetButton.textContent = nextSetLetter;
        newSetButton.setAttribute('data-set', nextSetLetter);
        
        // Temukan posisi sebelum tombol kurung pertama
        const firstParen = calculator.querySelector('button[data-operator="("]');
        calculator.insertBefore(newSetButton, firstParen);

        // Inisialisasi himpunan baru
        sets[nextSetLetter] = { min: 0, max: 5 };

        // Update tombol hapus
        updateRemoveButtonState();

        // Pindah ke huruf berikutnya
        nextSetLetter = String.fromCharCode(nextSetLetter.charCodeAt(0) + 1);
    }

    // Fungsi untuk menghapus himpunan terakhir
    function removeLastSet() {
        const setKeys = Object.keys(sets);
        if (setKeys.length <= 2) {
            alert('Minimal harus ada 2 himpunan');
            return;
        }

        const lastSetKey = setKeys[setKeys.length - 1];
        
        // Hapus dari state
        delete sets[lastSetKey];
        
        // Hapus input
        const lastSetInput = document.getElementById(`set${lastSetKey}`);
        if (lastSetInput) {
            lastSetInput.parentElement.remove();
        }
        
        // Hapus tombol dari kalkulator
        const lastSetButton = calculator.querySelector(`button[data-set="${lastSetKey}"]`);
        if (lastSetButton) {
            lastSetButton.remove();
        }

        // Update current expression - hapus referensi ke himpunan yang dihapus
        currentExpression = currentExpression.replace(new RegExp(lastSetKey, 'g'), '');
        updateExpressionDisplay();

        // Update next letter
        nextSetLetter = lastSetKey;

        // Update tombol hapus
        updateRemoveButtonState();
    }

    function updateRemoveButtonState() {
        removeSetBtn.disabled = Object.keys(sets).length <= 2;
    }

    // Fungsi untuk mereset semua himpunan
    function resetAllSets() {
        // Reset ke himpunan default A dan B
        sets = {
            'A': { min: -6, max: -1 },
            'B': { min: -1, max: 4 }
        };
        nextSetLetter = 'C';

        // Reset input
        document.getElementById('setA').value = '-6 ≤ x ≤ -1';
        document.getElementById('setB').value = '-1 ≤ x ≤ 4';

        // Hapus himpunan tambahan
        const setInputs = setInputContainer.querySelectorAll('.set-input');
        for (let i = 2; i < setInputs.length; i++) {
            setInputs[i].remove();
        }

        // Reset kalkulator - hapus tombol himpunan tambahan
        const setButtons = calculator.querySelectorAll('button[data-set]');
        setButtons.forEach(button => {
            const setLetter = button.getAttribute('data-set');
            if (setLetter > 'B') {
                button.remove();
            }
        });

        // Reset state lainnya
        currentExpression = '';
        expressionDisplay.textContent = 'Ekspresi akan muncul di sini';
        resultDisplay.textContent = 'Hasil akan muncul di sini';
        solutionSteps.innerHTML = '';
        numberLineContainer.innerHTML = '';

        // Update tombol hapus
        updateRemoveButtonState();
    }

    function clearExpression() {
        currentExpression = '';
        updateExpressionDisplay();
        resultDisplay.textContent = 'Hasil akan muncul di sini';
        solutionSteps.innerHTML = '';
        numberLineContainer.innerHTML = '';
    }

    function solveExpression() {
        updateSets();
        
        if (!currentExpression) {
            alert('Masukkan ekspresi himpunan terlebih dahulu');
            return;
        }
        
        try {
            const result = evaluateSetExpression(currentExpression, sets);
            displayResult(result, currentExpression);
        } catch (error) {
            alert('Error dalam mengevaluasi ekspresi: ' + error.message);
        }
    }

    // Fungsi untuk memperbarui set dari input
    function updateSets() {
        try {
            for (const setName in sets) {
                const inputElement = document.getElementById(`set${setName}`);
                if (inputElement) {
                    sets[setName] = parseSetInput(inputElement.value);
                }
            }
        } catch (error) {
            alert('Format himpunan tidak valid: ' + error.message);
        }
    }
    
    // Fungsi untuk mem-parsing input himpunan
    function parseSetInput(input) {
        // Menghapus spasi berlebih
        input = input.replace(/\s+/g, ' ');
        
        // Mencocokkan pola seperti "a ≤ x ≤ b" atau "a <= x <= b"
        const pattern = /(-?\d+(?:\.\d+)?)\s*(≤|<=)\s*x\s*(≤|<=)\s*(-?\d+(?:\.\d+)?)/;
        const match = input.match(pattern);
        
        if (match) {
            const min = parseFloat(match[1]);
            const max = parseFloat(match[4]);
            
            if (min <= max) {
                return { min, max };
            } else {
                throw new Error('Nilai minimum harus lebih kecil atau sama dengan nilai maksimum');
            }
        } else {
            throw new Error('Format tidak dikenali. Gunakan format seperti: -6 ≤ x ≤ -1');
        }
    }
    
    // Fungsi untuk menghasilkan daftar angka dari himpunan
    function generateSetElements(set) {
        if (isNaN(set.min) || isNaN(set.max)) {
            return "{}";
        }
        
        const elements = [];
        for (let i = Math.ceil(set.min); i <= Math.floor(set.max); i++) {
            elements.push(i);
        }
        return `{${elements.join(', ')}}`;
    }
    
    // Fungsi untuk mengevaluasi ekspresi himpunan
    function evaluateSetExpression(expression, sets) {
        // Validasi ekspresi
        if (!isValidExpression(expression)) {
            throw new Error('Ekspresi tidak valid');
        }
        
        // Evaluasi ekspresi menggunakan pendekatan rekursif
        return evaluate(expression, sets);
    }
    
    // Fungsi untuk memvalidasi ekspresi
    function isValidExpression(expr) {
        // Periksa keseimbangan kurung
        let balance = 0;
        for (let char of expr) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false;
        }
        if (balance !== 0) return false;
        
        // Periksa karakter yang valid
        const validChars = /^[A-Z∩∪()\s]+$/;
        return validChars.test(expr.replace(/\s/g, ''));
    }
    
    // Fungsi evaluasi rekursif
    function evaluate(expr, sets) {
        // Hapus spasi
        expr = expr.replace(/\s/g, '');
        
        // Jika ekspresi hanya satu himpunan
        if (expr.length === 1 && /[A-Z]/.test(expr)) {
            return sets[expr];
        }
        
        // Cari operator dengan prioritas terendah (di luar kurung)
        let depth = 0;
        let minPriority = Infinity;
        let minPriorityIndex = -1;
        let minPriorityOp = '';
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (char === '(') depth++;
            if (char === ')') depth--;
            
            if (depth === 0) {
                if (char === '∪' || char === '∩') {
                    const priority = (char === '∪') ? 1 : 2;
                    if (priority < minPriority) {
                        minPriority = priority;
                        minPriorityIndex = i;
                        minPriorityOp = char;
                    }
                }
            }
        }
        
        // Jika ditemukan operator dengan prioritas terendah
        if (minPriorityIndex !== -1) {
            const leftExpr = expr.substring(0, minPriorityIndex);
            const rightExpr = expr.substring(minPriorityIndex + 1);
            
            const leftSet = evaluate(leftExpr, sets);
            const rightSet = evaluate(rightExpr, sets);
            
            if (minPriorityOp === '∩') {
                return setIntersection(leftSet, rightSet);
            } else if (minPriorityOp === '∪') {
                return setUnion(leftSet, rightSet);
            }
        }
        
        // Jika ekspresi diawali dan diakhiri dengan kurung
        if (expr[0] === '(' && expr[expr.length - 1] === ')') {
            return evaluate(expr.substring(1, expr.length - 1), sets);
        }
        
        throw new Error('Ekspresi tidak valid: ' + expr);
    }
    
    // Fungsi untuk irisan himpunan
    function setIntersection(set1, set2) {
        const min = Math.max(set1.min, set2.min);
        const max = Math.min(set1.max, set2.max);
        
        if (min <= max) {
            return { min, max };
        } else {
            return { min: NaN, max: NaN }; // Himpunan kosong
        }
    }
    
    // Fungsi untuk gabungan himpunan
    function setUnion(set1, set2) {
        // Periksa apakah himpunan saling tumpang tindih atau bersebelahan
        if (set1.max >= set2.min - 0.1 && set2.max >= set1.min - 0.1) {
            return {
                min: Math.min(set1.min, set2.min),
                max: Math.max(set1.max, set2.max)
            };
        } else {
            // Untuk kasus himpunan terpisah, kita kembalikan array himpunan
            return {
                sets: [set1, set2],
                isUnionOfDisjointSets: true
            };
        }
    }
    
    // Fungsi untuk menampilkan hasil
    function displayResult(result, expression) {
        let resultText = '';
        let stepsHTML = '';
        
        // Langkah 1: Tampilkan semua himpunan yang didefinisikan dengan elemennya
        stepsHTML += `<div class="step">
            <h4>Langkah 1: Menentukan Semua Himpunan</h4>`;
        
        for (const [setName, setValue] of Object.entries(sets)) {
            const elements = generateSetElements(setValue);
            stepsHTML += `<p>${setName} = { x | ${setValue.min} ≤ x ≤ ${setValue.max} } = ${elements}</p>`;
        }
        
        stepsHTML += `<p class="explanation">Kita telah mendefinisikan semua himpunan yang akan digunakan dalam perhitungan.</p>`;
        stepsHTML += `</div>`;
        
        // Langkah 2: Evaluasi ekspresi dengan penjelasan natural
        stepsHTML += `<div class="step">
            <h4>Langkah 2: Mengevaluasi Ekspresi "${expression}"</h4>`;
        
        // Tampilkan ekspresi awal
        stepsHTML += `<p class="formula">Ekspresi: ${expression}</p>`;
        
        // Evaluasi dan tampilkan penjelasan natural
        const naturalExplanation = generateNaturalExplanation(expression, sets);
        stepsHTML += naturalExplanation;
        
        // Tampilkan hasil akhir
        if (result.isUnionOfDisjointSets) {
            resultText = `Gabungan dari himpunan terpisah: `;
            const resultSets = [];
            result.sets.forEach(set => {
                if (!isNaN(set.min) && !isNaN(set.max)) {
                    resultSets.push(generateSetElements(set));
                }
            });
            resultText += resultSets.join(' ∪ ');
            
            stepsHTML += `<p class="final-answer">Jawaban: ${resultText}</p>`;
        } else if (isNaN(result.min) || isNaN(result.max)) {
            resultText = '{}';
            stepsHTML += `<p class="final-answer">Jawaban: ${resultText}</p>`;
        } else {
            resultText = generateSetElements(result);
            stepsHTML += `<p class="final-answer">Jawaban: ${resultText}</p>`;
        }
        
        stepsHTML += `</div>`;
        
        // Tampilkan hasil
        resultDisplay.textContent = resultText;
        solutionSteps.innerHTML = stepsHTML;
        
        // Gambar garis bilangan
        drawNumberLine(result, expression);
    }
    
    // Fungsi untuk menghasilkan penjelasan natural
    function generateNaturalExplanation(expression, sets) {
        let explanationHTML = '';
        const usedSets = new Set();
        
        // Identifikasi himpunan yang digunakan
        for (const char of expression) {
            if (char >= 'A' && char <= 'Z') {
                usedSets.add(char);
            }
        }
        
        // Penjelasan untuk operasi
        if (expression.includes('∩')) {
            explanationHTML += `<p class="explanation">Karena yang akan kita operasikan adalah ${expression}, maka artinya kita mencari irisan dari himpunan-himpunan tersebut. Irisan adalah himpunan yang berisi elemen-elemen yang sama dari semua himpunan.</p>`;
            
            // Tampilkan elemen dari masing-masing himpunan
            const setNames = Array.from(usedSets);
            for (const setName of setNames) {
                const set = sets[setName];
                const elements = generateSetElements(set);
                explanationHTML += `<p>${setName} = ${elements}</p>`;
            }
            
            explanationHTML += `<p class="explanation">Mari kita cari elemen-elemen yang sama dari himpunan-himpunan tersebut:</p>`;
            
            // Lakukan evaluasi untuk mendapatkan hasil
            const result = evaluateSetExpression(expression, sets);
            if (isNaN(result.min) || isNaN(result.max)) {
                explanationHTML += `<p>Tidak ada elemen yang sama antara himpunan-himpunan tersebut.</p>`;
            } else {
                const commonElements = generateSetElements(result);
                explanationHTML += `<p>Elemen yang sama: ${commonElements}</p>`;
            }
            
        } else if (expression.includes('∪')) {
            explanationHTML += `<p class="explanation">Karena yang akan kita operasikan adalah ${expression}, maka artinya kita mencari gabungan dari himpunan-himpunan tersebut. Gabungan adalah himpunan yang berisi semua elemen dari semua himpunan.</p>`;
            
            // Tampilkan elemen dari masing-masing himpunan
            const setNames = Array.from(usedSets);
            for (const setName of setNames) {
                const set = sets[setName];
                const elements = generateSetElements(set);
                explanationHTML += `<p>${setName} = ${elements}</p>`;
            }
            
            explanationHTML += `<p class="explanation">Mari kita gabungkan semua elemen dari himpunan-himpunan tersebut:</p>`;
            
            // Lakukan evaluasi untuk mendapatkan hasil
            const result = evaluateSetExpression(expression, sets);
            if (result.isUnionOfDisjointSets) {
                const resultSets = [];
                result.sets.forEach(set => {
                    if (!isNaN(set.min) && !isNaN(set.max)) {
                        resultSets.push(generateSetElements(set));
                    }
                });
                explanationHTML += `<p>Gabungan himpunan: ${resultSets.join(' ∪ ')}</p>`;
            } else if (!isNaN(result.min) && !isNaN(result.max)) {
                const unionElements = generateSetElements(result);
                explanationHTML += `<p>Gabungan himpunan: ${unionElements}</p>`;
            }
        } else {
            // Jika hanya satu himpunan
            const setName = expression;
            const set = sets[setName];
            const elements = generateSetElements(set);
            explanationHTML += `<p class="explanation">Hanya satu himpunan yang dipilih:</p>`;
            explanationHTML += `<p>${setName} = ${elements}</p>`;
        }
        
        return explanationHTML;
    }
    
    // Fungsi untuk menggambar garis bilangan
    function drawNumberLine(result, expression) {
        // Tentukan rentang untuk garis bilangan
        let allMins = [];
        let allMaxs = [];
        
        for (const set of Object.values(sets)) {
            allMins.push(set.min);
            allMaxs.push(set.max);
        }
        
        if (!result.isUnionOfDisjointSets && !isNaN(result.min) && !isNaN(result.max)) {
            allMins.push(result.min);
            allMaxs.push(result.max);
        } else if (result.isUnionOfDisjointSets) {
            result.sets.forEach(set => {
                allMins.push(set.min);
                allMaxs.push(set.max);
            });
        }
        
        const minVal = Math.min(...allMins) - 1;
        const maxVal = Math.max(...allMaxs) + 1;
        
        // Buat elemen garis bilangan
        numberLineContainer.innerHTML = `
            <h3>Visualisasi pada Garis Bilangan</h3>
            <div class="number-line">
                <div class="number-line-inner"></div>
                <div class="number-line-markers" id="numberLineMarkers"></div>
            </div>
        `;
        
        const numberLineMarkers = document.getElementById('numberLineMarkers');
        
        // Tambahkan marker dan label
        for (let i = minVal; i <= maxVal; i++) {
            const marker = document.createElement('div');
            marker.className = 'number-line-marker';
            marker.style.left = `${((i - minVal) / (maxVal - minVal)) * 100}%`;
            
            const label = document.createElement('div');
            label.className = 'number-line-label';
            label.textContent = i;
            label.style.left = `${((i - minVal) / (maxVal - minVal)) * 100}%`;
            
            numberLineMarkers.appendChild(marker);
            numberLineMarkers.appendChild(label);
        }
        
        // Gambar himpunan asli
        let colorIndex = 0;
        const colors = [
            'rgba(52, 152, 219, 0.5)',
            'rgba(155, 89, 182, 0.5)',
            'rgba(241, 196, 15, 0.5)',
            'rgba(230, 126, 34, 0.5)'
        ];
        
        for (const [setName, setValue] of Object.entries(sets)) {
            if (expression.includes(setName)) {
                const setInterval = document.createElement('div');
                setInterval.className = 'set-interval';
                setInterval.style.backgroundColor = colors[colorIndex % colors.length];
                setInterval.style.left = `${((setValue.min - minVal) / (maxVal - minVal)) * 100}%`;
                setInterval.style.width = `${((setValue.max - setValue.min) / (maxVal - minVal)) * 100}%`;
                
                const setLabel = document.createElement('div');
                setLabel.className = 'set-label';
                setLabel.textContent = setName;
                setLabel.style.left = `${((setValue.min + (setValue.max - setValue.min) / 2 - minVal) / (maxVal - minVal)) * 100}%`;
                setLabel.style.color = colors[colorIndex % colors.length];
                
                numberLineMarkers.appendChild(setInterval);
                numberLineMarkers.appendChild(setLabel);
                
                colorIndex++;
            }
        }
        
        // Gambar hasil
        if (result.isUnionOfDisjointSets) {
            result.sets.forEach(set => {
                const resultInterval = document.createElement('div');
                resultInterval.className = 'operation-result';
                resultInterval.style.backgroundColor = 'rgba(46, 204, 113, 0.7)';
                resultInterval.style.left = `${((set.min - minVal) / (maxVal - minVal)) * 100}%`;
                resultInterval.style.width = `${((set.max - set.min) / (maxVal - minVal)) * 100}%`;
                numberLineMarkers.appendChild(resultInterval);
            });
        } else if (!isNaN(result.min) && !isNaN(result.max)) {
            const resultInterval = document.createElement('div');
            resultInterval.className = 'operation-result';
            resultInterval.style.backgroundColor = 'rgba(46, 204, 113, 0.7)';
            resultInterval.style.left = `${((result.min - minVal) / (maxVal - minVal)) * 100}%`;
            resultInterval.style.width = `${((result.max - result.min) / (maxVal - minVal)) * 100}%`;
            numberLineMarkers.appendChild(resultInterval);
        }
    }
});