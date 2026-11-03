import { z } from "zod";
import nodemailer from "nodemailer";

export const enquirySchema=z.object({name:z.string().trim().min(2).max(80),email:z.string().trim().email().max(254),phone:z.string().trim().min(7).max(24),message:z.string().trim().min(5).max(2000),productId:z.number().int().positive().optional()});
export type Enquiry=z.infer<typeof enquirySchema>;
export interface EmailProvider{send(enquiry:Enquiry):Promise<void>;}

export class LocalEmailProvider implements EmailProvider {
  readonly inbox:Enquiry[]=[];
  async send(enquiry:Enquiry):Promise<void>{this.inbox.push(enquiry);console.info("[local enquiry inbox] enquiry captured");}
}

export function createEmailProvider():EmailProvider {
  const host=process.env.SMTP_HOST;
  const salesInbox=process.env.SALES_INBOX;
  if(!host||!salesInbox)return new LocalEmailProvider();
  const port=Number(process.env.SMTP_PORT??587);
  const transport=nodemailer.createTransport({
    host,port,secure:process.env.SMTP_SECURE==="true",
    auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD??""}:undefined
  });
  return {
    async send(enquiry:Enquiry){
      await transport.sendMail({
        from:process.env.SMTP_FROM??process.env.SMTP_USER??"no-reply@localhost",
        to:salesInbox,replyTo:enquiry.email,
        subject:`Product enquiry from ${enquiry.name}`,
        text:`Name: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nProduct ID: ${enquiry.productId??"Not specified"}\n\nMessage:\n${enquiry.message}`
      });
    }
  };
}
