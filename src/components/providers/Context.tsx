import React from "react";
import { useRouter } from "next/router";

type toggleContextType = {
  open: boolean;
  toggle: () => void;
  sticky: boolean;
}

const Context = React.createContext<toggleContextType>({} as toggleContextType)

export default function Provider({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [sticky, setSticky] = React.useState(false)
  const router = useRouter()

  const toggle = React.useCallback(() => {
    setOpen((prevState) => !prevState)
  }, [setOpen])

  React.useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
    }

    window.addEventListener("resize", () => {
      if (open && window.innerWidth > 767) {
        setOpen(false)
        document.documentElement.style.overflow = ""
      }
    })

    window.addEventListener("scroll", () => {
      setSticky(window.scrollY >= 5)
    })

    return () => {
      window.removeEventListener("resize", () => {
        if (open && window.innerWidth > 767) {
          setOpen(false)
          document.documentElement.style.overflow = ""
        }
      })

      window.removeEventListener("scroll", () => {
        setSticky(window.scrollY >= 5)
      })
    }
  }, [open, router])

  return (
    <Context.Provider value={{ open, toggle, sticky }}>
      {children}
    </Context.Provider>
  )
}

export function useToggle() {
  return React.useContext(Context)
}
