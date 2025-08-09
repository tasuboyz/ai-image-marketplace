import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Image Marketplace
            </h1>
            <nav className="flex space-x-4">
              <button className="btn-primary">
                Get Started
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Image Marketplace
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, share, and sell amazing AI-generated images. 
            Join our community of creators and art enthusiasts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images</h3>
              <p className="text-gray-600">
                Share your AI-generated masterpieces with the world
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Art</h3>
              <p className="text-gray-600">
                Explore thousands of unique AI-generated images
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Money</h3>
              <p className="text-gray-600">
                Monetize your creativity and build your portfolio
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Placeholder for existing images */}
              <div className="image-card aspect-square">
                <img 
                  src="/images/LandScape/magical lake under a night sky filled with stars and a vivid Milky Way.png"
                  alt="Magical Lake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="image-card aspect-square">
                <img 
                  src="/images/LandScape/Japanese landscape at twilight, featuring a serene mountain village.png"
                  alt="Japanese Landscape"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="image-card aspect-square">
                <img 
                  src="/images/LandScape/floating island drifts through the sky during a vivid sunset.png"
                  alt="Floating Island"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="image-card aspect-square">
                <img 
                  src="/images/LandScape/forest with silver-leaved trees growing under a galactic sky.png"
                  alt="Galactic Forest"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 AI Image Marketplace. Built with React + Node.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
