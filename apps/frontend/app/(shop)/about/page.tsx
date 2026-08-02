import React from "react";
import { Metadata } from "next";
import Image from "next/image";

// Next.js பக்கத்திற்கான தலைப்பு மற்றும் மெட்டா விவரங்கள்
export const metadata: Metadata = {
  title: "எங்களைப் பற்றி | எமனேரி மீனவன்",
  description:
    "எமனேரி மீனவன் நிறுவனத்தின் நோக்கம், மதிப்பு மற்றும் பாரம்பரியத்தைப் பற்றி அறிந்து கொள்ளுங்கள்.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* தலைப்புப் பகுதி */}
      <header className="text-center py-10 bg-gray-50 rounded-lg shadow-sm mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800">
          எங்களைப் பற்றி
        </h1>
        <p className="text-lg md:text-xl mt-3 text-gray-600">
          "தரத்தின் உறுதிப்பாடு, பாரம்பரியத்தின் புதுப்பிப்பு."
        </p>
      </header>

      {/* 1. எமனேரி மீனவன் வரலாறு மற்றும் நோக்கம் */}
      <section className="mb-12 border-b pb-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          எமனேரி மீனவன்: ஒரு புதிய தொடக்கம்
        </h2>
        <div className="text-lg text-gray-700 space-y-4">
          <p>
            எமனேரி மீனவன் என்பது வெறும் ஆன்லைன் மீன் விற்பனை தளம் மட்டுமல்ல; இது
            தலைமுறைகளாகக் கடலில் வாழும் எமனேரி மீனவக் குடும்பங்களின்
            நம்பிக்கையையும் பாரம்பரியத்தையும், நவீன தொழில்நுட்பத்துடன் இணைக்கும்
            ஒரு பாலமாகும்.
          </p>
          <p>
            மீன்களைப் பிடிக்கவும், அவற்றைப் பதப்படுத்தவும், நேர்த்தியாக
            வெட்டவும் தேவையான உழைப்பையும் அறிவையும் கொண்ட மீனவர்களிடமிருந்து,
            எந்தத் தரகர்களும் இல்லாமல், மீன் பிடித்த 24 மணி நேரத்திற்குள்
            வாடிக்கையாளர்களின் சமையலறைக்குக் கொண்டு சேர்ப்பதே எங்கள் முதன்மை
            நோக்கமாகும்.
          </p>
        </div>
      </section>

      {/* 🎣 புதிய பகுதி: எங்கள் மீனவர் - பொன்முடி துரைசாமி */}
      <section className="mb-12 border-b pb-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-6">
          🐟 எங்கள் மீனவர்: பொன்முடி துரைசாமி
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 p-6 rounded-xl border border-blue-200">
          {/* இடது புறம்: படம் (Mock) */}
          <div className="flex-shrink-0 mb-4 md:mb-0 text-center">
            {/* உண்மையான புகைப்படம் கிடைத்தவுடன் இங்கே சேர்க்கலாம் */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto">
              <Image
                src="/images/founder.jpeg"
                alt="Founder"
                fill
                className="rounded-full object-cover border-4 border-orange-300"
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-blue-800">நிறுவனர்</p>
          </div>

          {/* வலது புறம்: விவரங்கள் */}
          <div className="flex-grow text-base md:text-lg text-gray-700 text-center md:text-left leading-8">
            <div>
              <span className="font-bold">முழுப்பெயர்:</span>{" "}
              பொன்முடி துரைசாமி (DOB: 01/07/1970)            {" "}
            </div>
            {" "}
            <div>
              <span className="font-bold">அனுபவம்:</span>{" "}
              <span className="font-bold text-blue-700">
                25 ஆண்டுகளுக்கும் மேலான
              </span>{" "}
              ஆழமான மீன்பிடி அனுபவம்.            {" "}
            </div>
            {" "}
            <div>
              <span className="font-bold">நிலை:</span> மீனவர்
              சங்கக் கூட்டுறவு உறுப்பினர் (உறுப்பினர் எண்: 637).            {" "}
            </div>
            {" "}
            <div>
              <span className="font-bold">முகவரி:</span> No1/163,
              மாரியம்மன் கோவில் தெரு, புளிவலம் கிராமம், கடலூர் மாவட்டம்.
              {" "}
            </div>
            <blockquote className="italic border-l-4 border-orange-500 pl-4 text-gray-600 mt-4">
              "மீன்பிடித் தொழிலில் உள்ள பாரம்பரிய நேர்மையையும், கடல்
              புத்துணர்ச்சியையும் நேரடியாக வாடிக்கையாளர்களிடம் கொண்டு சேர்க்கும்
              நோக்கத்துடன் 'எமனேரி மீனவன்' தொடங்கப்பட்டது."
            </blockquote>
          </div>
        </div>
      </section>

      {/* 2. எங்கள் வாக்குறுதி (Values) */}
      <section className="mb-12 border-b pb-8">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          எங்கள் வாக்குறுதி
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-blue-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🌊 புத்துணர்ச்சி (Freshness)
            </h3>
            <p className="text-gray-600">
              எங்கள் மீன்கள் ரசாயனங்கள் மற்றும் பாதுகாப்பான்கள் (Preservatives)
              இல்லாமல், ஐஸ் பெட்டிகளில் மட்டுமே பதப்படுத்தப்பட்டு, புத்துணர்ச்சி
              குறையாமல் வழங்கப்படுகிறது.
            </p>
          </div>

          <div className="p-6 bg-white border border-blue-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              ⚖️ நம்பகத்தன்மை (Authenticity)
            </h3>
            <p className="text-gray-600">
              சரியான எடை, ஒளிவுமறைவற்ற விலை மற்றும் நீங்கள் ஆர்டர் செய்த மீன்
              வகையை மட்டுமே வழங்குவதில் நாங்கள் நம்பகத்தன்மையுடன் இருக்கிறோம்.
            </p>
          </div>

          <div className="p-6 bg-white border border-blue-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🛠️ கைவினைத் திறன் (Craftsmanship)
            </h3>
            <p className="text-gray-600">
              பாரம்பரிய முறைகளைப் பின்பற்றி, மீன்களைச் சுத்தம் செய்தல்,
              வெட்டுதல் மற்றும் பேக்கேஜ் செய்தல் ஆகியவற்றில் அதிக கவனம்
              செலுத்துகிறோம்.
            </p>
          </div>
        </div>
      </section>

      {/* 3. வாடிக்கையாளர்களுக்கு அழைப்பு */}
      <section className="text-center bg-yellow-50 p-8 rounded-lg border-2 border-yellow-300">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
          எங்கள் பயணத்தில் இணையுங்கள்!
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          எமனேரி மீனவன் ஒரு வணிகம் மட்டுமல்ல, இது ஒரு பாரம்பரிய முயற்சி. தரமான
          கடல் உணவுகளை வழங்குவதில் எங்களின் உறுதிப்பாட்டிற்கு ஆதரவளியுங்கள்.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-600 text-white text-lg font-semibold py-3 px-8 rounded-full hover:bg-orange-700 transition duration-300 shadow-lg"
        >
          இன்றைய மீன் வகைகளைப் பார்க்கவும்
        </a>
      </section>
    </main>
  );
}
