<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;

class ImageBase64
{
    /**
     * Mengonversi gambar ke format base64
     *
     * @param  \Illuminate\Http\UploadedFile  $image
     * @return string|null
     */
    public static function convertImageToBase64($image)
    {
        // Cek apakah file valid
        if ($image && $image->isValid()) {
            // Mengambil konten gambar dalam bentuk binary
            $imageData = File::get($image->getPathname());
            
            // Mengonversi gambar ke format base64
            $base64Image = base64_encode($imageData);
            
            // Mengambil ekstensi gambar
            $mimeType = $image->getMimeType();
            
            // Menyusun URL Base64 lengkap
            return 'data:' . $mimeType . ';base64,' . $base64Image;
        }

        return null;
    }
}

// https://www.base64-image.de/
// Cara memakai Helper ini untuk Konversi gambar ke Base64:
// public function store(Request $request)
// {
//     $request->validate([
//         'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
//     ]);
//     if ($request->hasFile('image')) {
//         $image = $request->file('image');
//         $base64ImageUrl = ImageBase64::convertImageToBase64($image);
//         if ($base64ImageUrl) {
//             return response()->json([
//                 'message' => 'Gambar berhasil diupload dan dikonversi ke Base64!',
//                 'base64_image' => $base64ImageUrl,
//             ]);
//         }
//         return response()->json(['error' => 'Gambar tidak valid.'], 400);
//     }
//     return response()->json(['error' => 'Gambar tidak ditemukan.'], 400);
// }
