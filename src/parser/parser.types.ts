export interface CheckDataResponse {
  compareValue: string;
  grabbedValues?: { [key: string]: string };
  allData?: {
    compareValue: string;
    grabbedValues?: { [key: string]: string };
  }[];
}
