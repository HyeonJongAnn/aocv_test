import React from 'react';
import { forwardRef } from 'react';
import '../scss/ui/Input.scss';

const Input = forwardRef(({ id, type, placeholder, value, color, label, className, labelClassName, readOnly, onChange, ...rest }, ref) => {
    const inputColor = ['white'].includes(color) ? 'input-color-' + color : "input-color-gray";

    return (
        <>
            {label !== undefined &&
                <div className={`label ${labelClassName}`}>{label}</div>}
            <input
                type={type}
                className={`Input ${inputColor} ${className}`}
                id={id}
                placeholder={placeholder}
                value={value} 
                readOnly={readOnly}
                onChange={onChange}
                ref={ref}
                style={{ width: '95%' }}
                {...rest}
            />
        </>
    );
});

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    color: "default",
    labelClassName: '',
};

export default Input;
