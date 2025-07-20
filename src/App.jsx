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
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {!result ? (
          <>
            <h1 className="text-4xl font-lobster text-white text-center mb-2">Check which MF</h1>
            <h2 className="text-2xl font-lobster text-white text-center mb-6">Unfollowed YOU 😏</h2>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept=".json"
                  id="follower"
                  className="hidden"
                  onChange={(e) => setFollowerFile(e.target.files[0])}
                />
                <label
                  htmlFor="follower"
                  className="w-64 h-40 bg-[#2a2a2a] border-2 border-dashed border-gray-500 flex items-center justify-center text-center cursor-pointer text-sm text-gray-300 rounded-lg hover:border-gray-300 transition"
                >
                  Upload Follower<br />JSON
                </label>
                {followerFile && (
                  <p className="text-blue-400 text-xs mt-2">{followerFile.name}</p>
                )}
              </div>

              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept=".json"
                  id="following"
                  className="hidden"
                  onChange={(e) => setFollowingFile(e.target.files[0])}
                />
                <label
                  htmlFor="following"
                  className="w-64 h-40 bg-[#2a2a2a] border-2 border-dashed border-gray-500 flex items-center justify-center text-center cursor-pointer text-sm text-gray-300 rounded-lg hover:border-gray-300 transition"
                >
                  Upload Following<br />JSON
                </label>
                {followingFile && (
                  <p className="text-blue-400 text-xs mt-2">{followingFile.name}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleCompare}
              className="bg-gray-600 text-white w-64 py-3 rounded font-semibold hover:bg-gray-500 transition mb-8"
            >
              Compare
            </button>

            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          </>
        ) : (
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

            <div className="text-center">
              <button
                onClick={handleGoBack}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#1e1e1e] text-center text-sm text-gray-400 py-2">
        © {new Date().getFullYear()} Built with pure hate 🖕🏻
      </footer>
    </div>
  );
}

export default App;
