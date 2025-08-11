import { CustomLoader } from "./CustomLoader";

interface PageLoaderProps {
  title?: string;
  description?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ title = "Loading..", description = "Please wait while we get your information from the web" }) => {
  return (
    <div className="fixed inset-0 z-[999999999] flex h-screen w-screen items-center justify-center bg-[#ffffff80] backdrop-blur-[8px]">
      <div className="p-4">
        <CustomLoader />
        <h2 className="f-w-400 my-3 text-center">{title}</h2>
        <p className="mb-0 text-center">{description}</p>
      </div>
    </div>
  );
};
