import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react';

export const Route = createFileRoute('/_public/_default/bulletin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Fragment>
      <section className="relative bg-deep-forest text-white py-24 md:py-32 overflow-hidden islamic-pattern">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight tracking-tighter">
              The LAUMGA Bulletin
            </h1>
            <p className="mt-4 text-lg md:text-xl font-body text-white/80">
              Perspectives on Faith, Science, and Society.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 w-full max-w-lg -translate-x-1/2 px-6">
          <div className="flex gap-2 p-2 justify-center rounded-full bg-white/20 backdrop-blur-lg shadow-lg">
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-vibrant-lime px-5 text-sm font-bold text-deep-forest">
              General
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium text-white hover:bg-white/10">
              Health
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium text-white hover:bg-white/10">
              Islamic Studies
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium text-white hover:bg-white/10">
              Campus News
            </button>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 bg-white p-6 rounded-lg shadow-sm">
            <div
              className="w-full lg:w-1/2 aspect-video bg-cover bg-center rounded-lg flex-1"
              data-alt="Abstract image representing human crisis and resilience."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAippGBv8ayDuhlZ7quIkR-ANJoc7lO4K7S8AJDbe8J08CHMbmKUZNcfQKM2Udh1vgT27qOQ-4dF8-dCjI_u_Im84fh_KY7FFanZAPV4Srz4lFASo-BZTykLC_vfixb9uzcnnKcusKmk0Ydor3wy14xkZp51w1BieNdep6e1KgdW3dBfZQfQDwkbkMtpVQcY7GVqEwuFW7kVNO448YVOSz7-LYCJILKh0uarBB8QRJfKYjTBejEkDYNYrAlgQrBYlnRao8s0RtQ7p0')",
              }}
            />
            <div className="flex lg:w-1/2 flex-col justify-center gap-4 py-4">
              <p className="text-sm font-bold uppercase tracking-widest text-sage-green">
                EDITOR'S PICK
              </p>
              <h2 className="text-4xl font-display font-medium leading-tight text-deep-forest">
                Human Under the Siege of Crisis
              </h2>
              <p className="text-base font-normal leading-relaxed text-deep-forest/70">
                An in-depth analysis of modern challenges and their impact on
                the human condition from an Islamic perspective, exploring
                pathways to resilience and faith.
              </p>
              <p className="text-sm font-medium text-institutional-green">
                By Dr. Aisha Al-Farsi • Jan 15, 2024
              </p>
              <div className="mt-4">
                <a
                  className="inline-block text-base font-bold text-deep-forest underline-expand"
                  href="#"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                    data-alt="Stylized illustration of a brain with floral patterns, symbolizing mental health."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvpYNTKdvCl_j683q86azlut4bUt4xj9Wdp3L4CCwArNbMOQ-lE88oKb1OE7g-CYmMJ7zNWtB5_ycnifJgARhGbv9XZrprMaD7wsXa0TIoG2aVTUhgUBFuuHHFyfABVi1Mrv5HNeK0gF1P0LDZC1moopqam2JfJv5CtU31BAO-VgcLDDLMyogaIvw-_wUhfb23vAboKGPfmk_gF2EzUkvaA5mw8kN-e-LqYJtTJ9iURLqIBnzw_gGKxZwUTz24lx_96DMTSjUOMsw')",
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    Health
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    Medico-Islamic Perspectives on Mental Health
                  </h3>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                    data-alt="Golden coins spilling from a modern Zakat collection box."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfIkFLjlkkcIxSJkSCi8uIq_YBujbciKGR75ASMkvFKNd4-Sb4GB1xdb-NeOUV1F-mVeKLCoXJ6rF6VHKbzV_5FwKlEMYUH_fGMzlM6jSWuRRUXs5tYYjhO-6-Gevv5XDEptTcZD8qNRDjeLDwXfzW547x66oOZAcKdK90bPE2vPrXPltpIUH8evBvYWNFjBHEppw9W6NzUoL357IR7AKPT_h506I-WsAMuxQ2msutndKK3WgBeGZt-ChBYjDa2s-R0ESSH9U20iY')",
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    Islamic Studies
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    The Role of Zakat in Modern Economies
                  </h3>
                  <p className="font-arabic text-right text-lg mt-2 text-deep-forest/80">
                    دور الزكاة في الاقتصادات الحديثة
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                    data-alt="A collage of photos from university campus events over the past year."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCReGAvKnMJwzwr1U8od_hk7837JVZ-GZRnKLO_i4z2QSrA-H-u5twvWirIscA822GZACDx5HqODAv5iAMHFtKXaj1ObQ1xtTMatmA_a-r8nN937gaXs5xdTFlxkmN9GzDnxdqe7VOicn1DV1A6nPTGOZQeMYFPPIFhxjLkc_jMpltbxukbt55CrPqlfdY2NmNy4cN8TzVYqlT5ECEmM5ZC-JW_rX-Cew1p-RJWU2spkyM0eMRac0t83N4wzqbgYwsDtVe7qGP3jiI')",
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    Campus News
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    Campus Chronicles: A Year in Review
                  </h3>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-sage-green overflow-hidden"/>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    General
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    The Poetics of Rumi: A Spiritual Journey
                  </h3>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                    data-alt="Intricate tilework of the Sheikh Lotfollah Mosque in Isfahan, Iran."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDs1aia-S-SQtNaL4xiyeTs1q3lN_JUujGmOG3nLZa6KMVAF36HKl3slIZYRUGbziwQiMnCHSP4a1mCUHrWy6V2HDSmR4u8xu6eohs9DifoXteJl1XkEbgwYJmZn-EsNu8jUKPEcsjgeJIvPr-xaTxCKFu9wFqZK-YGMF5dDgb7CcwOxDvXRID_koGaFD6J9btRKGNmhjGRM9pqbwr3afRkbC78Va3lVSmMGg624TJjR3aIaDXOGWMz9D46lCvmFUOnzv0ezi747u4')",
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    General
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    Architectural Marvels of the Islamic World
                  </h3>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover">
                <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                    data-alt="An abstract representation of an AI neural network with glowing nodes."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeJJlD1GsU3KMD_dDprA0yhQyjO9X-COpn-Ub0Rdgt1-QMHxPZd8R8E6-iXz627-kRqcuw3881xEpQZbXyU11_frpcKNxQvUDBJ09hLFn493HBifqksLVZ9XPazB6s9E3h-ayUmZwx4TnT_HzygPePzpI1DJZsyMxD5QGF6_3ZjnGj9RsHA_2i0RtIHhjqBTtznaaBHYgaOnli0Y2pNbotNn5DveeaPwauFFlFILOh7z7K9UclS53Vf7nOXjWdnKTt1I_RzWKqaxE')",
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                    Science
                  </p>
                  <h3 className="font-display text-xl font-medium text-deep-forest grow">
                    Debating AI Ethics: A Faith-Based Approach
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <div className="sticky top-28 space-y-8">
              <div className="relative">
                <input
                  className="w-full h-12 pl-4 pr-12 bg-white border border-transparent rounded-full focus:ring-2 focus:ring-vibrant-lime focus:border-transparent transition"
                  placeholder="Search articles..."
                  type="text"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="material-symbols-outlined text-vibrant-lime">
                    search
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-display text-lg font-medium text-deep-forest mb-4">
                  Trending Now
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="font-display text-4xl font-bold text-vibrant-lime -mt-1">
                      1
                    </span>
                    <p className="font-body text-sm font-medium leading-tight text-deep-forest/80 hover:text-deep-forest transition cursor-pointer">
                      Medico-Islamic Perspectives on Mental Health
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="font-display text-4xl font-bold text-vibrant-lime -mt-1">
                      2
                    </span>
                    <p className="font-body text-sm font-medium leading-tight text-deep-forest/80 hover:text-deep-forest transition cursor-pointer">
                      The Role of Zakat in Modern Economies
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="font-display text-4xl font-bold text-vibrant-lime -mt-1">
                      3
                    </span>
                    <p className="font-body text-sm font-medium leading-tight text-deep-forest/80 hover:text-deep-forest transition cursor-pointer">
                      Debating AI Ethics: A Faith-Based Approach
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-deep-forest text-white p-6 rounded-lg text-center">
                <h4 className="font-display text-lg font-medium mb-3">
                  Get the bulletin in your inbox
                </h4>
                <div className="flex items-center mt-4">
                  <input
                    className="w-full h-10 px-4 bg-white/10 text-white placeholder-white/60 border-0 rounded-l-full focus:ring-2 focus:ring-vibrant-lime"
                    placeholder="Your email address"
                    type="email"
                  />
                  <button className="shrink-0 h-10 w-12 flex items-center justify-center bg-vibrant-lime rounded-r-full text-deep-forest">
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="mt-16 text-center">
          <button className="w-full md:w-auto bg-institutional-green text-white font-bold py-3 px-12 rounded-full text-base transition hover:bg-opacity-90">
            Load More Articles
          </button>
        </div>
      </section>
    </Fragment>
  );
}
