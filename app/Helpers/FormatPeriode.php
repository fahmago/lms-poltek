<?php

namespace App\Helpers;
use Carbon\Carbon;

class FormatPeriode
{
    public static function formatPeriode($startDate, $endDate)
    {
        if (!$startDate || !$endDate) {
            return "-";
        }

        $start = Carbon::parse($startDate);
        $end   = Carbon::parse($endDate);

        $startMonth = $start->translatedFormat('M');
        $endMonth   = $end->translatedFormat('M');

        $startYear  = $start->format('Y');
        $endYear    = $end->format('Y');

        // Kalau tahun sama → Okt - Des 2025
        if ($startYear === $endYear) {
            return "$startMonth - $endMonth $endYear";
        }

        // Tahun beda → Okt 2024 - Okt 2025
        return "$startMonth $startYear - $endMonth $endYear";
    }
}