import React from "react";
import Overlay from "./providers/Overlay";
import { motion } from "framer-motion";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <motion.div
        className="relative top-0"
        initial={{ y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <Overlay />
        <div className="relative top-0 left-0">
          <main>
            { children }
          </main>
        </div>
      </motion.div>
    </>
  )
}
