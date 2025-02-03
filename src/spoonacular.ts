import axios, { Axios, AxiosResponse } from "axios";

interface IFoodResult {
  totalResults: number;
  searchResults: IGroup[];
}

interface IFood {
  id: number;
  name: string;
  image: string | null;
  link: string;
}

interface IFoodExt extends IFood {
  category: string;
}

interface IGroup {
  name: string;
  totalResults: number;
  results: IFood[];
}

interface IProperty {
  name: string;
  amount: number;
  unit: string;
}

interface INutrient extends IProperty {
  percentOfDailyNeeds: number;
}

interface IRecipeNutrition {
  nutrients: INutrient[];
  properties: IProperty[];
  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightperServing: {
    amount: number;
    unit: string;
  };
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
}

export class Spoonacular {
  constructor(private token: string) {}

  public async search(query: string): Promise<IFoodExt[]> {
    const res: AxiosResponse<IFoodResult> = await axios.get(
      "https://api.spoonacular.com/food/search",
      {
        params: {
          query,
          apiKey: this.token,
        },
      },
    );
    const mapped = res.data.searchResults.map((el) =>
      el.results.map((e) => ({ ...e, category: el.name })),
    );
    const reduced = mapped.reduce((acc, el) => acc.concat(el), []);
    const filtered = reduced.filter((el) =>
      ["Recipes", "Products", "Menu Items", "Simple Foods"].includes(
        el.category,
      ),
    );
    return filtered;
  }

  public async getRecipeNutrition(id: string): Promise<IRecipeNutrition> {
    const res: AxiosResponse<IRecipeNutrition> = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`,
      {
        params: {
          apiKey: this.token,
        },
      },
    );
    return res.data;
  }

  public async getProductNutrition(id: string): Promise<IRecipeNutrition> {
    const product: AxiosResponse<{
      nutrition: IRecipeNutrition;
    }> = await axios.get(`https://api.spoonacular.com/food/products/${id}`, {
      params: {
        apiKey: this.token,
      },
    });
    return product.data.nutrition;
  }

  public async getMenuItemNutrition(id: string): Promise<IRecipeNutrition> {
    const menuItem: AxiosResponse<{
      nutrition: IRecipeNutrition;
    }> = await axios.get(`https://api.spoonacular.com/food/menuItems/${id}`);
    return menuItem.data.nutrition;
  }
}
