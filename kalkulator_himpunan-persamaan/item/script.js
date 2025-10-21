// Kalkulator Pertidaksamaan Fleksibel - kholikdev
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const problemTypeSelect = document.getElementById('problemType');
    const dynamicInputs = document.getElementById('dynamicInputs');
    const exampleButtons = document.getElementById('exampleButtons');
    const methodBtns = document.querySelectorAll('.method-btn');
    const solveBtn = document.getElementById('solveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const problemDisplay = document.getElementById('problemDisplay');
    const resultDisplay = document.getElementById('result');
    const solutionSteps = document.getElementById('solutionSteps');
    const solutionRepresentation = document.getElementById('solutionRepresentation');

    // State variables
    let currentMethod = 'pindah-ruas';
    let currentProblemType = 'linear';
    let examples = {};

    // Initialize
    initializeCalculator();

    function initializeCalculator() {
        loadExamples();
        setupEventListeners();
        updateInputInterface();
        updateExampleButtons();
    }

    function loadExamples() {
        examples = {
            linear: [
                { problem: '6x - 7 < 2x + 5', inputs: { a: '6', b: '-7', operator: '<', c: '2', d: '5' } },
                { problem: '3x + 2 > x - 4', inputs: { a: '3', b: '2', operator: '>', c: '1', d: '-4' } },
                { problem: '4x - 3 ≤ 2x + 9', inputs: { a: '4', b: '-3', operator: '<=', c: '2', d: '9' } },
                { problem: '2x < 12', inputs: { a: '2', b: '0', operator: '<', c: '0', d: '12' } },
                { problem: '5x + 3 ≥ 18', inputs: { a: '5', b: '3', operator: '>=', c: '0', d: '18' } }
            ],
            double: [
                { problem: '2 < 5x - 4 < 16', inputs: { a: '2', b: '5', c: '-4', d: '16' } },
                { problem: '-3 < 2x + 1 < 7', inputs: { a: '-3', b: '2', c: '1', d: '7' } },
                { problem: '1 ≤ 3x - 2 ≤ 10', inputs: { a: '1', b: '3', c: '-2', d: '10' } }
            ],
            rational: [
                { problem: '1/x < 2/(x-4)', inputs: { a: '1', b: 'x', operator: '<', c: '2', d: 'x', e: '-4' } },
                { problem: '1 < 2/(x-4)', inputs: { a: '1', b: '1', operator: '<', c: '2', d: 'x', e: '-4', isConstant: true } },
                { problem: '(x+1)/(x-2) ≥ 0', inputs: { a: '1', b: '1', operator: '>=', c: '0', d: '1', isZero: true } }
            ]
        };
    }

    function setupEventListeners() {
        // Problem type selection
        problemTypeSelect.addEventListener('change', function() {
            currentProblemType = this.value;
            updateInputInterface();
            updateExampleButtons();
            clearResults();
        });

        // Method selection
        methodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                methodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentMethod = this.dataset.method;
                solveProblem();
            });
        });

        // Action buttons
        solveBtn.addEventListener('click', solveProblem);
        clearBtn.addEventListener('click', clearInputs);
    }

    function updateInputInterface() {
        let html = '';
        
        switch(currentProblemType) {
            case 'linear':
                html = `
                    <div class="input-group">
                        <input type="text" id="linearA" placeholder="6" value="6">
                        <span class="operator-display">x</span>
                        <input type="text" id="linearB" placeholder="-7" value="-7">
                        <select id="linearOperator">
                            <option value="<"><</option>
                            <option value="<=">≤</option>
                            <option value=">">></option>
                            <option value=">=">≥</option>
                        </select>
                        <input type="text" id="linearC" placeholder="2" value="2">
                        <span class="operator-display">x</span>
                        <input type="text" id="linearD" placeholder="5" value="5">
                    </div>
                    <div class="input-note">
                        <p><small>Untuk pertidaksamaan sederhana seperti 2x < 12, isi 2 pada kolom pertama, 0 pada kolom kedua, < pada operator, 0 pada kolom ketiga, dan 12 pada kolom keempat.</small></p>
                    </div>
                `;
                break;
                
            case 'double':
                html = `
                    <div class="input-group">
                        <div class="double-inequality">
                            <input type="text" id="doubleA" placeholder="2" value="2">
                            <span class="operator-display"><</span>
                            <input type="text" id="doubleB" placeholder="5" value="5">
                            <span class="operator-display">x</span>
                            <input type="text" id="doubleC" placeholder="-4" value="-4">
                            <span class="operator-display"><</span>
                            <input type="text" id="doubleD" placeholder="16" value="16">
                        </div>
                    </div>
                    <div class="input-note">
                        <p><small>Format: a < bx + c < d</small></p>
                    </div>
                `;
                break;
                
            case 'rational':
                html = `
                    <div class="rational-input-container">
                        <div class="rational-row">
                            <div class="rational-fraction">
                                <input type="text" id="rationalA" placeholder="1" value="1">
                                <div class="fraction-line"></div>
                                <input type="text" id="rationalB" placeholder="x" value="x">
                            </div>
                            <select id="rationalOperator">
                                <option value="<"><</option>
                                <option value="<=">≤</option>
                                <option value=">">></option>
                                <option value=">=">≥</option>
                            </select>
                            <div class="rational-fraction">
                                <input type="text" id="rationalC" placeholder="2" value="2">
                                <div class="fraction-line"></div>
                                <input type="text" id="rationalD" placeholder="x" value="x">
                                <input type="text" id="rationalE" placeholder="-4" value="-4">
                            </div>
                        </div>
                    </div>
                    <div class="input-options">
                        <label>
                            <input type="checkbox" id="isConstant"> Angka konstan (bukan pecahan)
                        </label>
                        <label>
                            <input type="checkbox" id="isZero"> Sama dengan nol
                        </label>
                    </div>
                    <div class="input-note">
                        <p><small>Untuk pecahan seperti 2/(x-4), isi 2 pada pembilang kanan, x pada penyebut kanan, dan -4 pada kolom tambahan.</small></p>
                    </div>
                `;
                break;
        }
        
        dynamicInputs.innerHTML = html;
        
        // Add event listeners for auto-solve
        const inputs = dynamicInputs.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', solveProblem);
            if (input.type === 'checkbox') {
                input.addEventListener('change', solveProblem);
            }
        });
    }

    function updateExampleButtons() {
        const typeExamples = examples[currentProblemType];
        if (!typeExamples) {
            exampleButtons.innerHTML = '<p>Tidak ada contoh tersedia</p>';
            return;
        }

        let html = '';
        typeExamples.forEach((example, index) => {
            html += `
                <button class="example-btn" data-index="${index}">
                    ${example.problem}
                </button>
            `;
        });

        exampleButtons.innerHTML = html;

        // Add event listeners to example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                loadExample(parseInt(this.dataset.index));
            });
        });
    }

    function loadExample(index) {
        const example = examples[currentProblemType][index];
        if (!example) return;

        // Clear previous inputs
        clearInputs();

        // Load example data into inputs
        switch(currentProblemType) {
            case 'linear':
                document.getElementById('linearA').value = example.inputs.a;
                document.getElementById('linearB').value = example.inputs.b;
                document.getElementById('linearOperator').value = example.inputs.operator;
                document.getElementById('linearC').value = example.inputs.c;
                document.getElementById('linearD').value = example.inputs.d;
                break;
            case 'double':
                document.getElementById('doubleA').value = example.inputs.a;
                document.getElementById('doubleB').value = example.inputs.b;
                document.getElementById('doubleC').value = example.inputs.c;
                document.getElementById('doubleD').value = example.inputs.d;
                break;
            case 'rational':
                document.getElementById('rationalA').value = example.inputs.a;
                document.getElementById('rationalB').value = example.inputs.b;
                document.getElementById('rationalOperator').value = example.inputs.operator;
                document.getElementById('rationalC').value = example.inputs.c;
                document.getElementById('rationalD').value = example.inputs.d;
                if (example.inputs.e) document.getElementById('rationalE').value = example.inputs.e;
                if (example.inputs.isConstant) document.getElementById('isConstant').checked = true;
                if (example.inputs.isZero) document.getElementById('isZero').checked = true;
                break;
        }

        // Auto-solve the example
        solveProblem();
    }

    function clearInputs() {
        const inputs = dynamicInputs.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
            } else {
                input.checked = false;
            }
        });
        
        // Reset to default values based on type
        updateInputInterface();
        clearResults();
    }

    function clearResults() {
        problemDisplay.innerHTML = 'Soal akan muncul di sini';
        resultDisplay.innerHTML = 'Hasil akan muncul di sini';
        solutionSteps.innerHTML = '';
        solutionRepresentation.innerHTML = '';
    }

    function solveProblem() {
        try {
            let problem, result, steps, representations;
            
            // Solve based on problem type
            switch(currentProblemType) {
                case 'linear':
                    ({ problem, result, steps, representations } = solveLinearInequality());
                    break;
                case 'double':
                    ({ problem, result, steps, representations } = solveDoubleInequality());
                    break;
                case 'rational':
                    ({ problem, result, steps, representations } = solveRationalInequality());
                    break;
                default:
                    problem = 'Soal tidak dikenali';
                    result = 'Error';
                    steps = '<div class="step error"><p>Jenis soal tidak dikenali</p></div>';
                    representations = '';
            }
            
            // Display results
            displayResults(problem, result, steps, representations);
            
        } catch (error) {
            console.error('Error solving problem:', error);
            resultDisplay.innerHTML = 'Error: ' + error.message;
            solutionSteps.innerHTML = '<div class="step error"><p>Terjadi kesalahan dalam menyelesaikan soal</p></div>';
            solutionRepresentation.innerHTML = '';
        }
    }

    function displayResults(problem, result, steps, representations) {
        problemDisplay.innerHTML = `\\(${problem}\\)`;
        resultDisplay.innerHTML = `\\(${result}\\)`;
        solutionSteps.innerHTML = steps;
        solutionRepresentation.innerHTML = representations;
        
        // Render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([problemDisplay, resultDisplay, solutionSteps, solutionRepresentation]).catch(err => {
                console.error('MathJax error:', err);
            });
        }
    }

    // Linear Inequality Solver
    function solveLinearInequality() {
        const a = parseFloat(document.getElementById('linearA').value) || 0;
        const b = parseFloat(document.getElementById('linearB').value) || 0;
        const operator = document.getElementById('linearOperator').value;
        const c = parseFloat(document.getElementById('linearC').value) || 0;
        const d = parseFloat(document.getElementById('linearD').value) || 0;

        // Format the problem display
        let leftSide = '';
        if (a !== 0 && b !== 0) {
            leftSide = `${a}x ${b >= 0 ? '+' : ''} ${b}`;
        } else if (a !== 0) {
            leftSide = `${a}x`;
        } else if (b !== 0) {
            leftSide = `${b}`;
        } else {
            leftSide = '0';
        }

        let rightSide = '';
        if (c !== 0 && d !== 0) {
            rightSide = `${c}x ${d >= 0 ? '+' : ''} ${d}`;
        } else if (c !== 0) {
            rightSide = `${c}x`;
        } else if (d !== 0) {
            rightSide = `${d}`;
        } else {
            rightSide = '0';
        }

        const problem = `${leftSide} ${operator} ${rightSide}`;
        
        let steps = `<div class="step"><h4>Langkah 1: Tulis Pertidaksamaan</h4>`;
        steps += `<p class="math-expression">\\(${problem}\\)</p></div>`;
        
        let result = '';
        let representations = '';

        // Calculate coefficients and constants
        const coefDiff = a - c;
        const constantDiff = d - b;

        if (currentMethod === 'pindah-ruas') {
            if (c !== 0) {
                steps += `<div class="step"><h4>Langkah 2: Pindah Ruas - Pindahkan ${c}x ke kiri</h4>`;
                steps += `<p class="math-expression">\\(${leftSide} ${operator} ${rightSide}\\)</p>`;
                steps += `<p class="explanation">${c}x dipindah ruas ke kiri dan karena dulunya + dan pindah ruas jadinya -:</p>`;
                steps += `<p class="math-expression">\\(${a}x - ${c}x ${b >= 0 ? '+' : ''} ${b} ${operator} ${d}\\)</p></div>`;
                
                steps += `<div class="step"><h4>Langkah 3: Sederhanakan</h4>`;
                steps += `<p class="math-expression">\\(${a}x - ${c}x\\) menjadi \\(${coefDiff}x\\):</p>`;
                steps += `<p class="math-expression">\\(${coefDiff}x ${b >= 0 ? '+' : ''} ${b} ${operator} ${d}\\)</p></div>`;
            }

            if (b !== 0) {
                steps += `<div class="step"><h4>Langkah 4: Pindah Ruas - Pindahkan ${b} ke kanan</h4>`;
                steps += `<p class="explanation">${b} dipindah ruas ke kanan:</p>`;
                steps += `<p class="math-expression">\\(${coefDiff !== 0 ? coefDiff + 'x' : ''} ${operator} ${d} - ${b}\\)</p>`;
                steps += `<p class="math-expression">\\(${coefDiff !== 0 ? coefDiff + 'x' : ''} ${operator} ${constantDiff}\\)</p></div>`;
            }

            steps += `<div class="step"><h4>Langkah 5: Selesaikan untuk x</h4>`;
            
            if (coefDiff === 0) {
                // Special case: 0x < constantDiff
                if (constantDiff > 0) {
                    if (operator === '<' || operator === '<=') {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    } else {
                        result = 'Tidak ada solusi';
                    }
                } else if (constantDiff < 0) {
                    if (operator === '>' || operator === '>=') {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    } else {
                        result = 'Tidak ada solusi';
                    }
                } else {
                    // constantDiff = 0
                    if (operator === '<' || operator === '>') {
                        result = 'Tidak ada solusi';
                    } else {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    }
                }
                steps += `<p class="explanation">Karena koefisien x adalah 0, kita periksa ketidaksamaannya:</p>`;
                steps += `<p class="math-expression">\\(0 ${operator} ${constantDiff}\\)</p>`;
                steps += `<p class="math-expression">${result}</p></div>`;
            } else {
                steps += `<p class="explanation">${coefDiff} dibelakang x artinya dikali, jadi kalau pindah ruas jadinya bagi:</p>`;
                steps += `<p class="math-expression">\\(x ${getInverseOperator(operator)} \\frac{${constantDiff}}{${coefDiff}}\\)</p>`;
                const solution = constantDiff / coefDiff;
                steps += `<p class="math-expression">\\(x ${getInverseOperator(operator)} ${solution}\\)</p></div>`;
                
                result = `x ${getInverseOperator(operator)} ${solution}`;
            }
        } else {
            // Method: Disamaratakan
            if (c !== 0) {
                steps += `<div class="step"><h4>Langkah 2: Hilangkan ${c}x di kanan dengan invers</h4>`;
                steps += `<p class="math-expression">\\(${leftSide} ${operator} ${rightSide}\\)</p>`;
                steps += `<p class="explanation">Kita hilangkan dulu ${c}x di kanan dengan menambahkan -${c}x di kedua ruas:</p>`;
                steps += `<p class="math-expression">\\(${a}x ${b >= 0 ? '+' : ''} ${b} - ${c}x ${operator} ${c}x ${d >= 0 ? '+' : ''} ${d} - ${c}x\\)</p>`;
                steps += `<p class="math-expression">\\(${coefDiff}x ${b >= 0 ? '+' : ''} ${b} ${operator} ${d}\\)</p></div>`;
            }

            if (b !== 0) {
                steps += `<div class="step"><h4>Langkah 3: Hilangkan ${b} dengan invers</h4>`;
                steps += `<p class="explanation">Kita hilangkan ${b} dengan menambahkan -${b} di kedua ruas:</p>`;
                steps += `<p class="math-expression">\\(${coefDiff}x ${b >= 0 ? '+' : ''} ${b} - ${b} ${operator} ${d} - ${b}\\)</p>`;
                steps += `<p class="math-expression">\\(${coefDiff}x ${operator} ${constantDiff}\\)</p></div>`;
            }

            steps += `<div class="step"><h4>Langkah 4: Selesaikan untuk x</h4>`;
            
            if (coefDiff === 0) {
                // Special case: 0x < constantDiff
                if (constantDiff > 0) {
                    if (operator === '<' || operator === '<=') {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    } else {
                        result = 'Tidak ada solusi';
                    }
                } else if (constantDiff < 0) {
                    if (operator === '>' || operator === '>=') {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    } else {
                        result = 'Tidak ada solusi';
                    }
                } else {
                    // constantDiff = 0
                    if (operator === '<' || operator === '>') {
                        result = 'Tidak ada solusi';
                    } else {
                        result = 'x ∈ ℝ (semua bilangan real)';
                    }
                }
                steps += `<p class="explanation">Karena koefisien x adalah 0, kita periksa ketidaksamaannya:</p>`;
                steps += `<p class="math-expression">\\(0 ${operator} ${constantDiff}\\)</p>`;
                steps += `<p class="math-expression">${result}</p></div>`;
            } else {
                steps += `<p class="explanation">Karena di kiri masih ${coefDiff}x, untuk menghilangkan ${coefDiff}-nya kita bagi kedua ruas dengan ${coefDiff}:</p>`;
                steps += `<p class="math-expression">\\(\\frac{${coefDiff}x}{${coefDiff}} ${operator} \\frac{${constantDiff}}{${coefDiff}}\\)</p>`;
                const solution = constantDiff / coefDiff;
                steps += `<p class="math-expression">\\(x ${getInverseOperator(operator)} ${solution}\\)</p></div>`;
                
                result = `x ${getInverseOperator(operator)} ${solution}`;
            }
        }
        
        steps += `<div class="step"><p class="final-answer">Jawaban: \\(${result}\\)</p></div>`;
        
        if (coefDiff !== 0) {
            const solution = constantDiff / coefDiff;
            representations = createLinearRepresentation(result, solution);
        } else {
            representations = `
                <div class="representation-item">
                    <h4>Himpunan Penyelesaian:</h4>
                    <p>${result}</p>
                </div>
            `;
        }
        
        return { problem, result, steps, representations };
    }

    // Double Inequality Solver
    function solveDoubleInequality() {
        const a = parseFloat(document.getElementById('doubleA').value) || 0;
        const b = parseFloat(document.getElementById('doubleB').value) || 1;
        const c = parseFloat(document.getElementById('doubleC').value) || 0;
        const d = parseFloat(document.getElementById('doubleD').value) || 1;

        const problem = `${a} < ${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}`;
        
        let steps = `<div class="step"><h4>Langkah 1: Tulis Pertidaksamaan Ganda</h4>`;
        steps += `<p class="math-expression">\\(${problem}\\)</p></div>`;
        
        let result = '';
        let representations = '';

        if (currentMethod === 'pindah-ruas') {
            steps += `<div class="step"><h4>Langkah 2: Pisahkan pertidaksamaan ganda</h4>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p>`;
            steps += `<p class="explanation">Pisahkan menjadi dua pertidaksamaan:</p>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c}\\) dan \\(${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p></div>`;
            
            steps += `<div class="step"><h4>Langkah 3: Selesaikan pertidaksamaan pertama</h4>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c}\\)</p>`;
            steps += `<p class="explanation">Pindah ruas ${c} ke kiri:</p>`;
            steps += `<p class="math-expression">\\(${a} - ${c} < ${b}x\\)</p>`;
            const leftConstant = a - c;
            steps += `<p class="math-expression">\\(${leftConstant} < ${b}x\\)</p>`;
            steps += `<p class="math-expression">\\(x > \\frac{${leftConstant}}{${b}}\\)</p></div>`;
            
            steps += `<div class="step"><h4>Langkah 4: Selesaikan pertidaksamaan kedua</h4>`;
            steps += `<p class="math-expression">\\(${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p>`;
            steps += `<p class="explanation">Pindah ruas ${c} ke kanan:</p>`;
            steps += `<p class="math-expression">\\(${b}x < ${d} - ${c}\\)</p>`;
            const rightConstant = d - c;
            steps += `<p class="math-expression">\\(${b}x < ${rightConstant}\\)</p>`;
            steps += `<p class="math-expression">\\(x < \\frac{${rightConstant}}{${b}}\\)</p></div>`;
            
            const leftBound = leftConstant / b;
            const rightBound = rightConstant / b;
            
            steps += `<div class="step"><h4>Langkah 5: Gabungkan solusi</h4>`;
            steps += `<p class="explanation">Iriskan kedua solusi:</p>`;
            steps += `<p class="math-expression">\\(x > ${leftBound}\\) dan \\(x < ${rightBound}\\)</p>`;
            steps += `<p class="math-expression">\\(${leftBound} < x < ${rightBound}\\)</p></div>`;
            
            result = `${leftBound} < x < ${rightBound}`;
        } else {
            // Method: Disamaratakan
            steps += `<div class="step"><h4>Langkah 2: Pisahkan pertidaksamaan ganda</h4>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p>`;
            steps += `<p class="explanation">Pisahkan menjadi dua pertidaksamaan:</p>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c}\\) dan \\(${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p></div>`;
            
            steps += `<div class="step"><h4>Langkah 3: Selesaikan pertidaksamaan pertama</h4>`;
            steps += `<p class="math-expression">\\(${a} < ${b}x ${c >= 0 ? '+' : ''} ${c}\\)</p>`;
            steps += `<p class="explanation">Kurangi ${c} di kedua ruas:</p>`;
            steps += `<p class="math-expression">\\(${a} - ${c} < ${b}x ${c >= 0 ? '+' : ''} ${c} - ${c}\\)</p>`;
            const leftConstant = a - c;
            steps += `<p class="math-expression">\\(${leftConstant} < ${b}x\\)</p>`;
            steps += `<p class="explanation">Bagi kedua ruas dengan ${b}:</p>`;
            steps += `<p class="math-expression">\\(\\frac{${leftConstant}}{${b}} < x\\)</p></div>`;
            
            steps += `<div class="step"><h4>Langkah 4: Selesaikan pertidaksamaan kedua</h4>`;
            steps += `<p class="math-expression">\\(${b}x ${c >= 0 ? '+' : ''} ${c} < ${d}\\)</p>`;
            steps += `<p class="explanation">Kurangi ${c} di kedua ruas:</p>`;
            steps += `<p class="math-expression">\\(${b}x ${c >= 0 ? '+' : ''} ${c} - ${c} < ${d} - ${c}\\)</p>`;
            const rightConstant = d - c;
            steps += `<p class="math-expression">\\(${b}x < ${rightConstant}\\)</p>`;
            steps += `<p class="explanation">Bagi kedua ruas dengan ${b}:</p>`;
            steps += `<p class="math-expression">\\(x < \\frac{${rightConstant}}{${b}}\\)</p></div>`;
            
            const leftBound = leftConstant / b;
            const rightBound = rightConstant / b;
            
            steps += `<div class="step"><h4>Langkah 5: Gabungkan solusi</h4>`;
            steps += `<p class="explanation">Iriskan kedua solusi:</p>`;
            steps += `<p class="math-expression">\\(\\frac{${leftConstant}}{${b}} < x\\) dan \\(x < \\frac{${rightConstant}}{${b}}\\)</p>`;
            steps += `<p class="math-expression">\\(${leftBound} < x < ${rightBound}\\)</p></div>`;
            
            result = `${leftBound} < x < ${rightBound}`;
        }
        
        steps += `<div class="step"><p class="final-answer">Jawaban: \\(${result}\\)</p></div>`;
        
        const leftBound = (a - c) / b;
        const rightBound = (d - c) / b;
        representations = createDoubleRepresentation(leftBound, rightBound);
        
        return { problem, result, steps, representations };
    }

    // Rational Inequality Solver
    function solveRationalInequality() {
        const a = parseFloat(document.getElementById('rationalA').value) || 1;
        const b = document.getElementById('rationalB').value || 'x';
        const operator = document.getElementById('rationalOperator').value;
        const c = parseFloat(document.getElementById('rationalC').value) || 1;
        const d = document.getElementById('rationalD').value || 'x';
        const e = document.getElementById('rationalE').value || '0';
        const isConstant = document.getElementById('isConstant').checked;
        const isZero = document.getElementById('isZero').checked;

        let problem = '';
        if (isZero) {
            problem = `\\frac{${a}${b.includes('x') ? 'x' : ''} ${parseFloat(b) > 0 ? '+' : ''} ${b}}{${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''}} ${operator} 0`;
        } else if (isConstant) {
            problem = `${a} ${operator} \\frac{${c}}{${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''}}`;
        } else {
            problem = `\\frac{${a}}{${b}} ${operator} \\frac{${c}}{${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''}}`;
        }
        
        let steps = `<div class="step"><h4>Langkah 1: Tulis Pertidaksamaan Rasional</h4>`;
        steps += `<p class="math-expression">\\(${problem}\\)</p></div>`;
        
        // Basic implementation for rational inequalities
        steps += `<div class="step"><h4>Langkah 2: Tentukan Domain</h4>`;
        steps += `<p class="explanation">Penyebut tidak boleh sama dengan nol</p>`;
        
        if (b.includes('x')) {
            steps += `<p class="math-expression">\\(${b} \\neq 0\\)</p>`;
        }
        if (d.includes('x')) {
            steps += `<p class="math-expression">\\(${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''} \\neq 0\\)</p>`;
        }
        steps += `</div>`;
        
        steps += `<div class="step"><h4>Langkah 3: Cari titik kritis</h4>`;
        steps += `<p class="explanation">Titik dimana pembilang atau penyebut bernilai nol</p>`;
        
        if (isZero) {
            steps += `<p class="math-expression">Pembilang: \\(${a}${b.includes('x') ? 'x' : ''} ${parseFloat(b) > 0 ? '+' : ''} ${b} = 0\\)</p>`;
            steps += `<p class="math-expression">Penyebut: \\(${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''} = 0\\)</p>`;
        } else if (isConstant) {
            steps += `<p class="math-expression">Penyebut: \\(${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''} = 0\\)</p>`;
        } else {
            steps += `<p class="math-expression">Pembilang kiri: \\(${a} = 0\\)</p>`;
            steps += `<p class="math-expression">Penyebut kiri: \\(${b} = 0\\)</p>`;
            steps += `<p class="math-expression">Pembilang kanan: \\(${c} = 0\\)</p>`;
            steps += `<p class="math-expression">Penyebut kanan: \\(${d}${e ? (parseFloat(e) > 0 ? '+' : '') + e : ''} = 0\\)</p>`;
        }
        steps += `</div>`;
        
        steps += `<div class="step"><h4>Langkah 4: Uji tanda pada setiap interval</h4>`;
        steps += `<p class="explanation">Gunakan garis bilangan untuk menentukan daerah penyelesaian</p></div>`;
        
        // For now, we'll provide a generic solution
        let result = 'x ∈ [solusi]';
        if (isZero) {
            result = 'Solusi bergantung pada tanda pembilang dan penyebut';
        } else if (isConstant) {
            result = 'Solusi bergantung pada nilai konstanta dan penyebut';
        } else {
            result = 'Solusi bergantung pada perbandingan kedua pecahan';
        }
        
        steps += `<div class="step"><p class="final-answer">Jawaban: ${result}</p></div>`;
        
        let representations = `
            <div class="representation-item">
                <h4>Catatan:</h4>
                <p>Penyelesaian lengkap untuk pertidaksamaan rasional memerlukan analisis tanda pada interval yang ditentukan oleh titik kritis.</p>
                <p>Fitur ini sedang dalam pengembangan lebih lanjut.</p>
            </div>
        `;
        
        return { problem, result, steps, representations };
    }

    // Helper functions
    function getInverseOperator(operator) {
        switch(operator) {
            case '<': return '>';
            case '<=': return '>=';
            case '>': return '<';
            case '>=': return '<=';
            default: return operator;
        }
    }

    function createLinearRepresentation(result, boundary) {
        if (result.includes('<') && !result.includes('>')) {
            return `
                <div class="representation-item">
                    <h4>1. Notasi Himpunan:</h4>
                    <p>\\(HP = \\{x | x < ${boundary}\\}\\)</p>
                </div>
                <div class="representation-item">
                    <h4>2. Notasi Interval:</h4>
                    <p>\\(HP = (-\\infty, ${boundary})\\)</p>
                </div>
            `;
        } else if (result.includes('>') && !result.includes('<')) {
            return `
                <div class="representation-item">
                    <h4>1. Notasi Himpunan:</h4>
                    <p>\\(HP = \\{x | x > ${boundary}\\}\\)</p>
                </div>
                <div class="representation-item">
                    <h4>2. Notasi Interval:</h4>
                    <p>\\(HP = (${boundary}, \\infty)\\)</p>
                </div>
            `;
        } else if (result.includes('≤') || result.includes('<=')) {
            return `
                <div class="representation-item">
                    <h4>1. Notasi Himpunan:</h4>
                    <p>\\(HP = \\{x | x ≤ ${boundary}\\}\\)</p>
                </div>
                <div class="representation-item">
                    <h4>2. Notasi Interval:</h4>
                    <p>\\(HP = (-\\infty, ${boundary}]\\\\)</p>
                </div>
            `;
        } else if (result.includes('≥') || result.includes('>=')) {
            return `
                <div class="representation-item">
                    <h4>1. Notasi Himpunan:</h4>
                    <p>\\(HP = \\{x | x ≥ ${boundary}\\}\\)</p>
                </div>
                <div class="representation-item">
                    <h4>2. Notasi Interval:</h4>
                    <p>\\(HP = [${boundary}, \\infty)\\)</p>
                </div>
            `;
        }
        return '';
    }

    function createDoubleRepresentation(leftBound, rightBound) {
        return `
            <div class="representation-item">
                <h4>1. Notasi Himpunan:</h4>
                <p>\\(HP = \\{x | ${leftBound} < x < ${rightBound}\\}\\)</p>
            </div>
            <div class="representation-item">
                <h4>2. Notasi Interval:</h4>
                <p>\\(HP = (${leftBound}, ${rightBound})\\)</p>
            </div>
        `;
    }
});