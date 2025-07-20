import { useState } from "react";

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

    try {
      const followerText = await followerFile.text();
      const followingText = await followingFile.text();

      const followerJson = JSON.parse(followerText);
      const followingJson = JSON.parse(followingText);

      const followers = new Set(
        followerJson.map((entry) => entry.string_list_data[0].value)
      );

      const followings = new Set(
        followingJson.relationships_following.map(
          (entry) => entry.string_list_data[0].value
        )
      );

      const unfollowers = [...followings].filter((user) => !followers.has(user));
      const notFollowingBack = [...followers].filter((user) => !followings.has(user));

      setResult({ unfollowers, not_following_back: notFollowingBack });
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to process files.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-lobster text-white text-center mb-4">
        Check which MF
      </h1>
      <h2 className="text-2xl font-lobster text-white text-center mb-8">
        Unfollowed YOU.!😏
      </h2>

      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div>
          <input
            type="file"
            accept=".json"
            id="follower"
            className="hidden"
            onChange={(e) => setFollowerFile(e.target.files[0])}
          />
          <label
            htmlFor="follower"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-lg cursor-pointer text-lg w-60 text-center"
          >
            Upload Follower JSON
          </label>
        </div>

        <div>
          <input
            type="file"
            accept=".json"
            id="following"
            className="hidden"
            onChange={(e) => setFollowingFile(e.target.files[0])}
          />
          <label
            htmlFor="following"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-lg cursor-pointer text-lg w-60 text-center"
          >
            Upload Following JSON
          </label>
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 w-60 text-center mb-6"
      >
        Compare
      </button>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {result && (
        <div className="max-w-3xl w-full space-y-8">
          <div className="bg-[#1e1e1e] p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Unfollowed You</h2>
            <ul className="space-y-1 list-disc list-inside">
              {result.unfollowers.map((user, i) => (
                <li key={i}>
                  <a
                    href={`https://instagram.com/${user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {user}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Not Following Back</h2>
            <ul className="space-y-1 list-disc list-inside">
              {result.not_following_back.map((user, i) => (
                <li key={i}>
                  <a
                    href={`https://instagram.com/${user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {user}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
