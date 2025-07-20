// src/App.jsx
import { useRef, useState } from "react";
import axios from "axios";

function App() {
  const followerInputRef = useRef(null);
  const followingInputRef = useRef(null);

  const [followerFile, setFollowerFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!followerFile || !followingFile) {
      setError("Please upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append("follower", followerFile);
    formData.append("following", followingFile);

    try {
      const res = await axios.post("http://localhost:4000/compare", formData);
      setResult(res.data);
      setError("");
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to process files.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Instagram Unfollowers Insight
      </h1>

      {/* Upload Buttons */}
      <div className="flex gap-6 mb-6">
        {/* Upload Following */}
        <button
          className="w-32 h-32 bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm text-center p-2"
          onClick={() => followingInputRef.current.click()}
        >
          Upload <br /> Following <br /> JSON
        </button>
        <input
          type="file"
          accept=".json"
          ref={followingInputRef}
          onChange={(e) => setFollowingFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        {/* Upload Follower */}
        <button
          className="w-32 h-32 bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm text-center p-2"
          onClick={() => followerInputRef.current.click()}
        >
          Upload <br /> Follower <br /> JSON
        </button>
        <input
          type="file"
          accept=".json"
          ref={followerInputRef}
          onChange={(e) => setFollowerFile(e.target.files[0])}
          style={{ display: "none" }}
        />
      </div>

      {/* Compare Button */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-semibold rounded mb-6"
        onClick={handleCompare}
      >
        Compare
      </button>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Result */}
      {result && (
        <div className="bg-gray-800 p-6 rounded w-full max-w-2xl text-left space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Unfollowers:</h2>
            <ul className="list-disc ml-5">
              {result.unfollowers.map((user, i) => (
                <li key={i}>{user}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Not Following Back:</h2>
            <ul className="list-disc ml-5">
              {result.not_following_back.map((user, i) => (
                <li key={i}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
