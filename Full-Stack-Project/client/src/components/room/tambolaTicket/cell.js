import React, { useState } from "react";
export default function Cell(props){
    const number = props.number;
    const [bgColor, setbgColor] = useState('whitesmoke');
    function handleClick() {
        console.log(number);
        if(number) {
            if(bgColor === 'whitesmoke'){
                setbgColor('lightgreen');
                props.handleClick(props.row, props.col, 85);
            }
            else{
                setbgColor('whitesmoke');
                props.handleClick(props.row, props.col, null);
            }
        }
    }
    
    return(
        <>
            <button
            onClick={handleClick}
            className="square btn btn-outline border"
            style={{height: '50px', width: '50px', backgroundColor:bgColor}}
            >{number}</button>
        </>
    )
}