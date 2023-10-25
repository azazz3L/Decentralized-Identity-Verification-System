import { useEffect } from "react";
import React, { useState } from "react";

function DataFieldsSelector({ onFieldsSelect }) {
    const fields = ["DOB", "Address", "Name", "Phone"];  // example fields
    const [selectedFields, setSelectedFields] = useState([]);

    const handleCheckboxChange = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(prev => prev.filter(f => f !== field));
        } else {
            setSelectedFields(prev => [...prev, field]);
        }
    };

    useEffect(() => {
        onFieldsSelect(selectedFields);
    }, [selectedFields]);

    return (
        <div>
            {fields.map(field => (
                <div key={field}>
                    <input 
                        type="checkbox"
                        id={field}
                        value={field}
                        onChange={() => handleCheckboxChange(field)}
                    />
                    <label htmlFor={field}>{field}</label>
                </div>
            ))}
        </div>
    );
}

export default DataFieldsSelector;
