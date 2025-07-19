// src/App.jsx
import { useState } from "react";
import axios from "axios";

function App() {
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
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Instagram Unfollowers Checker</h1>

      <div className="space-y-4 mb-6">
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFollowerFile(e.target.files[0])}
        />
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFollowingFile(e.target.files[0])}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCompare}
        >
          Compare
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="text-left space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Unfollowers:</h2>
            <ul className="list-disc ml-5">
              {result.unfollowers.map((user, i) => (
                <li key={i}>{user}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Not Following Back:</h2>
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
