export function getTicket() {
    let uniqueNumbers = new Set();
    const ticket = new Array(3).fill(null).map(col => new Array(9).fill(null));
    for (let i = 0; i < 9; i++) {
        const randomRow = Math.floor(Math.random() * 3);
        const randomNumber = Math.floor(Math.random() * 10) + i * 10 + 1;
        uniqueNumbers.add(randomNumber);
        ticket[randomRow][i] = randomNumber
    }

    let i = 0;
    while (i < 6) {
        const randomNumber = Math.floor(Math.random() * 90);
        const col = Math.floor(randomNumber / 10);
        const row = !ticket[1][col] ? 1 : (!ticket[0][col] ? 0 : (!ticket[2][col] ? 2 : null));
        if (row !== null) {
            ticket[row][col] = randomNumber;
            i++;
        }
    }
    return ticket;
}