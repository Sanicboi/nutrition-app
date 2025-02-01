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

interface IFoodExt extends IFood {
  category: string;
}

interface IGroup {
  name: string;
  totalResults: number;
  results: IFood[];
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
    const mapped = res.data.searchResults.map(el => el.results.map(e => ({...e, category: el.name})));
    const reduced = mapped.reduce((acc, el) => acc.concat(el), []);
    return reduced;
  }
}
