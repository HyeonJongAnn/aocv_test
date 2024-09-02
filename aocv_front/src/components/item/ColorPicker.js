import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/pages/item/ItemDetail.scss'; // 위에서 추가한 CSS를 적용

const ColorPicker = ({ colors, selectedColor, onSelectColor }) => {
    const colorNameToHex = {
        '블랙': '#000000',
        '네이비': '#000080',
        '흰색': '#FFFFFF',
        '화이트':'#FFFFFF',
        '빨강': '#FF0000',
        '파랑': '#0000FF',
        '초록': '#008000',
        // 필요한 다른 색상들을 추가합니다.
    };

    const getColorHex = (colorName) => {
        return colorNameToHex[colorName] || '#FFFFFF'; // 기본 색상은 흰색
    };

    return (
        <div className='color-picker'>
            {colors.map((colorName, index) => {
                const colorHex = getColorHex(colorName);
                return (
                    <div
                        key={index}
                        className={`color-circle ${selectedColor === colorHex ? 'selected' : ''} ${colorHex === '#FFFFFF' ? 'white' : ''}`} // 화이트 색상에 대해 white 클래스 추가
                        style={{ backgroundColor: colorHex }}
                        onClick={() => onSelectColor(colorHex)}
                    ></div>
                );
            })}
        </div>
    );
};

ColorPicker.propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedColor: PropTypes.string,
    onSelectColor: PropTypes.func.isRequired,
};

export default ColorPicker;