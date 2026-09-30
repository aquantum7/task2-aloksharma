import { useMemo, useState } from "react";

const examples = [
  "A neon-lit cyberpunk city after rain, cinematic lighting, highly detailed",
  "A peaceful Himalayan valley at sunrise, painterly digital art, atmospheric",
  "A futuristic Indian space station orbiting Earth, concept art, dramatic scale"
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1024");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const promptLength = useMemo(() => prompt.length, [prompt]);

  async function generateArt(event) {
    event.preventDefault();
    setError("");

    if (prompt.trim().length < 3) {
      setError("Write a more detailed prompt first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
          count
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Generation failed.");
      }

      setImages(payload.images || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function useExample(text) {
    setPrompt(text);
    setError("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>AI Art Studio</strong>
            <span>Text → visual creation</span>
          </div>
        </div>
        <span className="status-pill">FULL-STACK PROJECT</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">NATURAL LANGUAGE → DIGITAL ARTWORK</p>
          <h1>Turn an idea into an image.</h1>
          <p className="subtitle">
            Describe a scene, choose your design parameters, and generate artwork
            through a secure backend image API.
          </p>
        </div>
      </section>

      <section className="workspace">
        <form className="control-panel" onSubmit={generateArt}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / PROMPT</p>
              <h2>Describe your artwork</h2>
            </div>
            <span>{promptLength}/2000</span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={2000}
            placeholder="Example: A cinematic floating city above the clouds at golden hour..."
            rows={7}
          />

          <div className="examples">
            {examples.map((example) => (
              <button
                type="button"
                className="example-chip"
                key={example}
                onClick={() => useExample(example)}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="section-heading compact">
            <div>
              <p className="eyebrow">02 / PARAMETERS</p>
              <h2>Design controls</h2>
            </div>
          </div>

          <div className="controls-grid">
            <label>
              Aspect ratio
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                <option value="1:1">1:1 — Square</option>
                <option value="16:9">16:9 — Landscape</option>
                <option value="9:16">9:16 — Portrait</option>
                <option value="4:3">4:3 — Classic</option>
              </select>
            </label>

            <label>
              Resolution
              <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
                <option value="1024">1024</option>
              </select>
            </label>

            <label>
              Generation count
              <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                <option value={1}>1 image</option>
                <option value={2}>2 images</option>
                <option value={3}>3 images</option>
                <option value={4}>4 images</option>
              </select>
            </label>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="generate-btn" disabled={loading}>
            {loading ? "Creating artwork..." : "Generate artwork ✦"}
          </button>

          <p className="security-note">
            Your provider API key stays on the server and is never sent to the browser.
          </p>
        </form>

        <section className="gallery-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / OUTPUT</p>
              <h2>Your artwork</h2>
            </div>
            {images.length > 0 && <span>{images.length} generated</span>}
          </div>

          {loading && (
            <div className="loading-grid">
              {Array.from({ length: count }, (_, i) => <div className="skeleton" key={i} />)}
            </div>
          )}

          {!loading && images.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>Your gallery is waiting.</h3>
              <p>Enter a prompt and generate your first piece of AI artwork.</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div className="gallery">
              {images.map((image, index) => (
                <article className="art-card" key={image.id || index}>
                  <img src={image.url} alt={`Generated artwork ${index + 1}`} />
                  <div className="art-footer">
                    <span>Artwork {index + 1}</span>
                    <a href={image.url} download={`ai-art-${index + 1}.png`}>
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer>
        <span>AI Art Studio</span>
        <span>Built as a full-stack internship project</span>
      </footer>
    </main>
  );
}

export default App;
