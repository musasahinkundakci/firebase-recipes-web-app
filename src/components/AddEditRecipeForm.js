import React, { useEffect, useState } from 'react'
import ImageUploadPreview from './ImageUploadPreview';

const AddEditRecipeForm = ({ handleDeleteRecipe, existingRecipe, handleUpdateRecipe, handleEditRecipeCancel, handleAddRecipe }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
    const [directions, setDirections] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    useEffect(() => {
        if (existingRecipe) {
            setName(existingRecipe.name);
            setDirections(existingRecipe.directions);
            setCategory(existingRecipe.category);
            setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
            setIngredients(existingRecipe.ingredients);
            setImageUrl(existingRecipe.imageUrl);
        }

    }, [existingRecipe])
    function handleAddIngredient(e) {
        if (e?.key !== "Enter") {
            return;
        }
        e.preventDefault()
        if (!ingredientName) {
            alert("Missing ingredient field. Please double check.")
            return;
        }
        setIngredients([...ingredients, ingredientName]);
        setIngredientName("")
    }
    function handleRecipeSubmit(e) {
        e.preventDefault();
        if (ingredients.length === 0) {
            alert("Ingredients cannot be empty. Please add at least 1 ingredient.");
            return;
        }
        if (!imageUrl) {
            alert("Missing recipe image.Please add a recipe image.");
            return;
        }
        const isPublished = new Date(publishDate) <= new Date() ? true : false;
        const newRecipe = {
            name,
            category,
            directions,
            publishDate: new Date(publishDate),
            isPublished,
            ingredients,
            imageUrl: imageUrl
        };
        if (existingRecipe) {
            handleUpdateRecipe(newRecipe, existingRecipe.id);
            return;
        }
        handleAddRecipe(newRecipe);
        resetForm();
    }
    function resetForm() {
        setName("");
        setDirections("");
        setCategory("");
        setPublishDate("");
        setIngredients([])
        setImageUrl("")
    }
    return (
        <form className='add-edit-recipe-form-container' onSubmit={handleRecipeSubmit}>
            <h2 >{existingRecipe ? "Update The Recipe" : "Add a New Recipe"}</h2>
            <div className='top-form-section'>
                <div className='image-input-box'>
                    Recipe Image
                    <ImageUploadPreview
                        basePath="recipes"
                        existingImageUrl={imageUrl}
                        handleUploadFinish={(downloadUrl) => { setImageUrl(downloadUrl) }}
                        handleUploadCancel={() => setImageUrl("")}
                    />
                </div>
                <div className='fields'>
                    <label className='recipe-label input-label'>Recipe Name:</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-text  w" />
                    <label className='recipe-label input-label'>
                        Category:
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select" required>
                            <option value="breadsSandiwichesAndPizza">Breads , Sandiwiches and Pizza </option>
                            <option value="eggsAndBreakfast">Eggs and Breakfast</option>
                            <option value="dessertsAndBakedGoods">Desserts and Baked Goods</option>
                            <option value="fishAndSeaFood">Fish and Seafood</option>
                            <option value="vegatables">Vegatables</option>
                        </select>
                    </label>
                    <label className='recipe-label input-label'>
                        Directions:
                        <textarea required value={directions} onChange={e => setDirections(e.target.value)} className="input-text directions"></textarea>
                    </label>
                    <label className='recipe-label input-label'>
                        Publish Date
                        <input type="data" required value={publishDate} onChange={e => setPublishDate(e.target.value)} className="input-text" />
                    </label>
                </div>
            </div>
            <div className='ingredients-list '>
                <h3 className="text-center">Ingredients</h3>
                <table className='ingredients-table'>
                    <thead>
                        <tr>
                            <th className='table-header'>Ingredient</th>
                            <th className='table-header'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ingredients?.length > 0 ? ingredients.map((ingredient) => {
                                return (
                                    <tr key={ingredient}>
                                        <td className='table-data text-center'>{ingredient}</td>
                                        <td className='ingredient-delete-box'>
                                            <button type='button' className='secondary-button ingredient-delete-button'>Delete</button>
                                        </td>
                                    </tr>
                                )
                            }) : ""
                        }
                    </tbody>
                </table>
                {ingredients?.length === 0 ? <h3 className='text-center no-ingredients'>No ingredients Added Yet</h3> : ""}
                <div className='ingredient-form'>
                    <label className='ingredient-label'>
                        Ingredient:
                        <input type="text" onKeyPress={handleAddIngredient} value={ingredientName} onChange={e => setIngredientName(e.target.value)} className="input-text" placeholder='ex. 1 cup of sugar' />

                    </label>
                    <button type='button' className='primary-button add-ingredient-button' onClick={handleAddIngredient}> Add Ingredient</button>
                </div>
            </div>
            <div>
                <div className="action-buttons">
                    <button type='submit' className='primary-button action-button'> {existingRecipe ? "Update Recipe" : "Create Recipe"}</button>
                    {existingRecipe ? (
                        <>
                            <button type='button' onClick={handleEditRecipeCancel} className="primary-button action-button">Cancel</button>
                            <button type='button' className='primary-button action-button' onClick={() => handleDeleteRecipe(existingRecipe.id)}>Delete</button>
                        </>
                    ) : ""}
                </div>
            </div>
        </form>
    )
}

export default AddEditRecipeForm