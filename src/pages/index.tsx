const Home = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vTcfDe6C2-_daxehVm4Vbe9uCHzw7IuAdcqD1nSaj9v1HNxPqfLRZr74Ky7ePAqXFgMooCTU8ryxMpV/embed?start=false&loop=true&delayms=5000"
        width="960"
        className="h-full w-full"
        allowFullScreen={true}
        moz-allowfullscreen={true}
        webkit-allowfullscreen={true}
      />
      <a href="https://bit.ly/goodbidsquestion" target="_blank">
        <p className="mt-4 text-xl font-bold">Contact Us</p>
      </a>
    </div>
  );
};

export default Home;
