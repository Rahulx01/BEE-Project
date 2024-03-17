import React from 'react';
import Cell from './cell';

export default function Ticket(props) {
    const ticket = props.ticket;

    return (
        <>
            {ticket && (
                <div className="w-80 m-auto">
                    {ticket.map((row, rowIndex) => (
                        <div key={rowIndex} className="d-flex">
                            {row.map((number, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    number={number}
                                    className="border"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
