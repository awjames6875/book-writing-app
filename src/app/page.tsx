'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <Link href="/" className="logo">
            <span className="logo-icon">SF</span>
            <span className="logo-text">StoryForge</span>
          </Link>
          <div className="nav-links">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#how-it-works" className="nav-link">How It Works</Link>
            <Link href="#testimonials" className="nav-link">Stories</Link>
            <Link href="/login" className="nav-cta">Start Writing</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grain" />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Book Writing
          </div>
          <h1 className="hero-title">
            Your Voice.<br />
            <span className="title-accent">Your Story.</span><br />
            Finally Written.
          </h1>
          <p className="hero-subtitle">
            Transform scattered thoughts, voice recordings, and raw ideas into a
            polished manuscript that sounds authentically <em>you</em>.
            StoryForge is the AI ghostwriter that learns your voice.
          </p>
          <div className="hero-ctas">
            <Link href="/login" className="cta-primary">
              <span>Begin Your Book</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="#how-it-works" className="cta-secondary">
              See How It Works
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">200+</span>
              <span className="stat-label">Interview Questions</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">4</span>
              <span className="stat-label">Core Systems</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Your Authentic Voice</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="book-preview">
            <div className="book-spine" />
            <div className="book-cover">
              <div className="book-title">Your Memoir</div>
              <div className="book-author">by You</div>
              <div className="book-progress">
                <div className="progress-bar" />
              </div>
              <div className="book-words">47,832 words</div>
            </div>
            <div className="book-pages">
              <div className="page page-1" />
              <div className="page page-2" />
              <div className="page page-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="problem-content">
          <h2 className="section-label">The Challenge</h2>
          <p className="problem-statement">
            You have a book inside you. The stories, the lessons, the transformation—it&apos;s all there.
            But between the <span className="highlight">blank page</span> and the <span className="highlight">finished manuscript</span>
            lies an overwhelming journey that stops most authors cold.
          </p>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">◊</div>
              <h3>Organization Paralysis</h3>
              <p>Ideas scattered across notebooks, voice memos, and late-night thoughts with no system to capture them.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">◊</div>
              <h3>Voice Dilution</h3>
              <p>Traditional ghostwriters cost $15K-$100K and often lose what makes your story uniquely yours.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">◊</div>
              <h3>Structure Overwhelm</h3>
              <p>200 pages of content needs a framework. Without one, even great material becomes an unreadable mess.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution" id="features">
        <div className="solution-header">
          <h2 className="section-label">The StoryForge System</h2>
          <p className="solution-intro">
            Four integrated engines that transform how books get written.
            Not templates. Not generic AI. A system built for <em>your</em> voice.
          </p>
        </div>

        <div className="systems-grid">
          <div className="system-card system-interview">
            <div className="system-number">01</div>
            <div className="system-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <h3>Interview Engine</h3>
            <p>200+ structured questions guide you through your entire story. Just talk—we transcribe, organize, and map to chapters automatically.</p>
            <ul className="system-features">
              <li>Voice recording with live transcription</li>
              <li>Memory prompts & starter phrases</li>
              <li>Auto-mapping to chapters</li>
            </ul>
          </div>

          <div className="system-card system-voice">
            <div className="system-number">02</div>
            <div className="system-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>Voice DNA</h3>
            <p>Every transcript teaches us your signature phrases, speech rhythms, and storytelling patterns. The more you speak, the more authentic your book becomes.</p>
            <ul className="system-features">
              <li>Pattern recognition from transcripts</li>
              <li>Signature phrase detection</li>
              <li>Voice confidence scoring</li>
            </ul>
          </div>

          <div className="system-card system-source">
            <div className="system-number">03</div>
            <div className="system-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>Source Brain</h3>
            <p>Upload anything—PDFs, YouTube transcripts, research notes, competitor books. Our AI processes it all and makes it searchable, quotable, and usable.</p>
            <ul className="system-features">
              <li>Multi-format ingestion</li>
              <li>Smart content extraction</li>
              <li>RAG-powered chat interface</li>
            </ul>
          </div>

          <div className="system-card system-forge">
            <div className="system-number">04</div>
            <div className="system-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3>Chapter Forge</h3>
            <p>When you have enough content, our elite AI ghostwriter—trained on bestseller mechanics—generates polished chapters in YOUR voice. Not generic. Authentically you.</p>
            <ul className="system-features">
              <li>Voice DNA-powered generation</li>
              <li>Story → Principle → Practice structure</li>
              <li>10-point quality verification</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process" id="how-it-works">
        <div className="process-content">
          <h2 className="section-label">The Journey</h2>
          <p className="process-intro">From first thought to finished manuscript in four phases.</p>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">1</div>
              <div className="timeline-content">
                <h3>Speak Your Story</h3>
                <p>Answer interview questions by voice. Our AI transcribes and organizes everything while you focus on remembering.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2</div>
              <div className="timeline-content">
                <h3>Build Your Voice DNA</h3>
                <p>With each recording, we learn your patterns. Your phrases. Your rhythm. The system gets smarter about what makes YOU sound like you.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">3</div>
              <div className="timeline-content">
                <h3>Generate Chapters</h3>
                <p>When a chapter has enough content, generate a polished draft. Review, refine, and watch your book take shape.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">4</div>
              <div className="timeline-content">
                <h3>Export & Publish</h3>
                <p>Download your manuscript as DOCX, Markdown, or a Beta Reader Guide. Your book. Your voice. Finally finished.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <h2 className="section-label">Author Stories</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card featured">
            <div className="quote-mark">&ldquo;</div>
            <p className="testimonial-text">
              I&apos;d been trying to write my memoir for 12 years. Twelve years of false starts,
              abandoned drafts, and guilt. StoryForge got my first draft done in 3 months.
              And it actually sounds like me—not some AI robot.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MJ</div>
              <div className="author-info">
                <span className="author-name">Maria Johnson</span>
                <span className="author-title">First-time Memoir Author</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote-mark">&ldquo;</div>
            <p className="testimonial-text">
              As a coach, I talk for a living. But writing? That&apos;s different. StoryForge let me
              just talk my book into existence.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">DK</div>
              <div className="author-info">
                <span className="author-name">David Kim</span>
                <span className="author-title">Executive Coach</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote-mark">&ldquo;</div>
            <p className="testimonial-text">
              The interview questions alone were worth it. They pulled stories out of me
              I&apos;d forgotten I had.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SR</div>
              <div className="author-info">
                <span className="author-name">Sarah Reynolds</span>
                <span className="author-title">Business Leader</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Your Book Is Waiting</h2>
          <p>
            You&apos;ve carried this story long enough. It&apos;s time to get it out of your head
            and into the world—in your voice, with your wisdom, exactly as you&apos;d tell it.
          </p>
          <Link href="/login" className="cta-primary large">
            <span>Start Writing Today</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="cta-note">Free to start • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-icon">SF</span>
            <span className="logo-text">StoryForge</span>
            <p>AI-powered book writing that preserves your authentic voice.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link href="#features">Features</Link>
              <Link href="#how-it-works">How It Works</Link>
              <Link href="/login">Get Started</Link>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Contact</Link>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 StoryForge. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        /* CSS Variables */
        .landing-page {
          --color-bg: #faf7f2;
          --color-bg-alt: #f5f1ea;
          --color-text: #1a1a1a;
          --color-text-muted: #5a5a5a;
          --color-primary: #1a2f23;
          --color-primary-light: #2d4a3a;
          --color-accent: #c9a227;
          --color-accent-light: #dbb84a;
          --color-border: rgba(26, 47, 35, 0.1);
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', -apple-system, sans-serif;
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (prefers-color-scheme: dark) {
          .landing-page {
            --color-bg: #0f0f0f;
            --color-bg-alt: #1a1a1a;
            --color-text: #f5f1ea;
            --color-text-muted: #a0a0a0;
            --color-primary: #c9a227;
            --color-primary-light: #dbb84a;
            --color-border: rgba(201, 162, 39, 0.15);
          }
        }

        .landing-page {
          min-height: 100vh;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: var(--font-body);
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 2rem;
          background: rgba(250, 247, 242, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
        }

        @media (prefers-color-scheme: dark) {
          .nav {
            background: rgba(15, 15, 15, 0.8);
          }
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--color-text);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--color-primary);
          color: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          border-radius: 8px;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color var(--transition);
        }

        .nav-link:hover {
          color: var(--color-text);
        }

        .nav-cta {
          background: var(--color-primary);
          color: var(--color-bg);
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition);
        }

        .nav-cta:hover {
          background: var(--color-primary-light);
          transform: translateY(-1px);
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          padding: 8rem 4rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        .hero-gradient {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 150%;
          background: radial-gradient(ellipse at center, rgba(201, 162, 39, 0.08) 0%, transparent 60%);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 50px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          width: fit-content;
          margin-bottom: 2rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: var(--color-accent);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .title-accent {
          color: var(--color-accent);
          font-style: italic;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          max-width: 480px;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hero-subtitle em {
          color: var(--color-text);
          font-style: italic;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--color-primary);
          color: var(--color-bg);
          padding: 1rem 1.75rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all var(--transition);
        }

        .cta-primary:hover {
          background: var(--color-primary-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(26, 47, 35, 0.2);
        }

        .cta-primary.large {
          padding: 1.25rem 2.25rem;
          font-size: 1.1rem;
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 1rem 1.75rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text);
          text-decoration: none;
          font-weight: 500;
          transition: all var(--transition);
        }

        .cta-secondary:hover {
          border-color: var(--color-primary);
          background: var(--color-bg-alt);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        @media (prefers-color-scheme: dark) {
          .stat-number {
            color: var(--color-accent);
          }
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }

        /* Hero Visual */
        .hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .book-preview {
          position: relative;
          width: 280px;
          height: 380px;
          perspective: 1000px;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotateY(-5deg); }
          50% { transform: translateY(-20px) rotateY(-5deg); }
        }

        .book-spine {
          position: absolute;
          left: 0;
          top: 0;
          width: 30px;
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          transform: rotateY(90deg) translateX(-15px);
          transform-origin: left;
          border-radius: 3px 0 0 3px;
        }

        .book-cover {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          border-radius: 0 8px 8px 0;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          box-shadow:
            20px 20px 60px rgba(0, 0, 0, 0.15),
            -5px -5px 20px rgba(255, 255, 255, 0.1);
        }

        .book-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--color-bg);
          margin-bottom: 0.5rem;
        }

        .book-author {
          font-size: 0.9rem;
          color: rgba(250, 247, 242, 0.7);
          margin-bottom: auto;
        }

        .book-progress {
          height: 4px;
          background: rgba(250, 247, 242, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 67%;
          height: 100%;
          background: var(--color-accent);
          border-radius: 2px;
          animation: progress 3s ease-in-out infinite;
        }

        @keyframes progress {
          0%, 100% { width: 67%; }
          50% { width: 72%; }
        }

        .book-words {
          font-size: 0.8rem;
          color: rgba(250, 247, 242, 0.7);
        }

        .book-pages {
          position: absolute;
          right: 8px;
          top: 10px;
          bottom: 10px;
          width: 15px;
        }

        .page {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          background: var(--color-bg);
          border-radius: 0 4px 4px 0;
        }

        .page-1 { width: 15px; right: 0; }
        .page-2 { width: 12px; right: 3px; opacity: 0.7; }
        .page-3 { width: 9px; right: 6px; opacity: 0.4; }

        /* Problem Section */
        .problem {
          padding: 6rem 4rem;
          background: var(--color-bg-alt);
        }

        .problem-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-label {
          font-family: var(--font-display);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .problem-statement {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          line-height: 1.4;
          max-width: 900px;
          margin-bottom: 3rem;
        }

        .highlight {
          color: var(--color-accent);
          font-style: italic;
        }

        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .problem-card {
          padding: 2rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 12px;
        }

        .problem-icon {
          font-size: 1.5rem;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }

        .problem-card h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .problem-card p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        /* Solution Section */
        .solution {
          padding: 6rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .solution-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .solution-intro {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .solution-intro em {
          color: var(--color-text);
        }

        .systems-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .system-card {
          padding: 2.5rem;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: all var(--transition);
        }

        .system-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-4px);
        }

        .system-number {
          position: absolute;
          top: 2rem;
          right: 2rem;
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-border);
        }

        .system-icon {
          width: 56px;
          height: 56px;
          background: var(--color-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .system-icon svg {
          stroke: var(--color-bg);
        }

        .system-card h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .system-card > p {
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .system-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .system-features li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .system-features li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--color-accent);
        }

        /* Process Section */
        .process {
          padding: 6rem 4rem;
          background: var(--color-bg-alt);
        }

        .process-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .process-intro {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          margin-bottom: 4rem;
        }

        .timeline {
          position: relative;
          padding-left: 3rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-border);
        }

        .timeline-item {
          position: relative;
          padding-bottom: 3rem;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -3rem;
          width: 2rem;
          height: 2rem;
          background: var(--color-primary);
          color: var(--color-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          transform: translateX(-50%);
        }

        .timeline-content h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .timeline-content p {
          color: var(--color-text-muted);
        }

        /* Testimonials */
        .testimonials {
          padding: 6rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 2rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
        }

        .testimonial-card.featured {
          grid-row: span 2;
          display: flex;
          flex-direction: column;
        }

        .quote-mark {
          font-family: var(--font-display);
          font-size: 4rem;
          color: var(--color-accent);
          line-height: 1;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--color-text);
          flex: 1;
        }

        .featured .testimonial-text {
          font-size: 1.25rem;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          background: var(--color-primary);
          color: var(--color-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 600;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
        }

        .author-title {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        /* Final CTA */
        .final-cta {
          padding: 8rem 4rem;
          background: var(--color-primary);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .final-cta h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--color-bg);
          margin-bottom: 1rem;
        }

        .final-cta > .cta-content > p {
          color: rgba(250, 247, 242, 0.8);
          font-size: 1.15rem;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .final-cta .cta-primary {
          background: var(--color-bg);
          color: var(--color-primary);
        }

        .final-cta .cta-primary:hover {
          background: var(--color-bg-alt);
          transform: translateY(-2px);
        }

        .cta-note {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: rgba(250, 247, 242, 0.6);
        }

        /* Footer */
        .footer {
          padding: 4rem;
          background: var(--color-bg-alt);
          border-top: 1px solid var(--color-border);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 4rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-brand p {
          color: var(--color-text-muted);
          max-width: 280px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-column h4 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .footer-column a {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color var(--transition);
        }

        .footer-column a:hover {
          color: var(--color-text);
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .footer-bottom p {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 6rem 2rem;
          }

          .hero-content {
            align-items: center;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-ctas {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-visual {
            display: none;
          }

          .problem-grid,
          .systems-grid {
            grid-template-columns: 1fr;
          }

          .testimonial-grid {
            grid-template-columns: 1fr;
          }

          .testimonial-card.featured {
            grid-row: auto;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .nav-links {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding: 5rem 1.5rem;
          }

          .problem,
          .solution,
          .process,
          .testimonials,
          .final-cta,
          .footer {
            padding: 4rem 1.5rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .stat-divider {
            display: none;
          }

          .footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
