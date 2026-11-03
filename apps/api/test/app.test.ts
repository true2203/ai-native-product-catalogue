import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app.js";
import type {Product,ProductProvider} from "../src/catalogue.js";
import {LocalEmailProvider} from "../src/enquiries.js";
const data:Product[]=[
{id:1,title:"Low rated",price:10,description:"One",category:"books",image:"https://example.com/1.png",rating:{rate:3,count:1}},
{id:2,title:"Top rated",price:20,description:"Two",category:"books",image:"https://example.com/2.png",rating:{rate:4.8,count:2}},
{id:3,title:"Other item",price:30,description:"Three",category:"electronics",image:"https://example.com/3.png",rating:{rate:4,count:1}}];
const provider:ProductProvider={all:async()=>data,byId:async id=>data.find(p=>p.id===id)??null,categories:async()=>["books","electronics"]};
describe("catalogue API",()=>{
 it("orders featured products by rating",async()=>{const r=await request(createApp({products:provider})).get("/api/products/featured").expect(200);expect(r.body.map((p:Product)=>p.id)).toEqual([2,3,1]);});
 it("searches title and filters category",async()=>{const r=await request(createApp({products:provider})).get("/api/products?q=top&category=books").expect(200);expect(r.body.map((p:Product)=>p.id)).toEqual([2]);});
 it("returns 404 for missing product",async()=>{await request(createApp({products:provider})).get("/api/products/999").expect(404);});
 it("validates and captures enquiry",async()=>{const inbox=new LocalEmailProvider();await request(createApp({products:provider,email:inbox})).post("/api/enquiries").send({name:"Test User",email:"test@example.com",phone:"1234567890",message:"Please contact me"}).expect(202);expect(inbox.inbox).toHaveLength(1);});
 it("rejects invalid enquiry",async()=>{await request(createApp({products:provider})).post("/api/enquiries").send({name:"x"}).expect(400);});
});
