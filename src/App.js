import React, { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import RecipeList from "./components/RecipeList";
import SavedRecipes from "./components/SavedRecipes";
import "./styles/main.css";

function App() {
  const [activeTab, setActiveTab] = useState("all");
  const [savedRecipes, setSavedRecipes] = useState([]);

  return (
    <div className="container">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-area">
        {activeTab === "all" ? (
          <RecipeList
            savedRecipes={savedRecipes}
            setSavedRecipes={setSavedRecipes}
          />
        ) : (
          <SavedRecipes savedRecipes={savedRecipes} />
        )}
      </div>
    </div>
  );
}

export default App;
