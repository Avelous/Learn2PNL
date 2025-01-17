import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-1">
      <Image height={28} width={28} alt="logo" src="/logo.svg" />
      <span className="text-xl font-semibold text-sky-600">Learn2PNL</span>
    </div>
  );
};

export default Logo;
