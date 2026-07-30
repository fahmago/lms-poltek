<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class UuidHelper
{
    /**
     * Generate unique random code with letters (upper & lower) and numbers.
     *
     * @param string $table  Nama tabel untuk pengecekan unik
     * @param string $column Nama kolom untuk pengecekan unik (default: uuid)
     * @param int    $length Panjang kode (default: 7)
     * @return string
     */
    public static function generateUniqueCode(string $table, string $column = 'uuid', int $length = 7): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        do {
            $code = self::randomString($characters, $length);
        } while (DB::table($table)->where($column, $code)->exists());

        return $code;
    }

    /**
     * Generate random string from a given character set.
     *
     * @param string $characters
     * @param int $length
     * @return string
     */
    private static function randomString(string $characters, int $length): string
    {
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}
