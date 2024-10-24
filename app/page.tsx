import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text  m-2 p-4 text-white ">
        Welcome to the Quiz
      </h1>
      <Link
        href="/quiz"
        className="bg-gradient-to-r from-sky-900 to-amber-700 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105  duration-300"
      >
        Go to Quiz
      </Link>
    </div>
  );
};

export default Home;
