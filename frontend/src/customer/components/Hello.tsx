import React from "react";

interface HelloProps {
    name: string;
    age?: number;
}

const Hello: React.FC<HelloProps> = ({ name, age}) => {
    return (
        <div>
            <p>
                สวัสดีครับ {name} {age ?`(อายุ ${age})` : ""}
            </p>
        </div>
    )
}

export default Hello;