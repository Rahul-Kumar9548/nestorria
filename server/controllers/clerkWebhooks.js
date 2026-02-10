import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req,res)=> {
     try {
            // Creating a Svix instance
            const whook = new Webhook(process.env.CLERK_WEBHOOk_SECRET)
            // Get headres
            const headres = {
                 "svix-id": req.headres["svix-id"],
                 "svix-timestamp": req.headres["svix-timestamp"],
                 "svix-signature": req.headres["svix-signature"]
            }

            // Verfiying headers
            await whook.verify(JSON.stringify(req.body), headres)

            // Getting data from request body...
            const {data, type} = req.body

            // Switch Cases for different froms
             switch (type) {
                case "user-created": {
                    const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        username: data.first_name + " " + data.last_name,
                        image: data.image_url,
                    };
                     await User.create(userData)
                    break;
                }
                  case "user-updated": {
                    const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        username: data.first_name + " " + data.last_name,
                        image: data.image_url,
                    };
                     await User.findByIdAndUpdate(userData)
                    break;
                }

                 case "user-deleted": {
                     await User.findByIdAndDelete(data.id)
                    break;
                }

                default:
                    break;
             }
             res.json({success:true, message: "webhook Recieved"})
     } catch (error) {
        console.log({success: false, message: error.message})
     }
};

export default clerkWebhooks