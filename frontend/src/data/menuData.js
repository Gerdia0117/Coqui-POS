// ============================================
// MENU DATA — COQUÍ POS
// ============================================
// Images use Unsplash's keyword search URL.
// Each URL pulls a live photo matching that exact dish/ingredient.
// Format: https://source.unsplash.com/featured/400x300?{keyword}

export const menuData = {

  // ==================== BEVERAGES ====================
  beverages: [
    {
      id: "bev-1",
      name: "Piña Colada",
      price: 8.99,
      category: "beverages",
      type: "bar",
      image: "https://source.unsplash.com/featured/400x300?pina+colada+cocktail",
      description: "Classic Puerto Rican cocktail with rum, coconut cream, and pineapple",
      allergens: ["coconut"],
      proteins: [],
      ingredients: ["White Rum", "Coconut Cream", "Pineapple Juice", "Ice"],
      sides: []
    },
    {
      id: "bev-2",
      name: "Mojito",
      price: 7.99,
      category: "beverages",
      type: "bar",
      image: "https://source.unsplash.com/featured/400x300?mojito+cocktail+mint",
      description: "Refreshing mint and lime cocktail",
      allergens: [],
      proteins: [],
      ingredients: ["White Rum", "Fresh Mint", "Lime Juice", "Sugar", "Soda Water"],
      sides: []
    },
    {
      id: "bev-3",
      name: "Fresh Squeezed Orange Juice",
      price: 4.99,
      category: "beverages",
      type: "non-alcoholic",
      image: "https://source.unsplash.com/featured/400x300?orange+juice+fresh+glass",
      description: "Freshly squeezed Florida oranges",
      allergens: [],
      proteins: [],
      ingredients: ["Fresh Oranges"],
      sides: []
    },
    {
      id: "bev-4",
      name: "Café con Leche",
      price: 3.99,
      category: "beverages",
      type: "non-alcoholic",
      image: "https://source.unsplash.com/featured/400x300?coffee+steamed+milk+latte",
      description: "Strong Puerto Rican coffee with steamed milk",
      allergens: ["dairy"],
      proteins: [],
      ingredients: ["Espresso", "Steamed Milk", "Sugar"],
      sides: []
    }
  ],

  // ==================== APPETIZERS ====================
  appetizers: [
    {
      id: "app-1",
      name: "Tostones",
      price: 6.99,
      category: "appetizers",
      image: "https://source.unsplash.com/featured/400x300?fried+green+plantains+tostones",
      description: "Twice-fried green plantains served with garlic sauce",
      allergens: [],
      proteins: [],
      ingredients: ["Green Plantains", "Garlic", "Olive Oil", "Salt"],
      sides: ["Garlic Dipping Sauce", "Mayo-Ketchup"]
    },
    {
      id: "app-2",
      name: "Alcapurrias",
      price: 8.99,
      category: "appetizers",
      image: "https://source.unsplash.com/featured/400x300?puerto+rican+fritters+fried+stuffed",
      description: "Fried fritters stuffed with seasoned beef",
      allergens: ["gluten"],
      proteins: ["beef"],
      ingredients: ["Green Banana", "Yautía", "Ground Beef", "Sofrito", "Annatto Oil"],
      sides: ["Hot Sauce", "Mayo-Ketchup"]
    },
    {
      id: "app-3",
      name: "Empanadillas",
      price: 7.99,
      category: "appetizers",
      image: "https://source.unsplash.com/featured/400x300?empanadas+fried+pastry+golden",
      description: "Crispy turnovers filled with chicken or beef",
      allergens: ["gluten", "eggs"],
      proteins: ["chicken", "beef"],
      ingredients: ["Flour", "Chicken or Beef", "Sofrito", "Olives", "Eggs"],
      sides: ["Hot Sauce"]
    },
    {
      id: "app-4",
      name: "Bacalaítos",
      price: 6.99,
      category: "appetizers",
      image: "https://source.unsplash.com/featured/400x300?cod+fish+fritters+fried+crispy",
      description: "Crispy codfish fritters",
      allergens: ["fish", "gluten"],
      proteins: ["fish"],
      ingredients: ["Salted Codfish", "Flour", "Garlic", "Cilantro"],
      sides: ["Hot Sauce"]
    }
  ],

  // ==================== SALADS ====================
  salads: [
    {
      id: "sal-1",
      name: "Ensalada de Aguacate",
      price: 9.99,
      category: "salads",
      image: "https://source.unsplash.com/featured/400x300?avocado+salad+fresh+tomato",
      description: "Fresh avocado salad with tomatoes and onions",
      allergens: [],
      proteins: [],
      ingredients: ["Avocado", "Tomatoes", "Red Onion", "Cilantro", "Lime", "Olive Oil"],
      sides: ["Garlic Bread"]
    },
    {
      id: "sal-2",
      name: "Caesar Salad",
      price: 8.99,
      category: "salads",
      image: "https://source.unsplash.com/featured/400x300?caesar+salad+romaine+croutons",
      description: "Classic Caesar with romaine, parmesan, and croutons",
      allergens: ["dairy", "gluten", "eggs", "fish"],
      proteins: [],
      ingredients: ["Romaine Lettuce", "Parmesan Cheese", "Caesar Dressing", "Croutons"],
      sides: ["Garlic Bread"]
    },
    {
      id: "sal-3",
      name: "Tropical Fruit Salad",
      price: 7.99,
      category: "salads",
      image: "https://source.unsplash.com/featured/400x300?tropical+fruit+salad+mango+pineapple",
      description: "Fresh tropical fruits with honey-lime dressing",
      allergens: [],
      proteins: [],
      ingredients: ["Pineapple", "Mango", "Papaya", "Watermelon", "Honey", "Lime"],
      sides: []
    }
  ],

  // ==================== MAIN COURSE ====================
  mainCourse: [
    {
      id: "main-1",
      name: "Mofongo con Camarones",
      price: 18.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?mofongo+plantain+shrimp+garlic",
      description: "Mashed plantains with garlic and shrimp in creole sauce",
      allergens: ["shellfish"],
      proteins: ["shrimp"],
      ingredients: ["Green Plantains", "Garlic", "Pork Cracklings", "Shrimp", "Creole Sauce"],
      sides: ["White Rice", "Beans", "Salad"]
    },
    {
      id: "main-2",
      name: "Pernil Asado",
      price: 16.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?pernil+roasted+pork+shoulder",
      description: "Slow-roasted pork shoulder marinated in adobo",
      allergens: [],
      proteins: ["pork"],
      ingredients: ["Pork Shoulder", "Adobo Seasoning", "Garlic", "Oregano", "Vinegar"],
      sides: ["Rice & Beans", "Tostones", "Salad"]
    },
    {
      id: "main-3",
      name: "Arroz con Pollo",
      price: 14.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?arroz+con+pollo+yellow+rice+chicken",
      description: "Yellow rice with chicken, vegetables, and saffron",
      allergens: [],
      proteins: ["chicken"],
      ingredients: ["Chicken", "Rice", "Sofrito", "Peas", "Carrots", "Saffron", "Olives"],
      sides: ["Sweet Plantains", "Salad"]
    },
    {
      id: "main-4",
      name: "Churrasco",
      price: 22.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?churrasco+skirt+steak+grilled+chimichurri",
      description: "Grilled skirt steak with chimichurri sauce",
      allergens: [],
      proteins: ["beef"],
      ingredients: ["Skirt Steak", "Chimichurri", "Garlic", "Olive Oil"],
      sides: ["Mashed Potatoes", "Grilled Vegetables", "Salad"]
    },
    {
      id: "main-5",
      name: "Pescado Frito",
      price: 17.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?whole+fried+fish+red+snapper",
      description: "Whole fried red snapper with garlic sauce",
      allergens: ["fish"],
      proteins: ["fish"],
      ingredients: ["Red Snapper", "Garlic", "Lime", "Flour", "Seasoning"],
      sides: ["White Rice", "Beans", "Tostones"]
    },
    {
      id: "main-6",
      name: "Ropa Vieja",
      price: 15.99,
      category: "mainCourse",
      image: "https://source.unsplash.com/featured/400x300?ropa+vieja+shredded+beef+stew",
      description: "Shredded beef in tomato-based creole sauce",
      allergens: [],
      proteins: ["beef"],
      ingredients: ["Flank Steak", "Tomato Sauce", "Bell Peppers", "Onions", "Garlic", "Sofrito"],
      sides: ["White Rice", "Sweet Plantains", "Black Beans"]
    }
  ],

  // ==================== DESSERTS ====================
  desserts: [
    {
      id: "des-1",
      name: "Flan de Coco",
      price: 6.99,
      category: "desserts",
      image: "https://source.unsplash.com/featured/400x300?flan+caramel+custard+coconut",
      description: "Coconut custard with caramel sauce",
      allergens: ["eggs", "dairy", "coconut"],
      proteins: [],
      ingredients: ["Eggs", "Coconut Milk", "Condensed Milk", "Sugar", "Vanilla"],
      sides: []
    },
    {
      id: "des-2",
      name: "Tembleque",
      price: 5.99,
      category: "desserts",
      image: "https://source.unsplash.com/featured/400x300?coconut+pudding+dessert+cinnamon",
      description: "Coconut pudding with cinnamon",
      allergens: ["coconut"],
      proteins: [],
      ingredients: ["Coconut Milk", "Cornstarch", "Sugar", "Cinnamon", "Salt"],
      sides: []
    },
    {
      id: "des-3",
      name: "Tres Leches Cake",
      price: 7.99,
      category: "desserts",
      image: "https://source.unsplash.com/featured/400x300?tres+leches+cake+whipped+cream+slice",
      description: "Sponge cake soaked in three types of milk",
      allergens: ["dairy", "eggs", "gluten"],
      proteins: [],
      ingredients: ["Flour", "Eggs", "Evaporated Milk", "Condensed Milk", "Heavy Cream", "Vanilla"],
      sides: []
    },
    {
      id: "des-4",
      name: "Quesito",
      price: 4.99,
      category: "desserts",
      image: "https://source.unsplash.com/featured/400x300?cream+cheese+puff+pastry+sweet",
      description: "Sweet cheese-filled pastry",
      allergens: ["dairy", "gluten"],
      proteins: [],
      ingredients: ["Cream Cheese", "Puff Pastry", "Sugar", "Vanilla"],
      sides: []
    }
  ],

  // ==================== SIDES ====================
  sides: [
    {
      id: "side-1",
      name: "White Rice",
      price: 3.99,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?steamed+white+rice+bowl",
      description: "Fluffy steamed white rice",
      allergens: [],
      proteins: [],
      ingredients: ["Long Grain Rice", "Water", "Olive Oil", "Salt"],
      sides: []
    },
    {
      id: "side-2",
      name: "Rice & Beans",
      price: 4.99,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?rice+beans+sofrito+latin",
      description: "Traditional Puerto Rican rice with pink beans",
      allergens: [],
      proteins: [],
      ingredients: ["Rice", "Pink Beans", "Sofrito", "Ham", "Olives", "Annatto Oil"],
      sides: []
    },
    {
      id: "side-3",
      name: "Tostones",
      price: 4.49,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?tostones+plantain+fried+crispy",
      description: "Crispy twice-fried green plantain slices",
      allergens: [],
      proteins: [],
      ingredients: ["Green Plantains", "Vegetable Oil", "Salt"],
      sides: []
    },
    {
      id: "side-4",
      name: "Maduros",
      price: 4.49,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?sweet+plantains+maduros+caramelized+fried",
      description: "Sweet fried ripe plantains",
      allergens: [],
      proteins: [],
      ingredients: ["Ripe Plantains", "Vegetable Oil", "Salt"],
      sides: []
    },
    {
      id: "side-5",
      name: "Black Beans",
      price: 3.99,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?black+beans+bowl+stew+garnish",
      description: "Slow-cooked black beans with sofrito",
      allergens: [],
      proteins: [],
      ingredients: ["Black Beans", "Sofrito", "Garlic", "Cumin", "Bay Leaf", "Olive Oil"],
      sides: []
    },
    {
      id: "side-6",
      name: "Mashed Potatoes",
      price: 4.49,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?mashed+potatoes+creamy+butter+garlic",
      description: "Creamy garlic mashed potatoes",
      allergens: ["dairy"],
      proteins: [],
      ingredients: ["Potatoes", "Butter", "Milk", "Garlic", "Salt", "Pepper"],
      sides: []
    },
    {
      id: "side-7",
      name: "Grilled Vegetables",
      price: 4.99,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?grilled+vegetables+zucchini+peppers+herbs",
      description: "Seasonal vegetables grilled with herbs",
      allergens: [],
      proteins: [],
      ingredients: ["Zucchini", "Bell Peppers", "Onions", "Mushrooms", "Olive Oil", "Herbs"],
      sides: []
    },
    {
      id: "side-8",
      name: "Yuca Frita",
      price: 5.49,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?yuca+cassava+fries+fried+garlic",
      description: "Crispy fried cassava with garlic dipping sauce",
      allergens: [],
      proteins: [],
      ingredients: ["Yuca (Cassava)", "Vegetable Oil", "Garlic", "Salt", "Lime"],
      sides: []
    },
    {
      id: "side-9",
      name: "Ensalada Verde",
      price: 3.99,
      category: "sides",
      image: "https://source.unsplash.com/featured/400x300?green+salad+mixed+greens+vinaigrette+fresh",
      description: "Simple green salad with vinaigrette",
      allergens: [],
      proteins: [],
      ingredients: ["Mixed Greens", "Tomatoes", "Cucumbers", "Red Onion", "Olive Oil", "Vinegar"],
      sides: []
    }
  ]
};

// ==================== CATEGORIES ====================
export const categories = [
  { key: "beverages",  label: "Beverages",   icon: "🍹" },
  { key: "appetizers", label: "Appetizers",  icon: "🍤" },
  { key: "salads",     label: "Salads",      icon: "🥗" },
  { key: "mainCourse", label: "Main Course", icon: "🍽️" },
  { key: "sides",      label: "Sides",       icon: "🥔" },
  { key: "desserts",   label: "Desserts",    icon: "🍰" }
];

// ==================== ALLERGENS ====================
export const allergenInfo = {
  dairy:    { name: "Dairy",    icon: "🥛" },
  eggs:     { name: "Eggs",     icon: "🥚" },
  fish:     { name: "Fish",     icon: "🐟" },
  shellfish:{ name: "Shellfish",icon: "🦐" },
  nuts:     { name: "Nuts",     icon: "🥜" },
  gluten:   { name: "Gluten",   icon: "🌾" },
  coconut:  { name: "Coconut",  icon: "🥥" },
  soy:      { name: "Soy",      icon: "🫘" }
};