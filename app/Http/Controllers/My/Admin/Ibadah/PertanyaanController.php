<?php

namespace App\Http\Controllers\My\Admin\Ibadah;

use App\Http\Controllers\Controller;
use App\Models\Ibadah\Pertanyaan;
use App\Models\Ibadah\PilihanJawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PertanyaanController extends Controller
{
    public function index()
    {
        $pertanyaans = Pertanyaan::query()
            ->when(request()->q, function ($query, $search) {
                $query->where('teks_pertanyaan', 'like', "%{$search}%");
            })
            ->orderByRaw("CASE WHEN kategori = 'umum' THEN 1 ELSE 2 END")
            ->orderBy('urutan', 'asc')
            ->paginate(10)
            ->withQueryString();

        return inertia('My/Admin/Ibadah/Pertanyaan/Index', [
            'pertanyaans' => $pertanyaans,
            'currentFilters' => request()->only(['q']),
        ]);
    }

    public function create()
    {
        return inertia('My/Admin/Ibadah/Pertanyaan/Form', [
            'pertanyaan' => null,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi data utama pertanyaan (DITAMBAH 'kategori')
        $validatedData = $request->validate([
            'teks_pertanyaan' => 'required|string',
            'tipe_pertanyaan' => ['required', Rule::in(['pilihan_ganda', 'teks'])],
            'wajib_diisi' => 'required|boolean',
            'urutan' => 'required|integer',
            'kategori' => ['required', Rule::in(['umum', 'haid'])], // <-- TAMBAHAN VALIDASI
        ]);

        $validatedChoices = [];
        if ($request->tipe_pertanyaan === 'pilihan_ganda') {
            $validatedChoices = $request->validate([
                'pilihan_jawabans' => 'required|array|min:1',
                'pilihan_jawabans.*.teks_jawaban' => 'required|string|max:255',
                'pilihan_jawabans.*.poin' => 'required|integer',
                'pilihan_jawabans.*.khusus_gender' => ['nullable', Rule::in(['L', 'P'])],
                'pilihan_jawabans.*.urutan' => 'required|integer',
            ]);
        } else {
            $validatedChoices['pilihan_jawabans'] = [];
        }

        try {
            DB::transaction(function () use ($validatedData, $validatedChoices) {
                // 1. Buat Pertanyaannya (sudah termasuk 'kategori')
                $pertanyaan = Pertanyaan::create($validatedData);

                if (!empty($validatedChoices['pilihan_jawabans'])) {
                    $pertanyaan->pilihanJawabans()->createMany($validatedChoices['pilihan_jawabans']);
                }
            });
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal menyimpan pertanyaan. Error: ' . $e->getMessage());
        }

        return redirect()->route('my.pertanyaan.ibadah.index')
            ->with('success', 'Pertanyaan baru berhasil ditambahkan.');
    }

    public function edit(Pertanyaan $pertanyaan)
    {
        $pertanyaan->load(['pilihanJawabans' => function ($query) {
            $query->orderBy('urutan', 'asc');
        }]);

        session(['previous_url' => url()->previous()]);

        return inertia('My/Admin/Ibadah/Pertanyaan/Form', [
            'pertanyaan' => $pertanyaan,
        ]);
    }

    public function update(Request $request, Pertanyaan $pertanyaan)
    {
        // Validasi data utama (DITAMBAH 'kategori')
        $validatedData = $request->validate([
            'teks_pertanyaan' => 'required|string',
            'tipe_pertanyaan' => ['required', Rule::in(['pilihan_ganda', 'teks'])],
            'wajib_diisi' => 'required|boolean',
            'urutan' => 'required|integer',
            'kategori' => ['required', Rule::in(['umum', 'haid'])], // <-- TAMBAHAN VALIDASI
        ]);

        $validatedChoices = [];
        if ($request->tipe_pertanyaan === 'pilihan_ganda') {
            $validatedChoices = $request->validate([
                'pilihan_jawabans' => 'present|array|min:1', 
                'pilihan_jawabans.*.id' => 'nullable|integer',
                'pilihan_jawabans.*.teks_jawaban' => 'required|string|max:255',
                'pilihan_jawabans.*.poin' => 'required|integer',
                'pilihan_jawabans.*.khusus_gender' => ['nullable', Rule::in(['L', 'P'])],
                'pilihan_jawabans.*.urutan' => 'required|integer',
            ]);
        } else {
            $validatedChoices['pilihan_jawabans'] = [];
        }

        try {
            DB::transaction(function () use ($pertanyaan, $validatedData, $validatedChoices, $request) {
                // 1. Update data Pertanyaannya (sudah termasuk 'kategori')
                $pertanyaan->update($validatedData);

                $incomingChoices = $validatedChoices['pilihan_jawabans'];
                $existingIds = $pertanyaan->pilihanJawabans()->pluck('id')->all();

                if ($request->tipe_pertanyaan === 'teks') {
                    PilihanJawaban::destroy($existingIds);
                } else {
                    $incomingIds = collect($incomingChoices)->pluck('id')->filter()->all();
                    $idsToDelete = array_diff($existingIds, $incomingIds);
                    PilihanJawaban::destroy($idsToDelete);

                    foreach ($incomingChoices as $choiceData) {
                        $pertanyaan->pilihanJawabans()->updateOrCreate(
                            ['id' => $choiceData['id'] ?? null],
                            $choiceData
                        );
                    }
                }
            });
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal memperbarui pertanyaan. Error: ' . $e->getMessage());
        }

        // return redirect()->route('my.pertanyaan.ibadah.index')
        return redirect(session('previous_url'))
            ->with('success', 'Pertanyaan berhasil diperbarui.');
    }

    public function destroy(Pertanyaan $pertanyaan)
    {
        try {
            $pertanyaan->delete();
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal menghapus pertanyaan. Error: ' . $e->getMessage());
        }

        return redirect()->back()
            ->with('success', 'Pertanyaan berhasil dihapus.');
    }
}
