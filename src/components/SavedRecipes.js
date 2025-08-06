import React, { useState, useMemo } from 'react';

const SavedRecipes = ({ savedRecipes }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSavedRecipes = useMemo(() => {
    if (!searchTerm) {
      return savedRecipes;
    }
    return savedRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedRecipes, searchTerm]);

  return (
    <>
      <div className="filters">
        <input
          type="text"
          placeholder="Search your saved recipes..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="recipes">
        {filteredSavedRecipes.length > 0 ? (
          filteredSavedRecipes.map((recipe, index) => (
            <div className="recipe-card" key={index}>
              <h3>{recipe.title}</h3>
              <p>{recipe.content}</p>
            </div>
          ))
        ) : (
          <p className="empty">
            {searchTerm
              ? "No saved recipes match your search."
              : "No saved recipes yet. Go generate or browse some!"}
          </p>
        )}
      </div>
    </>
  );
};

export default SavedRecipes;
