 
import { useNavigate } from "react-router-dom";


const FirstPage = () => {

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f6f2e7] flex flex-col items-center justify-center text-center p-4">
        <main className="flex flex-col items-center mt-16">
            <h2 className="text-4xl font-bold text-gray-900">What is Journalist?</h2>
            <p className="text-lg text-gray-700 mt-4 max-w-2xl">
            <strong>Journalist AI</strong> – Your Trusted Partner for Staying Informed Across All Fields.
            Stay ahead with real-time news updates and seamless tracking. <br />
            <strong>No more misinformation—just reliable news.</strong>
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-4">Subscribe now!</p>
            <p className="text-sm text-gray-600 mt-2">More than +99 news</p>
            <div className="mt-6 flex space-x-4">
            <button onClick={() => navigate("/signup")} className="bg-gray-600 text-white px-6 py-2 rounded shadow hover:bg-gray-700">
                Sign up
            </button>
            <span className="text-gray-800 font-semibold">or</span>
            <button onClick={() => navigate("/login")} className="bg-gray-600 text-white px-6 py-2 rounded shadow hover:bg-gray-700">
                Sign in
            </button>
            </div>
        </main>
    </div>
    );
};

export default FirstPage;