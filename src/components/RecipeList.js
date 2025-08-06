import React, { useState, useMemo } from "react";




import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
const ALL_RECIPES = [/* Your recipes here */];
const CUISINE_CATEGORIES = ["All", "Italian", "Mexican", "Indian", "Japanese", "Thai", "Middle Eastern"];

const RecipeList = ({ savedRecipes = [], setSavedRecipes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [notification, setNotification] = useState("");

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };
  const getImage = async (foodName) => {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${foodName}&per_page=1`, {
    headers: {
      Authorization: process.env.auth, // Replace this with your actual Pexels API key
    },
  });
  const data = await res.json();
  return data.photos[0]?.src.small;
};

const fetchRecipeFromGemini = async (itemName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      `Provide a Result just having maximum 5 steps recipe for ${itemName} in ${selectedCategory} category. 
       following format:
      1. List all ingredients clearly.
      2. Then provide **10 step-by-step instructions** (numbered from 1 to 10) to prepare the dish.
      Ensure the response is clear, formatted as 10 bullet points for the instructions.
      Structure the output clearly with headings for Ingredients, Instructions, and Serving Suggestions.`,
    ]);

    const response = await result.response;
    const text = response.text();

    // Fetch image
    const image = await getImage(itemName);

    setGeneratedRecipe({
      title: `Recipe for ${itemName}`,
      content: text,
      category: "Generated",
      image: image, // Include the image
    });
  } catch (error) {
    console.error("Error fetching recipe from Gemini:", error);
    setNotification("Failed to fetch recipe. Please try again.");
    setTimeout(() => setNotification(""), 3000);
  }
};




  const handleGenerate = () => {
    if (!searchTerm) {
      console.warn("Please enter a food item to generate a recipe!");
      return;
    }
    fetchRecipeFromGemini(searchTerm);

  };

  const handleSave = (recipeToSave) => {
    if (recipeToSave) {
      if (!savedRecipes.some((r) => r.title === recipeToSave.title)) {
        if (typeof setSavedRecipes === "function") {
          setSavedRecipes((prev) => [...prev, recipeToSave]);
          setNotification(`${recipeToSave.title} has been saved!`);
        }
      } else {
        setNotification(`${recipeToSave.title} is already in your saved list.`);
      }

      setTimeout(() => {
        setNotification("");
      }, 3000);

      if (recipeToSave === generatedRecipe) {
        setGeneratedRecipe(null);
      }
    }
  };

  const filteredRecipes = useMemo(() => {
    return ALL_RECIPES.filter((recipe) => {
      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const notificationStyle = {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#28a745",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "opacity 0.5s, top 0.5s",
    opacity: notification ? 1 : 0,
    top: notification ? "20px" : "-100px",
  };

  return (
    <>
      <div style={notificationStyle}>{notification}</div>

      <h2>Find or Create a Recipe</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by recipe or ingredients..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CUISINE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={handleGenerate} className="generate-btn">
          Generate
        </button>
      </div>

          {generatedRecipe && (
  <div className="recipe-card" style={{ marginTop: "2rem" }}>
    <h3>{generatedRecipe.title}</h3>

    {generatedRecipe.image && (
      <img
        src={generatedRecipe.image}
        alt={generatedRecipe.title}
        className="recipe-card-img"
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "1rem" }}
      />
    )}

    {/* Render content line by line for better formatting */}
    {generatedRecipe.content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => (
        <p key={index}>{line}</p>
      ))}

    <button onClick={() => handleSave(generatedRecipe)} className="save-btn">
      Save Recipe
    </button>
  </div>
)}



      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "2rem 0" }} />

      <div className="recipes">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found";
                }}
              />
              <div className="recipe-card-content">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="recipe-card-buttons" style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                  <button onClick={() => handleViewRecipe(recipe)} className="generate-btn">
                    View Recipe
                  </button>
                  <button onClick={() => handleSave(recipe)} className="save-btn">
                    Save Recipe
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">No recipes match your search.</p>
        )}
      </div>

      {/* RecipeModal must be imported and used properly */}
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />}
    </>
  );
};

export default RecipeList;
