import AuthLayout from "@/components/LayoutAuth";
import Navbar from "@/components/auth/Navbar";
import BlurImage from "@/components/BlurImage";
import BlurImageFill from "@/components/BlurImageFill";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import type { NextPage } from "next";
import { type SignInResponse, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";

const images = [
  "/images/hero.jpg",
  "/images/hero2.jpg"
];

const SignIn: NextPage = () => {
  const [opacities, setOpacities] = useState<number[]>([])

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: images.length,
      loop: true,
      detailsChanged(s) {
        const new_opacities = s.track.details.slides.map((slide) => slide.portion);
        setOpacities(new_opacities);
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        })
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ],
  )

  const router = useRouter()
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;


    try {
      const result: SignInResponse = await signIn<"emailAndPassword">("emailAndPassword", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        await router.replace("/");
      } else {
        setError(result?.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!!session?.user) void router.push('/');
  }, [session, router]);

  return (
    <AuthLayout>
      <div className="relative bg-white flex flex-col-reverse lg:flex-row justify-start md:justify-between h-full">
        <div className="relative bg-dark lg:w-7/12 my-5 mx-7 lg:m-10 px-8 py-3 lg:p-8 rounded-2xl flex flex-col justify-between shadow-2xl shadow-dark/30">
          <div className="rounded-2xl bg-login">
            {images.map((src, i) => (
              <div
                key={i}
                className="fader__slide"
                style={{ opacity: opacities[i] }}
              >
                <BlurImageFill srcImage={src} title="bg" style="absolute opacity-10" />
              </div>
            ))}
          </div>
          <div className="flex justify-center lg:justify-start mx-0 lg:mx-4">
            <div className="text-white tracking-wider focus:outline-none focus:shadow-outline">
              <div className="flex items-center">
                <BlurImage
                  style="mr-3 transition-all duration-300 ease-in-out"
                  width={64}
                  height={64}
                  srcImage="/images/icons/icon-72x72.png"
                  title="Logo IMKEY"
                />
                <h4 className="flex flex-col font-semibold">Ikatan Mahasiswa Kendal <p className="font-normal text-sm">Yogyakarta</p></h4>
              </div>
            </div>
          </div>
          <div ref={sliderRef} className="fader hidden lg:block">
            <div className="relative my-5 mx-2 h-80 overflow-hidden rounded-xl shadow-md">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="fader__slide"
                  style={{ opacity: opacities[i] }}
                >
                  <BlurImageFill srcImage={src} title="IMKEY"  />
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block mx-4 mb-3">
            <h1 className="text-white text-2xl font-bold">Welcome to IMKEY</h1>
            <p className="text-gray-300 text-sm mt-4 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
        <div className="flex flex-col w-full max-h-full h-full lg:h-full">
          <Navbar />
          <form className="relative max-w-full md:max-w-lg self-center w-full my-7 mx-7 px-8 lg:p-6" onSubmit={submitHandler}>
            <h1 className="font-semibold text-2xl">Welcome Back!</h1>
            <p className="mt-2 text-sm text-gray-500">Please enter sign in details below</p>
            {error &&
              <p>{error}</p>
            }
            <div className="mt-14 relative space-y-8">
              <div className="flex items-center border-2 py-2 px-3 rounded-xl mb-4">
                <div className="bg-primary2-m rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input ref={emailInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type="email" name="email" placeholder="your@imkey.or.id" required />
              </div>
              <div className="flex items-center border-2 py-2 px-3 rounded-xl mb-4">
                <div className="bg-primary2-m rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input ref={passwordInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type={showPassword == true ? "text" : "password"} name="password" placeholder="Password" required />
                <button type="button" className="flex items-center inset-y-0 right-0 mr-1" onClick={() => setShowPassword(!showPassword)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${showPassword == false ? 'hidden' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${showPassword == true ? 'hidden' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link href="#" className="ml-auto mt-6 text-primary2-m hover:text-primary2 transition-all duration-400 ease-in text-sm">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="relative flex justify-center items-center mt-8 w-full bg-dark border border-transparent text-white px-6 py-3 rounded-xl transition-all duration-300 ease-in hover:shadow hover:shadow-dark/40" disabled={loading}>
              {loading ?
                  <Loading />
                :
                  <>
                    Sign in
                  </>
              }
            </button>
            <div className="flex items-center justify-center space-x-4 my-7">
              <span className="h-px w-16 bg-gray-200"></span>
              <span className="text-gray-400 font-sm">or continue with</span>
              <span className="h-px w-16 bg-gray-200"></span>
            </div>
            <button className="relative flex justify-center items-center mt-8 w-full border-2 border-dark px-6 py-3 rounded-xl transition-all duration-400 ease-in hover:bg-primary2 hover:border-primary2 hover:text-white">
              <i className="fa-brands fa-ethereum mr-3"></i> Sign in with Ethereum
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
};

export default SignIn;
