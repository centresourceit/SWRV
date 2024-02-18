
/**
 * Represents the properties of a category card component.
 * @typedef {Object} CategoryCardProps
 * @property {string} imageUrl - The URL of the image to display on the card.
 * @property {string} title - The title of the category.
 * @property {string} description - The description of the category.
 */
type CategoryCardProps = {
    imageUrl: string,
    title: string,
    description: string,
}

/**
 * A functional component that represents a category card.
 * @param {CategoryCardProps} props - The props object containing the data for the category card.
 * @returns JSX element representing the category card.
 */
export const CategoryCard = (props: CategoryCardProps) => {
    return (
        <>
            <div className={`w-40 text-left text-gray-600 p-3 border-2 border-gray-400 shadow-md rounded-xl my-4`}>
                <img src={props.imageUrl} alt="err" />
                <h1 className="text-xl font-bold my-2 text-primary">{props.title}</h1>
                <p className="text-sm font-normal">{props.description}</p>
            </div>
        </>
    );
}