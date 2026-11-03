import { z } from "zod";
const productSchema = z.object({id:z.number().int(),title:z.string(),price:z.number(),description:z.string(),category:z.string(),image:z.string().url(),rating:z.object({rate:z.number(),count:z.number()}).optional()});
export type Product = z.infer<typeof productSchema>;
export interface ProductProvider { all():Promise<Product[]>; byId(id:number):Promise<Product|null>; categories():Promise<string[]>; }
export class FakeStoreProvider implements ProductProvider {
  constructor(private readonly baseUrl="https://fakestoreapi.com",private readonly timeoutMs=8000){}
  private async request<T>(path:string):Promise<T>{const r=await fetch(this.baseUrl+path,{signal:AbortSignal.timeout(this.timeoutMs)});if(!r.ok)throw new Error(`Product provider returned ${r.status}`);return r.json() as Promise<T>;}
  async all():Promise<Product[]>{return z.array(productSchema).parse(await this.request<unknown>("/products"));}
  async byId(id:number):Promise<Product|null>{const raw=await this.request<unknown>(`/products/${id}`);if(raw===null||(typeof raw==="object"&&Object.keys(raw).length===0))return null;return productSchema.parse(raw);}
  async categories():Promise<string[]>{return this.request<string[]>("/products/categories");}
}
export function topRated(products:Product[],limit?:number):Product[]{const sorted=[...products].sort((a,b)=>(b.rating?.rate??0)-(a.rating?.rate??0)||a.id-b.id);return limit?sorted.slice(0,limit):sorted;}
