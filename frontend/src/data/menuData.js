// ============================================
// MENU DATA STRUCTURE
// ============================================
// This file contains all menu items organized by categories
// Each item includes: name, price, image, description, allergens, proteins, ingredients, and sides

export const menuData = {
  // ============================================
  // BEVERAGES CATEGORY (includes bar options)
  // ============================================
  beverages: [
    {
      id: "bev-1",
      name: "Piña Colada",
      price: 8.99,
      category: "beverages",
      type: "bar",
      image: "/images/pina-colada.jpg",
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
      image: "/images/mojito.jpg",
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
      image: "/images/orange-juice.jpg",
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
      image: "/images/cafe-con-leche.jpg",
      description: "Strong Puerto Rican coffee with steamed milk",
      allergens: ["dairy"],
      proteins: [],
      ingredients: ["Espresso", "Steamed Milk", "Sugar"],
      sides: []
    }
  ],

  // ============================================
  // APPETIZERS CATEGORY
  // ============================================
  appetizers: [
    {
      id: "app-1",
      name: "Tostones",
      price: 6.99,
      category: "appetizers",
      image: "/images/tostones.jpg",
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
      image: "/images/alcapurrias.jpg",
      description: "Fried fritters stuffed with beef",
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
      image: "/images/empanadillas.jpg",
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
      image: "/images/bacalaitos.jpg",
      description: "Crispy codfish fritters",
      allergens: ["fish", "gluten"],
      proteins: ["fish"],
      ingredients: ["Salted Codfish", "Flour", "Garlic", "Cilantro"],
      sides: ["Hot Sauce"]
    }
  ],

  // ============================================
  // SALADS CATEGORY
  // ============================================
  salads: [
    {
      id: "sal-1",
      name: "Ensalada de Aguacate",
      price: 9.99,
      category: "salads",
      image: "/images/avocado-salad.jpg",
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
      image: "/images/caesar-salad.jpg",
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
      image: "/images/fruit-salad.jpg",
      description: "Fresh tropical fruits with honey-lime dressing",
      allergens: [],
      proteins: [],
      ingredients: ["Pineapple", "Mango", "Papaya", "Watermelon", "Honey", "Lime"],
      sides: []
    }
  ],

  // ============================================
  // MAIN COURSE CATEGORY
  // ============================================
  mainCourse: [
    {
      id: "main-1",
      name: "Mofongo con Camarones",
      price: 18.99,
      category: "mainCourse",
      image: "/images/mofongo-camarones.jpg",
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
      image: "/images/pernil.jpg",
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
      image: "/images/arroz-con-pollo.jpg",
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
      image: "/images/churrasco.jpg",
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
      image: "/images/pescado-frito.jpg",
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
      image: "/images/ropa-vieja.jpg",
      description: "Shredded beef in tomato-based creole sauce",
      allergens: [],
      proteins: ["beef"],
      ingredients: ["Flank Steak", "Tomato Sauce", "Bell Peppers", "Onions", "Garlic", "Sofrito"],
      sides: ["White Rice", "Sweet Plantains", "Black Beans"]
    }
  ],

  // ============================================
  // DESSERTS CATEGORY
  // ============================================
  desserts: [
    {
      id: "des-1",
      name: "Flan de Coco",
      price: 6.99,
      category: "desserts",
      image: "/images/flan-coco.jpg",
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
      image: "/images/tembleque.jpg",
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
      image: "/images/tres-leches.jpg",
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
      image: "/images/quesito.jpg",
      description: "Sweet cheese-filled pastry",
      allergens: ["dairy", "gluten"],
      proteins: [],
      ingredients: ["Cream Cheese", "Puff Pastry", "Sugar", "Vanilla"],
      sides: []
    }
  ]
};

// ============================================
// CATEGORY LABELS FOR NAVIGATION
// ============================================
export const categories = [
  { key: "beverages", label: "Beverages", icon: "🍹" },
  { key: "appetizers", label: "Appetizers", icon: "🍤" },
  { key: "salads", label: "Salads", icon: "🥗" },
  { key: "mainCourse", label: "Main Course", icon: "🍽️" },
  { key: "desserts", label: "Desserts", icon: "🍰" }
];

// ============================================
// ALLERGEN INFORMATION
// ============================================
export const allergenInfo = {
  dairy: { name: "Dairy", icon: "🥛" },
  eggs: { name: "Eggs", icon: "🥚" },
  fish: { name: "Fish", icon: "🐟" },
  shellfish: { name: "Shellfish", icon: "🦐" },
  nuts: { name: "Nuts", icon: "🥜" },
  gluten: { name: "Gluten", icon: "🌾" },
  coconut: { name: "Coconut", icon: "🥥" },
  soy: { name: "Soy", icon: "🫘" }
};
