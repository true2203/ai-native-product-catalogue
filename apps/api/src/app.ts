import express from "express";
import cors from "cors";
import {z} from "zod";
import {FakeStoreProvider,topRated,type ProductProvider} from "./catalogue.js";
import {createEmailProvider,enquirySchema,type EmailProvider} from "./enquiries.js";
export function createApp(deps:{products?:ProductProvider;email?:EmailProvider}={}){
 const products=deps.products??new FakeStoreProvider();const email=deps.email??createEmailProvider();const app=express();
 app.use(cors({origin:process.env.WEB_ORIGIN?.split(",")??true}));app.use(express.json({limit:"32kb"}));
 app.get("/api/health",(_req,res)=>res.json({status:"ok"}));
 app.get("/api/products/featured",async(_req,res,next)=>{try{res.json(topRated(await products.all(),5));}catch(e){next(e);}});
 app.get("/api/categories",async(_req,res,next)=>{try{res.json(await products.categories());}catch(e){next(e);}});
 app.get("/api/products",async(req,res,next)=>{try{const all=await products.all();const q=String(req.query.q??"").trim().toLowerCase();const category=String(req.query.category??"").trim().toLowerCase();const result=all.filter(p=>(!q||p.title.toLowerCase().includes(q)||p.description.toLowerCase().includes(q))&&(!category||p.category.toLowerCase()===category));res.json(topRated(result));}catch(e){next(e);}});
 app.get("/api/products/:id",async(req,res,next)=>{try{const parsed=z.coerce.number().int().positive().safeParse(req.params.id);if(!parsed.success)return res.status(400).json({error:"Invalid product id"});const p=await products.byId(parsed.data);if(!p)return res.status(404).json({error:"Product not found"});res.json(p);}catch(e){next(e);}});
 app.post("/api/enquiries",async(req,res,next)=>{const parsed=enquirySchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Please provide valid contact details and a message",details:parsed.error.flatten().fieldErrors});try{await email.send(parsed.data);res.status(202).json({message:"Thank you. Your enquiry has been received."});}catch(e){next(e);}});
 app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error("API error",err);res.status(502).json({error:"The service is temporarily unavailable. Please try again."});});
 return app;
}
