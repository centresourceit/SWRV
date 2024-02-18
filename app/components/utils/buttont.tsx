/**
 * Represents the properties of a custom button component.
 * @typedef {Object} CusButtonProps
 * @property {string} text - The text content of the button.
 * @property {string} [textColor] - The color of the button text.
 * @property {string} [textSize] - The size of the button text.
 * @property {string} [width] - The width of the button.
 * @property {string} [background] - The background color of the button.
 * @property {string} [border] - The border style of the button.
 * @property {string} [borderColor] - The color of the button border.
 * @property {string} [extra]
 */
type CusButtonProps = {
    text: string
    textColor?: String
    textSize?: String
    width?: String
    background?: string
    border?: string
    borderColor?: String
    extra?: string
    fontwidth?: string
    margin?: string
    height?: string
    func?: () => void
}

export const CusButton = (props: CusButtonProps) => {

    /**
     * Executes the function stored in the `func` property of the `props` object, if it is defined.
     * @returns None
     */
    const clickfunc = () => {
        if (props.func != undefined) {
            props.func();
        }
    }
    /**
     * Renders a button component with customizable properties.
     * @param {function} clickfunc - The function to be executed when the button is clicked.
     * @param {string} [props.margin] - The margin property of the button.
     * @param {string} [props.background] - The background color of the button.
     * @param {string} [props.textColor] - The text color of the button.
     * @param {string} [props.textSize] - The font size of the button text.
     * @param {string} [props.width] - The width of the button.
     * @param {string} [props.border] - The border style of the button.
     * @param {string} [props.borderColor] -
     */
    return (

        <button onClick={clickfunc} className={`text-center py-2 ${props.margin ?? "my-3"} rounded-lg font-normal ${props.background ?? "bg-primary"} ${props.textColor ?? "text-white"} ${props.textSize ?? "text-md"} ${props.width ?? "w-44"} ${props.background ?? "bg-transparent"} ${props.border ?? "border-2"} ${props.borderColor ?? "border-transparent"}  ${props.height ?? ""} ${props.extra ?? ""}`}>
            <p className={`${props.fontwidth ?? "font-normal"}`}>
                {props.text}
            </p>
        </ button >
    );
}