import '../../scss/ui/Button.scss';

const Button = ({id, type, color, onClick, text, className }) => {
    const btnColor = ['thickgray', 'shadegray', 'gray', 'green', 'red'].includes(color) ? 'btn-color-' + color : "btn-color-white";

    return (
        <button type={type} className={['Button', `${btnColor}`, className].join(" ")} id={id} onClick={onClick}>
            {text}
        </button>
    );
};

Button.defaultProps = {color: "default", type: "button"}

export default Button;