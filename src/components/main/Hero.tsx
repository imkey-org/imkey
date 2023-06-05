import { motion } from "framer-motion";
import { fadeIn, fadeInSide } from "@/components/Variants";
import React from "react";

interface HeroProps {
  servicesRef: React.RefObject<HTMLDivElement>;
  }

export default function Hero({ servicesRef }: HeroProps) {
  const scrollServices = () => servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <div className="container py-28 md:py-44 px-4 sm:px-6 lg:px-14 xl:px-18 mx-auto relative flex flex-col items-center z-30">
        <div className="hero-text flex flex-col items-center text-center">
          <motion.h1
            initial="initial"
            animate="animate"
            variants={fadeInSide('left', 1.4)}
            className="font-bold text-4xl lg:text-5xl max-w-xl text-white"
          >
            Grow Up <span className="text-primary2-m">Together</span> and Give To Each Other.
          </motion.h1>
          <motion.p
            initial="initial"
            animate="animate"
            variants={fadeInSide('left', 1.6, 0.2)}
            className="text-gray-200 text-base leading-relaxed mt-4 font-medium max-w-lg"
          >
            Ikatan Mahasiswa Kendal Yogyakarta (IMKEY). IMKEY adalah anak kendal yang berada di Yogyakarta untuk berkuliah.
          </motion.p>
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn('down', 1.4, 0.2)}
          >
            <button onClick={scrollServices} className="mt-10 bg-primary2-m hover:bg-primary2 text-sm py-3 px-6 rounded-xl tracking-wide transition-color duration-200 ease-in text-white shadow-xl shadow-primary2-m/30">
              Tentang Kami
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
