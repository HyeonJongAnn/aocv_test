import '../../scss/ui/Button.scss';

const FullWidthButton = ({id, type, color, onClick, text, style}) => {
    const btnColor = ['thickgray', 'gray', 'green', 'red'].includes(color) ? 'btn-color-' + color : "btn-color-white";

    return (
        <button type={type} className={['FullWidthButton', `${btnColor}`].join(" ")} id={id} onClick={onClick}  style={style}>
            {text}
        </button>
    );
};

FullWidthButton.defaultProps = {color: "default", type: "button"}
export default FullWidthButton;