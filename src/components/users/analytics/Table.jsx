import React, { useState, useMemo } from 'react';

const tableData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=100",
    title: "Lorem ipsum dolar samet",
    date: "16 Jan, 2025",
    reach: "4.5k",
    views: "1.2k",
    likes: 16,
    comments: 10,
    followers: 150,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100",
    title: "Lorem ipsum dolar samet",
    date: "16 Jan, 2025",
    reach: "4.5k",
    views: "1.2k",
    likes: 16,
    comments: 10,
    followers: 150,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=100",
    title: "Lorem ipsum dolar samet",
    date: "16 Jan, 2025",
    reach: "4.5k",
    views: "1.2k",
    likes: 16,
    comments: 10,
    followers: 150,
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=100",
    title: "Lorem ipsum dolar samet",
    date: "16 Jan, 2025",
    reach: "4.5k",
    views: "1.2k",
    likes: 16,
    comments: 10,
    followers: 150,
  },
];

const Table = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ---------- Filtering ----------
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return tableData;
    return tableData.filter(
      (row) =>
        row.title.toLowerCase().includes(searchText.toLowerCase()) ||
        row.date.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  // ---------- Pagination ----------
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [page, filteredData]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="w-full text-sm overflow-x-hidden">
      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search content..."
          value={searchText}
          onChange={(e) => {
            setPage(1); // reset to page 1 on new search
            setSearchText(e.target.value);
          }}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f122f] focus:outline-none"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-700 text-sm tracking-wide">
              <tr>
                <th className="p-4">Preview</th>
                <th className="p-4">Title</th>
                <th className="p-4">Reach</th>
                <th className="p-4">Views</th>
                <th className="p-4">Likes</th>
                <th className="p-4">Comments</th>
                <th className="p-4">Followers</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={row.img}
                      alt="preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-gray-500">{row.date}</p>
                  </td>
                  <td className="p-4">{row.reach}</td>
                  <td className="p-4">{row.views}</td>
                  <td className="p-4">{row.likes}</td>
                  <td className="p-4">{row.comments}</td>
                  <td className="p-4">{row.followers}</td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredData.length} Results
        </p>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg border ${
                page === i + 1
                  ? "bg-[#0f122f] text-white border-[#0f122f]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
