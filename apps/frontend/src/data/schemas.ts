import { z } from 'zod';

// நாம் முன்பு ts-rest contract-இல் பயன்படுத்திய அதே ஸ்கீமா வடிவத்தை இங்குப் பயன்படுத்துகிறோம்
export const OrderItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantityGrams: z.number().int().positive(),
  cuttingOption: z.string().max(50),
});

export const CreateOrderInputSchema = z.object({
  customer: z.object({
    name: z.string().max(100, "பெயர் 100 எழுத்துகளுக்கு மிகாமல் இருக்க வேண்டும்"),
    phoneNumber: z.string().min(10, "10 இலக்க எண் தேவை").max(15, "தொலைபேசி எண் மிக நீளமாக உள்ளது"),
    email: z.string().email("சரியான மின்னஞ்சல் முகவரி தேவை").optional().or(z.literal('')),
  }),
  deliveryAddress: z.string().min(10, "முகவரி 10 எழுத்துகளுக்குக் குறையாமல் இருக்க வேண்டும்"),
  pincode: z.string().length(6, "பின்கோடு 6 இலக்கங்கள் இருக்க வேண்டும்"),
  paymentMethod: z.enum(['COD', 'UPI']), 
  items: z.array(OrderItemInputSchema).min(1, "குறைந்தது ஒரு தயாரிப்பையாவது சேர்க்க வேண்டும்"),
   transactionId: z.string().nullable(),
});