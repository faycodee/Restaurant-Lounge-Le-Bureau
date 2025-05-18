const axios = require("axios");
require("dotenv").config();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.SITE_NAME || "Lounge Le Bureau";

// Menu data
const MENU_DATA = {
  menu: {
    title: "Menu",
    sections: {
      salads: "Salad",
      hotStarters: "Hot Starters",
      starters: "Starters",
      traditional: "Traditional Dishes",
      pizza: "Pizza Over à Wood Fire",
      pasta: "Pasta Italienne",
      meatAndPoultry: "Meat and Poultry",
      fish: "Fish",
    },
    salads: {
      richBureau: {
        name: "Rich salad the Bureau",
        description:
          "Salad Mesclun, Avocado, Shrimp, Palm Heart, Cor, Grilled pepper, cold cuts, fresh tomato",
      },
      market: {
        name: "Market Salad",
        description:
          "Green lettuce, fresh tomato, Grated carrot, Green bean, Cucumber, Potato, Corn, Pepper, Boiled eggs, Tuna, Onion",
      },
      caesar: {
        name: "Cesar Salad",
        description: "Caesar trend, Poultry, Parmesan, Candied tomato, Anchovy",
      },
    },
    specialties: {
      cheeseSlate: "Cheese Slate",
      beefCarpaccio: "Beef Carpaccio",
      avocadoShrimp: {
        name: "Avocado with Shrimp Cocktail Sauce",
      },
    },
    hotStarters: {
      gratineeEggplant: "Gratinee Eggplant",
      seafoodGratin: "Seafood Gratin",
      legumesGratin: "Gratin with Legume",
      pilPilShrimp: "Pil Pil Shrimp in Andalusian Style",
      vegetableSoup: "Vegetable Soup",
      fishSoup: "Fish Soup",
    },
    starters: {
      moroccanSalad: {
        name: "Moroccan Salad",
        description: "Tomato, Onion, Tuna",
      },
      aubergineSalad: "Aubergine salad",
      brioatesAssortment: "Brioates Assortment",
      chickenPastilla: "Chicken Pastilla",
      seafoodPastilla: "Sea Food Pastilla",
      harira: "Traditional Moroccan Soup (Harira)",
    },
    pizza: {
      margherita: {
        name: "Margherita",
        description: "Tomato sauce, mozzarella, basil",
      },
      seafood: {
        name: "Seafood",
        description:
          "Tomato sauce, mozzarella, shrimp, squid, mussels, basil, oregano",
      },
      fourCheeses: {
        name: "4 Cheeses",
        description: "Recotta, mozzarella, blue, fontal, parmesan",
      },
      bureau: {
        name: "Pizza The Bureau",
        description:
          "Tomato sauce, mozzarella, minced meat, smoked turkey ham, button mushrooms, oregano",
      },
      custom: {
        name: "Pizza of Your Choice",
        description: "Composition of our client",
      },
    },
    pasta: {
      penneToscana: {
        name: "Penne alla Toscana",
        description: "Smoked turkey ham, Mushrooms, Spinach, Basil",
      },
      tagliatelleAlfredo: {
        name: "Tagliatelle Alfredo",
        description: "Sautéed chicken, crème fraîche, oregano",
      },
      linguineMamma: {
        name: "Linguine della Mamma",
        description: "Tuna, Mushrooms, Tomato sauce",
      },
      spaghettiPuttanesca: {
        name: "Spaghetti Puttanesca",
        description:
          "Salted anchovies, Cherry tomato, Black olives, Basil, Olive oil",
      },
      spaghettiDelmare: {
        name: "Spaghetti Delmare",
        description: "Squid, Shrimp, Mussels, Cherry tomato, Olive oil, Basil",
      },
    },
    traditional: {
      beefTagine: {
        name: "Beef Tagine",
        description: "With onions and almonds",
      },
      meatballTagine: {
        name: "Minced Meatball Tagine",
        description: "Tomato sauce and egg",
      },
      chickenTagine: {
        name: "Chicken Tagine",
        description: "With candied lemons and olives",
      },
      moroccanTagine: {
        name: "Moroccan-Style Fish Tagine",
        description: "Depending on the arrival of the day",
      },
      couscous: {
        beef: "Beef Couscous",
        chicken: "Chicken Couscous",
        vegetable: "Vegetable Couscous",
        moroccan: {
          name: "Moroccan-Style Couscous",
          description: "Semolina, Onion and raisins caramelis, Chickpeas",
        },
      },
      seffa: {
        name: "Angel-Haired Seffa",
        description: "Beef Or Chicken",
        ingredients:
          "Very Fine Vermicelli, Dried Fruits, Raisins, Almonds, Dates",
      },
    },
    meatAndPoultry: {
      beefFillet: {
        name: "Beef Fillet",
        description: "220G",
      },
      beefSteak: {
        name: "Beef Steak",
        description: "220G",
      },
      ossoBucco: {
        name: "Osso Bucco",
        description: "Baked veal shank",
      },
      mincedBeef: {
        name: "Minced Beef",
        description: "Mushrooms of Paris",
      },
      chickenCutlet: {
        name: "Breaded Chicken Cutlet",
      },
      lemonChicken: {
        name: "Chicken cutlet with lemon",
      },
      mincedChicken: {
        name: "Minced chicken",
        description: "Two Mushrooms Across Asia",
      },
      moroccanSkewers: {
        name: "Moroccan Chicken Skewers",
      },
      cordonBleu: {
        name: "Chicken cordon bleu",
        description: "Tarragon Sauce",
      },
      accompaniments: {
        title: "Accompaniments",
        options: "Vegetables or Pasta, Mashed Potatoes, Fresh Fries, Rice",
      },
    },
    fish: {
      dorade: {
        name: "Oven-Stuffed Dorade Wood Oven",
      },
      saintPierre: {
        name: "Filet of Saint Pierre in the Moroccan style",
      },
      swordfish: {
        name: "Grilled Swordfish Fillet",
        description: "Green Sauce with Olive Oil",
      },
      salmon: {
        name: "Grilled Salmon Pave",
        description: "in the Moroccan style",
      },
    },
    pricing: {
      salads: "Starting from 85 DH",
      hotStarters: "Starting from 70 DH",
      starters: "Starting from 70 DH",
      traditional: "Starting from 90 DH",
      pizza: "Starting from 70 DH",
      pasta: "Starting from 90 DH",
      meatAndPoultry: "Starting from 110 DH",
      fish: "Starting from 180 DH",
    },
  },
};

const suggestDish = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-4b:free",
        messages: [
          {
            role: "system",
            content: `
            You are a friendly and efficient restaurant assistant for **${SITE_NAME}** .
            
            Begin with small intro based on question and Follow this format in your responses(answer under 30 words):
            
      
                  
            Dish Name : Price DH n/
             - Short description of the dish.

             then give her a question
            
            Formatting rules:
            - Keep answers brief and helpful
            - under 20 words
                `,
              },  {
            role: "system",
            content: `Menu data: ${JSON.stringify(MENU_DATA)}`,
          },
          
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenRouter API");
    }

    res.json({
      success: true,
      suggestion: response.data.choices[0].message.content,
      formatted: true,
    });
  } catch (error) {
    console.error("Chatbot Error:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({
      success: false,
      error: "Failed to get suggestion",
    });
  }
};

module.exports = { suggestDish };
