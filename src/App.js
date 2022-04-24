import './App.css';
import FirebaseAuthService from './FirebaseAuthService';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';
import FirebaseFirestoreService from "./FirebaseFirestoreService"
function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState(3);
  FirebaseAuthService.subscribeToAuthChanges(setUser);
  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm("Are you sure  you wanna delete this recipe ? (Yes/No)");
    if (deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument("recipes", recipeId);
        handleFetchRecipes();
        setCurrentRecipe(null);
        window.scrollTo(0, 0);
        alert(`Succesfully deleted recipe with ID => ${recipeId}`)
      } catch (err) {
        alert(err.message);
        throw err;
      }
    }
  }
  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFirestoreService.createDocument("recipes", newRecipe);
      alert(`Succesfully created a recipe with and Id = ${response.id}`);
      handleFetchRecipes();
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleFetchRecipes(cursorId = "") {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);
      setRecipes(fetchedRecipes);
    } catch (err) {
      alert(err.message);
      throw err;
    }
  }
  async function fetchRecipes(cursorId = "") {
    const queries = [];
    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter
      })
    }
    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true
      })
    }
    const orderByField = "publishDate";
    let orderByDirection;
    if (orderBy) {
      switch (orderBy) {
        case "publishDateAsc":
          orderByDirection = "asc";
          break;
        case "publishDateDesc":
          orderByDirection = "desc";
          break;
        default:
          break;
      }
    }
    let fetchedRecipes = []
    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collection: "recipes", queries, orderByField, orderByDirection, perPage: recipesPerPage, cursorId
      });
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000)
        return {
          ...data, id
        }
      })
      if (cursorId) {
        fetchedRecipes = [...recipes, ...newRecipes];
      }
      else {
        fetchedRecipes = [...newRecipes];
      }
    } catch (err) {
      alert(err.message);
      throw err;
    }
    return fetchedRecipes;
  }
  function handleRecipesPerPageChange(event) {
    const recipesPerPage = event.target.value;
    setRecipes([]);
    setRecipesPerPage(recipesPerPage);
  }
  function handleLoadMoreRecipesClick() {
    const lastRecipe = recipes[recipes.length - 1];
    const cursorId = lastRecipe.id;
    handleFetchRecipes(cursorId);
  }
  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandiwichesAndPizza: "Breads , Sandiwiches and Pizza",
      eggsAndBreakfast: "Eggs and Breakfast",
      dessertsAndBakedGoods: "Desserts and Baked Goods",
      fishAndSeaFood: "Fish and Seafood",
      vegatables: "Vegatables"
    }
    const label = categories[categoryKey];
    return label;
  }
  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;//çünkü 0 based geliyo
    const year = date.getFullYear();
    const dateString = `${month} / ${day} / ${year}`;
    return dateString;
  }
  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFirestoreService.updateDocument("recipes", recipeId, newRecipe);
      handleFetchRecipes();
      alert(`Succesfully updated a recipe with and ID = ${recipeId}`);
      setCurrentRecipe(null)
    } catch (err) {
      alert(err.message);
      throw err;
    }
  }
  function handleEditRecipeClick(recipeId) {
    const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (selectedRecipe) {
      setCurrentRecipe(selectedRecipe)
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
  function handleEditRecipeCancel() {
    setCurrentRecipe(null)
  }
  useEffect(() => {
    setIsLoading(true);
    fetchRecipes().then(fetchedRecipes => { setRecipes(fetchedRecipes); }).catch(err => {
      alert(err.message);
      throw err;
    }).finally(() => setIsLoading(false))
  }, [user, categoryFilter, orderBy, recipesPerPage])//[] içne deki şeyler değişnce kod yeniden çalışır
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className='main'>
        <div className='row apart filters'>
          <label className='recipe-label input-label'>
            Category:
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="select" required>
              <option></option>
              <option value="breadsSandiwichesAndPizza">Breads , Sandiwiches and Pizza </option>
              <option value="eggsAndBreakfast">Eggs and Breakfast</option>
              <option value="dessertsAndBakedGoods">Desserts and Baked Goods</option>
              <option value="fishAndSeaFood">Fish and Seafood</option>
              <option value="vegatables">Vegatables</option>
            </select>
          </label>
          <label className='input-label'>
            <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="select">
              <option value="publishDateDesc">Publish Date (newest - oldest)</option>
              <option value="publishDateAsc">Publish Date (oldest - newest)</option>
            </select>
          </label>
        </div>
        <div className="center">
          <div className='recipe-list-box'>
            {
              isLoading ? (
                <div className='fire'>
                  <div className='flames'>
                    <div className='flame'></div>
                    <div className='flame'></div>
                    <div className='flame'></div>
                    <div className='flame'></div>
                  </div>
                  <div className='logs'></div>
                </div>
              ) : ""
            }
            {
              !isLoading && recipes?.length === 0 ? (
                <h5 className='no-recipes'>No Recipes Found</h5>
              ) : ""
            }
            {recipes?.length > 0 ? (
              <div className='recipe-list'>
                {
                  recipes.map((recipe) => {

                    return (
                      <div className='recipe-card' key={recipe.id}>
                        {
                          recipe.isPublished === false ? (
                            <div className="unpublished">UNPUBLISHED</div>
                          ) : ""
                        }
                        <div className='recipe-name'>{recipe.name}</div>
                        <div className='recipe-field'>Category: {lookupCategoryLabel(recipe.category)}</div>
                        <div className='recipe-field'>Publish Date: {formatDate(recipe.publishDate)}</div>
                        {
                          user ? (
                            <button type='button' onClick={() => handleEditRecipeClick(recipe.id)} className='primary-button edit-button'>EDIT</button>
                          )
                            : ""}
                      </div>
                    )
                  })
                }
              </div>
            ) : null}
          </div>
        </div>
        {isLoading || (recipes?.length > 0) ? (
          <>
            <label className='input-label'>
              Recipes Per Paage:
              <select value={recipesPerPage} onChange={handleRecipesPerPageChange} className="select">
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </label>
            <div className='pagination'>
              <button className='primary-button' onClick={handleLoadMoreRecipesClick}>Load More Recipes</button>
            </div>
          </>
        ) : ""}
        {user
          ? <AddEditRecipeForm
            existingRecipe={currentRecipe}
            handleAddRecipe={handleAddRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleEditRecipeCancel={handleEditRecipeCancel}
            handleDeleteRecipe={handleDeleteRecipe}
          /> : null}

      </div>
    </div >
  );
}

export default App;
