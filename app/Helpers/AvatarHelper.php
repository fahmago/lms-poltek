<?php

namespace App\Helpers;
use Illuminate\Support\Facades\Auth;

class AvatarHelper
{
    public static function getAvatarData($mahasiswa)
    {
        $currentUser = Auth::user();

        // CEK IZIN MELIHAT FOTO
        $canSeePhoto = false;
        if ($mahasiswa->gender === 'L' && $currentUser->can('view-photo-l')) {
            $canSeePhoto = true;
        }
        if ($mahasiswa->gender === 'P' && $currentUser->can('view-photo-p')) {
            $canSeePhoto = true;
        }

        // RANDOM AVATAR
        $styles = [
            'adventurer',
            'adventurer-neutral',
            'avataaars',
            'avataaars-neutral',
            'big-ears',
            'big-ears-neutral',
            'big-smile',
            'bottts',
            'bottts-neutral',
            'croodles',
            'croodles-neutral',
            'fun-emoji',
            'identicon',
            'initials',
            'lorelei',
            'lorelei-neutral',
            'micah',
            'miniavs',
            'notionists',
            'notionists-neutral',
            'open-peeps',
            'personas',
            'pixel-art',
            'pixel-art-neutral',
            'shapes',
            'thumbs',
        ];

        return [
            'canSeePhoto' => $canSeePhoto,
            'randomStyle' => $styles[array_rand($styles)],
            'seed' => urlencode($mahasiswa->user->name),
        ];
    }
}