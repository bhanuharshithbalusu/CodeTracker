import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Zap, Shield, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Unified Dashboard',
      description: 'Track your progress across multiple coding platforms in one place.'
    },
    {
      icon: Users,
      title: 'Multi-Platform Support',
      description: 'Connect LeetCode, Codeforces, CodeChef, and W3Schools accounts.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Automatically sync your latest achievements and statistics.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CodeTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Track Your
            <span className="text-blue-600"> Coding Journey</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Aggregate your coding statistics from multiple platforms into a single, 
            beautiful dashboard. Monitor your progress, set goals, and level up your skills.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/register"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              <span>Start Tracking</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/demo"
              className="btn-outline py-3 px-8"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Track Your Progress
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            CodeTracker provides all the tools you need to monitor and improve your coding skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platforms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Supported Platforms
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect your accounts from these popular coding platforms and get a unified view of your progress.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-6 mb-4">
              <span className="text-2xl font-bold text-yellow-800">LC</span>
            </div>
            <h3 className="font-semibold text-gray-900">LeetCode</h3>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6 mb-4">
              <span className="text-2xl font-bold text-blue-800">CF</span>
            </div>
            <h3 className="font-semibold text-gray-900">Codeforces</h3>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-lg p-6 mb-4">
              <span className="text-2xl font-bold text-orange-800">CC</span>
            </div>
            <h3 className="font-semibold text-gray-900">CodeChef</h3>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-6 mb-4">
              <span className="text-2xl font-bold text-green-800">W3</span>
            </div>
            <h3 className="font-semibold text-gray-900">W3Schools</h3>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Level Up Your Coding?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who use CodeTracker to monitor their progress.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">CodeTracker</span>
            </div>
            <p className="text-gray-400">
              © 2024 CodeTracker. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;