import { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Navbar from "../component/navigation/navbar";
import { useRouter } from "next/router";
import Layout from "../component/navigation/layout";

const AddBook = () => {
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [penerbit, setPenerbit] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [gambar, setGambar] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const router = useRouter();

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

  // Dropzone untuk Gambar
  const {
    getRootProps: getGambarRootProps,
    getInputProps: getGambarInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setGambar(file);
      setPreviewImage(URL.createObjectURL(file));
    },
    accept: { "image/*": [] },
  });

  // Dropzone untuk PDF
  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setPdf(file);
        setPreviewPdf(URL.createObjectURL(file));
      },
      accept: { "application/pdf": [] },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    formData.append("penerbit", penerbit);
    formData.append("tahun_terbit", tahunTerbit);
    if (gambar) formData.append("gambar", gambar);
    if (pdf) formData.append("pdf", pdf);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3030/books/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Buku berhasil ditambahkan!");
      fetchBooks();
      setJudul("");
      setPenulis("");
      setPenerbit("");
      setTahunTerbit("");
      setGambar(null);
      setPdf(null);
      setPreviewImage(null);
      setPreviewPdf(null);
      router.push("/");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Terjadi kesalahan saat menambahkan buku");
    }
  };

  return (
    <div className="text-center">
      <Navbar isLoggedIn={true} onLogout={() => {}} />
      <form onSubmit={handleSubmit}>
        <h1 className="">Tambah Buku</h1>
        <div className="m-2">
          <input
            className="bg-gray-50 border mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
          <input
            className="bg-gray-50 border mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Penulis"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
          />
          <input
            className="bg-gray-50 border mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Penerbit"
            value={penerbit}
            onChange={(e) => setPenerbit(e.target.value)}
          />
          <input
            className="bg-gray-50 border mb-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="number"
            placeholder="Tahun Terbit"
            value={tahunTerbit}
            onChange={(e) => setTahunTerbit(e.target.value)}
          />
          <div className="flex gap-3">
            <div
              {...getGambarRootProps()}
              className="flex flex-col mb-3 items-center justify-center w-1/2 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <input {...getGambarInputProps()} />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain h-full"
                />
              ) : (
                <p>Drag & drop gambar di sini, atau klik untuk memilih</p>
              )}
            </div>

            {/* DROPZONE PDF */}
            <div
              {...getPdfRootProps()}
              className="flex flex-col items-center justify-center w-1/2 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <input {...getPdfInputProps()} />
              {previewPdf ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm mb-2">{pdf?.name}</p>
                  <button
                    onClick={() => window.open(previewPdf, "_blank")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Lihat PDF
                  </button>
                </div>
              ) : (
                <p>Drag & drop PDF di sini, atau klik untuk memilih</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-3 bg-blue-500 text-white p-2 rounded"
        >
          Tambah Buku
        </button>
      </form>
    </div>
  );
};

export default AddBook;
