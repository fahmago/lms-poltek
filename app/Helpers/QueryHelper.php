<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class QueryHelper
{
    public static function applySearchAndPagination(
        Builder $query,
        array $searchableFields,
        ?array $relations = [],
        ?string $searchKeyword = null,
        int $perPage = 10
    ) {
        // Apply search if keyword is provided
        if ($searchKeyword) {
            $query->where(function ($q) use ($searchableFields, $relations, $searchKeyword) {
                // Search in fields
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'like', '%' . $searchKeyword . '%');
                }

                // Search in related fields
                foreach ($relations as $relation => $relationFields) {
                    $q->orWhereHas($relation, function ($relationQuery) use ($relationFields, $searchKeyword) {
                        foreach ($relationFields as $field) {
                            $relationQuery->orWhere($field, 'like', '%' . $searchKeyword . '%');
                        }
                    });
                }
                
            });
        }

        // Apply pagination
        return $query->paginate($perPage)->appends(['q' => $searchKeyword]);
    }
}
