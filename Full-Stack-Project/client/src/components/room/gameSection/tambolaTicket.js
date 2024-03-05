import React from 'react';
import Cell from './cell';
// import { socket } from '../../../socket';
export default function Ticket(props) {

    const ticket = props.ticket;



    const cellWidth = `calc(100% / 9)`; // Calculates dynamic cell width
    return (
        <>
            {ticket && (
                <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', margin: 'auto' }}>
                    {ticket.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex' }}>
                            {row.map((number, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    number={number}
                                    // Added cellWidth for consistent sizing
                                    style={{ width: cellWidth, height: cellWidth, border: '1px solid black' }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
