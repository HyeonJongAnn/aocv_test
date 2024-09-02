import React, { useEffect, useRef, useState } from 'react';
import '../../scss/ui/SelectBox.scss';

const SelectBox = ({ label, options, fontSize, onSelectChange, placeholder, disabled, value }) => {
    const [selectedOption, setSelectedOption] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelectChange({ key: option, value: options[option] });
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        setSelectedOption(value);
    }, [value]);

    const renderOptions = () => {
        if (disabled) {
            return (
                <div
                    key="placeholder"
                    className={`SelectOption placeholder`}
                    style={{ fontSize: fontSize }}>
                    {placeholder}
                </div>
            );
        }

        return Object.keys(options).map((option, index) => (
            <div
                key={option}
                className={`SelectOption ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
                style={{ fontSize: fontSize }}>
                {options[option]}
            </div>
        ));
    };

    return (
        <div className="SelectBox" onClick={toggleDropdown} ref={wrapperRef}>
            {label !== undefined && label !== "" &&
                <span className="label">{label}</span>}
            {label !== undefined && label === "" &&
                <span className="label-placeholder">&nbsp;</span>}
            <div className="SelectArea">
                <div className="SelectTrigger"><span style={{ fontSize: fontSize }}>{selectedOption ? options[selectedOption] : placeholder}</span></div>
                <div className={`SelectOptions ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
                    {renderOptions()}
                </div>
            </div>
        </div>
    );
};

SelectBox.defaultProps = { fontSize: '1rem' };

export default SelectBox;
