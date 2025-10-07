
type Category = "Электроника" | "Одежда" | "Книги";

type CategoriesData = Partial<Record<Category, number>>;

interface SalesArrItem {
  date: string;
  categories: CategoriesData;
};

export type TSalesArr = SalesArrItem[];