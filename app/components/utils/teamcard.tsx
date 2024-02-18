
/**
 * Represents the properties of a team card component.
 */
type TeamCardProps = {
    imageUrl: string
    name: string
    position: string
}

/**
 * A functional component that represents a team card.
 * @param {TeamCardProps} props - The props object containing the data for the team card.
 * @returns The JSX representation of the team card.
 */
export const TeamCard = (props: TeamCardProps) => {
    return (
        <>
            <div className={`w-64 text-left shadow-xl rounded-xl pb-4 m-4`}>
                <img src={props.imageUrl} alt="err" className="w-full rounded-md object-cover object-center h-56" />
                <h1 className="text-xl font-bold text-primary text-center mt-2">{props.name}</h1>
                <h1 className="text-md font-semibold text-primary text-center">{props.position}</h1>
            </div>
        </>
    );
}
