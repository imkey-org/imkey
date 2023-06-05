import React from "react";
import Provider from "./providers/Context";
import Overlay from "./providers/Overlay";
import { motion } from "framer-motion";
import Navbar from "./main/Navbar";
import Footer from "./main/Footer";

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      <div className="relative top-0">
        <Overlay />
        <div className="relative top-0 left-0 flex flex-col justify-between">
          <Navbar />
          <div className="mb-auto">
            <motion.main
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              { children }
            </motion.main>
          </div>
          <Footer />
        </div>
      </div>
    </Provider>
  )
}
