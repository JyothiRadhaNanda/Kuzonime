import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [gambar, setGambar] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

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
      await axios.delete(`http://localhost:3030/books/${id}/delete`);
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
      <form onSubmit={handleSubmit}>
        <h2>Tambah Buku</h2>
        <input
          type="text"
          placeholder="Judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
        <input
          type="text"
          placeholder="Penulis"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
        />
        <input
          type="text"
          placeholder="Penerbit"
          value={penerbit}
          onChange={(e) => setPenerbit(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tahun Terbit"
          value={tahunTerbit}
          onChange={(e) => setTahunTerbit(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "gambar")}
        />
        <input
          placeholder="add pdf"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, "pdf")}
        />
        <button type="submit">Tambah Buku</button>
      </form>

      <h1>Daftar Buku</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.gambar && (
              <img
                src={`http://localhost:3030${book.gambar}`} // Gunakan path dari backend
                alt={book.judul}
                style={{ width: "150px", height: "auto" }}
              />
            )}
            <div>
              <strong>{book.judul}</strong> oleh {book.penulis} -{" "}
              {book.tahun_terbit}
            </div>
            {book.pdf && (
              <a
                href={`http://localhost:3030${book.pdf}`} // Link ke PDF
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat PDF
              </a>
            )}
            <button onClick={() => handleDelete(book.id)}>Hapus</button>
            <button onClick={() => handleEdit(book)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
