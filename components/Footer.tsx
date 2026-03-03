export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold text-gray-800">BlogApp</h2>
            <p className="mt-2 text-sm text-gray-500">
              A modern blog platform built with Next.js & Tailwind CSS.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-indigo-600">Home</a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-indigo-600">Blogs</a>
              </li>
              <li>
                <a href="/login" className="hover:text-indigo-600">Login</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>Email: user@gmail.com</li>
              <li>Ho Chi Minh City</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BlogApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
