import React, { useState } from 'react';
import Input from './Input';
import Button from './button/Button';

const JoinBox = ({ onClick, titleName, showButtonBox, type, id, placeholder, value, readOnly, onChange, ref, inputProps, name, multiple, className }) => {
    const [fileNames, setFileNames] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFileNames(files.map(file => file.name));
        onChange(e);
    };

    return (
        <div className={`box1 ${className}`}>
            <div className='titleBox1'>
                <p>{titleName}</p>
            </div>
            <div className='inputBox1'>
                {type === 'file' ? (
                    <div className='custom-file-input'>
                        <input
                            type={type}
                            id={id}
                            name={name}
                            multiple={multiple}
                            onChange={handleFileChange}
                            ref={ref}
                            className='hidden-file-input'
                            {...inputProps}
                        />
                        <label htmlFor={id} className='file-input-label'>
                            이미지 추가
                        </label>
                    </div>
                ) : (
                    <Input
                        type={type}
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        readOnly={readOnly}
                        onChange={onChange}
                        ref={ref}
                        name={name}
                        multiple={multiple}
                        {...inputProps}
                    />
                )}
            </div>
            {showButtonBox && (
                <div className='buttonBox'>
                    <Button
                        onClick={onClick}
                        className="Button"
                        color={"gray"}
                        text={"중복확인"}
                    />
                </div>
            )}
        </div>
    );
};

export default JoinBox;
