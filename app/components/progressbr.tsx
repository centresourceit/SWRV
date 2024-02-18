/**
 * Represents the properties of a progress bar component.
 * @interface ProgressbarProps
 * @property {string} height - The height of the progress bar.
 * @property {number} progress - The progress value of the progress bar.
 */
interface ProgressbarProps {
    height: string;
    progress: number;
}
/**
 * A progress bar component that displays the progress as a percentage.
 * @param {ProgressbarProps} props - The props for the progress bar component.
 * @returns {JSX.Element} - The rendered progress bar component.
 */
const ProgressBar: React.FC<ProgressbarProps> = (
    props: ProgressbarProps
): JSX.Element => {
    const value = props.progress;

    return (
        <>
            <div className={`w-full ${props.height} bg-cyan-500 bg-opacity-30 my-2 rounded-lg  relative`}>
                <div className={`h-full bg-cyan-500 rounded-lg relative`} style={{ width: props.progress + "%" }}>
                </div>
                <div className="absolute right-0 top-0 grid place-items-center h-full text-primary text-mg text-center font-semibold">{`${value}%`}</div>
            </div>
        </>
    );
};
export default ProgressBar;
