import axios, { AxiosResponse } from "axios";

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

interface IGroup {
  name: string;
  totalResults: number;
  results: IFood;
}

export class Spoonacular {
  constructor(private token: string) {}

  public async search(query: string): Promise<IFoodResult> {
    const res: AxiosResponse<IFoodResult> = await axios.get(
      "https://api.spoonacular.com/food/search",
      {
        params: {
          query,
          apiKey: this.token,
        },
      },
    );
    return res.data;
  }
}
