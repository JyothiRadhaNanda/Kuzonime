import { useState, useEffect } from "react";
import axios from "axios";

const AddBook = () => {
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [books, setBooks] = useState<any[]>([]);

  // Fetch data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchBooks();
  }, []);

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
    e.preventDefault(); // Menghindari refresh halaman default

    const newBook = {
      judul,
      penulis,
      penerbit,
      tahun_terbit: Number(tahunTerbit),
    };

    try {
      await axios.post("http://localhost:3030/books/add", newBook);
      alert("Buku berhasil ditambahkan!");
      fetchBooks(); // ✅ Refresh data setelah submit
      setJudul("");
      setPenulis("");
      setPenerbit("");
      setTahunTerbit("");
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan buku");
    }
  };

  return <div></div>;
};

export default AddBook;
