<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Notifications\CompanyCreated;
use App\Http\Resources\CompanyResource;
use App\Http\Requests\StoreCompaniesRequest;
use App\Http\Requests\UpdateCompaniesRequest;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $per_page = $request->per_page ? $request->per_page : 10;
        $search = $request->search;

        return CompanyResource::collection(Company::when($search, function ($query) use ($search) {
            $query->where('name', 'LIKE', '%' . $search . '%')
                ->orWhere('email', 'LIKE', '%' . $search . '%')
                ->orWhere('website', 'LIKE', '%' . $search . '%');
        })->orderBy('created_at', 'DESC')->paginate($per_page));
    }

    public function store(StoreCompaniesRequest $request)
    {
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $imageFileName = 'image_' . time() . '.' . $image->getClientOriginalExtension();

            $request->file('logo')->storeAs('', $imageFileName, 'public');
        } else {
            $imageFileName = $request->logo;
        }

        $company = Company::create([
            'name' => $request->name,
            'email' => $request->email,
            'logo' => $imageFileName,
            'website' => $request->website,
        ]);

        $admin = User::where('email', 'admin@admin.com')->first();
        $admin->notify(new CompanyCreated());

        return response()->json($company, 200);
    }

    public function update(UpdateCompaniesRequest $request, Company $company)
    {
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $imageFileName = 'image_' . time() . '.' . $image->getClientOriginalExtension();

            $request->file('logo')->storeAs('', $imageFileName, 'public');
        } else {
            $imageFileName = $request->logo;
        }

        $company->name = $request->name;
        $company->email = $request->email;
        $company->logo = $imageFileName;
        $company->website = $request->website;

        $company->save();

        return response()->json($company, 200);
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(null, 204);
    }

    public function getMinifiedCompanyList()
    {
        $company = Company::get(['id', 'name']);

        return response()->json($company, 200);
    }
}
