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

  const handleGoBack = () => {
    setResult(null);
    setFollowerFile(null);
    setFollowingFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col justify-center items-center">
      {!result && (
        <>
          <h1 className="text-4xl font-lobster text-white text-center mb-2">Check which MF</h1>
          <h2 className="text-2xl font-lobster text-white text-center mb-6">Unfollowed YOU.! 😏</h2>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
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
                className="w-64 h-40 bg-[#2a2a2a] border-2 border-dashed border-gray-500 flex items-center justify-center text-center cursor-pointer text-sm text-gray-300 rounded-lg hover:border-gray-300 transition px-2"
              >
                {followerFile ? (
                  <span className="text-sm text-blue-400 break-words">{followerFile.name}</span>
                ) : (
                  <>Upload Follower<br />JSON</>
                )}
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
                className="w-64 h-40 bg-[#2a2a2a] border-2 border-dashed border-gray-500 flex items-center justify-center text-center cursor-pointer text-sm text-gray-300 rounded-lg hover:border-gray-300 transition px-2"
              >
                {followingFile ? (
                  <span className="text-sm text-blue-400 break-words">{followingFile.name}</span>
                ) : (
                  <>Upload Following<br />JSON</>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleCompare}
            className="bg-gray-600 text-white px-10 py-3 rounded font-semibold hover:bg-gray-500 transition mb-8"
          >
            Compare
          </button>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        </>
      )}

      {result && (
        <div className="max-w-3xl w-full space-y-8">
          <button
            onClick={handleGoBack}
            className="bg-gray-700 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 mb-6"
          >
            ← Go Back
          </button>

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
