import '../../scss/ui/Button.scss';

const Button = ({id, type, color, onClick, text}) => {
    const btnColor = ['thickgray', 'gray', 'green', 'red'].includes(color) ? 'btn-color-' + color : "btn-color-white";

    return (
        <button type={type} className={['Button3', `${btnColor}`].join(" ")} id={id} onClick={onClick}>
            {text}
        </button>
    );
};

Button.defaultProps = {color: "default", type: "button"}

export default Button;