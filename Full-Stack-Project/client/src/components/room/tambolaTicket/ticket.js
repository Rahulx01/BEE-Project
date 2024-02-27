import React from 'react';
import Cell from './cell';

export default function Ticket() {
    const cells = Array(3).fill(null).map(() => Array(9).fill(null));
    cells[0][4] = 56;
    cells[2][5] = 69;
    cells[2][1] = 23;
    cells[1][0] = 1;

    const cellWidth = `calc(100% / 9)`; // Calculates dynamic cell width
    function handleClick(row, col, number) {
        cells[row][col] = number;
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', margin: 'auto' }}>
            {cells.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((number, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            row={rowIndex}
                            col={colIndex}
                            number={number}
                            handleClick={(row, col, number) => handleClick(row, col, number)}
                            // Added cellWidth for consistent sizing
                            style={{ width: cellWidth, height: cellWidth, border: '1px solid black' }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
