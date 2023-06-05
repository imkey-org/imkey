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
import { api } from "@/utils/api";

const images = [
  "/images/hero.jpg",
  "/images/hero2.jpg"
];

const SignUp: NextPage = () => {
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
  const nameInputRef = useRef<HTMLInputElement>();
  const emailInputRef = useRef<HTMLInputElement>();
  const usernameInputRef = useRef<HTMLInputElement>();
  const passwordInputRef = useRef<HTMLInputElement>();
  const confirmPasswordInputRef = useRef<HTMLInputElement>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createUser = api.user.createUser.useMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    const name = nameInputRef.current?.value;
    const username = usernameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    const passwordConfirm = confirmPasswordInputRef.current?.value;


    try {
      await createUser.mutate({ name, email, username, password, passwordConfirm });

      if (!error) {
        await router.replace("/");
      } else {
        setError(error);
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
                  <BlurImageFill srcImage={src} title="IMKEY" />
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
            <h1 className="font-semibold text-2xl">Welcome IMKEY Lovers!</h1>
            <p className="mt-2 text-sm text-gray-500">Please enter the details below to sign up</p>
            {error &&
              <p>{error}</p>
            }
            <div className="mt-14 relative space-y-8">
              <div className="flex mb-4">
                <div className="flex items-center border-2 py-3 px-3 rounded-xl mx-1">
                  <input ref={nameInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type="text" name="name" placeholder="Full Name" required autoComplete="false" />
                </div>
                <div className="flex items-center border-2 py-3 px-3 rounded-xl mx-1">
                  <input ref={usernameInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type="text" name="username" placeholder="Username" required autoComplete="false" />
                </div>
              </div>
              <div className="flex items-center border-2 py-3 px-3 rounded-xl mb-4">
                <input ref={emailInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type="email" name="email" placeholder="your@imkey.or.id" required autoComplete="false" />
              </div>
              <div className="flex items-center border-2 py-3 px-3 rounded-xl mb-4">
                <input ref={passwordInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type={showPassword == true ? "text" : "password"} name="password" placeholder="Password" required autoComplete="false" />
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
              <div className="flex items-center border-2 py-3 px-3 rounded-xl mb-4">
                <input ref={confirmPasswordInputRef} className="bg-transparent pl-3 outline-none border-none w-full" type={showPassword == true ? "text" : "password"} name="password" placeholder="Confirm Password" required autoComplete="false" />
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
            <button type="submit" className="relative flex justify-center items-center mt-8 w-full bg-dark border border-transparent text-white px-6 py-3 rounded-xl transition-all duration-300 ease-in hover:shadow hover:shadow-dark/40" disabled={loading}>
              {loading ?
                  <Loading />
                :
                  <>
                    Sign up
                  </>
              }
            </button>
            <div className="text-center mt-8">
              <p className="mt-4 text-sm">Already Have An Account? <Link href="/auth/signin" className="underline cursor-pointer"> Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
};

export default SignUp;
