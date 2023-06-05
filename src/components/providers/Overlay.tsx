import { useToggle } from "./Context";

const style = {
  overlay: `bg-black fixed h-screen inset-0 w-screen z-30 md:hidden bg-opacity-75 transition-opacity`,
}

export default function Overlay() {
  const { open } = useToggle();
  return <div className={open ? style.overlay : ""} />;
}
