const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button
        className={activeTab === "all" ? "tab active" : "tab"}
        onClick={() => setActiveTab("all")}
      >
        All Recipes
      </button>
      <button
        className={activeTab === "saved" ? "tab active" : "tab"}
        onClick={() => setActiveTab("saved")}
      >
        Saved Recipes
      </button>
    </div>
  );
};

export default Tabs;
