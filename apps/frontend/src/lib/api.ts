// src/lib/api.ts

import { QueryClient } from '@tanstack/react-query'; 

// நாம் இப்போது Backend-ஐ இணைக்கவில்லை, அதனால் ts-rest குறியீடுகள் நீக்கப்படுகின்றன.
// எதிர்காலத்தில் தரவுப் பெறுதலுக்குப் பயன்படும் QueryClient ஐ மட்டும் இங்கே வைக்கலாம்.

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // தரவு புதியதாக இருக்கும் கால அளவு (எ.கா: 5 நிமிடங்கள்)
            staleTime: 1000 * 60 * 5, 
        },
    },
});

// இப்போது, இந்த கோப்பில் எந்த ts-rest அல்லது contract இறக்குமதிகளும் இல்லை.