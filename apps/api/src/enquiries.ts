import { z } from "zod";
export const enquirySchema=z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(254),phone:z.string().trim().min(7).max(24),message:z.string().trim().min(5).max(2000),productId:z.number().int().positive().optional()});
export type Enquiry=z.infer<typeof enquirySchema>;
export interface EmailProvider{send(enquiry:Enquiry):Promise<void>;}
export class LocalEmailProvider implements EmailProvider{readonly inbox:Enquiry[]=[];async send(enquiry:Enquiry):Promise<void>{this.inbox.push(enquiry);console.info(`[local enquiry inbox] Received enquiry from ${enquiry.name} <${enquiry.email}>`);}}
