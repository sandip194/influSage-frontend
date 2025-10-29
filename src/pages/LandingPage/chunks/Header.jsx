
export function Header() {
    return (
        <header className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 font-bold text-xl">
                <img
                    src="/influSage-logo.png"
                    alt="Logo"
                    className="h-8 w-auto px-3"
                />
            </div>
            <div className="space-x-3">
                <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">Login</button>
                <button className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-gray-800">Sign Up</button>
            </div>
        </header>
    );
}
