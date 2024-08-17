import { defineNuxtPlugin } from "#app";
import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api", // Ganti dengan URL API Anda
  });

  // Anda bisa menambahkan interceptors atau konfigurasi lain di sini

  nuxtApp.provide("axios", axiosInstance);
});
