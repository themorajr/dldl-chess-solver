let grid = [];

function setupGrid(rows, cols) {
    const container = document.getElementById('grid-container');
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.innerHTML = '';

    grid = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'off');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => toggleCell(r, c);
            container.appendChild(cell);
        }
    }

    updateGrid();
}

function setupSpecialGrid() {
    const container = document.getElementById('grid-container');
    container.style.gridTemplateColumns = `repeat(5, 1fr)`;
    container.innerHTML = '';

    grid = Array.from({ length: 3 }, () => Array(5).fill(0));

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'off');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => setSpecialCell(r, c);
            container.appendChild(cell);
        }
    }

    updateGrid();
}

function toggleCell(row, col) {
    if (grid[row][col] === "X") return;

    grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    updateGrid();
}

function setSpecialCell(row, col) {
    if (grid[row][col] === "X") {
        grid[row][col] = 0;
    } else if (grid[row][col] === 0) {
        grid[row][col] = 1;
    } else {
        grid[row][col] = "X";
    }
    updateGrid();
}

function updateGrid() {
    const container = document.getElementById('grid-container');
    const cells = container.children;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const index = r * grid[r].length + c;
            const cell = cells[index];

            if (grid[r][c] === 1) {
                cell.classList.add('on');
                cell.classList.remove('off', 'x');
            } else if (grid[r][c] === 0) {
                cell.classList.add('off');
                cell.classList.remove('on', 'x');
            } else if (grid[r][c] === "X") {
                cell.classList.add('x');
                cell.classList.remove('on', 'off');
            }
        }
    }
}

function toggleLights(row, col) {
    if (grid[row][col] === "X") return;

    const directions = [
        [0, 0], // Self
        [-1, 0], // Above
        [1, 0], // Below
        [0, -1], // Left
        [0, 1], // Right
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
            newRow >= 0 &&
            newRow < grid.length &&
            newCol >= 0 &&
            newCol < grid[0].length &&
            grid[newRow][newCol] !== "X"
        ) {
            grid[newRow][newCol] = grid[newRow][newCol] === 0 ? 1 : 0;
        }
    }
}

function calculateSolution() {
    const solution = [];
    const originalGrid = grid.map(row => [...row]);

    function isAllOn() {
        return grid.every(row => row.every(cell => cell === 1 || cell === "X"));
    }

    function solve(row = 0, col = 0) {
        if (isAllOn()) return true;
        if (row >= grid.length) return false;

        const nextRow = col === grid[0].length - 1 ? row + 1 : row;
        const nextCol = col === grid[0].length - 1 ? 0 : col + 1;

        // Try not toggling
        if (solve(nextRow, nextCol)) return true;

        // Try toggling
        if (grid[row][col] !== "X") {
            toggleLights(row, col);
            solution.push([row, col]);
            if (solve(nextRow, nextCol)) return true;
            solution.pop();
            toggleLights(row, col);
        }

        return false;
    }

    if (solve()) {
        const solutionDiv = document.getElementById('solution');
        solutionDiv.innerHTML = '<h2>Solution:</h2>' + solution.map(([r, c]) => `(${r + 1}, ${c + 1})`).join(' → ');
        grid = originalGrid;
        updateGrid();
    } else {
        alert('No solution found!');
    }
}

// Default grid
setupGrid(3, 3);