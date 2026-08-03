// ஆர்டர் நிலைக்கான ஒரு வகை (Type)
export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// ஆர்டரின் ஒற்றைத் தயாரிப்பின் வகை
export type OrderItem = {
    productName: string;
    quantityGrams: number;
    price: number; // ஆர்டர் செய்தபோது இருந்த விலை
    cuttingOption: string;
};

// முழு ஆர்டர் வகையும்
export type Order = {
    id: string;
    date: string; // ISO Date String
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
};

// தற்காலிக ஆர்டர் பட்டியல்
export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-928374",
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 நாட்களுக்கு முன்
        status: 'DELIVERED',
        totalAmount: 1850.00,
        items: [
            { productName: "வஞ்சிரம் மீன்", quantityGrams: 1000, price: 750.00, cuttingOption: "CURRY_CUT" },
            { productName: "நண்டு (கடல் நண்டு)", quantityGrams: 500, price: 850.00, cuttingOption: "WHOLE" },
        ],
    },
    {
        id: "ORD-928375",
        date: new Date(Date.now() - 86400000).toISOString(), // நேற்று
        status: 'SHIPPED',
        totalAmount: 1280.00,
        items: [
            { productName: "சங்கரா மீன்", quantityGrams: 2000, price: 320.00, cuttingOption: "SMALL_PIECES" },
        ],
    },
    {
        id: "ORD-928376",
        date: new Date().toISOString(), // இன்று
        status: 'NEW',
        totalAmount: 900.00,
        items: [
            { productName: "வஞ்சிரம் மீன்", quantityGrams: 1000, price: 750.00, cuttingOption: "FRY_CUT" },
            { productName: "சுறா கறி", quantityGrams: 500, price: 300.00, cuttingOption: "WHOLE" },
        ],
    },
];

// ஆர்டர்களைப் பெறுவதற்கான ஒரு Mock செயல்பாடு
export async function getOrdersMock(): Promise<Order[]> {
    // API அழைப்பைப் போல ஒரு சிறிய தாமதத்தைச் சேர்க்கலாம்
    await new Promise(resolve => setTimeout(resolve, 300));
    // சமீபத்திய ஆர்டர்கள் முதலில் வர வரிசைப்படுத்துதல்
    return MOCK_ORDERS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}