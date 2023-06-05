import BlurImageFill from "./BlurImageFill";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInHidden } from "@/components/Variants";
import React, { useState } from "react";

export default function CardShowOverlay({
  children
}: {
  children: React.ReactNode
}) {
  const [selectedCardID, setSelectedCardID] = useState<string>("")

  return (
    <>
      <motion.div
        layoutId="1"
        key="1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInHidden('up', 0.8, 0.1*1)}
        className="card-blog relative bg-white rounded-xl transition duration-700 ease-in-out w-full flex flex-col justify-between hover:shadow-xl cursor-pointer"
        onClick={() => setSelectedCardID("1")}
      >
        <div className="relative">
          <div className="h-60 md:h-56 w-full rounded-t-xl mb-3 relative bg-gray-200">
            <BlurImageFill
              style="rounded-t-xl"
              title="Agenda"
              srcImage="https://res.cloudinary.com/dgk0qcjjb/image/upload/v1633085281/nfitec/cover_blog_zma0mm.png"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between px-5 py-1 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <a className="text-gray-900 font-bold text-xl tracking-tight mt-1">
                Title
              </a>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[14px] font-normal">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem veniam voluptas porro at autem dolore molestiae illum cum iusto? Perferendis, laboriosam pariatur quo cupiditate optio debitis atque. Tenetur, nostrum aliquid!
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedCardID && (
          <div className="fixed z-50 backdrop-blur-md backdrop-brightness-[.3] w-screen h-screen top-0 left-0">
            <button className="text-white text-3xl py-2 px-4 float-right mr-5 hover:text-primary3" onClick={() => setSelectedCardID("")}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full md:w-fit pl-4 pr-8">
              <motion.div layoutId={selectedCardID} className="w-full md:w-8/12 h-full md:h-11/12 mx-auto bg-white rounded-lg text-pb flex flex-col justify-between">

                <div className="relative mb-5 mt-2 px-5">
                  <h4 className="font-bold text-2xl mb-2 text-primary">Title</h4>
                  <p>Deskripsi</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
