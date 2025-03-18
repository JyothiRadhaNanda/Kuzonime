import { useState, useEffect } from "react";
import axios from "axios";
import AddBook from "../CRUD/create";

const HomePage = () => {
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [gambar, setGambar] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const userId = localStorage.getItem("id");
  // Fetch data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "gambar" | "pdf"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === "gambar") setGambar(e.target.files[0]);
      if (type === "pdf") setPdf(e.target.files[0]);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3030/books");
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus buku ini?"
    );

    if (!confirmDelete) {
      return; // Jika user membatalkan, tidak ada aksi yang dilakukan
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/books/${id}/delete`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(books.filter((book) => book.id !== id));
      alert("Buku berhasil dihapus!");
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus buku");
    }
  };

  const handleEdit = (book: any) => {
    console.log("Edit book:", book);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    formData.append("penerbit", penerbit);
    formData.append("tahun_terbit", tahunTerbit);

    if (gambar) {
      formData.append("gambar", gambar); // Tambahkan gambar ke FormData
    }

    if (pdf) {
      formData.append("pdf", pdf); // Tambahkan PDF ke FormData
    }

    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      await axios.post("http://localhost:3030/books/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Menambahkan token di header Authorization
        },
      });
      alert("Buku berhasil ditambahkan!");
      fetchBooks(); // Refresh daftar buku
      setJudul("");
      setPenulis("");
      setPenerbit("");
      setTahunTerbit("");
      setGambar(null); // Reset input file
      setPdf(null); // Reset input file PDF
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Terjadi kesalahan saat menambahkan buku");
    }
  };

  return (
    <div>
      <h1>Daftar Buku</h1>
      <div className="grid grid-cols-4 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            {book.gambar && (
              <a href="#">
                <img
                  className="rounded-t-lg"
                  src={`http://localhost:3030${book.gambar}`}
                  alt={book.judul}
                />
              </a>
            )}
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {book.judul}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Oleh {book.penulis} - {book.tahun_terbit}
              </p>
              {book.pdf && (
                <a
                  href={`http://localhost:3030${book.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-3 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lihat PDF
                </a>
              )}

              {Number(userId) === Number(book.userId) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
