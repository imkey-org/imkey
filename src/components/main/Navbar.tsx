import { useToggle } from "../providers/Context";
import { motion } from "framer-motion";
import Link from "next/link";
import BlurImage from "../BlurImage";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  const { open, toggle, sticky } = useToggle();
  const nav = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Programs",
      link: "/programs",
    },
    {
      title: "Blog",
      link: "/blog",
    },
    {
      title: "Teams",
      link: "/team",
    },
    {
      title: "About",
      link: "/about",
    }
  ]

  return(
    <>
      <nav
        className={
          `header_fixed w-full z-50 transition-all duration-500 ease-out
          ${open ?
              "h-full md:h-auto pt-0 px-0"
            :
              (sticky ? "pt-5 pb-2 px-6 md:px-24" : "pt-3 px-7")
          }
        `}
      >
        <motion.div
          animate={open ? { height: "100%" } : { height: "0%" }}
          className={
            `relative w-full transition-all duration-500 ease-out z-50
            ${pathname != "/" ? `${sticky ? "text-white" : (open ? "text-white" : "text-black")}` : "text-white"}
            ${open ?
                "bg-primary"
              :
                `
                  ${sticky ?
                      "bg-primary/80 backdrop-filter backdrop-blur shadow-lg shadow-primary/30 rounded-[14px]"
                    :
                      ""
                  }
                `
            }
          `}
        >
          <div className="relative flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:flex-row md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between p-4 w-full lg:w-1/7">
              <Link href="#" className="tracking-wider focus:outline-none focus:shadow-outline">
                <div className="flex items-center justify-center">
                  <BlurImage
                    style="mr-2 transition-all duration-300 ease-in-out"
                    width={sticky ? 54 : 60}
                    height={sticky ? 54 : 60}
                    srcImage="/images/icons/icon-72x72.png"
                    title="Logo IMKEY"
                  />
                  <h4 className="hidden lg:flex flex-col font-semibold text-sm">Ikatan Mahasiswa Kendal <p className="font-normal text-xs">Yogyakarta</p></h4>
                  <h2 className={`lg:hidden ${sticky ? "text-3xl" : "text-3xl lg:text-4xl"} font-bold transition-all duration-300 ease-in-out`}>IMKEY</h2>
                </div>
              </Link>
              <button
                aria-label="button-navbar"
                className={`
                  ${open ? "opened" : ""}
                  md:hidden focus:outline-none focus:shadow-outline transition-all ease-linear
                `}
                onClick={() => toggle()}
              >
                <svg width="35" height="35" viewBox="0 0 100 100">
                  <path className="line line1" fill="none" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                  <path className="line line2" d="M 20,50 H 80" />
                  <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
              </button>
            </div>
            <ul
              className={`
              ${open ? "flex navbar-open" : "hidden"} ${!sticky ? "pl-2" : ""}
              bg-transparent flex-col justify-center py-4 md:pb-5 md:flex md:flex-row md:justify-between w-full`}
            >
              <div className="flex-col text-center md:flex md:flex-row mx-auto md:mr-8">
                {nav.map((item, index) => (
                  <li key={index} className="px-3 md:px-4 lg:px-5 xl:px-6 py-3">
                    <Link
                      href={item.link}
                      className={`
                        relative underscore-nav
                        ${(item.link === pathname) ? "active" : ""}
                        py-2 mt-2 text-normal md:text-sm md:mt-0 font-medium hover:text-primary3 focus:text-primary3 focus:border-none focus:outline-none focus:shadow-outline
                      `}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </div>
              <Link
                href={status !== "unauthenticated" ? "/dashboard" : "/auth/signin" }
                className="flex justify-center items-center my-auto mt-8 md:mt-auto mx-auto md:mr-0 md:ml-auto w-10/12 md:w-max max-w-lg bg-primary2-m text-white px-6 py-3 rounded-xl shadow-lg shadow-primary2-m/25 text-normal md:text-sm hover:bg-primary2 hover:shadow-primary2-m/20 transition-all duration-300 ease-in"
              >
                {status !== "unauthenticated" ?
                    <>
                      <i className="fa-solid fa-house pr-2"></i> Dashboard
                    </>
                  :
                    <>
                      <i className="fa-solid fa-right-to-bracket pr-2"></i> Sign In
                    </>
                }
              </Link>
            </ul>
          </div>
        </motion.div>
      </nav>
    </>
  )
}
